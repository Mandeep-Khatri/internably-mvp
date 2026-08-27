import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, FlatList, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Input, PostCard, colors, spacing, typography } from '@internably/ui/src';
import { api } from '@/api/client';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type PostDetail = {
  id: string;
  content: string;
  createdAt?: string;
  imageUrl?: string | null;
  likedByMe?: boolean;
  author?: {
    id?: string;
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
      headline?: string | null;
      avatarUrl?: string | null;
    };
  };
  _count?: { likes?: number; comments?: number };
};

type Comment = {
  id: string;
  content: string;
  author?: { profile?: { firstName?: string | null; lastName?: string | null } };
};

function postAuthorName(post?: PostDetail | null) {
  const first = post?.author?.profile?.firstName?.trim() ?? '';
  const last = post?.author?.profile?.lastName?.trim() ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Internably Member';
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = String(id);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef<TextInput>(null);
  const queryClient = useQueryClient();

  const postQuery = useQuery<PostDetail>({
    queryKey: ['post', postId],
    queryFn: () => ResourcesApi.postById(postId),
    enabled: Boolean(postId),
  });

  const post = postQuery.data;

  const commentsQuery = useQuery<Comment[]>({
    queryKey: ['post-comments', postId],
    queryFn: async () => (await api.get(`/posts/${postId}/comments`)).data,
    enabled: Boolean(postId),
  });

  const commentMutation = useMutation({
    mutationFn: async () => (await api.post(`/posts/${postId}/comments`, { content: comment.trim() })).data as Comment,
    onSuccess: async (createdComment) => {
      setComment('');
      queryClient.setQueryData<Comment[]>(['post-comments', postId], (current = []) => [
        ...current,
        createdComment,
      ]);
      queryClient.setQueryData<PostDetail>(['post', postId], (current) => current ? {
        ...current,
        _count: {
          ...current._count,
          comments: (current._count?.comments ?? 0) + 1,
        },
      } : current);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['post-comments', postId] }),
        queryClient.invalidateQueries({ queryKey: ['post', postId] }),
        queryClient.invalidateQueries({ queryKey: ['feed'] }),
      ]);
    },
    onError: () => Alert.alert('Unable to comment', 'Please try again.'),
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (post?.likedByMe) await api.delete(`/posts/${postId}/like`);
      else await api.post(`/posts/${postId}/like`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previous = queryClient.getQueryData<PostDetail>(['post', postId]);
      queryClient.setQueryData<PostDetail>(['post', postId], (current) => current ? {
        ...current,
        likedByMe: !current.likedByMe,
        _count: {
          ...current._count,
          likes: Math.max(0, (current._count?.likes ?? 0) + (current.likedByMe ? -1 : 1)),
        },
      } : current);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(['post', postId], context.previous);
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['post', postId] }),
        queryClient.invalidateQueries({ queryKey: ['feed'] }),
      ]);
    },
  });

  return (
    <ScreenContainer scroll={false}>
      <FlatList
        data={commentsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Post</Text>
            {!post ? (
              <Text style={styles.loading}>{postQuery.isError ? 'Unable to load post.' : 'Loading post…'}</Text>
            ) : (
              <PostCard
                authorName={postAuthorName(post)}
                subtitle={post.author?.profile?.headline ?? 'Internably member'}
                timestamp={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : undefined}
                avatarUrl={post.author?.profile?.avatarUrl ?? null}
                content={post.content}
                imageUrl={post.imageUrl ?? null}
                likes={post._count?.likes ?? 0}
                comments={post._count?.comments ?? 0}
                liked={Boolean(post.likedByMe)}
                likeDisabled={likeMutation.isPending}
                onLike={() => likeMutation.mutate()}
                onComment={() => commentInputRef.current?.focus()}
                onShare={() => Share.share({ message: `${postAuthorName(post)} on Internably:\n\n${post.content}` })}
              />
            )}
            <Text style={styles.commentsTitle}>Comments</Text>
            <View style={styles.composer}>
              <Input ref={commentInputRef} placeholder="Write a comment" value={comment} onChangeText={setComment} multiline />
              <Button
                title={commentMutation.isPending ? 'Posting…' : 'Comment'}
                onPress={() => commentMutation.mutate()}
                disabled={!comment.trim() || commentMutation.isPending}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const first = item.author?.profile?.firstName ?? '';
          const last = item.author?.profile?.lastName ?? '';
          return (
            <View style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{`${first} ${last}`.trim() || 'Internably Member'}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          commentsQuery.isLoading ? <Text style={styles.loading}>Loading comments…</Text> : <Text style={styles.loading}>No comments yet.</Text>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    ...typography.sectionHeader,
    marginBottom: spacing.md,
  },
  loading: {
    color: '#6B655F',
    ...typography.secondary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 80,
  },
  commentsTitle: {
    color: colors.text,
    ...typography.sectionHeader,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  composer: {
    marginBottom: spacing.md,
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E0D6',
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  commentAuthor: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  commentText: {
    color: colors.text,
    ...typography.body,
  },
});
