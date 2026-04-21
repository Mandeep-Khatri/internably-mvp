import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from './theme';

type Variant = 'primary' | 'outline' | 'ghost';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
};

function backgroundColor(variant: Variant) {
  if (variant === 'primary') return colors.primary;
  if (variant === 'outline') return colors.surface;
  return 'transparent';
}

function borderColor(variant: Variant) {
  if (variant === 'outline') return colors.border;
  return 'transparent';
}

export const Button = React.memo(function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: backgroundColor(variant),
          borderColor: borderColor(variant),
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>{title}</Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text,
    ...typography.button,
  },
  ghostText: {
    ...typography.button,
  },
});
