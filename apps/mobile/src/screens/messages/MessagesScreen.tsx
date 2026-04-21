import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, colors, spacing, typography } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type Conversation = {
  id: string;
  updatedAt?: string;
  members?: Array<{
    user?: {
      id: string;
      profile?: {
        firstName?: string | null;
        lastName?: string | null;
        avatarUrl?: string | null;
      };
    };
  }>;
  messages?: Array<{
    content?: string | null;
    createdAt?: string;
  }>;
};

function formatDate(ts?: string) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function conversationName(c: Conversation) {
  const member = c.members?.[0]?.user?.profile;
  const first = member?.firstName?.trim() ?? '';
  const last = member?.lastName?.trim() ?? '';
  const full = `${first} ${last}`.trim();
  return full || `Conversation ${c.id.slice(0, 6)}`;
}

function conversationAvatar(c: Conversation) {
  return c.members?.[0]?.user?.profile?.avatarUrl ?? null;
}

export default function MessagesScreen() {
  const [query, setQuery] = useState('');
  const listQuery = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: ResourcesApi.conversations,
  });

  const conversations = listQuery.data ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((item) => {
      const target = `${conversationName(item)} ${item.messages?.[0]?.content ?? ''}`.toLowerCase();
      return target.includes(q);
    });
  }, [conversations, query]);

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.header}>
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const lastMessage = item.messages?.[0]?.content ?? 'Start a conversation';
          return (
            <Pressable onPress={() => router.push(`/messages/${item.id}`)} style={styles.row}>
              <Avatar name={conversationName(item)} uri={conversationAvatar(item)} size={54} online />
              <View style={styles.mainCol}>
                <Text numberOfLines={1} style={styles.name}>{conversationName(item)}</Text>
                <Text numberOfLines={1} style={styles.message}>{lastMessage}</Text>
              </View>
              <Text style={styles.date}>{formatDate(item.updatedAt ?? item.messages?.[0]?.createdAt)}</Text>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No conversations</Text>
            <Text style={styles.emptyBody}>Your messages will show here.</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD2',
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
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: 4,
    paddingBottom: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    gap: spacing.sm,
  },
  mainCol: {
    flex: 1,
  },
  name: {
    color: '#1F1F1F',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  message: {
    marginTop: 2,
    color: '#5E5E5E',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
  },
  date: {
    color: '#767676',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: '#ECE7DC',
  },
  emptyWrap: {
    paddingTop: 50,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  emptyBody: {
    marginTop: 4,
    color: colors.muted,
  },
});
