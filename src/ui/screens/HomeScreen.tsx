import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { APP } from '../../config/app';
import { ControlButton } from '../components/ControlButton';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONTS, TYPE } from '../theme/typography';

export function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{APP.displayName}</Text>
      <Text style={styles.subtitle}>Basketball scoreboard</Text>
      <View style={styles.actions}>
        <ControlButton
          label="New game"
          variant="primary"
          haptic={false}
          onPress={() => router.push('/new-game')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.body,
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPE.body,
    color: COLORS.textSecondary,
  },
  actions: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
});
