export const NETWORK = {
  TCP_PORT: 41235,
  UDP_DISCOVERY_PORT: 41234,
  CLOCK_BROADCAST_INTERVAL_MS: 1500,
  TIME_SYNC_INTERVAL_MS: 30_000,
  CONNECT_TIMEOUT_MS: 5_000,
  RECONNECT_BACKOFF_MS: [500, 1_000, 2_000, 4_000, 8_000],
  HOST_SILENCE_BEFORE_HANDOVER_MS: 20_000,
  MODULE_RELEASE_GRACE_MS: 30_000,
} as const;

export const GAME_CODE = {
  LENGTH: 4,
  ALPHABET: '23456789CDFGHJKMNPQRTVWX',
} as const;

export const LAYOUT = {
  MIN_TOUCH_TARGET: 56,
  ROSTER_ROW_HEIGHT: 68,
  COMPACT_BAR_HEIGHT: 44,
  FOOTER_HEIGHT: 60,
  RESTART_BUTTON_WIDTH: 140,
} as const;

export const DISPLAY = {
  TIMEOUTS_MAX_PIPS: 5,
  FOUL_PIPS_FALLBACK_MAX: 5,
} as const;

export const CORRECTION = {
  SCORE_STEP: 1,
  CLOCK_STEP_SMALL_MS: 10_000,
  CLOCK_STEP_LARGE_MS: 60_000,
} as const;

export const QUICK_GAME = {
  DEFAULT_MINUTES: 10,
  MIN_MINUTES: 1,
  MAX_MINUTES: 99,
  PRESET_MINUTES: [5, 8, 10, 12, 20],
} as const;

export const SCOREBOARD = {
  // Natural size of the LED board at full digit scale. The board scales down to
  // fit whatever space it is given (narrow portrait or short landscape) without
  // overflowing, and renders at full size once there is room for both.
  DESIGN_WIDTH: 560,
  DESIGN_HEIGHT: 160,
  MIN_SCALE: 0.35,
} as const;

export const TIMING = {
  UNDO_WINDOW_MS: 8_000,
  HAPTIC_DEBOUNCE_MS: 120,
  HOLD_TO_CONFIRM_MS: 800,
  CLOCK_TICK_MS: 100,
  RECENT_EVENT_LIMIT: 20,
} as const;
