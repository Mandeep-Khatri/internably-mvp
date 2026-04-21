import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isOnboarded: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clear: () => Promise<void>;
  hydrate: () => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
};

const ACCESS = 'internably.access';
const REFRESH = 'internably.refresh';
const ONBOARDED = 'internably.onboarded';

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isOnboarded: false,
  setTokens: async (accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
      [ACCESS, accessToken],
      [REFRESH, refreshToken],
    ]);
    set({ accessToken, refreshToken });
  },
  clear: async () => {
    await AsyncStorage.multiRemove([ACCESS, REFRESH, ONBOARDED]);
    set({ accessToken: null, refreshToken: null, isOnboarded: false });
  },
  hydrate: async () => {
    const values = await AsyncStorage.multiGet([ACCESS, REFRESH, ONBOARDED]);
    const map = Object.fromEntries(values);
    set({
      accessToken: map[ACCESS] ?? null,
      refreshToken: map[REFRESH] ?? null,
      isOnboarded: map[ONBOARDED] === 'true',
    });
  },
  setOnboarded: async (value) => {
    await AsyncStorage.setItem(ONBOARDED, String(value));
    set({ isOnboarded: value });
  },
}));
