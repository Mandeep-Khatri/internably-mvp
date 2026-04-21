import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, colors, spacing } from '@internably/ui/src';
import ScreenContainer from '../shared/ScreenContainer';
import InternablyLogo from '../shared/InternablyLogo';

export default function LandingScreen() {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <InternablyLogo withTagline />

        <Button title="Log In" onPress={() => router.push('/(auth)/sign-in')} style={styles.primaryBtn} />

        <Pressable onPress={() => router.push('/(auth)/sign-up')}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerAccent}>Join the Network</Text>
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  primaryBtn: {
    width: 220,
    marginTop: 28,
    marginBottom: 26,
  },
  footerText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  footerAccent: {
    color: colors.primary,
    fontWeight: '800',
  },
});
