import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors, radius, shadows, spacing, typography } from './theme';

export type PostCardProps = {
  authorName: string;
  subtitle?: string;
  timestamp?: string;
  avatarUrl?: string | null;
  content: string;
  imageUrl?: string | null;
  likes?: number;
  comments?: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onPressAuthor?: () => void;
  onPressPost?: () => void;
};

function isLikelyImageUrl(uri?: string | null) {
  if (!uri) return false;
  if (!/^https?:\/\//i.test(uri)) return false;
  return /(\.png|\.jpg|\.jpeg|\.webp|\.gif)$/i.test(uri.split('?')[0]);
}

export const PostCard = React.memo(function PostCard({
  authorName,
  subtitle,
  timestamp,
  avatarUrl,
  content,
  imageUrl,
  likes = 0,
  comments = 0,
  onLike,
  onComment,
  onShare,
  onPressAuthor,
  onPressPost,
}: PostCardProps) {
  const showImage = isLikelyImageUrl(imageUrl);
  const HeaderWrapper = onPressAuthor ? Pressable : View;
  const CardWrapper = onPressPost ? Pressable : View;

  return (
    <CardWrapper style={styles.card} onPress={onPressPost}>
      <HeaderWrapper style={styles.headerRow} onPress={onPressAuthor}>
        <Avatar name={authorName} uri={avatarUrl} size={46} />
        <View style={styles.nameCol}>
          <Text style={styles.nameText}>{authorName}</Text>
          {!!subtitle && <Text style={styles.subText}>{subtitle}</Text>}
        </View>
        {!!timestamp && <Text style={styles.timeText}>{timestamp}</Text>}
      </HeaderWrapper>

      <Text style={styles.contentText}>{content}</Text>

      {showImage && <Image source={{ uri: imageUrl as string }} style={styles.postImage} resizeMode="cover" />}

      <View style={styles.metricsRow}>
        <Text style={styles.metricText}>{likes.toLocaleString()} likes</Text>
        <Text style={styles.metricText}>{comments.toLocaleString()} comments</Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable onPress={onLike} style={styles.actionBtn}>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>
        <Pressable onPress={onComment} style={styles.actionBtn}>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>
        <Pressable onPress={onShare} style={styles.actionBtn}>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </CardWrapper>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nameCol: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  nameText: {
    color: colors.text,
    ...typography.body,
    fontWeight: '600',
  },
  subText: {
    color: colors.muted,
    ...typography.secondary,
    marginTop: 1,
  },
  timeText: {
    color: colors.muted,
    ...typography.caption,
  },
  contentText: {
    color: colors.text,
    ...typography.body,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    backgroundColor: colors.border,
  },
  metricsRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricText: {
    color: colors.muted,
    ...typography.caption,
  },
  actionsRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    color: colors.text,
    ...typography.secondary,
    fontWeight: '600',
  },
});
