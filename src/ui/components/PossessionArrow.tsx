import { StyleSheet, View } from 'react-native';

import type { TeamId } from '../../core/game/types';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

type Props = {
  possession: TeamId | null;
};

/**
 * Possession is carried by arrow shape and side, not colour alone — the dim
 * arrow stays visible so the direction reads under red-green deficiency (§15).
 */
export function PossessionArrow({ possession }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={[styles.arrowLeft, possession === 'home' ? styles.on : styles.off]} />
      <View style={[styles.arrowRight, possession === 'away' ? styles.on : styles.off]} />
    </View>
  );
}

const ARROW = 12;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.xl,
    alignItems: 'center',
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: ARROW,
    borderBottomWidth: ARROW,
    borderRightWidth: ARROW * 1.4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: ARROW,
    borderBottomWidth: ARROW,
    borderLeftWidth: ARROW * 1.4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  on: {
    borderRightColor: COLORS.ledRed,
    borderLeftColor: COLORS.ledRed,
  },
  off: {
    borderRightColor: COLORS.ledDim,
    borderLeftColor: COLORS.ledDim,
  },
});
