import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors, PostCard, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import ScreenContainer from '../shared/ScreenContainer';

type Group = {
  name?: string;
  description?: string;
  type?: string;
};

type GroupPost = {
  id: string;
  content: string;
  createdAt?: string;
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

function postName(post: GroupPost) {
  const first = post.author?.profile?.firstName ?? '';
  const last = post.author?.profile?.lastName ?? '';
  return `${first} ${last}`.trim() || 'Internably Member';
}

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);

  const detailQuery = useQuery<Group>({
    queryKey: ['group', groupId],
    queryFn: async () => (await api.get(`/groups/${groupId}`)).data,
  });

  const postsQuery = useQuery<GroupPost[]>({
    queryKey: ['group-posts', groupId],
    queryFn: async () => (await api.get(`/groups/${groupId}/posts`)).data,
  });

  return (
    <ScreenContainer>
      <View style={styles.headCard}>
        <Text style={styles.name}>{detailQuery.data?.name ?? 'Community'}</Text>
        <Text style={styles.meta}>{detailQuery.data?.type ?? 'Group'}</Text>
        {!!detailQuery.data?.description && <Text style={styles.desc}>{detailQuery.data.description}</Text>}
      </View>

      <FlatList
        data={postsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PostCard
            authorName={postName(item)}
            subtitle={item.author?.profile?.headline ?? 'Group member'}
            timestamp={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : undefined}
            avatarUrl={item.author?.profile?.avatarUrl ?? null}
            content={item.content}
            likes={item._count?.likes ?? 0}
            comments={item._count?.comments ?? 0}
            onPressAuthor={item.author?.id ? () => router.push(`/profile/${item.author?.id}`) : undefined}
            onPressPost={() => router.push(`/posts/${item.id}`)}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },
  meta: {
    marginTop: 2,
    color: '#615B55',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  desc: {
    marginTop: 8,
    color: '#47433F',
    fontSize: 15,
    lineHeight: 21,
  },
  list: {
    paddingBottom: 110,
  },
});
