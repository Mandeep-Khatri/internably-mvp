import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, colors, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import ScreenContainer from '../shared/ScreenContainer';

type ChatMessage = {
  id: string;
  content: string;
  createdAt?: string;
  sender?: {
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
    };
  };
};

function senderName(message: ChatMessage) {
  const first = message.sender?.profile?.firstName?.trim() ?? '';
  const last = message.sender?.profile?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || 'Member';
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = String(id);
  const [content, setContent] = useState('');
  const qc = useQueryClient();

  const query = useQuery<ChatMessage[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => (await api.get(`/conversations/${conversationId}/messages`)).data,
    enabled: !!conversationId,
  });

  const sendMutation = useMutation({
    mutationFn: async () => api.post(`/conversations/${conversationId}/messages`, { content: content.trim() }),
    onSuccess: async () => {
      setContent('');
      await qc.invalidateQueries({ queryKey: ['messages', conversationId] });
      await qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const reversed = useMemo(() => [...(query.data ?? [])].reverse(), [query.data]);

  return (
    <ScreenContainer noPadding>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>{'<'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Conversation</Text>
      </View>

      <FlatList
        data={reversed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <Text style={styles.sender}>{senderName(item)}</Text>
            <Text style={styles.body}>{item.content}</Text>
          </View>
        )}
      />

      <View style={styles.composer}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Type your message..."
          placeholderTextColor="#7A7469"
          style={styles.input}
          multiline
        />
        <Button
          title={sendMutation.isPending ? 'Sending...' : 'Send'}
          onPress={() => {
            if (!content.trim()) return;
            sendMutation.mutate();
          }}
          disabled={sendMutation.isPending}
          style={styles.sendBtn}
        />
      </View>
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
    color: '#111111',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '500',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 130,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E0D6',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sender: {
    color: colors.text,
    fontWeight: '800',
    marginBottom: 4,
  },
  body: {
    color: '#222222',
    fontSize: 15,
    lineHeight: 21,
  },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E0D6',
    backgroundColor: colors.background,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DAD3C8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: '#1E1E1E',
    fontSize: 15,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  sendBtn: {
    minWidth: 92,
  },
});
