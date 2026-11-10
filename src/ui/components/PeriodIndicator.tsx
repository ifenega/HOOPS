import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { TYPE } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { SevenSegmentDisplay } from './SevenSegmentDisplay';

type Props = {
  period: number;
  regulationPeriods: number;
};

/** A green numeral with a lit `OT` word-label once play passes regulation. */
export function PeriodIndicator({ period, regulationPeriods }: Props): React.JSX.Element {
  const isOvertime = period > regulationPeriods;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isOvertime ? 'OT' : 'PERIOD'}</Text>
      <SevenSegmentDisplay
        value={String(period)}
        type={TYPE.statNumeral}
        color={COLORS.ledGreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  label: {
    ...TYPE.label,
    color: COLORS.ledGreen,
  },
});
