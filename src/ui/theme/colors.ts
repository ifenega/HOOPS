/**
 * Every colour in the app lives here. No hex codes in component files (spec §5).
 *
 * The `led*` tokens are the skeuomorphic scoreboard palette; the `surface`/
 * `control`/`text` tokens are the flat dark UI for anything the user taps.
 */
export const COLORS = {
  ledBackground: '#000000',
  ledAmber: '#FFB000',
  ledRed: '#FF3B30',
  ledGreen: '#39FF14',
  ledDim: '#332200',

  surface: '#0B0B0D',
  surfaceRaised: '#17171B',
  control: '#232329',
  controlPressed: '#33333B',
  border: '#2C2C33',

  textPrimary: '#F2F2F5',
  textSecondary: '#A0A0A8',
  textMuted: '#66666E',

  accent: '#3B82F6',
  danger: '#FF3B30',
  success: '#30D158',
  warning: '#FFB000',

  scrim: '#000000AA',
} as const;

/** Opacity applied to the ghost digit layer behind the live value. */
export const GHOST_OPACITY = 0.12;
