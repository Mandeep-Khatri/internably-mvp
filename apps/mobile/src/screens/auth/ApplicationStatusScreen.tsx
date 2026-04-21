import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, colors, spacing } from '@internably/ui/src';
import ScreenContainer from '../shared/ScreenContainer';

export default function ApplicationStatusScreen() {
  return (
    <ScreenContainer>
      <View style={styles.wrap}>
        <Text style={styles.title}>Application Submitted</Text>
        <Text style={styles.subtitle}>Status: Pending review</Text>
        <Text style={styles.body}>
          We review every application to keep Internably a trusted student-first community.
        </Text>

        <Button title="Back to Sign In" onPress={() => router.replace('/(auth)/sign-in')} style={styles.button} />

        <Pressable onPress={() => router.replace('/(auth)/landing')}>
          <Text style={styles.link}>Return to landing</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.text,
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: '#106F3A',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: spacing.lg,
  },
  button: {
    width: '100%',
  },
  link: {
    marginTop: spacing.md,
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
});
