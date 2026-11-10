import { Pressable, StyleSheet, Text, View } from 'react-native';

import { QUICK_GAME } from '../../config/constants';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Props = {
  minutes: number;
  onChange: (minutes: number) => void;
};

/** Picks a single game length in minutes: quick chips plus a fine stepper. */
export function DurationPicker({ minutes, onChange }: Props): React.JSX.Element {
  function clampedChange(next: number): void {
    onChange(Math.max(QUICK_GAME.MIN_MINUTES, Math.min(QUICK_GAME.MAX_MINUTES, next)));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>GAME LENGTH</Text>
      <View style={styles.chips}>
        {QUICK_GAME.PRESET_MINUTES.map((value) => {
          const selected = value === minutes;
          return (
            <Pressable
              key={value}
              onPress={() => onChange(value)}
              style={[styles.chip, selected ? styles.chipSelected : undefined]}
            >
              <Text style={[styles.chipText, selected ? styles.chipTextSelected : undefined]}>
                {value}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.stepper}>
        <Pressable style={styles.step} onPress={() => clampedChange(minutes - 1)}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.value}>{minutes} min</Text>
        <Pressable style={styles.step} onPress={() => clampedChange(minutes + 1)}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  label: {
    ...TYPE.label,
    color: COLORS.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  chipSelected: {
    borderColor: COLORS.accent,
  },
  chipText: {
    ...TYPE.button,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.textPrimary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  step: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
  value: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
});
