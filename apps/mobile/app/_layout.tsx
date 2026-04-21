import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/store/auth-store';

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate().finally(() => setReady(true));
  }, [hydrate]);

  useEffect(() => {
    (Text as any).defaultProps = (Text as any).defaultProps || {};
    (Text as any).defaultProps.style = [
      (Text as any).defaultProps.style,
      { fontFamily: 'Inter' },
    ];

    (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
    (TextInput as any).defaultProps.style = [
      (TextInput as any).defaultProps.style,
      { fontFamily: 'Inter' },
    ];
  }, []);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
