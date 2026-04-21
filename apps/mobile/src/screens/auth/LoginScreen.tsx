import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import * as AuthSession from 'expo-auth-session';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { Button, Input, colors, spacing } from '@internably/ui/src';
import { googleLogin, login, resendVerification } from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';
import ScreenContainer from '../shared/ScreenContainer';
import InternablyLogo from '../shared/InternablyLogo';

type AuthSessionResult = {
  type: 'success' | 'error' | 'cancel' | 'dismiss';
  params?: { id_token?: string };
  authentication?: { idToken?: string };
};

let GoogleProvider: {
  useAuthRequest?: (
    config: Record<string, string | undefined>,
  ) => [
    unknown,
    AuthSessionResult | null,
    (options?: Record<string, unknown>) => Promise<AuthSessionResult>,
  ];
  useIdTokenAuthRequest?: (
    config: Record<string, string | undefined>,
  ) => [
    unknown,
    AuthSessionResult | null,
    (options?: Record<string, unknown>) => Promise<AuthSessionResult>,
  ];
} | null = null;

let WebBrowserModule: { maybeCompleteAuthSession?: () => void } | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  GoogleProvider = require('expo-auth-session/providers/google');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebBrowserModule = require('expo-web-browser');
  WebBrowserModule?.maybeCompleteAuthSession?.();
} catch {
  // Google auth packages are optional during compile; runtime message guides installation.
}

const useGoogleIdTokenAuthRequest =
  GoogleProvider?.useAuthRequest ??
  GoogleProvider?.useIdTokenAuthRequest ??
  ((_: Record<string, string | undefined>) =>
    [null, null, async () => ({ type: 'error' as const })] as const satisfies [
      unknown,
      AuthSessionResult | null,
      (options?: Record<string, unknown>) => Promise<AuthSessionResult>,
    ]);

const schema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof schema>;

function resolveErrorMessage(error: unknown) {
  const maybeAxiosError = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  if (maybeAxiosError.message === 'Network Error') {
    return 'Network error: cannot reach Internably API. Start backend on port 4000 and set EXPO_PUBLIC_API_URL to your Mac IP (example: http://10.0.0.243:4000/api).';
  }
  const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
  if (Array.isArray(message)) return message.join(', ');
  return message ?? 'Unable to sign in. Please try again.';
}

