import { Pressable, StyleSheet, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE, scaleType } from '../theme/typography';
import type { LedBoardView } from './boardTypes';
import { ClockDisplay } from './ClockDisplay';
import { LedTeamPanel } from './LedTeamPanel';
import { PeriodIndicator } from './PeriodIndicator';
import { PossessionArrow } from './PossessionArrow';

type Props = {
  view: LedBoardView;
  /** Fit factor computed by the screen from the space available to the board. */
  scale: number;
  /** Tapping the clock toggles it running/paused. */
  onClockPress: () => void;
};

/**
 * The skeuomorphic LED scoreboard. Horizontal by design (it reads like a real
 * scoreboard and fills a landscape host screen); the digits scale to whatever
 * space the screen hands it so the row never overflows. Purely presentational.
 */
export function LedBoard({ view, scale, onClockPress }: Props): React.JSX.Element {
  const showPeriod =
    view.regulationPeriods > 1 || view.period > view.regulationPeriods;

  return (
    <View style={styles.board}>
      <View style={styles.row}>
        <LedTeamPanel panel={view.home} config={view.config} scale={scale} />
        <View style={styles.center}>
          <Pressable onPress={onClockPress} hitSlop={SPACING.md}>
            <ClockDisplay
              remainingMs={view.remainingMs}
              type={scaleType(TYPE.clockLarge, scale)}
            />
          </Pressable>
          {showPeriod ? (
            <PeriodIndicator
              period={view.period}
              regulationPeriods={view.regulationPeriods}
            />
          ) : null}
          <PossessionArrow possession={view.possession} />
        </View>
        <LedTeamPanel panel={view.away} config={view.config} scale={scale} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: COLORS.ledBackground,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  center: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
});
