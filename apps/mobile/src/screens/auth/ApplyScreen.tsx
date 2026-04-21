import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '../shared/ScreenContainer';

export default function ApplyScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [major, setMajor] = useState('');
  const [city, setCity] = useState('');
  const [internshipCompany, setInternshipCompany] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      ResourcesApi.submitApplication({
        firstName,
        lastName,
        email,
        school,
        graduationYear: Number(graduationYear),
        major,
        city,
        internshipCompany,
      }),
    onSuccess: () => {
      setError(null);
      router.replace('/(auth)/application-status');
    },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { message?: string | string[] } }; message?: string };
      if (err.message === 'Network Error') {
        setError(
          'Network error: cannot reach Internably API. Start backend on port 4000 and set EXPO_PUBLIC_API_URL to your Mac IP (example: http://10.0.0.243:4000/api).',
        );
        return;
      }
      const msg = err.response?.data?.message ?? err.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Unable to submit application.');
    },
  });

  return (
    <ScreenContainer>
      <Text style={styles.title}>Apply to Internably</Text>
      <Input placeholder="First name" value={firstName} onChangeText={setFirstName} />
      <Input placeholder="Last name" value={lastName} onChangeText={setLastName} />
      <Input placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <Input placeholder="School/University" value={school} onChangeText={setSchool} />
      <Input placeholder="Graduation year" keyboardType="number-pad" value={graduationYear} onChangeText={setGraduationYear} />
      <Input placeholder="Major" value={major} onChangeText={setMajor} />
      <Input placeholder="City" value={city} onChangeText={setCity} />
      <Input placeholder="Internship/Company (optional)" value={internshipCompany} onChangeText={setInternshipCompany} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={mutation.isPending ? 'Submitting...' : 'Submit Application'}
        onPress={() => mutation.mutate()}
        disabled={mutation.isPending}
        style={styles.button}
      />

      <Text style={styles.note}>Internably reviews each student application to keep the network trusted.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  error: {
    color: '#B42318',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.md,
  },
  note: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
