import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';

type AvatarProps = {
  name?: string;
  uri?: string | null;
  size?: number;
  online?: boolean;
};

function initials(name?: string) {
  if (!name) return 'IN';
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? 'I';
  const second = parts[1]?.[0] ?? 'N';
  return `${first}${second}`.toUpperCase();
}

function isLikelyImageUrl(uri?: string | null) {
  if (!uri) return false;
  if (!/^https?:\/\//i.test(uri)) return false;
  return /(\.png|\.jpg|\.jpeg|\.webp|\.gif)$/i.test(uri.split('?')[0]);
}

export const Avatar = React.memo(function Avatar({ name, uri, size = 44, online }: AvatarProps) {
  const hasValidImage = isLikelyImageUrl(uri);

  return (
    <View style={{ width: size, height: size }}>
      {hasValidImage ? (
        <Image source={{ uri: uri as string }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.initials, { fontSize: Math.max(13, size * 0.3) }]}>{initials(name)}</Text>
        </View>
      )}
      {!!online && <View style={styles.onlineDot} />}
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: '#D9D2C5',
  },
  fallback: {
    backgroundColor: '#E6F8D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D2C5',
  },
  initials: {
    color: colors.text,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
