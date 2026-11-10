import { StyleSheet, View } from 'react-native';

import type { TeamId } from '../../core/game/types';
import { SPACING } from '../theme/spacing';
import { ControlButton } from './ControlButton';
import { HoldToConfirmButton } from './HoldToConfirmButton';

type Props = {
  running: boolean;
  onToggleClock: () => void;
  onSetPossession: (team: TeamId) => void;
  onEndPeriod: () => void;
  onOpenSettings: () => void;
};

/** Compact single-row clock/period bar so scoring stays on-screen (spec §9). */
export function ClockControls({
  running,
  onToggleClock,
  onSetPossession,
  onEndPeriod,
  onOpenSettings,
}: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <ControlButton
        label={running ? 'Pause' : 'Start'}
        variant={running ? 'neutral' : 'primary'}
        haptic={false}
        onPress={onToggleClock}
        style={styles.wide}
      />
      <ControlButton label="◄" onPress={() => onSetPossession('home')} style={styles.cell} />
      <ControlButton label="►" onPress={() => onSetPossession('away')} style={styles.cell} />
      <View style={styles.cell}>
        <HoldToConfirmButton label="End" onConfirm={onEndPeriod} />
      </View>
      <ControlButton label="⚙" haptic={false} onPress={onOpenSettings} style={styles.cell} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'stretch',
  },
  wide: {
    flex: 2,
  },
  cell: {
    flex: 1,
  },
});
