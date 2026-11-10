import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import { useGameStore } from '../src/state/gameStore';
import { COLORS } from '../src/ui/theme/colors';

export default function RootLayout(): React.JSX.Element {
  const router = useRouter();
  const resumeActive = useGameStore((state) => state.resumeActive);
  const resumedOnce = useRef(false);

  // A crash mid-quarter must not cost a tap: resume a live game directly (§12).
  useEffect(() => {
    if (resumedOnce.current) return;
    resumedOnce.current = true;
    if (resumeActive()) router.replace('/scoreboard');
  }, [resumeActive, router]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.surface },
        }}
      >
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