export default function LoginScreen() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendLink, setResendLink] = useState<string | null>(null);
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  const googleClientIds = useMemo(
    () => ({
      expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    }),
    [],
  );

  const googleRedirectUri = useMemo(() => {
    const envRedirect = process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI;
    if (envRedirect) return envRedirect;
    const username = process.env.EXPO_PUBLIC_EXPO_USERNAME;
    if (!username) return undefined;
    return `https://auth.expo.io/@${username}/internably-mobile`;
  }, []);

  const googleAuthConfig = useMemo(() => {
    if (isExpoGo) {
      return {
        clientId: googleClientIds.webClientId,
        webClientId: googleClientIds.webClientId,
        responseType: 'id_token',
      };
    }
    return {
      ...googleClientIds,
    };
  }, [isExpoGo, googleClientIds, googleRedirectUri]);

  const googleConfigured = Boolean(
    (isExpoGo
      ? googleClientIds.webClientId && googleRedirectUri
      : googleClientIds.webClientId ||
        googleClientIds.iosClientId ||
        googleClientIds.androidClientId ||
        googleClientIds.expoClientId),
  );

  const [request, response, promptAsync] = useGoogleIdTokenAuthRequest(googleAuthConfig);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: (payload: LoginForm) => login(payload.email.trim(), payload.password),
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
      router.replace('/');
    },
  });

  const googleMutation = useMutation({
    mutationFn: (idToken: string) => googleLogin(idToken),
    onSuccess: async (data) => {
      setGoogleError(null);
      await setTokens(data.accessToken, data.refreshToken);
      router.replace('/');
    },
    onError: (error: unknown) => {
      setGoogleError(resolveErrorMessage(error));
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => resendVerification(email),
    onSuccess: (data) => {
      setResendMessage(data.message ?? 'Verification email sent.');
      setResendLink(data.verificationLink ?? null);
    },
    onError: (error: unknown) => {
      setResendMessage(resolveErrorMessage(error));
      setResendLink(null);
    },
  });

  useEffect(() => {
    if (!response) return;

    if (response.type !== 'success') {
      if (response.type === 'error') {
        setGoogleError('Google sign-in failed. Please try again.');
      }
      return;
    }

    const idToken =
      (response.params as { id_token?: string } | undefined)?.id_token ??
      response.authentication?.idToken;

    if (!idToken) {
      setGoogleError('Google sign-in did not return an id token.');
      return;
    }
    googleMutation.mutate(idToken);
  }, [response]);

  async function handleGoogleLogin() {
    setGoogleError(null);
    if (!GoogleProvider?.useIdTokenAuthRequest) {
      setGoogleError(
        'Google auth packages are missing. Run: npx expo install expo-auth-session expo-web-browser',
      );
      return;
    }
    if (!googleConfigured) {
      setGoogleError(
        'Google login is not configured. In Expo Go set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and EXPO_PUBLIC_GOOGLE_REDIRECT_URI=https://auth.expo.io/@YOUR_EXPO_USERNAME/internably-mobile.',
      );
      return;
    }

    if (isExpoGo) {
      if (!request || !googleRedirectUri || !(request as { url?: string }).url) {
        setGoogleError('Google auth request not ready yet. Please try again.');
        return;
      }

      const requestUrl = (request as { url: string; redirectUri: string }).url;
      const returnUrl = (request as { url: string; redirectUri: string }).redirectUri;

      const authUrl = new URL(requestUrl);
      authUrl.searchParams.set('redirect_uri', googleRedirectUri);

      const startUrl =
        `${googleRedirectUri}/start?authUrl=${encodeURIComponent(authUrl.toString())}` +
        `&returnUrl=${encodeURIComponent(returnUrl)}`;

      await promptAsync({ url: startUrl } as unknown as Record<string, unknown>);
      return;
    }

    await promptAsync();
  }

  function handleResendVerification() {
    setResendMessage(null);
    setResendLink(null);
    const email = getValues('email')?.trim();
    if (!email) {
      setResendMessage('Enter your .edu email first, then tap resend verification.');
      return;
    }
    resendMutation.mutate(email);
  }

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>{'<'}</Text>
        </Pressable>
      </View>

      <View style={styles.brandWrap}>
        <InternablyLogo compact />
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Username or .edu email"
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

      <View style={styles.linksRow}>
        <Pressable onPress={() => {}} style={styles.forgotWrap}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>
        <Pressable onPress={handleResendVerification} style={styles.resendWrap}>
          <Text style={styles.resend}>
            {resendMutation.isPending ? 'Sending...' : 'Resend verification'}
          </Text>
        </Pressable>
      </View>

      <Button
        title={mutation.isPending ? 'Logging In...' : 'Log In'}
        onPress={handleSubmit((values) => mutation.mutate(values))}
        disabled={mutation.isPending}
      />

      {!!mutation.error && <Text style={styles.error}>{resolveErrorMessage(mutation.error)}</Text>}
      {!!resendMessage && <Text style={styles.info}>{resendMessage}</Text>}
      {!!resendLink && (
        <Pressable onPress={() => Linking.openURL(resendLink)}>
          <Text style={styles.devLink}>Open verification link (dev)</Text>
        </Pressable>
      )}

      <Pressable
        style={[styles.social, (!request || googleMutation.isPending) && styles.socialDisabled]}
        onPress={handleGoogleLogin}
        disabled={!request || googleMutation.isPending}
      >
        <Text style={styles.socialIcon}>G</Text>
        <Text style={styles.socialText}>
          {googleMutation.isPending ? 'Signing in with Google...' : 'Log In with Google'}
        </Text>
      </Pressable>
      {!!googleError && <Text style={styles.error}>{googleError}</Text>}
      {!!googleMutation.error && !googleError && (
        <Text style={styles.error}>{resolveErrorMessage(googleMutation.error)}</Text>
      )}

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      <Pressable onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={styles.joinText}>
          Don't have an account? <Text style={styles.joinAccent}>Join The Network</Text>
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
  brandWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  forgotWrap: {
    alignItems: 'flex-start',
  },
  linksRow: {
    marginTop: 2,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendWrap: {
    alignItems: 'flex-end',
  },
  forgot: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  resend: {
    color: '#0C8A46',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  error: {
    color: '#B42318',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  info: {
    color: '#186A3B',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  devLink: {
    color: '#0B61A4',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginBottom: spacing.sm,
  },
  social: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#BFDFA9',
    borderRadius: 16,
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialDisabled: {
    opacity: 0.6,
  },
  socialIcon: {
    color: colors.primary,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
  },
  socialText: {
    color: '#5A5764',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  orRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C9C2B6',
  },
  orText: {
    color: '#2E2A36',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  joinText: {
    textAlign: 'center',
    color: '#2E2A36',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  joinAccent: {
    color: colors.primary,
    fontWeight: '800',
  },
});
