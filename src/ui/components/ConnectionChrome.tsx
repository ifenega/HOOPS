import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Props = {
  code: string;
  connected: boolean;
  pendingCount: number;
};

/**
 * Persistent chrome shown on every device: game code, one status dot, and the
 * pending-event count. One glance answers "am I connected and is my data
 * getting through" (spec §9). Single-device Phase 1 is always connected.
 */
export function ConnectionChrome({ code, connected, pendingCount }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.status}>
        {pendingCount > 0 ? <Text style={styles.pending}>{pendingCount}</Text> : null}
        <View
          style={[styles.dot, { backgroundColor: connected ? COLORS.success : COLORS.danger }]}
        />
      </View>
    </View>
  );
}

const DOT = 10;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    ...TYPE.label,
    color: COLORS.textSecondary,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pending: {
    ...TYPE.label,
    color: COLORS.warning,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
});
