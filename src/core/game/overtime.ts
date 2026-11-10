import type { ScoreboardState } from '../projections/scoreboard';
import type { RuleSet } from '../rules/types';

export function isTied(scoreboard: ScoreboardState): boolean {
  return scoreboard.home.score === scoreboard.away.score;
}

export function leadMargin(scoreboard: ScoreboardState): number {
  return Math.abs(scoreboard.home.score - scoreboard.away.score);
}

/** The period at or beyond which no further regulation periods remain. */
function isRegulationOrLaterComplete(period: number, ruleSet: RuleSet): boolean {
  return period >= ruleSet.periods;
}

/**
 * After the given period ends, does the game go to (another) overtime?
 * True when the clock-based game is level at the end of the final regulation
 * period or of an overtime period. Run mode (no clock) never uses this.
 */
export function needsOvertime(
  scoreboard: ScoreboardState,
  ruleSet: RuleSet,
  endedPeriod: number,
): boolean {
  if (ruleSet.clockMode === 'none') return false;
  if (!isRegulationOrLaterComplete(endedPeriod, ruleSet)) return false;
  return isTied(scoreboard);
}

/**
 * Run mode ends when a team reaches `targetScore` AND leads by at least
 * `winBy`. Reaching the target without the margin means play continues.
 */
export function isRunModeGameOver(
  scoreboard: ScoreboardState,
  ruleSet: RuleSet,
): boolean {
  if (ruleSet.targetScore === null) return false;
  const leader = Math.max(scoreboard.home.score, scoreboard.away.score);
  return leader >= ruleSet.targetScore && leadMargin(scoreboard) >= ruleSet.winBy;
}
