import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PostCard, colors, spacing, typography } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type PostDetail = {
  id: string;
  content: string;
  createdAt?: string;
  imageUrl?: string | null;
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

function postAuthorName(post?: PostDetail | null) {
  const first = post?.author?.profile?.firstName?.trim() ?? '';
  const last = post?.author?.profile?.lastName?.trim() ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Internably Member';
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = String(id);

  const postQuery = useQuery<PostDetail>({
    queryKey: ['post', postId],
    queryFn: () => ResourcesApi.postById(postId),
    enabled: Boolean(postId),
  });

  const post = postQuery.data;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Post</Text>
      {!post ? (
        <Text style={styles.loading}>Loading post…</Text>
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
        />
      )}
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
});
