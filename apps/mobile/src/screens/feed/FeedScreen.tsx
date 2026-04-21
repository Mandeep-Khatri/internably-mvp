import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Input, PostCard, colors, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';
import FeedTopBar from '../shared/FeedTopBar';

type FeedPost = {
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
      school?: { name?: string | null } | null;
      avatarUrl?: string | null;
    };
  };
  _count?: { likes?: number; comments?: number };
};

type NotificationItem = {
  isRead?: boolean;
};

function formatTime(ts?: string) {
  if (!ts) return 'now';
  const date = new Date(ts);
  const diff = Math.max(0, Date.now() - date.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function postAuthorName(post: FeedPost) {
  const first = post.author?.profile?.firstName?.trim() ?? '';
  const last = post.author?.profile?.lastName?.trim() ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Internably Member';
}

function postSubtitle(post: FeedPost) {
  return post.author?.profile?.headline ?? `${post.author?.profile?.school?.name ?? 'Student'} Network`;
}

export default function FeedScreen() {
  const [composerVisible, setComposerVisible] = useState(false);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const topBarHeight = 76;

  const feedQuery = useQuery<FeedPost[]>({
    queryKey: ['feed'],
    queryFn: ResourcesApi.feed,
  });
  const notificationsQuery = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: ResourcesApi.notifications,
  });

  const createPostMutation = useMutation({
    mutationFn: async () => ResourcesApi.createPost({ content: draft.trim() }),
    onSuccess: async () => {
      setDraft('');
      setComposerVisible(false);
      await queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Please try again.';
      Alert.alert('Unable to post', text);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (post: FeedPost) => {
      if (post.likedByMe) {
        await api.delete(`/posts/${post.id}/like`);
      } else {
        await api.post(`/posts/${post.id}/like`);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const feed = feedQuery.data ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return feed;
    return feed.filter((p) => {
      const hay = `${postAuthorName(p)} ${postSubtitle(p) ?? ''} ${p.content ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [feed, search]);
  const unreadCount = useMemo(
    () => (notificationsQuery.data ?? []).filter((item) => !item.isRead).length,
    [notificationsQuery.data],
  );

  return (
    <ScreenContainer noPadding scroll={false}>
      <FeedTopBar
        searchValue={search}
        onSearchChange={setSearch}
        onPressCreate={() => setComposerVisible(true)}
        onPressNotifications={() => router.push('/(tabs)/notifications')}
        notificationCount={unreadCount}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingTop: topBarHeight + spacing.md }]}
        refreshControl={<RefreshControl refreshing={feedQuery.isRefetching} onRefresh={feedQuery.refetch} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <PostCard
            authorName={postAuthorName(item)}
            subtitle={postSubtitle(item)}
            timestamp={formatTime(item.createdAt)}
            avatarUrl={item.author?.profile?.avatarUrl ?? null}
            content={item.content}
            imageUrl={item.imageUrl ?? null}
            likes={item._count?.likes ?? 0}
            comments={item._count?.comments ?? 0}
            onLike={() => toggleLikeMutation.mutate(item)}
            onComment={() => Alert.alert('Comments', 'Comment UI is available in API and will open here.')}
            onShare={() => Alert.alert('Share', 'Share action will be connected next.')}
            onPressAuthor={item.author?.id ? () => router.push(`/profile/${item.author?.id}`) : undefined}
            onPressPost={() => router.push(`/posts/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyBody}>Create the first thought in your network.</Text>
          </View>
        }
      />

      <Pressable onPress={() => setComposerVisible(true)} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal animationType="slide" transparent visible={composerVisible} onRequestClose={() => setComposerVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalKeyboardWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
        >
          <Pressable style={styles.modalBackdrop} onPress={Keyboard.dismiss}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Create post</Text>
              <Input
                placeholder="Share something with your network"
                value={draft}
                onChangeText={setDraft}
                multiline
                style={styles.modalInput}
              />
              <View style={styles.modalActions}>
                <Button title="Cancel" variant="outline" onPress={() => setComposerVisible(false)} style={styles.modalBtn} />
                <Button
                  title={createPostMutation.isPending ? 'Posting...' : 'Post'}
                  onPress={() => createPostMutation.mutate()}
                  disabled={!draft.trim() || createPostMutation.isPending}
                  style={styles.modalBtn}
                />
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
  },
  emptyWrap: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  emptyBody: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2B9CF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalKeyboardWrap: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderColor: '#E3DCCF',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  modalInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  modalActions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalBtn: {
    flex: 1,
  },
});
