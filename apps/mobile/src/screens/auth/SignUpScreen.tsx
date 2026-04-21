import { useMutation } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, colors, spacing } from '@internably/ui/src';
import { register } from '@/api/auth';
import ScreenContainer from '../shared/ScreenContainer';
import InternablyLogo from '../shared/InternablyLogo';

const STUDENT_ONLY_MESSAGE = 'Internably is currently available only for students with a valid .edu email address.';

function isEduEmail(value: string) {
  const domain = value.trim().toLowerCase().split('@')[1] ?? '';
  return domain.endsWith('.edu');
}

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) => register(payload.email, payload.password),
    onSuccess: (data: { message?: string; verificationLink?: string }) => {
      setFormError(null);
      setSuccessMessage(data.message ?? 'Check your .edu email to verify your Internably account.');
      setVerificationLink(data.verificationLink ?? null);
      setPassword('');
      setConfirmPassword('');
      setUsername('');
    },
    onError: (error: unknown) => {
      const maybeAxiosError = error as { response?: { data?: { message?: string | string[] } }; message?: string };
      if (maybeAxiosError.message === 'Network Error') {
        setFormError(
          'Network error: cannot reach Internably API. Start backend on port 4000 and set EXPO_PUBLIC_API_URL to your Mac IP (example: http://10.0.0.243:4000/api).',
        );
        setSuccessMessage(null);
        setVerificationLink(null);
        return;
      }
      const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
      setFormError(Array.isArray(message) ? message.join(', ') : message ?? 'Sign up failed.');
      setSuccessMessage(null);
      setVerificationLink(null);
    },
  });

  const disabled = useMemo(() => mutation.isPending, [mutation.isPending]);

  function onCreateAccount() {
    const normalizedEmail = email.trim().toLowerCase();
    setFormError(null);
    setSuccessMessage(null);
    setVerificationLink(null);

    if (!isEduEmail(normalizedEmail)) {
      setFormError(STUDENT_ONLY_MESSAGE);
      return;
    }

    if (!username.trim()) {
      setFormError('Username is required.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    mutation.mutate({ email: normalizedEmail, password });
  }

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>{'<'}</Text>
        </Pressable>
      </View>

      <View style={styles.topHeader}>
        <InternablyLogo compact />
        <Text style={styles.sub}>Where Interns Connect & Grow</Text>
      </View>

      <Input placeholder="Email Address (.edu)" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <Input placeholder="Username" autoCapitalize="none" value={username} onChangeText={setUsername} />
      <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Input placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      {!!formError && <Text style={styles.error}>{formError}</Text>}
      {!!successMessage && <Text style={styles.success}>{successMessage}</Text>}
      {!!verificationLink && (
        <Pressable onPress={() => Linking.openURL(verificationLink)}>
          <Text style={styles.devLink}>Open verification link (dev)</Text>
        </Pressable>
      )}

      <Button
        title={disabled ? 'Creating Account...' : 'Create Account'}
        onPress={onCreateAccount}
        disabled={disabled}
        style={styles.mainButton}
      />

      <Pressable onPress={() => router.push('/(auth)/apply')}>
        <Text style={styles.join}>
          Already created account? <Text style={styles.joinBase}>Apply to join</Text>
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/(auth)/sign-in')}>
        <Text style={styles.apply}>
          Already verified? <Text style={styles.joinBase}>Sign In</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 42,
    justifyContent: 'center',
  },
  back: {
    color: colors.text,
    fontSize: 46,
    lineHeight: 50,
    fontWeight: '500',
  },
  topHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  sub: {
    marginTop: 2,
    color: '#67635D',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  mainButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  join: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  joinBase: {
    color: '#2E2A36',
    fontWeight: '700',
  },
  apply: {
    textAlign: 'center',
    color: '#2E2A36',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  error: {
    color: '#B42318',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  success: {
    color: '#067647',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  devLink: {
    marginTop: 8,
    color: '#1A73E8',
    textDecorationLine: 'underline',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
