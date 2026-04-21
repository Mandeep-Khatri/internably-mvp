import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from './theme';

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onPress?: () => void;
  editable?: boolean;
};

export const SearchBar = React.memo(function SearchBar({
  value,
  placeholder = 'Search...',
  onChangeText,
  onPress,
  editable = true,
}: SearchBarProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>Q</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor="#86807A"
        style={styles.input}
        pointerEvents={editable ? 'auto' : 'none'}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#1E1E1E',
    borderRadius: radius.sm,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 20,
    alignItems: 'center',
  },
  icon: {
    color: colors.text,
    ...typography.body,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    color: colors.text,
    ...typography.body,
    paddingVertical: 8,
  },
});
