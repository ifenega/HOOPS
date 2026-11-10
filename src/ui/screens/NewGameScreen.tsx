import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { QUICK_GAME } from '../../config/constants';
import { PRESETS, QUICK_SCORE } from '../../core/rules/presets';
import type { RuleSet } from '../../core/rules/types';
import { useGameStore } from '../../state/gameStore';
import { ControlButton } from '../components/ControlButton';
import { DurationPicker } from '../components/DurationPicker';
import { RulePresetPicker } from '../components/RulePresetPicker';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

const MS_PER_MINUTE = 60_000;

// Phase 1 exposes only Quick Score; the rest are visible but disabled.
const ENABLED_PRESET_IDS = [QUICK_SCORE.id];
const DISABLED_PRESET_IDS = PRESETS.filter(
  (preset) => !ENABLED_PRESET_IDS.includes(preset.id),
).map((preset) => preset.id);

export function NewGameScreen(): React.JSX.Element {
  const router = useRouter();
  const newGame = useGameStore((state) => state.newGame);
  const [selectedId, setSelectedId] = useState(QUICK_SCORE.id);
  const [minutes, setMinutes] = useState<number>(QUICK_GAME.DEFAULT_MINUTES);

  function start(): void {
    const ruleSet: RuleSet = { ...QUICK_SCORE, periodMs: minutes * MS_PER_MINUTE };
    newGame(ruleSet);
    router.replace('/scoreboard');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Quick Score</Text>
      <RulePresetPicker
        presets={PRESETS}
        selectedId={selectedId}
        onSelect={setSelectedId}
        disabledIds={DISABLED_PRESET_IDS}
      />
      <DurationPicker minutes={minutes} onChange={setMinutes} />
      <ControlButton label="Start game" variant="primary" haptic={false} onPress={start} />
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
    gap: SPACING.lg,
  },
  heading: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
});
