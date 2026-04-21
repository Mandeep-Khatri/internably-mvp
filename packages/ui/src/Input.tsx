import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from './theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const Input = React.memo(function Input({
  label,
  error,
  style,
  placeholderTextColor,
  ...props
}: InputProps) {
  return (
    <View style={styles.wrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor ?? '#A9A49A'}
        style={[styles.input, style]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.text,
    ...typography.secondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    ...typography.body,
  },
  error: {
    color: '#B42318',
    ...typography.secondary,
    marginTop: 5,
    marginLeft: 4,
  },
});
