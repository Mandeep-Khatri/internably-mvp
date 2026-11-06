import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Input, colors, spacing } from '@internably/ui/src';
import { forgotPassword, resetPassword } from '@/api/auth';
import InternablyLogo from '../shared/InternablyLogo';
import ScreenContainer from '../shared/ScreenContainer';

function errorMessage(error: unknown) {
  const maybeAxiosError = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  if (maybeAxiosError.message === 'Network Error') {
    return 'Unable to reach Internably. Check your internet connection and try again.';
  }
  const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
  return Array.isArray(message) ? message.join(', ') : message ?? 'Something went wrong. Try again.';
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(String(params.email ?? '').trim().toLowerCase());
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const sendMutation = useMutation({
    mutationFn: (value: string) => forgotPassword(value),
    onSuccess: (data) => {
      setFormError(null);
      setMessage(
        data.message ?? 'If that email exists, a 6-digit password reset code has been sent.',
      );
      setCodeSent(true);
    },
    onError: (error: unknown) => {
      setMessage(null);
      setFormError(errorMessage(error));
    },
  });

  const resetMutation = useMutation({
    mutationFn: (payload: { email: string; code: string; newPassword: string }) =>
      resetPassword(payload.email, payload.code, payload.newPassword),
    onSuccess: (data) => {
      setFormError(null);
      setMessage(data.message ?? 'Password updated. Please log in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setCode('');
      setComplete(true);
    },
    onError: (error: unknown) => {
      setMessage(null);
      setFormError(errorMessage(error));
    },
  });

  function sendCode() {
    const normalizedEmail = email.trim().toLowerCase();
    setFormError(null);
    setMessage(null);
    if (!isEmail(normalizedEmail)) {
      setFormError('Enter a valid email address.');
      return;
    }
    setEmail(normalizedEmail);
    sendMutation.mutate(normalizedEmail);
  }

  function submitReset() {
    setFormError(null);
    setMessage(null);
    if (!/^\d{6}$/.test(code)) {
      setFormError('Enter the 6-digit code from your email.');
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
    resetMutation.mutate({ email, code, newPassword: password });
  }

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Text style={styles.back}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <InternablyLogo compact />
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          {codeSent
            ? `Enter the code sent to ${email}. It expires in 15 minutes.`
            : 'Enter your account email and we will send you a one-time code.'}
        </Text>
      </View>

      {!codeSent ? (
        <>
          <Input
            label="Email"
            placeholder="Your account email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title={sendMutation.isPending ? 'Sending Code...' : 'Send Reset Code'}
            onPress={sendCode}
            disabled={sendMutation.isPending}
            style={styles.button}
          />
        </>
      ) : complete ? (
        <Button
          title="Back to Log In"
          onPress={() => router.replace('/(auth)/sign-in')}
          style={styles.button}
        />
      ) : (
        <>
          <Input
            label="Reset code"
            placeholder="6-digit code"
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
          />
          <Input
            label="New password"
            placeholder="At least 8 characters"
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm new password"
            placeholder="Enter the password again"
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button
            title={resetMutation.isPending ? 'Updating Password...' : 'Update Password'}
            onPress={submitReset}
            disabled={resetMutation.isPending}
            style={styles.button}
          />
          <View style={styles.secondaryActions}>
            <Pressable
              onPress={sendCode}
              disabled={sendMutation.isPending}
              accessibilityRole="button"
            >
              <Text style={styles.link}>
                {sendMutation.isPending ? 'Sending...' : 'Resend code'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setCodeSent(false);
                setCode('');
                setMessage(null);
                setFormError(null);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Change email</Text>
            </Pressable>
          </View>
        </>
      )}

      {!!formError && <Text style={styles.error}>{formError}</Text>}
      {!!message && <Text style={styles.success}>{message}</Text>}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 42,
    justifyContent: 'center',
  },
  back: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  title: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
  },
  secondaryActions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
  error: {
    marginTop: spacing.md,
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  success: {
    marginTop: spacing.md,
    color: '#067647',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});
