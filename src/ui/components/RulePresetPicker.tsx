import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RuleSet } from '../../core/rules/types';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Props = {
  presets: readonly RuleSet[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabledIds?: readonly string[];
};

/**
 * Data-driven list of rule presets. Phase 1 exposes only Quick Score; the other
 * presets are shown disabled so the plumbing is settled for later phases.
 */
export function RulePresetPicker({
  presets,
  selectedId,
  onSelect,
  disabledIds = [],
}: Props): React.JSX.Element {
  return (
    <View style={styles.list}>
      {presets.map((preset) => {
        const disabled = disabledIds.includes(preset.id);
        const selected = preset.id === selectedId;
        return (
          <Pressable
            key={preset.id}
            disabled={disabled}
            onPress={() => onSelect(preset.id)}
            style={[
              styles.card,
              selected ? styles.selected : undefined,
              disabled ? styles.disabled : undefined,
            ]}
          >
            <Text style={styles.name}>{preset.name}</Text>
            <Text style={styles.detail}>{describe(preset, disabled)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function describe(preset: RuleSet, disabled: boolean): string {
  if (disabled) return 'Coming in a later phase';
  if (preset.clockMode === 'none') {
    return `First to ${preset.targetScore}, win by ${preset.winBy}`;
  }
  if (preset.periods === 1) return 'Single timed period';
  const minutes = Math.round(preset.periodMs / 60_000);
  return `${preset.periods} × ${minutes} min`;
}

const styles = StyleSheet.create({
  list: {
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  selected: {
    borderColor: COLORS.accent,
  },
  disabled: {
    opacity: 0.4,
  },
  name: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
  detail: {
    ...TYPE.body,
    color: COLORS.textSecondary,
  },
});
