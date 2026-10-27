import { Feather } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import { useAuthStore } from '@/store/auth-store';
import ScreenContainer from '../shared/ScreenContainer';

type MeResponse = {
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  profile?: {
    openToNetwork?: boolean | null;
  } | null;
};

type SettingsRowProps = {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  disabled = false,
}: SettingsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
    >
      <View style={[styles.iconWrap, destructive && styles.dangerIconWrap]}>
        <Feather name={icon} size={20} color={destructive ? '#B42318' : colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, destructive && styles.dangerText]}>{title}</Text>
        {!!subtitle && <Text style={styles.rowBody}>{subtitle}</Text>}
      </View>
      <Feather name="chevron-right" size={21} color={destructive ? '#B42318' : '#777168'} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const clearAuth = useAuthStore((state) => state.clear);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const queryClient = useQueryClient();

  const meQuery = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: ResourcesApi.usersMe,
  });

  const updateNetworkingMutation = useMutation({
    mutationFn: (openToNetwork: boolean) => ResourcesApi.updateMe({ openToNetwork }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['me'], updatedUser);
      void queryClient.invalidateQueries({ queryKey: ['users-search'] });
      void queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
    onError: () => {
      Alert.alert('Unable to update privacy', 'Please check your connection and try again.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await ResourcesApi.logout(refreshToken);
      }
    },
    onSettled: async () => {
      queryClient.clear();
      await clearAuth();
      router.replace('/(auth)/sign-in');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: ResourcesApi.deleteMe,
    onSuccess: async () => {
      queryClient.clear();
      await clearAuth();
      router.replace('/(auth)/sign-in');
    },
    onError: () => {
      Alert.alert(
        'Unable to delete account',
        'Your account was not deleted. Please check your connection and try again.',
      );
    },
  });

  const openToNetwork = Boolean(meQuery.data?.profile?.openToNetwork);
  const isAdmin =
    meQuery.data?.role === 'ADMIN' || meQuery.data?.role === 'MODERATOR';

  async function openExternal(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', 'Please try again later.');
    }
  }

  function confirmLogout() {
    Alert.alert('Log out?', 'You can sign back in at any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        onPress: () => logoutMutation.mutate(),
      },
    ]);
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Permanently delete account?',
      'Your profile, posts, messages, connections, and account data will be deleted. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => deleteAccountMutation.mutate(),
        },
      ],
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="user"
          title="Manage Profile"
          subtitle="Update your profile, school, skills, and photos."
          onPress={() => router.push('/profile/edit')}
        />
      </View>

      <Text style={styles.sectionTitle}>Privacy & Safety</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Feather name="users" size={20} color={colors.primary} />
          </View>
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>Open to networking</Text>
            <Text style={styles.rowBody}>
              Allow other students to discover and connect with you.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Open to networking"
            value={openToNetwork}
            disabled={meQuery.isLoading || updateNetworkingMutation.isPending}
            onValueChange={(value) => updateNetworkingMutation.mutate(value)}
            trackColor={{ false: '#C8C3BA', true: '#80C993' }}
            thumbColor={openToNetwork ? colors.primary : '#FFFFFF'}
          />
        </View>
        <View style={styles.divider} />
        <SettingsRow
          icon="slash"
          title="Blocked Users"
          subtitle="Review and unblock accounts."
          onPress={() => router.push('/profile/blocked-users')}
        />
      </View>

      <Text style={styles.sectionTitle}>Support & Legal</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="shield"
          title="Privacy Policy"
          onPress={() => void openExternal('https://internably.com/privacy')}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="file-text"
          title="Terms"
          onPress={() => void openExternal('https://internably.com/terms')}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="heart"
          title="Community Guidelines"
          onPress={() => void openExternal('https://internably.com/community-guidelines')}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="mail"
          title="Contact Support"
          subtitle="support@internably.com"
          onPress={() =>
            void openExternal('mailto:support@internably.com?subject=Internably%20Support')
          }
        />
      </View>

      {isAdmin && (
        <>
          <Text style={styles.sectionTitle}>Administration</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="lock"
              title="Admin Tools"
              subtitle="Moderation and member review controls."
              onPress={() => router.push('/profile/admin')}
            />
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="log-out"
          title={logoutMutation.isPending ? 'Logging out…' : 'Log Out'}
          disabled={logoutMutation.isPending || deleteAccountMutation.isPending}
          onPress={confirmLogout}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="trash-2"
          title={deleteAccountMutation.isPending ? 'Deleting account…' : 'Delete Account'}
          subtitle="Permanently remove your account and data."
          destructive
          disabled={logoutMutation.isPending || deleteAccountMutation.isPending}
          onPress={confirmDeleteAccount}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  back: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
  },
  sectionTitle: {
    marginTop: spacing.sm,
    marginBottom: 8,
    color: '#59544C',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    marginBottom: spacing.md,
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: '#F3EFE6',
  },
  rowDisabled: {
    opacity: 0.55,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F4EA',
  },
  dangerIconWrap: {
    backgroundColor: '#FEECEB',
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    color: '#1A1A1A',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  rowBody: {
    marginTop: 2,
    color: '#676158',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
  dangerText: {
    color: '#B42318',
  },
  divider: {
    height: 1,
    marginLeft: 64,
    backgroundColor: '#ECE7DE',
  },
});
