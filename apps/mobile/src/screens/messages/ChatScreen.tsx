import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, colors, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import ScreenContainer from '../shared/ScreenContainer';

type ChatMessage = {
  id: string;
  type?: 'TEXT' | 'POST_SHARE';
  content: string;
  createdAt?: string;
  sender?: {
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
    };
  };
  sharedPost?: {
    id: string;
    content: string;
    imageUrl?: string | null;
    author?: {
      profile?: {
        firstName?: string | null;
        lastName?: string | null;
      } | null;
    } | null;
  } | null;
};

function senderName(message: ChatMessage) {
  const first = message.sender?.profile?.firstName?.trim() ?? '';
  const last = message.sender?.profile?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || 'Member';
}

function postAuthorName(message: ChatMessage) {
  const first = message.sharedPost?.author?.profile?.firstName?.trim() ?? '';
  const last = message.sharedPost?.author?.profile?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || 'Internably Member';
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
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Conversation</Text>
      </View>

      <FlatList
        data={reversed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const sharedPost = item.sharedPost;
          return (
            <View style={styles.messageCard}>
              <Text style={styles.sender}>{senderName(item)}</Text>
              {item.type === 'POST_SHARE' ? (
                sharedPost ? (
                  <Pressable
                    style={styles.sharedPost}
                    onPress={() => router.push(`/posts/${sharedPost.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel="Open shared post"
                  >
                    {!!sharedPost.imageUrl && (
                      <Image
                        source={{ uri: sharedPost.imageUrl }}
                        style={styles.sharedPostImage}
                      />
                    )}
                    <Text style={styles.sharedPostLabel}>Shared post</Text>
                    <Text style={styles.sharedPostAuthor}>{postAuthorName(item)}</Text>
                    <Text numberOfLines={3} style={styles.sharedPostContent}>
                      {sharedPost.content}
                    </Text>
                    <Text style={styles.openPost}>Open post</Text>
                  </Pressable>
                ) : (
                  <View style={styles.unavailablePost}>
                    <Text style={styles.unavailableTitle}>Post unavailable</Text>
                    <Text style={styles.unavailableBody}>
                      This post may have been deleted.
                    </Text>
                  </View>
                )
              ) : (
                <Text style={styles.body}>{item.content}</Text>
              )}
            </View>
          );
        }}
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
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
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
  sharedPost: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9D2C5',
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  sharedPostImage: {
    width: '100%',
    height: 150,
    borderRadius: 9,
    marginBottom: spacing.sm,
    backgroundColor: '#E8E2D7',
  },
  sharedPostLabel: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sharedPostAuthor: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  sharedPostContent: {
    color: '#393631',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  openPost: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  unavailablePost: {
    borderWidth: 1,
    borderColor: '#D9D2C5',
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  unavailableTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  unavailableBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
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
