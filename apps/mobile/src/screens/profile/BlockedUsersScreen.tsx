import { Feather } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type BlockedUser = {
  id: string;
  blockedId: string;
  blocked: {
    id: string;
    username?: string | null;
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
      headline?: string | null;
      avatarUrl?: string | null;
    } | null;
  };
};

function displayName(item: BlockedUser) {
  const first = item.blocked.profile?.firstName?.trim() ?? '';
  const last = item.blocked.profile?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || item.blocked.username || 'Internably Member';
}

export default function BlockedUsersScreen() {
  const queryClient = useQueryClient();
  const blockedQuery = useQuery<BlockedUser[]>({
    queryKey: ['blocked-users'],
    queryFn: ResourcesApi.blockedUsers,
  });

  const unblockMutation = useMutation({
    mutationFn: ResourcesApi.unblockUser,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blocked-users'] }),
        queryClient.invalidateQueries({ queryKey: ['users-search'] }),
        queryClient.invalidateQueries({ queryKey: ['suggestions'] }),
      ]);
    },
    onError: () => {
      Alert.alert('Unable to unblock', 'Please check your connection and try again.');
    },
  });

  function confirmUnblock(item: BlockedUser) {
    Alert.alert(
      `Unblock ${displayName(item)}?`,
      'They may be able to find and connect with you again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => unblockMutation.mutate(item.blockedId),
        },
      ],
    );
  }

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Blocked Users</Text>
      </View>

      {blockedQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : blockedQuery.isError ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Unable to load blocked users</Text>
          <Pressable onPress={() => blockedQuery.refetch()}>
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={blockedQuery.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isUnblocking =
              unblockMutation.isPending && unblockMutation.variables === item.blockedId;
            return (
              <View style={styles.userRow}>
                <Avatar
                  name={displayName(item)}
                  uri={item.blocked.profile?.avatarUrl}
                  size={50}
                />
                <View style={styles.userCopy}>
                  <Text numberOfLines={1} style={styles.userName}>
                    {displayName(item)}
                  </Text>
                  <Text numberOfLines={1} style={styles.userMeta}>
                    {item.blocked.username
                      ? `@${item.blocked.username}`
                      : item.blocked.profile?.headline || 'Internably member'}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={isUnblocking}
                  onPress={() => confirmUnblock(item)}
                  style={[styles.unblockButton, isUnblocking && styles.disabled]}
                >
                  <Text style={styles.unblockText}>
                    {isUnblocking ? 'Unblocking…' : 'Unblock'}
                  </Text>
                </Pressable>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="shield" size={38} color={colors.primary} />
              <Text style={styles.emptyTitle}>No blocked users</Text>
              <Text style={styles.emptyBody}>
                Accounts you block will appear here.
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D6',
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  back: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  loading: {
    marginTop: 48,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: 80,
  },
  userRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D8',
  },
  userCopy: {
    flex: 1,
  },
  userName: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  userMeta: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 18,
  },
  unblockButton: {
    minWidth: 86,
    minHeight: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  unblockText: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.55,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
  },
  emptyTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyBody: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
});
