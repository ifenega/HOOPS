import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { readClock } from '../../core/clock/clock';
import { needsOvertime } from '../../core/game/overtime';
import { CORRECTION, LAYOUT, SCOREBOARD, TIMING } from '../../config/constants';
import { useGameStore } from '../../state/gameStore';
import { useKeepScreenAwake } from '../useKeepScreenAwake';
import { useNow } from '../useNow';
import { toBoardView } from '../boardView';
import { describeEvent } from '../eventLabels';
import { ClockControls } from '../components/ClockControls';
import { ConnectionChrome } from '../components/ConnectionChrome';
import { HoldToConfirmButton } from '../components/HoldToConfirmButton';
import { LedBoard } from '../components/LedBoard';
import { RecentEventsModal } from '../components/RecentEventsModal';
import { TeamControls } from '../components/TeamControls';
import { UndoBar } from '../components/UndoBar';
import { COLORS } from '../theme/colors';
import { RADIUS, SPACING } from '../theme/spacing';
import { TYPE } from '../theme/typography';

type Size = { width: number; height: number };

function fitScale(area: Size): number {
  if (!area.width || !area.height) return SCOREBOARD.MIN_SCALE;
  const raw = Math.min(
    area.width / SCOREBOARD.DESIGN_WIDTH,
    area.height / SCOREBOARD.DESIGN_HEIGHT,
  );
  return Math.max(SCOREBOARD.MIN_SCALE, Math.min(1, raw));
}

export function ScoreboardScreen(): React.JSX.Element | null {
  useKeepScreenAwake();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [recentOpen, setRecentOpen] = useState(false);
  const [boardArea, setBoardArea] = useState<Size>({ width: 0, height: 0 });

  const game = useGameStore((state) => state.game);
  const derived = useGameStore((state) => state.derived);
  const deviceId = useGameStore((state) => state.deviceId);
  const store = useGameStore();

  const running = game?.clock.running ?? false;
  const now = useNow(running);

  if (!game || !derived) return null;

  const remainingMs = readClock(game.clock, now);
  const view = toBoardView(game, derived, remainingMs);
  const scale = fitScale(boardArea);

  const ownEvents = game.events.filter((event) => event.deviceId === deviceId);
  const lastUndoable = [...ownEvents].reverse().find((event) => !event.voided) ?? null;
  const recentEvents = ownEvents.slice(-TIMING.RECENT_EVENT_LIMIT).reverse();

  const showTimeout = view.config.showTimeouts;
  const overtimeReady =
    !running && remainingMs <= 0 && needsOvertime(derived.scoreboard, game.ruleSet, game.clock.period);

  function onBoardLayout(event: LayoutChangeEvent): void {
    const { width: w, height: h } = event.nativeEvent.layout;
    setBoardArea({ width: w, height: h });
  }

  const toggleClock = running ? store.stopGameClock : store.startGameClock;

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.chrome}>
          <ConnectionChrome code={game.code} connected pendingCount={0} />
        </View>
        <View style={styles.restart}>
          <HoldToConfirmButton label="Restart clock" onConfirm={store.restartClock} />
        </View>
      </View>

      <View style={styles.boardArea} onLayout={onBoardLayout}>
        <LedBoard view={view} scale={scale} onClockPress={toggleClock} />
      </View>

      <View style={styles.teamsRow}>
        <TeamControls
          teamName={view.home.name}
          onPoints={(points) => store.addPoints('home', points)}
          onMinus={() => store.adjustScore('home', -CORRECTION.SCORE_STEP)}
          onFoul={() => store.addTeamFoul('home')}
          onTimeout={() => store.addTimeout('home')}
          showTimeout={showTimeout}
          compact={isLandscape}
        />
        <TeamControls
          teamName={view.away.name}
          onPoints={(points) => store.addPoints('away', points)}
          onMinus={() => store.adjustScore('away', -CORRECTION.SCORE_STEP)}
          onFoul={() => store.addTeamFoul('away')}
          onTimeout={() => store.addTimeout('away')}
          showTimeout={showTimeout}
          compact={isLandscape}
        />
      </View>

      {overtimeReady ? (
        <View style={styles.overtimeBanner}>
          <Text style={styles.overtimeText}>Scores level.</Text>
          <Pressable style={styles.overtimeButton} onPress={store.startOvertime}>
            <Text style={styles.overtimeButtonText}>Start overtime</Text>
          </Pressable>
        </View>
      ) : null}

      <ClockControls
        running={running}
        onToggleClock={toggleClock}
        onSetPossession={store.setPossession}
        onEndPeriod={store.endPeriod}
        onOpenSettings={() => router.push('/settings')}
      />

      <UndoBar
        eventKey={lastUndoable?.id ?? null}
        lastEventLabel={lastUndoable ? describeEvent(lastUndoable) : null}
        onUndo={store.undoLast}
        onOpenRecent={() => setRecentOpen(true)}
      />

      <RecentEventsModal
        visible={recentOpen}
        events={recentEvents}
        onVoid={store.voidEvent}
        onClose={() => setRecentOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  chrome: {
    flex: 1,
  },
  restart: {
    width: LAYOUT.RESTART_BUTTON_WIDTH,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  teamsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  overtimeBanner: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overtimeText: {
    ...TYPE.body,
    color: COLORS.textPrimary,
  },
  overtimeButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  overtimeButtonText: {
    ...TYPE.button,
    color: COLORS.textPrimary,
  },
});
