import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Input, colors, spacing } from '@internably/ui/src';
import { api } from '@/api/client';
import { useAuthStore } from '@/store/auth-store';
import ScreenContainer from '../shared/ScreenContainer';

export default function OnboardingScreen() {
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [city, setCity] = useState('');
  const [internshipCompany, setInternshipCompany] = useState('');
  const [openToNetwork, setOpenToNetwork] = useState(true);
  const [openToInternship, setOpenToInternship] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const mutation = useMutation({
    mutationFn: () =>
      api.patch('/users/me', {
        headline,
        bio,
        school,
        major,
        graduationYear: Number(graduationYear),
        city,
        internshipCompany,
        openToNetwork,
        openToInternship,
      }),
    onSuccess: async () => {
      setError(null);
      await setOnboarded(true);
      router.replace('/(tabs)/home');
    },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = err.response?.data?.message ?? err.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Unable to save profile.');
    },
  });

  return (
    <ScreenContainer>
      <Text style={styles.title}>Complete your profile</Text>

      <Input placeholder="Headline" value={headline} onChangeText={setHeadline} />
      <Input placeholder="Bio" value={bio} onChangeText={setBio} multiline />
      <Input placeholder="School" value={school} onChangeText={setSchool} />
      <Input placeholder="Major" value={major} onChangeText={setMajor} />
      <Input placeholder="Graduation year" keyboardType="number-pad" value={graduationYear} onChangeText={setGraduationYear} />
      <Input placeholder="City" value={city} onChangeText={setCity} />
      <Input placeholder="Internship/Company" value={internshipCompany} onChangeText={setInternshipCompany} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Open to network</Text>
        <Switch value={openToNetwork} onValueChange={setOpenToNetwork} trackColor={{ true: colors.primary }} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Open to internship</Text>
        <Switch value={openToInternship} onValueChange={setOpenToInternship} trackColor={{ true: colors.primary }} />
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={mutation.isPending ? 'Saving...' : 'Finish Onboarding'}
        onPress={() => mutation.mutate()}
        disabled={mutation.isPending}
        style={styles.button}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  switchRow: {
    marginTop: spacing.sm,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  button: {
    marginTop: spacing.lg,
  },
  error: {
    color: '#B42318',
    marginTop: 8,
    fontWeight: '600',
  },
});
