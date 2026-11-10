import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';

const TAG = 'hoops-scoreboard';

/**
 * Keep the screen awake for the whole game (spec §9).
 *
 * Unlike `useKeepAwake`, this swallows the benign rejection expo-keep-awake
 * throws when deactivate runs for a tag that was already torn down — which
 * happens on rapid remounts such as Fast Refresh and would otherwise surface as
 * an unhandled promise rejection.
 */
export function useKeepScreenAwake(): void {
  useEffect(() => {
    activateKeepAwakeAsync(TAG).catch(() => undefined);
    return () => {
      deactivateKeepAwake(TAG).catch(() => undefined);
    };
  }, []);
}
