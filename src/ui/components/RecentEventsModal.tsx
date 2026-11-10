import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { GameEvent } from '../../core/events/types';
import { describeEvent } from '../eventLabels';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Props = {
  visible: boolean;
  events: GameEvent[];
  onVoid: (eventId: string) => void;
  onClose: () => void;
};

/** The device's recent events, any of which can be voided regardless of age (§13). */
export function RecentEventsModal({ visible, events, onVoid, onClose }: Props): React.JSX.Element {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Recent events</Text>
          <FlatList
            data={events}
            keyExtractor={(event) => event.id}
            ListEmptyComponent={<Text style={styles.empty}>No events yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text
                  style={[styles.label, item.voided ? styles.voided : undefined]}
                  numberOfLines={1}
                >
                  {describeEvent(item)}
                </Text>
                <Pressable
                  disabled={item.voided}
                  onPress={() => onVoid(item.id)}
                  style={styles.voidButton}
                >
                  <Text style={styles.voidText}>{item.voided ? 'Voided' : 'Void'}</Text>
                </Pressable>
              </View>
            )}
          />
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '70%',
    gap: SPACING.md,
  },
  title: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
  empty: {
    ...TYPE.body,
    color: COLORS.textMuted,
    paddingVertical: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  label: {
    ...TYPE.body,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  voided: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  voidButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.control,
  },
  voidText: {
    ...TYPE.label,
    color: COLORS.warning,
  },
  close: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  closeText: {
    ...TYPE.button,
    color: COLORS.accent,
  },
});
