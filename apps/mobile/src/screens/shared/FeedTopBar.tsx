import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing, typography } from '@internably/ui/src';

type FeedTopBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onPressCreate: () => void;
  onPressNotifications: () => void;
  notificationCount?: number;
};

export default function FeedTopBar({
  searchValue,
  onSearchChange,
  onPressCreate,
  onPressNotifications,
  notificationCount = 0,
}: FeedTopBarProps) {
  const badgeText = notificationCount > 99 ? '99+' : `${notificationCount}`;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={22} color="#7A7A7A" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#7A7A7A"
            value={searchValue}
            onChangeText={onSearchChange}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.brandWrap}>
          <Text style={styles.brandText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            <Text style={styles.brandIntern}>Intern</Text>
            <Text style={styles.brandAbly}>ably</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onPressCreate} style={styles.iconButton}>
            <Feather name="edit-3" size={24} color="#111111" />
          </Pressable>

          <Pressable onPress={onPressNotifications} style={styles.iconButton}>
            <Feather name="bell" size={24} color="#111111" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0D5',
    paddingTop: spacing.sm,
    paddingBottom: 10,
    paddingHorizontal: spacing.md,
  },
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchWrap: {
    flex: 1,
    minHeight: 36,
    borderWidth: 0,
    borderRadius: 18,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    color: '#2E2E2E',
    ...typography.secondary,
    paddingVertical: 0,
  },
  brandWrap: {
    width: 136,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandText: {
    ...typography.screenTitle,
    lineHeight: 30,
    includeFontPadding: false,
  },
  brandIntern: {
    color: colors.primary,
  },
  brandAbly: {
    color: '#111111',
  },
  actions: {
    width: 84,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    flexShrink: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EC2D2D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    ...typography.caption,
    fontSize: 11,
    lineHeight: 12,
    fontWeight: '600',
  },
});
