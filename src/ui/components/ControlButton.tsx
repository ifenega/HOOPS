import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { LAYOUT } from '../../config/constants';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Variant = 'primary' | 'neutral' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** A large flat control. Fires haptic feedback on every logged action (spec §9). */
export function ControlButton({
  label,
  onPress,
  variant = 'neutral',
  disabled = false,
  haptic = true,
  style,
}: Props): React.JSX.Element {
  function handlePress(): void {
    if (haptic) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        VARIANT_STYLE[variant],
        pressed ? styles.pressed : undefined,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const VARIANT_STYLE: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: COLORS.accent },
  neutral: { backgroundColor: COLORS.control },
  danger: { backgroundColor: COLORS.danger },
};

const styles = StyleSheet.create({
  button: {
    minHeight: LAYOUT.MIN_TOUCH_TARGET,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: COLORS.controlPressed,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
});
