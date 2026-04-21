import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ConnectionCard, colors, spacing, typography } from '@internably/ui/src';
import { api } from '@/api/client';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type SuggestedUser = {
  id: string;
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
  const qc = useQueryClient();

  const suggestionsQuery = useQuery<SuggestedUser[]>({
    queryKey: ['suggestions'],
    queryFn: ResourcesApi.usersSuggestions,
  });

  const groupsQuery = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: ResourcesApi.groups,
  });

  const connectMutation = useMutation({
    mutationFn: async (userId: string) => api.post(`/connections/request/${userId}`),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['connections'] });
    },
  });

  const suggestions = suggestionsQuery.data ?? [];
  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter((u) => `${userName(u)} ${userHeadline(u)}`.toLowerCase().includes(q));
  }, [suggestions, query]);

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.headerRow}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={22} color="#7A7A7A" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
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
          data={filteredSuggestions}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.column}
          renderItem={({ item }) => (
            <View style={styles.cardCol}>
              <ConnectionCard
                name={userName(item)}
                headline={userHeadline(item)}
                mutualText="Mutual peers in your network"
                avatarUrl={item.profile?.avatarUrl ?? null}
                onConnect={() => connectMutation.mutate(item.id)}
                onPress={() => router.push(`/profile/${item.id}`)}
              />
            </View>
          )}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>People you may know from your student network</Text>
          }
        />
      ) : (
        <FlatList
          key="checkin-list"
          data={groupsQuery.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.groupContent}
          renderItem={({ item }) => (
            <Pressable style={styles.groupCard} onPress={() => router.push(`/groups/${item.id}`)}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMeta}>{item.type ?? 'Group'} · {item._count?.members ?? 0} members</Text>
              {!!item.description && <Text numberOfLines={2} style={styles.groupDesc}>{item.description}</Text>}
            </Pressable>
          )}
          ListHeaderComponent={<Text style={styles.sectionTitle}>Communities to catch up with</Text>}
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
    minHeight: 36,
    borderWidth: 0,
    borderRadius: 18,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    color: '#2E2E2E',
    ...typography.secondary,
    paddingVertical: 0,
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
