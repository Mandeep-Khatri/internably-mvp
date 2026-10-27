import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, ConnectionCard, colors, spacing, typography } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type SuggestedUser = {
  id: string;
  username?: string | null;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    headline?: string | null;
    major?: string | null;
    school?: { name?: string | null } | null;
    avatarUrl?: string | null;
  };
};

type Group = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  _count?: { members?: number };
};

type Connection = {
  id: string;
  userAId: string;
  userBId: string;
};

type ConnectionRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: SuggestedUser;
  toUser?: SuggestedUser;
};

function userName(user: SuggestedUser) {
  const first = user.profile?.firstName?.trim() ?? '';
  const last = user.profile?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || 'Internably Member';
}

function userHeadline(user: SuggestedUser) {
  const school = user.profile?.school?.name;
  const major = user.profile?.major;
  const headline = user.profile?.headline;
  return headline || [major, school].filter(Boolean).join(' · ') || 'Student member';
}

export default function GrowScreen() {
  const [tab, setTab] = useState<'grow' | 'catchup'>('grow');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const qc = useQueryClient();
  const trimmedQuery = query.trim();
  const searching = trimmedQuery.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(trimmedQuery), 300);
    return () => clearTimeout(timer);
  }, [trimmedQuery]);

  const meQuery = useQuery<{ id: string }>({
    queryKey: ['me'],
    queryFn: ResourcesApi.usersMe,
  });

  const suggestionsQuery = useQuery<SuggestedUser[]>({
    queryKey: ['suggestions'],
    queryFn: ResourcesApi.usersSuggestions,
  });

  const searchQuery = useQuery<SuggestedUser[]>({
    queryKey: ['users-search', debouncedQuery],
    queryFn: () => ResourcesApi.usersSearch(debouncedQuery),
    enabled: tab === 'grow' && debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const connectionsQuery = useQuery<Connection[]>({
    queryKey: ['connections'],
    queryFn: ResourcesApi.connections,
  });

  const groupsQuery = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: ResourcesApi.groups,
  });

  const outgoingQuery = useQuery<ConnectionRequest[]>({
    queryKey: ['connection-requests', 'outgoing'],
    queryFn: ResourcesApi.outgoingConnectionRequests,
  });

  const incomingQuery = useQuery<ConnectionRequest[]>({
    queryKey: ['connection-requests', 'incoming'],
    queryFn: ResourcesApi.incomingConnectionRequests,
  });

  const connectMutation = useMutation({
    mutationFn: ResourcesApi.requestConnection,
    onMutate: async (userId) => {
      await qc.cancelQueries({ queryKey: ['connection-requests', 'outgoing'] });
      const previous = qc.getQueryData<ConnectionRequest[]>(['connection-requests', 'outgoing']);
      const toUser =
        searchQuery.data?.find((user) => user.id === userId) ??
        suggestionsQuery.data?.find((user) => user.id === userId);
      qc.setQueryData<ConnectionRequest[]>(['connection-requests', 'outgoing'], (current = []) => [
        ...current,
        {
          id: `pending-${userId}`,
          fromUserId: '',
          toUserId: userId,
          toUser,
        },
      ]);
      return { previous };
    },
    onError: (_error, _userId, context) => {
      qc.setQueryData(['connection-requests', 'outgoing'], context?.previous ?? []);
      Alert.alert('Unable to connect', 'Please check your network and try again.');
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['suggestions'] }),
        qc.invalidateQueries({ queryKey: ['users-search'] }),
        qc.invalidateQueries({ queryKey: ['connection-requests', 'outgoing'] }),
      ]);
    },
  });

  const respondMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'decline' }) =>
      action === 'accept'
        ? ResourcesApi.acceptConnectionRequest(requestId)
        : ResourcesApi.declineConnectionRequest(requestId),
    onMutate: async ({ requestId }) => {
      await qc.cancelQueries({ queryKey: ['connection-requests', 'incoming'] });
      const previous = qc.getQueryData<ConnectionRequest[]>(['connection-requests', 'incoming']);
      qc.setQueryData<ConnectionRequest[]>(['connection-requests', 'incoming'], (current = []) =>
        current.filter((request) => request.id !== requestId),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      qc.setQueryData(['connection-requests', 'incoming'], context?.previous ?? []);
      Alert.alert('Unable to update request', 'Please check your network and try again.');
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['connection-requests', 'incoming'] }),
        qc.invalidateQueries({ queryKey: ['connections'] }),
        qc.invalidateQueries({ queryKey: ['suggestions'] }),
        qc.invalidateQueries({ queryKey: ['users-search'] }),
      ]);
    },
  });

  const outgoing = outgoingQuery.data ?? [];
  const incoming = incomingQuery.data ?? [];
  const outgoingUserIds = useMemo(() => new Set(outgoing.map((request) => request.toUserId)), [outgoing]);
  const incomingByUserId = useMemo(
    () => new Map<string, ConnectionRequest>(
      incoming.map((request) => [request.fromUserId, request] as const),
    ),
    [incoming],
  );
  const connectedUserIds = useMemo(() => {
    const ids = new Set<string>();
    const meId = meQuery.data?.id;
    if (!meId) return ids;
    for (const connection of connectionsQuery.data ?? []) {
      if (connection.userAId === meId) ids.add(connection.userBId);
      if (connection.userBId === meId) ids.add(connection.userAId);
    }
    return ids;
  }, [connectionsQuery.data, meQuery.data?.id]);
  const suggestions = useMemo(() => {
    const users = [...(suggestionsQuery.data ?? [])];
    const ids = new Set(users.map((user) => user.id));
    for (const request of outgoing) {
      if (request.toUser && !ids.has(request.toUser.id)) {
        users.push(request.toUser);
        ids.add(request.toUser.id);
      }
    }
    return users;
  }, [suggestionsQuery.data, outgoing]);
  const searchMatchesCurrent = trimmedQuery.length >= 2 && debouncedQuery === trimmedQuery;
  const visibleUsers = searching
    ? searchMatchesCurrent
      ? searchQuery.data ?? []
      : []
    : suggestions;
  const searchPending =
    searching &&
    trimmedQuery.length >= 2 &&
    (!searchMatchesCurrent || searchQuery.isFetching);

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.headerRow}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={22} color="#7A7A7A" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search peer"
            placeholderTextColor="#7A7A7A"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.logoWrap}>
          <Text style={styles.brandText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9}>
            <Text style={styles.brandIntern}>Intern</Text>
            <Text style={styles.brandAbly}>ably</Text>
          </Text>
        </View>
      </View>

      <View style={styles.segmented}>
        <Pressable onPress={() => setTab('grow')} style={[styles.segmentItem, tab === 'grow' && styles.segmentItemActive]}>
          <Text style={[styles.segmentText, tab === 'grow' && styles.segmentTextActive]}>Grow</Text>
        </Pressable>
        <Pressable onPress={() => setTab('catchup')} style={[styles.segmentItem, tab === 'catchup' && styles.segmentItemActive]}>
          <Text style={[styles.segmentText, tab === 'catchup' && styles.segmentTextActive]}>Check in</Text>
        </Pressable>
      </View>

      {tab === 'grow' ? (
        <FlatList
          key="grow-list"
          data={visibleUsers}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.column}
          renderItem={({ item }) => {
            const connected = connectedUserIds.has(item.id);
            const requested = outgoingUserIds.has(item.id);
            const incomingRequest = incomingByUserId.get(item.id);
            const sending = connectMutation.isPending && connectMutation.variables === item.id;
            const accepting =
              respondMutation.isPending && respondMutation.variables?.requestId === incomingRequest?.id;
            const connectLabel = connected
              ? 'Connected'
              : requested
                ? 'Requested'
                : accepting
                  ? 'Accepting…'
                  : incomingRequest
                    ? 'Accept'
                    : sending
                      ? 'Sending…'
                      : 'Connect';

            return (
              <View style={styles.cardCol}>
                <ConnectionCard
                  name={userName(item)}
                  headline={userHeadline(item)}
                  mutualText={searching && item.username ? `@${item.username}` : 'Student member'}
                  avatarUrl={item.profile?.avatarUrl ?? null}
                  onConnect={() => {
                    if (connected || requested || sending || accepting) return;
                    if (incomingRequest) {
                      respondMutation.mutate({ requestId: incomingRequest.id, action: 'accept' });
                      return;
                    }
                    connectMutation.mutate(item.id);
                  }}
                  connectLabel={connectLabel}
                  connectDisabled={connected || requested || sending || accepting}
                  connectVariant={connected || requested ? 'success' : 'default'}
                  onPress={() => router.push(`/profile/${item.id}`)}
                />
              </View>
            );
          }}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              {searching ? 'Search results' : 'People you may know from your student network'}
            </Text>
          }
          ListEmptyComponent={
            searching ? (
              trimmedQuery.length < 2 ? (
                <Text style={styles.emptyText}>Type at least 2 characters to search for a member.</Text>
              ) : searchPending ? (
                <ActivityIndicator color={colors.primary} />
              ) : searchQuery.isError ? (
                <Text style={styles.emptyText}>Unable to search members. Please try again.</Text>
              ) : (
                <Text style={styles.emptyText}>No members found with that name or username.</Text>
              )
            ) : suggestionsQuery.isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.emptyText}>No new people to suggest right now.</Text>
            )
          }
        />
      ) : (
        <FlatList
          key="checkin-list"
          data={incomingQuery.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.groupContent}
          renderItem={({ item }) => {
            const responding = respondMutation.isPending && respondMutation.variables?.requestId === item.id;
            return (
            <View style={styles.requestCard}>
              <Pressable style={styles.requestPerson} onPress={() => router.push(`/profile/${item.fromUserId}`)}>
                <Avatar name={userName(item.fromUser ?? { id: item.fromUserId })} uri={item.fromUser?.profile?.avatarUrl} size={58} />
                <View style={styles.requestCopy}>
                  <Text numberOfLines={1} style={styles.requestName}>{userName(item.fromUser ?? { id: item.fromUserId })}</Text>
                  <Text numberOfLines={2} style={styles.requestHeadline}>{userHeadline(item.fromUser ?? { id: item.fromUserId })}</Text>
                </View>
              </Pressable>
              <View style={styles.requestActions}>
                <Pressable
                  disabled={responding}
                  onPress={() => respondMutation.mutate({ requestId: item.id, action: 'accept' })}
                  style={[styles.acceptBtn, responding && styles.disabledBtn]}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </Pressable>
                <Pressable
                  disabled={responding}
                  onPress={() => respondMutation.mutate({ requestId: item.id, action: 'decline' })}
                  style={[styles.denyBtn, responding && styles.disabledBtn]}
                >
                  <Text style={styles.denyText}>Deny</Text>
                </Pressable>
              </View>
            </View>
            );
          }}
          ListHeaderComponent={<Text style={styles.sectionTitle}>Connection requests</Text>}
          ListEmptyComponent={incomingQuery.isLoading
            ? <ActivityIndicator color={colors.primary} />
            : <Text style={styles.emptyText}>No new connection requests.</Text>}
          ListFooterComponent={
            <View style={styles.communitiesSection}>
              <Text style={styles.sectionTitle}>Communities to catch up with</Text>
              {(groupsQuery.data ?? []).map((group) => (
                <Pressable key={group.id} style={styles.groupCard} onPress={() => router.push(`/groups/${group.id}`)}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupMeta}>{group.type ?? 'Group'} · {group._count?.members ?? 0} members</Text>
                  {!!group.description && <Text numberOfLines={2} style={styles.groupDesc}>{group.description}</Text>}
                </Pressable>
              ))}
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E4DFD4',
    backgroundColor: colors.background,
  },
  searchWrap: {
    flex: 1,
    height: 44,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#2E2E2E',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  logoWrap: {
    width: 136,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    ...typography.screenTitle,
    fontSize: 23,
    lineHeight: 30,
    includeFontPadding: false,
  },
  brandIntern: {
    color: colors.primary,
  },
  brandAbly: {
    color: '#111111',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E1D7',
  },
  segmentItem: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  segmentItemActive: {
    borderBottomColor: colors.primary,
  },
  segmentText: {
    color: '#3D3943',
    ...typography.subtitle,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.primary,
  },
  sectionTitle: {
    color: '#151515',
    ...typography.sectionHeader,
    marginBottom: spacing.md,
  },
  gridContent: {
    padding: spacing.md,
    paddingBottom: 110,
  },
  column: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardCol: {
    flex: 1,
  },
  groupContent: {
    padding: spacing.md,
    paddingBottom: 110,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E0D6',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  requestPerson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  requestCopy: {
    flex: 1,
  },
  requestName: {
    color: colors.text,
    ...typography.subtitle,
    fontWeight: '600',
  },
  requestHeadline: {
    color: '#6B655F',
    ...typography.secondary,
    marginTop: 2,
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  acceptBtn: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  acceptText: {
    color: '#FFFFFF',
    ...typography.button,
  },
  denyBtn: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#9B2C2C',
  },
  denyText: {
    color: '#9B2C2C',
    ...typography.button,
  },
  disabledBtn: {
    opacity: 0.55,
  },
  emptyText: {
    color: colors.muted,
    ...typography.body,
    marginBottom: spacing.lg,
  },
  communitiesSection: {
    marginTop: spacing.lg,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E0D6',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  groupName: {
    color: colors.text,
    ...typography.subtitle,
    fontWeight: '600',
  },
  groupMeta: {
    marginTop: 3,
    color: '#6B655F',
    ...typography.secondary,
    fontWeight: '500',
  },
  groupDesc: {
    marginTop: 6,
    color: '#58524D',
    ...typography.secondary,
  },
});
