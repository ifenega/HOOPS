import { StyleSheet, Text, View } from 'react-native';
import type { TextStyle } from 'react-native';

import { GHOST_OPACITY } from '../theme/colors';

type Props = {
  /** Already padded to the intended fixed width by the caller. */
  value: string;
  type: TextStyle;
  color: string;
};

/**
 * DSEG7 renders every digit with all seven segments lit, so a `8`-filled ghost
 * layer shows the unlit segments faintly behind the live value. Both layers use
 * the identical `type` token — any divergence in size or letter spacing would
 * make the digits drift by a pixel (spec §9).
 */
export function SevenSegmentDisplay({ value, type, color }: Props): React.JSX.Element {
  const ghost = toGhost(value);
  return (
    <View style={styles.container}>
      <Text style={[type, { color, opacity: GHOST_OPACITY }]}>{ghost}</Text>
      <Text style={[type, styles.live, { color }]}>{value}</Text>
    </View>
  );
}

/** Every non-separator character becomes an all-segments-lit `8`. */
function toGhost(value: string): string {
  return value.replace(/[^:.]/g, '8');
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  live: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
