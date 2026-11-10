import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TIMING } from '../../config/constants';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Props = {
  /** Identity of this device's most recent undoable event; null if none. */
  eventKey: string | null;
  lastEventLabel: string | null;
  onUndo: () => void;
  onOpenRecent: () => void;
};

/**
 * Always visible and always one tap. Shows the most recent event for
 * `UNDO_WINDOW_MS`, then collapses to a "Recent" affordance that opens the
 * device's last events (spec §13). Mis-taps are the dominant failure mode.
 */
export function UndoBar({
  eventKey,
  lastEventLabel,
  onUndo,
  onOpenRecent,
}: Props): React.JSX.Element {
  // Track which event key has collapsed rather than toggling a boolean
  // synchronously in the effect: a fresh key is expanded by derivation, and the
  // timer only ever collapses (an async setState) after the window.
  const [collapsedKey, setCollapsedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!eventKey) return;
    const timer = setTimeout(() => setCollapsedKey(eventKey), TIMING.UNDO_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [eventKey]);

  const expanded = eventKey !== null && eventKey !== collapsedKey;

  if (expanded && lastEventLabel) {
    return (
      <View style={styles.bar}>
        <Pressable style={styles.undo} onPress={onUndo}>
          <Text style={styles.undoText}>Undo</Text>
          <Text style={styles.detail} numberOfLines={1}>
            {lastEventLabel}
          </Text>
        </Pressable>
        <Pressable style={styles.recent} onPress={onOpenRecent}>
          <Text style={styles.recentText}>Recent</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.bar}>
      <Pressable style={styles.recentWide} onPress={onOpenRecent}>
        <Text style={styles.recentText}>Recent</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  undo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.control,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  undoText: {
    ...TYPE.button,
    color: COLORS.warning,
  },
  detail: {
    ...TYPE.body,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  recent: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  recentWide: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  recentText: {
    ...TYPE.label,
    color: COLORS.textSecondary,
  },
});
