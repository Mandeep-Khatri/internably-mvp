import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type Group = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  _count?: { members?: number };
};

export default function GroupsDirectoryScreen() {
  const query = useQuery<Group[]>({ queryKey: ['groups'], queryFn: ResourcesApi.groups });

  return (
    <ScreenContainer>
      <Text style={styles.title}>Communities</Text>
      <FlatList
        data={query.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/groups/${item.id}`)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.type ?? 'Group'} · {item._count?.members ?? 0} members</Text>
            {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  name: {
    color: '#161616',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
  },
  meta: {
    marginTop: 4,
    color: '#666059',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  desc: {
    marginTop: 6,
    color: '#4C4843',
    fontSize: 14,
    lineHeight: 20,
  },
});
