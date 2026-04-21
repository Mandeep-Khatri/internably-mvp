import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing, typography } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import { useAuthStore } from '@/store/auth-store';
import ScreenContainer from '../shared/ScreenContainer';

type MeResponse = {
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
    graduationYear?: number | null;
    internshipCompany?: string | null;
    interests?: Array<string | { interest?: { name?: string | null } | null } | null> | null;
    linkedinUrl?: string | null;
  };
};

export default function ProfileScreen() {
  const clear = useAuthStore((s) => s.clear);
  const [search, setSearch] = useState('');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [localBannerUri, setLocalBannerUri] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'banner' | null>(null);
  const meQuery = useQuery<MeResponse>({ queryKey: ['me'], queryFn: ResourcesApi.usersMe });
  const connectionsQuery = useQuery<any[]>({ queryKey: ['connections'], queryFn: ResourcesApi.connections });

  const profile = meQuery.data?.profile;
  const name = `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() || 'Internably Member';
  const pronouns = profile?.pronouns?.trim() || 'He/Him';
  const headline = profile?.headline?.trim() || '';
  const schoolCompany = [profile?.internshipCompany, profile?.school?.name].filter(Boolean).join(' · ');
  const location = profile?.city?.trim() || '';
  const websiteUrl = profile?.linkedinUrl?.trim() || '';
  const bio = profile?.bio?.trim() || '';
  const bioLine = [headline, bio].filter(Boolean).join(' ').trim();
  const major = profile?.major?.trim() || '';
  const internshipCompany =
    profile?.company?.name?.trim() ||
    profile?.internshipCompany?.trim() ||
    '';
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
  const schoolCompanyLine = [schoolCompany, location].filter(Boolean).join(' · ');
  const connectionsCount = connectionsQuery.data?.length ?? 0;

  async function handleLogout() {
    await clear();
    router.replace('/(auth)/sign-in');
  }

  function inferMimeType(uri: string) {
    const ext = uri.split('.').pop()?.toLowerCase();
    if (ext === 'png') return 'image/png';
    if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
    if (ext === 'heic') return 'image/heic';
    return 'image/jpeg';
  }

  async function uploadProfileImage(kind: 'avatar' | 'banner', uri: string) {
    const fileName = uri.split('/').pop() || `${kind}.jpg`;
    const mimeType = inferMimeType(uri);

    const data = await ResourcesApi.mediaUploadUrl({
      fileName,
      mimeType,
      kind,
    });

    if (data.provider !== 'cloudinary') {
      throw new Error('Media provider not configured for cloudinary.');
    }

    const form = new FormData();
    Object.entries(data.fields ?? {}).forEach(([key, value]) => {
      form.append(key, String(value));
    });
    form.append('file', {
      uri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);

    const uploadRes = await fetch(data.uploadUrl, {
      method: 'POST',
      body: form,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(uploadJson?.error?.message || 'Cloudinary upload failed');
    }
    const finalUrl = uploadJson.secure_url || uploadJson.url || data.publicUrl;

    await ResourcesApi.mediaConfirm({
      url: finalUrl,
      mimeType,
      kind,
    });

    await ResourcesApi.updateMe({
      [kind === 'avatar' ? 'avatarUrl' : 'bannerUrl']: finalUrl,
    });

    return finalUrl as string;
  }

  async function pickImage(kind: 'avatar' | 'banner', onPicked: (uri: string) => void) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to update your profile.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      onPicked(uri);
      setUploading(kind);
      try {
        const uploadedUrl = await uploadProfileImage(kind, uri);
        if (kind === 'avatar') setLocalAvatarUri(uploadedUrl);
        if (kind === 'banner') setLocalBannerUri(uploadedUrl);
      } catch (error) {
        const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
        const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
        const text = Array.isArray(message) ? message.join(', ') : message ?? 'We could not upload your image.';
        Alert.alert('Upload failed', text);
      } finally {
        setUploading(null);
      }
    }
  }

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.topNav}>
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
          <Pressable onPress={() => setMenuOpen((prev) => !prev)} style={styles.iconButton}>
            <Feather name="more-vertical" size={24} color="#111111" />
          </Pressable>
        </View>
      </View>

      {menuOpen && (
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/profile/settings');
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Settings</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/profile/edit');
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Manage profile</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                Linking.openURL('https://internably.com/privacy');
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Privacy Policy</Text>
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
              {localBannerUri || profile?.bannerUrl ? (
                <Image source={{ uri: localBannerUri ?? profile?.bannerUrl ?? '' }} style={styles.bannerImage} />
              ) : (
                <View style={styles.bannerFallback} />
              )}
              <Pressable onPress={() => pickImage('banner', setLocalBannerUri)} style={styles.bannerEditButton}>
                <Feather name="edit-2" size={18} color="#1F4A97" />
              </Pressable>
            </View>

            <View style={styles.avatarRow}>
              <View style={styles.avatarShell}>
                {localAvatarUri || profile?.avatarUrl ? (
                  <Image source={{ uri: localAvatarUri ?? profile?.avatarUrl ?? '' }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
              </View>
              <Pressable onPress={() => pickImage('avatar', setLocalAvatarUri)} style={styles.avatarEditButton}>
                <Feather name="camera" size={16} color="#1F4A97" />
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.pronouns}>{pronouns}</Text>
              </View>
              {!!websiteUrl && (
                <Pressable
                  onPress={() => {
                    const normalized = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
                    Linking.openURL(normalized);
                  }}
                >
                  <Text style={styles.portfolio}>{websiteUrl}</Text>
                </Pressable>
              )}

              {!!bioLine && <Text style={styles.bio}>{bioLine}</Text>}
              {!!major && <Text style={styles.detailLine}>Major: {major}</Text>}
              {!!internshipCompany && <Text style={styles.detailLine}>Internship / Company: {internshipCompany}</Text>}
              {!!skills.length && (
                <Text style={styles.detailLine}>Skills: {skills.join(', ')}</Text>
              )}
              <Text style={styles.schoolCompany}>{schoolCompanyLine || 'Southern Company · Alabama Agricultural and Mechanical University · Atlanta Metropolitan Area'}</Text>
              <Text style={styles.connections}>{connectionsCount > 500 ? '500+ peers' : `${connectionsCount} peers`}</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <Pressable onPress={handleLogout} style={styles.logout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        }
      />
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
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexShrink: 0,
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
  bannerEditButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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
  avatarEditButton: {
    marginLeft: -18,
    marginBottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    alignItems: 'center',
    justifyContent: 'center',
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
  portfolio: {
    marginTop: 6,
    color: '#1E6BD6',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
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
  connections: {
    marginTop: 10,
    color: '#2D79C7',
    ...typography.sectionHeader,
    fontWeight: '700',
  },
  logout: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6D0C3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#1A1A1A',
    ...typography.button,
  },
});
