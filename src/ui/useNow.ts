import { useEffect, useState } from 'react';

import { TIMING } from '../config/constants';

/**
 * Current wall-clock time, re-read on an interval while `active`. The clock's
 * remaining value is a pure function of this and the anchor (see `readClock`),
 * so this drives re-renders without the display itself owning any tick counter.
 */
export function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setNow(Date.now()), TIMING.CLOCK_TICK_MS);
    return () => clearInterval(interval);
  }, [active]);

  return now;
}
