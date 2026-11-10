import { Alert } from 'react-native';
import { create } from 'zustand';

import { readClock, setClock, setPeriod, startClock, stopClock } from '../core/clock/clock';
import { createEvent, type NewEventInput } from '../core/events/factory';
import type { EventType, GameEvent } from '../core/events/types';
import type { ClockState } from '../core/clock/clock';
import type { Game, TeamId } from '../core/game/types';
import { computeDerived, type DerivedState } from '../core/projections/derived';
import type { RuleSet } from '../core/rules/types';
import { getDeviceId } from '../storage/deviceId';
import { generateGameCode, generateId } from '../storage/ids';
import {
  appendToGameIndex,
  getActiveGameId,
  loadGame,
  saveGame,
  setActiveGameId,
} from '../storage/gameRepository';

type GameStore = {
  game: Game | null;
  derived: DerivedState | null;
  deviceId: string;

  newGame: (ruleSet: RuleSet) => void;
  resumeActive: () => boolean;
  endGame: () => void;
  discardGame: () => void;

  startGameClock: () => void;
  stopGameClock: () => void;
  setClockRemaining: (remainingMs: number) => void;
  restartClock: () => void;

  addPoints: (team: TeamId, points: 1 | 2 | 3) => void;
  adjustScore: (team: TeamId, delta: number) => void;
  addTeamFoul: (team: TeamId) => void;
  removeTeamFoul: (team: TeamId) => void;
  addTimeout: (team: TeamId) => void;
  removeTimeout: (team: TeamId) => void;
  setPossession: (team: TeamId) => void;

  endPeriod: () => void;
  startOvertime: () => void;

  undoLast: () => void;
  voidEvent: (eventId: string) => void;
};

function initialClock(ruleSet: RuleSet, now: number): ClockState {
  const remaining = ruleSet.clockMode === 'countdown' ? ruleSet.periodMs : 0;
  return {
    period: 1,
    running: false,
    anchorAt: now,
    remainingAtAnchorMs: remaining,
    version: 0,
  };
}

