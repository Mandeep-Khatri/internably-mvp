import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import ScreenContainer from '../shared/ScreenContainer';

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.rowTitle}>Notifications</Text>
        <Text style={styles.rowBody}>Push notifications and email preferences.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.rowTitle}>Privacy</Text>
        <Text style={styles.rowBody}>Control visibility and peer preferences.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.rowTitle}>Admin</Text>
        <Text style={styles.rowBody}>Open moderation and review controls.</Text>
        <Link href="/profile/admin" style={styles.link}>Open admin tools</Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  rowBody: {
    color: '#5C5750',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },
  link: {
    marginTop: spacing.sm,
    color: '#2B7BC6',
    fontWeight: '700',
  },
});
