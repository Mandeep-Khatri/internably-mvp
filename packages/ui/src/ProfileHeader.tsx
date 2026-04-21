import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors, radius, shadows, spacing, typography } from './theme';

type ProfileHeaderProps = {
  name: string;
  pronouns?: string | null;
  bio?: string | null;
  headline?: string | null;
  schoolAndCompany?: string | null;
  location?: string | null;
  connectionsCount?: number;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  onEdit?: () => void;
};

function isLikelyImageUrl(uri?: string | null) {
  if (!uri) return false;
  if (!/^https?:\/\//i.test(uri)) return false;
  return /(\.png|\.jpg|\.jpeg|\.webp|\.gif)$/i.test(uri.split('?')[0]);
}

export const ProfileHeader = React.memo(function ProfileHeader({
  name,
  pronouns,
  bio,
  headline,
  schoolAndCompany,
  location,
  connectionsCount = 0,
  avatarUrl,
  bannerUrl,
  onEdit,
}: ProfileHeaderProps) {
  const showBanner = isLikelyImageUrl(bannerUrl);

  return (
    <View style={styles.card}>
      <View style={styles.bannerWrap}>
        {showBanner ? <Image source={{ uri: bannerUrl as string }} style={styles.banner} /> : <View style={styles.bannerFallback} />}
      </View>

      <View style={styles.avatarWrap}>
        <Avatar name={name} uri={avatarUrl} size={120} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{name}</Text>
          {!!pronouns && <Text style={styles.pronouns}>{pronouns}</Text>}
        </View>
        {!!headline && <Text style={styles.headline}>{headline}</Text>}
        {!!bio && <Text style={styles.bio}>{bio}</Text>}
        {!!schoolAndCompany && <Text style={styles.detail}>{schoolAndCompany}</Text>}
        {!!location && <Text style={styles.location}>{location}</Text>}

        <Text style={styles.connections}>{connectionsCount}+ connections</Text>

        {!!onEdit && (
          <Pressable onPress={onEdit} style={styles.editBtn}>
            <Text style={styles.editText}>Edit profile</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  bannerWrap: {
    height: 152,
    backgroundColor: '#274B8B',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerFallback: {
    flex: 1,
    backgroundColor: '#274B8B',
  },
  avatarWrap: {
    marginTop: -58,
    marginLeft: spacing.lg,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  name: {
    color: colors.text,
    ...typography.screenTitle,
  },
  pronouns: {
    color: colors.muted,
    ...typography.body,
    marginLeft: 8,
  },
  headline: {
    marginTop: spacing.sm,
    color: colors.text,
    ...typography.sectionHeader,
  },
  bio: {
    marginTop: spacing.xs,
    color: colors.text,
    ...typography.body,
  },
  detail: {
    marginTop: spacing.md,
    color: colors.text,
    ...typography.body,
    fontWeight: '600',
  },
  location: {
    marginTop: spacing.xs,
    color: colors.muted,
    ...typography.secondary,
  },
  connections: {
    marginTop: spacing.md,
    color: '#1166B8',
    ...typography.sectionHeader,
  },
  editBtn: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
  },
  editText: {
    color: colors.text,
    ...typography.button,
  },
});
