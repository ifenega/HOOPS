import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { TYPE } from '../theme/typography';
import { SPACING } from '../theme/spacing';

type Props = {
  count: number;
  max: number;
  color?: string;
  /** Once `count` reaches this, a numeral is shown too (spec §15). */
  numeralThreshold?: number;
};

/**
 * Bounded counts render as dots — the fill state communicates "one away" faster
 * than a numeral. A numeral is added past a threshold and for any overflow, so
 * colour is never the only carrier of meaning.
 */
export function Pips({
  count,
  max,
  color = COLORS.ledAmber,
  numeralThreshold,
}: Props): React.JSX.Element {
  const showNumeral =
    count > max || (numeralThreshold !== undefined && count >= numeralThreshold);
  return (
    <View style={styles.container}>
      {Array.from({ length: max }, (_, index) => (
        <View
          key={index}
          style={[
            styles.pip,
            { borderColor: color },
            index < count ? { backgroundColor: color } : undefined,
          ]}
        />
      ))}
      {showNumeral ? <Text style={[styles.numeral, { color }]}>{count}</Text> : null}
    </View>
  );
}

const PIP_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  pip: {
    width: PIP_SIZE,
    height: PIP_SIZE,
    borderRadius: PIP_SIZE / 2,
    borderWidth: 1,
  },
  numeral: {
    ...TYPE.label,
    marginLeft: SPACING.xs,
  },
});
