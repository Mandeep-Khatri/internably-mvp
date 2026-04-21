import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import SplashScreen from '@/screens/splash/SplashScreen';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/api/client';

export default function Index() {
  const token = useAuthStore((s) => s.accessToken);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [splashDone, setSplashDone] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!splashDone || !token) {
      setProfileChecked(false);
      return;
    }
    let isMounted = true;
    setCheckingProfile(true);
    api
      .get('/users/me')
      .then(({ data }) => {
        const profile = data?.profile;
        const hasBasics = Boolean(
          profile?.headline ||
            profile?.bio ||
            profile?.major ||
            profile?.school?.name ||
            profile?.city,
        );
        if (isMounted) {
          setOnboarded(hasBasics);
        }
      })
      .catch(() => {
        // Keep existing onboarding state if API is unreachable.
      })
      .finally(() => {
        if (isMounted) {
          setCheckingProfile(false);
          setProfileChecked(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [splashDone, token, setOnboarded]);

  if (!splashDone) return <SplashScreen />;
  if (checkingProfile || (token && !profileChecked)) return <SplashScreen />;

  if (!token) return <Redirect href="/(auth)/sign-in" />;
  if (!isOnboarded) return <Redirect href="/(auth)/onboarding" />;
  return <Redirect href="/(tabs)/home" />;
}
