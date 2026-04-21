import axios from 'axios';
import Constants from 'expo-constants';
import { NativeModules } from 'react-native';
import { useAuthStore } from '../store/auth-store';

function inferExpoHost(): string | undefined {
  const rawHost =
    (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ??
    (Constants as { manifest2?: { extra?: { expoGo?: { hostUri?: string } } } }).manifest2?.extra?.expoGo?.hostUri ??
    (Constants as { manifest?: { debuggerHost?: string; hostUri?: string } }).manifest?.debuggerHost ??
    (Constants as { manifest?: { debuggerHost?: string; hostUri?: string } }).manifest?.hostUri;

  if (rawHost) {
    const host = rawHost.split(':')[0];
    if (host) return host;
  }

  const scriptURL = (NativeModules as { SourceCode?: { scriptURL?: string } }).SourceCode?.scriptURL;
  if (!scriptURL) return undefined;

  const match = scriptURL.match(/^https?:\/\/([^/:]+)/i);
  return match?.[1];
}

function replaceLocalhost(url: string | undefined, host: string | undefined): string | undefined {
  if (!url || !host) return url;
  return url.replace(/(https?:\/\/)(localhost|127\.0\.0\.1)/i, `$1${host}`);
}

const expoHost = inferExpoHost();
const inferredUrl = expoHost ? `http://${expoHost}:4000/api` : undefined;
const envUrl = replaceLocalhost(process.env.EXPO_PUBLIC_API_URL, expoHost);

const apiUrl =
  envUrl ||
  inferredUrl ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'http://localhost:4000/api';

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10_000,
});

if (__DEV__) {
  console.log('[Internably] API base URL:', api.defaults.baseURL);
}

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const auth = useAuthStore.getState();
    if (!auth.refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken: auth.refreshToken },
            { timeout: 10_000 },
          );
          if (data?.accessToken && data?.refreshToken) {
            await useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
            return data.accessToken as string;
          }
          await useAuthStore.getState().clear();
          return null;
        } catch {
          await useAuthStore.getState().clear();
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const newAccessToken = await refreshPromise;
    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = {
      ...(originalRequest.headers ?? {}),
      Authorization: `Bearer ${newAccessToken}`,
    };
    return api(originalRequest);
  },
);
