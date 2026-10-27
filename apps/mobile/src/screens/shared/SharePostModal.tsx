import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Avatar, Button, colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';

type Peer = {
  id: string;
  username?: string | null;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    headline?: string | null;
    avatarUrl?: string | null;
  } | null;
};

type Connection = {
  id: string;
  userA?: Peer;
  userB?: Peer;
};

type ShareablePost = {
  id: string;
  content: string;
  author?: {
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  } | null;
};

type Props = {
  visible: boolean;
  post: ShareablePost | null;
  onClose: () => void;
};

function peerName(peer: Peer) {
  const first = peer.profile?.firstName?.trim() ?? '';
  const last = peer.profile?.lastName?.trim() ?? '';
  return (first + ' ' + last).trim() || peer.username || 'Internably Member';
}

function authorName(post: ShareablePost | null) {
  const first = post?.author?.profile?.firstName?.trim() ?? '';
  const last = post?.author?.profile?.lastName?.trim() ?? '';
  return (first + ' ' + last).trim() || 'Internably Member';
}

function errorMessage(error: unknown) {
  const possible = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = possible.response?.data?.message ?? possible.message;
  return Array.isArray(message) ? message.join(', ') : message ?? 'Please try again.';
}

export default function SharePostModal({ visible, post, onClose }: Props) {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const meQuery = useQuery<{ id: string }>({
    queryKey: ['me'],
    queryFn: ResourcesApi.usersMe,
    enabled: visible,
  });
  const connectionsQuery = useQuery<Connection[]>({
    queryKey: ['connections'],
    queryFn: ResourcesApi.connections,
    enabled: visible,
  });

  const peers = useMemo(() => {
    const meId = meQuery.data?.id;
    if (!meId) return [];

    const unique = new Map<string, Peer>();
    for (const connection of connectionsQuery.data ?? []) {
      const peer =
        connection.userA?.id === meId
          ? connection.userB
          : connection.userB?.id === meId
            ? connection.userA
            : null;
      if (peer) unique.set(peer.id, peer);
    }
    return [...unique.values()].sort((a, b) => peerName(a).localeCompare(peerName(b)));
  }, [connectionsQuery.data, meQuery.data?.id]);

  const filteredPeers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return peers;
    return peers.filter((peer) => {
      const searchable =
        peerName(peer) + ' ' + (peer.profile?.headline ?? '') + ' ' + (peer.username ?? '');
      return searchable.toLowerCase().includes(query);
    });
  }, [peers, search]);

  const shareMutation = useMutation({
    mutationFn: async (peer: Peer) => {
      if (!post) throw new Error('Choose a post to share.');
      const conversation = await ResourcesApi.createConversation(peer.id);
      await ResourcesApi.sendMessage(conversation.id, { sharedPostId: post.id });
      return peer;
    },
    onSuccess: async (peer) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['conversations'] }),
        queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      ]);
      setSearch('');
      onClose();
      Alert.alert('Post shared', 'Sent to ' + peerName(peer) + '.');
    },
    onError: (error: unknown) => {
      Alert.alert('Unable to share post', errorMessage(error));
    },
  });

  function close() {
    if (shareMutation.isPending) return;
    setSearch('');
    onClose();
  }

  const loading = meQuery.isLoading || connectionsQuery.isLoading;
  const failed = meQuery.isError || connectionsQuery.isError;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={close}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropPress}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close share post"
        />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Share with a connection</Text>
              <Text style={styles.subtitle}>Choose one person to send this post to.</Text>
            </View>
            <Pressable
              onPress={close}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewAuthor}>{authorName(post)}</Text>
            <Text numberOfLines={2} style={styles.previewContent}>
              {post?.content}
            </Text>
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search connections"
            placeholderTextColor="#777168"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.search}
          />

          <FlatList
            data={filteredPeers}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const sending =
                shareMutation.isPending && shareMutation.variables?.id === item.id;
              return (
                <View style={styles.peerRow}>
                  <Avatar
                    name={peerName(item)}
                    uri={item.profile?.avatarUrl ?? null}
                    size={46}
                  />
                  <View style={styles.peerText}>
                    <Text numberOfLines={1} style={styles.peerName}>
                      {peerName(item)}
                    </Text>
                    {!!item.profile?.headline && (
                      <Text numberOfLines={1} style={styles.peerHeadline}>
                        {item.profile.headline}
                      </Text>
                    )}
                  </View>
                  <Button
                    title={sending ? 'Sending…' : 'Send'}
                    onPress={() => shareMutation.mutate(item)}
                    disabled={shareMutation.isPending}
                    style={styles.sendButton}
                  />
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>
                  {loading
                    ? 'Loading connections…'
                    : failed
                      ? 'Unable to load connections.'
                      : search.trim()
                        ? 'No matching connections.'
                        : 'No connections yet.'}
                </Text>
                {!loading && !failed && !search.trim() && (
                  <Text style={styles.emptyBody}>
                    Accept a connection request before sharing posts privately.
                  </Text>
                )}
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  backdropPress: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheet: {
    maxHeight: '78%',
    minHeight: 420,
    backgroundColor: colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  close: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  preview: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  previewAuthor: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  previewContent: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },
  search: {
    marginTop: spacing.md,
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#D7D0C4',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontSize: 15,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  peerRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D7',
  },
  peerText: {
    flex: 1,
  },
  peerName: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  peerHeadline: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  sendButton: {
    minWidth: 76,
  },
  empty: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
