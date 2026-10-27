import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';

type MeResponse = {
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
};

export default function AdminPlaceholderScreen() {
  const meQuery = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: ResourcesApi.usersMe,
  });

  const isAdmin =
    meQuery.data?.role === 'ADMIN' || meQuery.data?.role === 'MODERATOR';

  if (meQuery.isLoading) {
    return (
      <Screen>
        <Card>
          <Text style={styles.body}>Checking admin access…</Text>
        </Card>
      </Screen>
    );
  }

  if (!isAdmin) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>Admin access required</Text>
          <Text style={styles.body}>This area is available only to Internably administrators.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Back to Settings</Text>
          </Pressable>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Admin Console</Text>
        <Text style={styles.body}>• Review applications</Text>
        <Text style={styles.body}>• Approve or deny members</Text>
        <Text style={styles.body}>• Moderate reports</Text>
        <Text style={styles.body}>• Manage communities</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
