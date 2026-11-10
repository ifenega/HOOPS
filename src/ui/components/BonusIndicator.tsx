import { StyleSheet, Text } from 'react-native';

import { COLORS } from '../theme/colors';
import { TYPE } from '../theme/typography';

type Props = {
  active: boolean;
};

/** The text label itself lights up, so bonus never rides on the red glow alone (§15). */
export function BonusIndicator({ active }: Props): React.JSX.Element {
  return (
    <Text style={[styles.label, active ? styles.on : styles.off]}>BONUS</Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...TYPE.label,
  },
  on: {
    color: COLORS.ledRed,
  },
  off: {
    color: COLORS.ledDim,
  },
});
