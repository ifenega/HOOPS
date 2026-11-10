export type ClockState = {
  period: number;
  running: boolean;
  anchorAt: number;
  remainingAtAnchorMs: number;
  version: number;
};

/**
 * The remaining time on the clock at `now`.
 *
 * When stopped, the clock holds the exact value written at the last transition.
 * When running, the value is derived from the anchor timestamp — never a tick
 * counter — so backgrounding the app cannot cause drift.
 */
export function readClock(state: ClockState, now: number): number {
  if (!state.running) return state.remainingAtAnchorMs;
  return Math.max(0, state.remainingAtAnchorMs - (now - state.anchorAt));
}

export function startClock(state: ClockState, now: number): ClockState {
  if (state.running) return state;
  return {
    ...state,
    running: true,
    anchorAt: now,
    version: state.version + 1,
  };
}

/**
 * Snap the exact computed remaining value into the anchor. Every device that
 * receives this state lands on the identical number, which is what eliminates
 * drift across a multi-device session.
 */
export function stopClock(state: ClockState, now: number): ClockState {
  if (!state.running) return state;
  return {
    ...state,
    running: false,
    anchorAt: now,
    remainingAtAnchorMs: readClock(state, now),
    version: state.version + 1,
  };
}

export function setClock(
  state: ClockState,
  remainingMs: number,
  now: number,
): ClockState {
  return {
    ...state,
    anchorAt: now,
    remainingAtAnchorMs: Math.max(0, remainingMs),
    version: state.version + 1,
  };
}

export function setPeriod(
  state: ClockState,
  period: number,
  remainingMs: number,
  now: number,
): ClockState {
  return {
    period,
    running: false,
    anchorAt: now,
    remainingAtAnchorMs: Math.max(0, remainingMs),
    version: state.version + 1,
  };
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

/** `MM:SS` while a minute or more remains, then `SS.t` in the final minute. */
export function formatClock(remainingMs: number): string {
  const clamped = Math.max(0, remainingMs);
  if (clamped >= MS_PER_MINUTE) {
    const minutes = Math.floor(clamped / MS_PER_MINUTE);
    const seconds = Math.floor((clamped % MS_PER_MINUTE) / MS_PER_SECOND);
    return `${pad2(minutes)}:${pad2(seconds)}`;
  }
  const seconds = Math.floor(clamped / MS_PER_SECOND);
  const tenths = Math.floor((clamped % MS_PER_SECOND) / 100);
  return `${pad2(seconds)}.${tenths}`;
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}