export const useGameStore = create<GameStore>((set, get) => {
  /**
   * Persist synchronously before touching in-memory state, then recompute the
   * full derived projection. A failed write is the one blocking error (§13).
   */
  function commit(game: Game): void {
    const saved = saveGame(game);
    if (!saved) {
      Alert.alert(
        'Storage error',
        'This game could not be saved. Recent changes may be lost if the app closes.',
      );
    }
    set({ game, derived: computeDerived(game) });
  }

  function eventBase(game: Game): Pick<
    NewEventInput,
    'id' | 'gameId' | 'deviceId' | 'createdAt' | 'period' | 'clockMs' | 'clockEstimated'
  > {
    const now = Date.now();
    return {
      id: generateId(),
      gameId: game.id,
      deviceId: get().deviceId,
      createdAt: now,
      period: game.clock.period,
      clockMs: readClock(game.clock, now),
      clockEstimated: false,
    };
  }

  function appendEvent(
    type: EventType,
    team: TeamId,
    extra?: { playerId?: string | null; value?: number | null },
  ): void {
    const game = get().game;
    if (!game) return;
    const event = createEvent({
      ...eventBase(game),
      type,
      teamId: team,
      playerId: extra?.playerId ?? null,
      value: extra?.value ?? null,
    });
    commit({ ...game, events: [...game.events, event] });
  }

  function setVoided(events: GameEvent[], eventId: string): GameEvent[] {
    return events.map((event) =>
      event.id === eventId ? { ...event, voided: true } : event,
    );
  }

  /** Void the most recent live event of a type for a team — a targeted undo. */
  function voidLastOfType(type: EventType, team: TeamId): void {
    const game = get().game;
    if (!game) return;
    const target = [...game.events]
      .reverse()
      .find((event) => event.type === type && event.teamId === team && !event.voided);
    if (!target) return;
    commit({ ...game, events: setVoided(game.events, target.id) });
  }

  return {
    game: null,
    derived: null,
    deviceId: getDeviceId(),

    newGame(ruleSet) {
      const now = Date.now();
      const game: Game = {
        id: generateId(),
        code: generateGameCode(),
        ruleSet,
        roster: null,
        clock: initialClock(ruleSet, now),
        events: [],
        status: 'live',
        createdAt: now,
      };
      setActiveGameId(game.id);
      commit(game);
    },

    resumeActive() {
      const activeId = getActiveGameId();
      if (!activeId) return false;
      const game = loadGame(activeId);
      if (!game || game.status !== 'live') return false;
      set({ game, derived: computeDerived(game) });
      return true;
    },

    endGame() {
      const game = get().game;
      if (!game) return;
      const ended: Game = { ...game, status: 'ended' };
      const derived = computeDerived(ended);
      appendToGameIndex({
        id: ended.id,
        code: ended.code,
        ruleSetName: ended.ruleSet.name,
        homeScore: derived.scoreboard.home.score,
        awayScore: derived.scoreboard.away.score,
        status: ended.status,
        createdAt: ended.createdAt,
      });
      setActiveGameId(null);
      commit(ended);
    },

    discardGame() {
      setActiveGameId(null);
      set({ game: null, derived: null });
    },

    startGameClock() {
      const game = get().game;
      if (!game) return;
      commit({ ...game, clock: startClock(game.clock, Date.now()) });
    },

    stopGameClock() {
      const game = get().game;
      if (!game) return;
      commit({ ...game, clock: stopClock(game.clock, Date.now()) });
    },

    setClockRemaining(remainingMs) {
      const game = get().game;
      if (!game) return;
      const now = Date.now();
      const event = createEvent({
        ...eventBase(game),
        type: 'CLOCK_SET',
        teamId: 'home',
        value: remainingMs,
      });
      commit({
        ...game,
        clock: setClock(game.clock, remainingMs, now),
        events: [...game.events, event],
      });
    },

    restartClock() {
      const game = get().game;
      if (!game) return;
      const now = Date.now();
      const isOvertime = game.clock.period > game.ruleSet.periods;
      const fullMs = isOvertime ? game.ruleSet.overtimeMs : game.ruleSet.periodMs;
      const event = createEvent({
        ...eventBase(game),
        type: 'CLOCK_SET',
        teamId: 'home',
        value: fullMs,
      });
      const stopped = stopClock(game.clock, now);
      commit({
        ...game,
        clock: setClock(stopped, fullMs, now),
        events: [...game.events, event],
      });
    },

    addPoints(team, points) {
      const type: EventType =
        points === 1 ? 'POINTS_1' : points === 2 ? 'POINTS_2' : 'POINTS_3';
      appendEvent(type, team);
    },

    adjustScore(team, delta) {
      if (delta === 0) return;
      appendEvent('SCORE_ADJUSTMENT', team, { value: delta });
    },

    addTeamFoul(team) {
      appendEvent('FOUL_PERSONAL', team);
    },

    removeTeamFoul(team) {
      voidLastOfType('FOUL_PERSONAL', team);
    },

    addTimeout(team) {
      appendEvent('TIMEOUT', team);
    },

    removeTimeout(team) {
      voidLastOfType('TIMEOUT', team);
    },

    setPossession(team) {
      appendEvent('POSSESSION_SET', team);
    },

    endPeriod() {
      const game = get().game;
      if (!game) return;
      const now = Date.now();
      const period = game.clock.period;
      const event = createEvent({
        ...eventBase(game),
        type: 'PERIOD_END',
        teamId: 'home',
      });
      const hasMoreRegulation = period < game.ruleSet.periods;
      const nextClock = hasMoreRegulation
        ? setPeriod(game.clock, period + 1, game.ruleSet.periodMs, now)
        : stopClock(setClock(game.clock, 0, now), now);
      commit({
        ...game,
        clock: nextClock,
        events: [...game.events, event],
      });
    },

    startOvertime() {
      const game = get().game;
      if (!game) return;
      const now = Date.now();
      commit({
        ...game,
        clock: setPeriod(
          game.clock,
          game.clock.period + 1,
          game.ruleSet.overtimeMs,
          now,
        ),
      });
    },

    undoLast() {
      const game = get().game;
      if (!game) return;
      const deviceId = get().deviceId;
      const own = game.events.filter(
        (event) => event.deviceId === deviceId && !event.voided,
      );
      const last = own[own.length - 1];
      if (!last) return;
      commit({ ...game, events: setVoided(game.events, last.id) });
    },

    voidEvent(eventId) {
      const game = get().game;
      if (!game) return;
      commit({ ...game, events: setVoided(game.events, eventId) });
    },
  };
});
