import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@internably/ui/src';

type InternablyLogoProps = {
  compact?: boolean;
  light?: boolean;
  withIcon?: boolean;
  withTagline?: boolean;
};

export default function InternablyLogo({
  compact,
  light,
  withIcon = false,
  withTagline = false,
}: InternablyLogoProps) {
  const titleStyle = compact ? styles.wordCompact : styles.word;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {withIcon && (
        <View style={styles.mark}>
          <View style={styles.markDot} />
          <View style={styles.markDot} />
          <View style={styles.markDot} />
          <View style={styles.markSlash} />
        </View>
      )}
      <View>
        <Text style={titleStyle}>
          <Text style={styles.intern}>Intern</Text>
          <Text style={[styles.ably, light && styles.ablyLight]}>ably</Text>
        </Text>
        {withTagline && (
          <Text style={styles.tagline}>Where Interns Connect, Grow and Excel</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  wrapCompact: {
    justifyContent: 'flex-start',
  },
  mark: {
    width: 46,
    height: 58,
    backgroundColor: '#F6F3EA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    padding: 6,
    justifyContent: 'space-between',
  },
  markDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111111',
  },
  markSlash: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111111',
    transform: [{ rotate: '-35deg' }],
    marginLeft: 10,
    marginBottom: 3,
  },
  word: {
    ...typography.brand,
  },
  wordCompact: {
    ...typography.screenTitle,
  },
  intern: {
    color: colors.primary,
  },
  ably: {
    color: '#111111',
  },
  ablyLight: {
    color: '#F6F3EA',
  },
  tagline: {
    marginTop: 2,
    color: colors.primary,
    ...typography.subtitle,
    textAlign: 'center',
  },
});
