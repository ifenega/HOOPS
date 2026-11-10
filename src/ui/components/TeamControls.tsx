import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { ControlButton } from './ControlButton';

type Props = {
  teamName: string;
  onPoints: (points: 1 | 2 | 3) => void;
  onMinus: () => void;
  onFoul: () => void;
  onTimeout: () => void;
  showTimeout: boolean;
  /** One wide row instead of two — used in landscape where there is width. */
  compact?: boolean;
};

/**
 * One team's scoring cluster. The +1/+2/+3 keys are primary; −1 is a quick
 * one-tap correction so fixing an over-count never needs the settings sheet.
 */
export function TeamControls({
  teamName,
  onPoints,
  onMinus,
  onFoul,
  onTimeout,
  showTimeout,
  compact = false,
}: Props): React.JSX.Element {
  const points = (
    <>
      <ControlButton label="+1" variant="primary" onPress={() => onPoints(1)} style={styles.cell} />
      <ControlButton label="+2" variant="primary" onPress={() => onPoints(2)} style={styles.cell} />
      <ControlButton label="+3" variant="primary" onPress={() => onPoints(3)} style={styles.cell} />
    </>
  );
  const secondary = (
    <>
      <ControlButton label="−1" onPress={onMinus} style={styles.cell} />
      <ControlButton label="Foul" onPress={onFoul} style={styles.cell} />
      {showTimeout ? (
        <ControlButton label="TO" onPress={onTimeout} style={styles.cell} />
      ) : null}
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {teamName}
      </Text>
      {compact ? (
        <View style={styles.row}>
          {points}
          {secondary}
        </View>
      ) : (
        <>
          <View style={styles.row}>{points}</View>
          <View style={styles.row}>{secondary}</View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SPACING.sm,
  },
  name: {
    ...TYPE.label,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cell: {
    flex: 1,
  },
});
