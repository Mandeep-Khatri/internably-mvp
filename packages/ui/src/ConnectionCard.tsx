import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors, radius, shadows, spacing, typography } from './theme';

type ConnectionCardProps = {
  name: string;
  headline?: string;
  mutualText?: string;
  avatarUrl?: string | null;
  onConnect?: () => void;
  onDismiss?: () => void;
  onPress?: () => void;
};

export const ConnectionCard = React.memo(function ConnectionCard({
  name,
  headline,
  mutualText,
  avatarUrl,
  onConnect,
  onDismiss,
  onPress,
}: ConnectionCardProps) {
  const CardWrapper = onPress ? Pressable : View;
  return (
    <CardWrapper style={styles.card} onPress={onPress}>
      <View style={styles.dismissRow}>
        <View />
        {!!onDismiss && (
          <Pressable onPress={onDismiss} style={styles.dismissBtn}>
            <Text style={styles.dismissText}>x</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.avatarRow}>
        <Avatar name={name} uri={avatarUrl} size={86} />
      </View>
      <Text numberOfLines={1} style={styles.name}>{name}</Text>
      {!!headline && <Text numberOfLines={2} style={styles.headline}>{headline}</Text>}
      {!!mutualText && <Text numberOfLines={2} style={styles.mutual}>{mutualText}</Text>}
      <Pressable onPress={onConnect} style={styles.connectBtn}>
        <Text style={styles.connectText}>Connect</Text>
      </Pressable>
    </CardWrapper>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadows.card,
  },
  dismissRow: {
    alignItems: 'flex-end',
    minHeight: 24,
  },
  dismissBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272727',
  },
  dismissText: {
    color: '#FFFFFF',
    ...typography.secondary,
    fontWeight: '600',
  },
  avatarRow: {
    alignItems: 'center',
    marginTop: -8,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.sectionHeader,
    color: colors.text,
    textAlign: 'center',
  },
  headline: {
    ...typography.secondary,
    color: '#6B6B6B',
    textAlign: 'center',
    marginTop: 4,
    minHeight: 42,
  },
  mutual: {
    ...typography.caption,
    color: '#7A7A7A',
    textAlign: 'left',
    marginTop: spacing.sm,
    minHeight: 36,
  },
  connectBtn: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#2B7BC6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  connectText: {
    color: '#2B7BC6',
    ...typography.button,
  },
});
