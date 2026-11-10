import type { RuleSet } from './types';

const MINUTE_MS = 60_000;

export const FIBA: RuleSet = {
  id: 'fiba',
  name: 'FIBA',
  clockMode: 'countdown',
  periods: 4,
  periodMs: 10 * MINUTE_MS,
  overtimeMs: 5 * MINUTE_MS,
  targetScore: null,
  winBy: 1,
  teamFoulBonus: 4,
  playerFoulLimit: 5,
  timeoutsFirstHalf: 2,
  timeoutsSecondHalf: 3,
  requiresRoster: true,
};

export const QUICK_SCORE: RuleSet = {
  id: 'quick_score',
  name: 'Quick Score',
  clockMode: 'countdown',
  // A single timed period — the operator enters the length at setup. No quarters.
  periods: 1,
  periodMs: 10 * MINUTE_MS,
  overtimeMs: 5 * MINUTE_MS,
  targetScore: null,
  winBy: 1,
  teamFoulBonus: 4,
  playerFoulLimit: null,
  timeoutsFirstHalf: null,
  timeoutsSecondHalf: null,
  requiresRoster: false,
};

export const RUN: RuleSet = {
  id: 'run',
  name: 'Run',
  clockMode: 'none',
  periods: 1,
  periodMs: 0,
  overtimeMs: 0,
  targetScore: 21,
  winBy: 2,
  teamFoulBonus: null,
  playerFoulLimit: null,
  timeoutsFirstHalf: null,
  timeoutsSecondHalf: null,
  requiresRoster: false,
};

export const PRESETS: readonly RuleSet[] = [QUICK_SCORE, RUN, FIBA];
