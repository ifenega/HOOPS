import type { TextStyle } from 'react-native';

/**
 * The font family name appears here once and nowhere else. Components reference
 * a `TYPE` token, never a family string or a raw size — that is what keeps the
 * live and ghost LED layers pixel-identical (spec §5).
 */
export const FONTS = {
  segment: 'DSEG7Classic-Bold',
  segmentCompact: 'DSEG7ClassicMini-Bold',
  body: 'System',
} as const;

export const TYPE = {
  clockLarge: { fontFamily: FONTS.segment, fontSize: 64, letterSpacing: 4 },
  clockCompact: { fontFamily: FONTS.segmentCompact, fontSize: 20, letterSpacing: 2 },
  scoreLarge: { fontFamily: FONTS.segment, fontSize: 58 },
  statNumeral: { fontFamily: FONTS.segment, fontSize: 22 },
  playerName: { fontFamily: FONTS.body, fontSize: 15 },
  label: { fontFamily: FONTS.body, fontSize: 11, letterSpacing: 2 },
  body: { fontFamily: FONTS.body, fontSize: 16 },
  button: { fontFamily: FONTS.body, fontSize: 18, fontWeight: '600' as const },
} as const;

/**
 * Scale a type token's size and letter spacing by a factor, keeping every other
 * property. The scoreboard uses this so the ghost and live LED layers always
 * receive the identical scaled token and never drift apart.
 */
export function scaleType(type: TextStyle, scale: number): TextStyle {
  const scaled: TextStyle = {
    ...type,
    fontSize: (type.fontSize ?? 0) * scale,
  };
  if (type.letterSpacing !== undefined) {
    scaled.letterSpacing = type.letterSpacing * scale;
  }
  return scaled;
}
