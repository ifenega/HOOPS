import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { LAYOUT, TIMING } from '../../config/constants';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Props = {
  label: string;
  onConfirm: () => void;
};

const RESET_MS = 150;

/**
 * Destructive actions (end period, end game, reset) require a deliberate hold
 * so a stray tap can never trigger them (spec §9). The fill bar shows progress.
 */
export function HoldToConfirmButton({ label, onConfirm }: Props): React.JSX.Element {
  const [progress] = useState(() => new Animated.Value(0));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  function cancelHold(): void {
    clearTimer();
    progress.stopAnimation();
    Animated.timing(progress, {
      toValue: 0,
      duration: RESET_MS,
      useNativeDriver: false,
    }).start();
  }

  function startHold(): void {
    Animated.timing(progress, {
      toValue: 1,
      duration: TIMING.HOLD_TO_CONFIRM_MS,
      useNativeDriver: false,
    }).start();
    timerRef.current = setTimeout(() => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onConfirm();
      cancelHold();
    }, TIMING.HOLD_TO_CONFIRM_MS);
  }

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable onPressIn={startHold} onPressOut={cancelHold} style={styles.button}>
      <Animated.View style={[styles.fill, { width: fillWidth }]} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: LAYOUT.MIN_TOUCH_TARGET,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.danger,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.danger,
    opacity: 0.35,
  },
  label: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
});
