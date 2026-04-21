import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type NotificationItem = {
  id: string;
  title?: string;
  body?: string;
  isRead?: boolean;
  createdAt?: string;
};

function timestamp(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function NotificationsScreen() {
  const queryClient = useQueryClient();
  const query = useQuery<NotificationItem[]>({ queryKey: ['notifications'], queryFn: ResourcesApi.notifications });

  const markRead = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={query.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => markRead.mutate(item.id)} style={[styles.card, item.isRead && styles.readCard]}>
            <View style={styles.cardHead}>
              <Text numberOfLines={1} style={styles.cardTitle}>{item.title ?? 'Update'}</Text>
              <Text style={styles.cardTime}>{timestamp(item.createdAt)}</Text>
            </View>
            <Text style={styles.cardBody}>{item.body ?? 'No additional details.'}</Text>
            {!item.isRead && <Text style={styles.unread}>Unread</Text>}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>You are all caught up.</Text>
          </View>
        }
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
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E0D6',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  readCard: {
    opacity: 0.75,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#1E1E1E',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTime: {
    color: '#7C7770',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  cardBody: {
    color: '#4A4741',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  unread: {
    marginTop: 6,
    color: '#0F8F49',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
});
