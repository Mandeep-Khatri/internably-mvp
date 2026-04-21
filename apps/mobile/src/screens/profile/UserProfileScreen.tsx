import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Image, Modal, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing, typography } from '@internably/ui/src';
import { api } from '@/api/client';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

type UserProfileResponse = {
  id: string;
  connectionsCount?: number;
  mutualConnectionsCount?: number;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    pronouns?: string | null;
    headline?: string | null;
    bio?: string | null;
    school?: { name?: string | null } | null;
    company?: { name?: string | null } | null;
    major?: string | null;
    city?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    internshipCompany?: string | null;
    interests?: Array<string | { interest?: { name?: string | null } | null } | null> | null;
    linkedinUrl?: string | null;
  };
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = String(id);
  const [search, setSearch] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [blockVisible, setBlockVisible] = React.useState(false);
  const [blockReason, setBlockReason] = React.useState('');
  const qc = useQueryClient();

  const userQuery = useQuery<UserProfileResponse>({
    queryKey: ['user', userId],
    queryFn: () => ResourcesApi.userById(userId),
    enabled: Boolean(userId),
  });
  const connectionsQuery = useQuery<any[]>({
    queryKey: ['connections'],
    queryFn: ResourcesApi.connections,
  });

  const connectMutation = useMutation({
    mutationFn: async () => api.post(`/connections/request/${userId}`),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['connections'] });
      Alert.alert('Request sent', 'Your connection request was sent.');
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Please try again.';
      Alert.alert('Unable to connect', text);
    },
  });
  const removeMutation = useMutation({
    mutationFn: async () => ResourcesApi.removeConnection(userId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['connections'] });
      Alert.alert('Removed', 'Peer removed from your network.');
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Please try again.';
      Alert.alert('Unable to remove', text);
    },
  });
  const blockMutation = useMutation({
    mutationFn: async () => ResourcesApi.blockUser(userId, blockReason.trim()),
    onSuccess: async () => {
      setBlockVisible(false);
      setBlockReason('');
      await qc.invalidateQueries({ queryKey: ['connections'] });
      Alert.alert('Blocked', 'This user has been blocked.');
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Please try again.';
      Alert.alert('Unable to block', text);
    },
  });
  const messageMutation = useMutation({
    mutationFn: async () => ResourcesApi.createConversation(userId),
    onSuccess: (conversation: { id: string }) => {
      router.push(`/messages/${conversation.id}`);
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
      const text = Array.isArray(message) ? message.join(', ') : message ?? 'Please try again.';
      Alert.alert('Unable to message', text);
    },
  });

  const profile = userQuery.data?.profile;
  const name = `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() || 'Internably Member';
  const pronouns = profile?.pronouns?.trim() || '';
  const headline = profile?.headline?.trim() || '';
  const bio = profile?.bio?.trim() || '';
  const bioLine = [headline, bio].filter(Boolean).join(' ').trim();
  const major = profile?.major?.trim() || '';
  const internshipCompany =
    profile?.company?.name?.trim() ||
    profile?.internshipCompany?.trim() ||
    '';
  const websiteUrl = profile?.linkedinUrl?.trim() || '';
  const location = profile?.city?.trim() || '';
  const schoolCompany = [profile?.internshipCompany, profile?.school?.name].filter(Boolean).join(' · ');
  const schoolCompanyLine = [schoolCompany, location].filter(Boolean).join(' · ');
  const skills = Array.isArray(profile?.interests)
    ? profile?.interests
        .map((item: unknown) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            const maybe = item as {
              name?: string;
              label?: string;
              title?: string;
              interest?: { name?: string | null } | null;
            };
            return maybe.name ?? maybe.label ?? maybe.title ?? maybe.interest?.name ?? '';
          }
          return '';
        })
        .filter((value) => Boolean(value))
    : [];

  const connections = connectionsQuery.data ?? [];
  const isConnected = connections.some(
    (edge) => edge.userAId === userId || edge.userBId === userId || edge.userA?.id === userId || edge.userB?.id === userId,
  );
  const peersCount =
    typeof (userQuery.data as any)?.connectionsCount === 'number'
      ? (userQuery.data as any)?.connectionsCount
      : null;
  const mutualPeers =
    typeof (userQuery.data as any)?.mutualConnectionsCount === 'number'
      ? (userQuery.data as any)?.mutualConnectionsCount
      : null;

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color="#111111" />
        </Pressable>
        <View style={styles.searchWrap}>
          <Feather name="search" size={22} color="#7A7A7A" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#7A7A7A"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.brandWrap}>
          <Text style={styles.brandText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9}>
            <Text style={styles.brandIntern}>Intern</Text>
            <Text style={styles.brandAbly}>ably</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => messageMutation.mutate()} style={styles.iconButton}>
            <Feather name="message-circle" size={22} color="#111111" />
          </Pressable>
          <Pressable onPress={() => setMenuOpen((prev) => !prev)} style={styles.iconButton}>
            <Feather name="more-vertical" size={22} color="#111111" />
          </Pressable>
        </View>
      </View>

      {menuOpen && (
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              onPress={async () => {
                setMenuOpen(false);
                await Share.share({
                  message: `Check out this Internably profile: https://internably.com/users/${userId}`,
                });
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Share profile</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                if (isConnected) {
                  removeMutation.mutate();
                } else {
                  Alert.alert('Not connected', 'You are not connected with this user.');
                }
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Remove peers</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                setBlockVisible(true);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Block</Text>
            </Pressable>
          </View>
        </Pressable>
      )}

      <FlatList
        data={[]}
        keyExtractor={(_, i) => `${i}`}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.bannerWrap}>
              {profile?.bannerUrl ? (
                <Image source={{ uri: profile.bannerUrl }} style={styles.bannerImage} />
              ) : (
                <View style={styles.bannerFallback} />
              )}
            </View>

            <View style={styles.avatarRow}>
              <View style={styles.avatarShell}>
                {profile?.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{name}</Text>
                {!!pronouns && <Text style={styles.pronouns}>{pronouns}</Text>}
              </View>
              {!!websiteUrl && <Text style={styles.portfolio}>{websiteUrl}</Text>}
              {!!bioLine && <Text style={styles.bio}>{bioLine}</Text>}
              {!!major && <Text style={styles.detailLine}>Major: {major}</Text>}
              {!!internshipCompany && <Text style={styles.detailLine}>Internship / Company: {internshipCompany}</Text>}
              {!!skills.length && (
                <Text style={styles.detailLine}>Skills: {skills.join(', ')}</Text>
              )}
              {!!schoolCompanyLine && <Text style={styles.schoolCompany}>{schoolCompanyLine}</Text>}

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  Peers: {peersCount === null ? '—' : peersCount}
                </Text>
                <Text style={styles.statsText}>
                  Mutual peers: {mutualPeers === null ? '—' : mutualPeers}
                </Text>
              </View>

              <Pressable
                onPress={() => connectMutation.mutate()}
                disabled={isConnected || connectMutation.isPending}
                style={[styles.connectBtn, isConnected && styles.connectBtnDisabled]}
              >
                <Text style={[styles.connectText, isConnected && styles.connectTextDisabled]}>
                  {isConnected ? 'Connected' : connectMutation.isPending ? 'Connecting...' : 'Connect'}
                </Text>
              </Pressable>
            </View>
          </View>
        }
      />

      <Modal transparent visible={blockVisible} animationType="fade">
        <Pressable style={styles.blockBackdrop} onPress={() => setBlockVisible(false)}>
          <Pressable style={styles.blockCard} onPress={() => {}}>
            <Text style={styles.blockTitle}>Reason for block</Text>
            <TextInput
              value={blockReason}
              onChangeText={setBlockReason}
              placeholder="Tell us why you’re blocking this user"
              placeholderTextColor="#7A7A7A"
              style={styles.blockInput}
              multiline
            />
            <View style={styles.blockActions}>
              <Pressable onPress={() => setBlockVisible(false)} style={[styles.blockBtn, styles.blockBtnOutline]}>
                <Text style={styles.blockBtnTextOutline}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => blockMutation.mutate()}
                disabled={!blockReason.trim() || blockMutation.isPending}
                style={[styles.blockBtn, styles.blockBtnPrimary]}
              >
                <Text style={styles.blockBtnText}>Block</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topNav: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD2',
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
    fontSize: 23,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 80,
  },
  menu: {
    position: 'absolute',
    top: 58,
    right: spacing.md,
    minWidth: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuText: {
    color: '#1A1A1A',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 120,
  },
  bannerWrap: {
    position: 'relative',
    height: 170,
    backgroundColor: '#1F4A97',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerFallback: {
    flex: 1,
    backgroundColor: '#1F4A97',
  },
  avatarRow: {
    marginTop: -52,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  avatarShell: {
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C7C7CE',
  },
  avatarInitial: {
    color: '#FFFFFF',
    ...typography.sectionHeader,
    fontWeight: '700',
  },
  infoCard: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  nameText: {
    color: '#1A1A1A',
    ...typography.sectionHeader,
    fontSize: 48 / 2,
    lineHeight: 32,
    fontWeight: '700',
  },
  pronouns: {
    color: '#5E5E5E',
    ...typography.subtitle,
    lineHeight: 28,
  },
  portfolio: {
    marginTop: 6,
    color: '#1E6BD6',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  bio: {
    marginTop: 8,
    color: '#2B2B2B',
    ...typography.body,
  },
  detailLine: {
    marginTop: 6,
    color: '#4F4F4F',
    ...typography.secondary,
    fontWeight: '500',
  },
  schoolCompany: {
    marginTop: 14,
    color: '#2B2B2B',
    ...typography.subtitle,
    fontWeight: '500',
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 16,
  },
  statsText: {
    color: '#2B2B2B',
    ...typography.secondary,
    fontWeight: '600',
  },
  connectBtn: {
    marginTop: spacing.md,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  connectBtnDisabled: {
    backgroundColor: '#E4E0D6',
    borderColor: '#D7D1C6',
  },
  connectText: {
    color: '#111111',
    ...typography.button,
  },
  connectTextDisabled: {
    color: '#6A655F',
  },
  blockBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  blockCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
  },
  blockTitle: {
    color: colors.text,
    ...typography.sectionHeader,
    marginBottom: spacing.sm,
  },
  blockInput: {
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    padding: spacing.sm,
    color: '#1F1F1F',
    ...typography.secondary,
  },
  blockActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  blockBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockBtnOutline: {
    borderWidth: 1,
    borderColor: '#D7D1C6',
    backgroundColor: '#FFFFFF',
  },
  blockBtnPrimary: {
    backgroundColor: '#C62828',
  },
  blockBtnText: {
    color: '#FFFFFF',
    ...typography.button,
  },
  blockBtnTextOutline: {
    color: '#3E3A36',
    ...typography.button,
  },
});
