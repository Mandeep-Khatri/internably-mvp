import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Input, colors, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import ScreenContainer from '../shared/ScreenContainer';

type ProfileState = {
  firstName: string;
  lastName: string;
  headline: string;
  pronouns: string;
  bio: string;
  city: string;
  major: string;
  internshipCompany: string;
  skills: string;
  portfolioUrl: string;
};

export default function EditProfileScreen() {
  const queryClient = useQueryClient();
  const meQuery = useQuery({ queryKey: ['me'], queryFn: async () => (await api.get('/users/me')).data });

  const [form, setForm] = useState<ProfileState>({
    firstName: '',
    lastName: '',
    headline: '',
    pronouns: '',
    bio: '',
    city: '',
    major: '',
    internshipCompany: '',
    skills: '',
    portfolioUrl: '',
  });

  useEffect(() => {
    const profile = meQuery.data?.profile;
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      headline: profile.headline ?? '',
      pronouns: profile.pronouns ?? '',
      bio: profile.bio ?? '',
      city: profile.city ?? '',
      major: profile.major ?? '',
      internshipCompany: profile.company?.name ?? profile.internshipCompany ?? '',
      skills: Array.isArray(profile.interests)
        ? profile.interests
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
            .join(', ')
        : '',
      portfolioUrl: profile.linkedinUrl ?? '',
    });
  }, [meQuery.data]);

  useFocusEffect(
    useCallback(() => {
      meQuery.refetch();
    }, [meQuery]),
  );

  const mutation = useMutation({
    mutationFn: async () =>
      api.patch('/users/me', {
        firstName: form.firstName,
        lastName: form.lastName,
        headline: form.headline,
        pronouns: form.pronouns,
        bio: form.bio,
        city: form.city,
        major: form.major,
        internshipCompany: form.internshipCompany,
        interests: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        linkedinUrl: form.portfolioUrl.trim() || null,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      router.back();
    },
  });

  return (
    <ScreenContainer>
      <Text style={styles.title}>Edit Profile</Text>
      <Input label="First Name" value={form.firstName} onChangeText={(v) => setForm((p) => ({ ...p, firstName: v }))} />
      <Input label="Last Name" value={form.lastName} onChangeText={(v) => setForm((p) => ({ ...p, lastName: v }))} />
      <Input label="Headline" value={form.headline} onChangeText={(v) => setForm((p) => ({ ...p, headline: v }))} />
      <Input label="Pronouns (He/Him, She/Her)" value={form.pronouns} onChangeText={(v) => setForm((p) => ({ ...p, pronouns: v }))} />
      <Input label="Bio" value={form.bio} onChangeText={(v) => setForm((p) => ({ ...p, bio: v }))} multiline style={styles.multi} />
      <Input label="City" value={form.city} onChangeText={(v) => setForm((p) => ({ ...p, city: v }))} />
      <Input label="Major" value={form.major} onChangeText={(v) => setForm((p) => ({ ...p, major: v }))} />
      <Input
        label="Internship / Company"
        value={form.internshipCompany}
        onChangeText={(v) => setForm((p) => ({ ...p, internshipCompany: v }))}
      />
      <Input
        label="Portfolio / Link"
        value={form.portfolioUrl}
        onChangeText={(v) => setForm((p) => ({ ...p, portfolioUrl: v }))}
        autoCapitalize="none"
      />
      <Input label="Skills (comma separated)" value={form.skills} onChangeText={(v) => setForm((p) => ({ ...p, skills: v }))} />

      <Button
        title={mutation.isPending ? 'Saving...' : 'Save Profile'}
        onPress={() => mutation.mutate()}
        disabled={mutation.isPending}
        style={styles.saveBtn}
      />
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
  multi: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
