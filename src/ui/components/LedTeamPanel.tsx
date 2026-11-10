import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { TYPE, scaleType } from '../theme/typography';
import type { TeamDisplayConfig, TeamPanel } from './boardTypes';
import { BonusIndicator } from './BonusIndicator';
import { Pips } from './Pips';
import { ScoreDisplay } from './ScoreDisplay';

type Props = {
  panel: TeamPanel;
  config: TeamDisplayConfig;
  scale: number;
};

/** One side of the LED board: name, score, bonus, team fouls, timeouts. */
export function LedTeamPanel({ panel, config, scale }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {panel.name}
      </Text>
      <ScoreDisplay score={panel.score} type={scaleType(TYPE.scoreLarge, scale)} />
      {config.showFouls ? (
        <View style={styles.meta}>
          <BonusIndicator active={panel.inBonus} />
          <Pips
            count={panel.teamFouls}
            max={config.foulPipsMax}
            color={COLORS.ledRed}
            numeralThreshold={config.foulNumeralThreshold}
          />
        </View>
      ) : null}
      {config.showTimeouts ? (
        <View style={styles.meta}>
          <Text style={styles.metaLabel}>TO</Text>
          <Pips
            count={panel.timeoutsUsed}
            max={config.timeoutPipsMax}
            color={COLORS.ledGreen}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  name: {
    ...TYPE.label,
    color: COLORS.textSecondary,
    maxWidth: 120,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  metaLabel: {
    ...TYPE.label,
    color: COLORS.ledGreen,
  },
});
