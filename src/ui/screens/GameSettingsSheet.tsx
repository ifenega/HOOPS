import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { readClock } from '../../core/clock/clock';
import type { TeamId } from '../../core/game/types';
import { CORRECTION } from '../../config/constants';
import { useGameStore } from '../../state/gameStore';
import { ControlButton } from '../components/ControlButton';
import { HoldToConfirmButton } from '../components/HoldToConfirmButton';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

export function GameSettingsSheet(): React.JSX.Element | null {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const adjustScore = useGameStore((state) => state.adjustScore);
  const setClockRemaining = useGameStore((state) => state.setClockRemaining);
  const addTeamFoul = useGameStore((state) => state.addTeamFoul);
  const removeTeamFoul = useGameStore((state) => state.removeTeamFoul);
  const addTimeout = useGameStore((state) => state.addTimeout);
  const removeTimeout = useGameStore((state) => state.removeTimeout);
  const endGame = useGameStore((state) => state.endGame);
  const discardGame = useGameStore((state) => state.discardGame);

  if (!game) return null;

  function stepClock(deltaMs: number): void {
    if (!game) return;
    const current = readClock(game.clock, Date.now());
    setClockRemaining(Math.max(0, current + deltaMs));
  }

  function finish(action: () => void): void {
    action();
    router.replace('/');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Corrections</Text>

      <Text style={styles.section}>Score adjustment</Text>
      {(['home', 'away'] as TeamId[]).map((team) => (
        <View key={team} style={styles.row}>
          <Text style={styles.rowLabel}>{team === 'home' ? 'HOME' : 'AWAY'}</Text>
          <ControlButton label={`-${CORRECTION.SCORE_STEP}`} onPress={() => adjustScore(team, -CORRECTION.SCORE_STEP)} style={styles.step} />
          <ControlButton label={`+${CORRECTION.SCORE_STEP}`} onPress={() => adjustScore(team, CORRECTION.SCORE_STEP)} style={styles.step} />
        </View>
      ))}

      <Text style={styles.section}>Team fouls</Text>
      {(['home', 'away'] as TeamId[]).map((team) => (
        <View key={team} style={styles.row}>
          <Text style={styles.rowLabel}>{team === 'home' ? 'HOME' : 'AWAY'}</Text>
          <ControlButton label="−1" onPress={() => removeTeamFoul(team)} style={styles.step} />
          <ControlButton label="+1" onPress={() => addTeamFoul(team)} style={styles.step} />
        </View>
      ))}

      <Text style={styles.section}>Timeouts</Text>
      {(['home', 'away'] as TeamId[]).map((team) => (
        <View key={team} style={styles.row}>
          <Text style={styles.rowLabel}>{team === 'home' ? 'HOME' : 'AWAY'}</Text>
          <ControlButton label="−1" onPress={() => removeTimeout(team)} style={styles.step} />
          <ControlButton label="+1" onPress={() => addTimeout(team)} style={styles.step} />
        </View>
      ))}

      <Text style={styles.section}>Clock</Text>
      <View style={styles.row}>
        <ControlButton label="-1:00" onPress={() => stepClock(-CORRECTION.CLOCK_STEP_LARGE_MS)} style={styles.step} />
        <ControlButton label="-0:10" onPress={() => stepClock(-CORRECTION.CLOCK_STEP_SMALL_MS)} style={styles.step} />
        <ControlButton label="+0:10" onPress={() => stepClock(CORRECTION.CLOCK_STEP_SMALL_MS)} style={styles.step} />
        <ControlButton label="+1:00" onPress={() => stepClock(CORRECTION.CLOCK_STEP_LARGE_MS)} style={styles.step} />
      </View>

      <Text style={styles.section}>Game</Text>
      <HoldToConfirmButton label="Hold: End game" onConfirm={() => finish(endGame)} />
      <HoldToConfirmButton label="Hold: Discard game" onConfirm={() => finish(discardGame)} />

      <View style={styles.footer}>
        <ControlButton label="Back to game" haptic={false} onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  title: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
  section: {
    ...TYPE.label,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rowLabel: {
    ...TYPE.body,
    color: COLORS.textPrimary,
    width: 64,
  },
  step: {
    flex: 1,
  },
  footer: {
    marginTop: SPACING.xl,
  },
});
