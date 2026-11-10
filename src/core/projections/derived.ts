import type { Game } from '../game/types';
import { computeBoxScore, type BoxScore } from './boxscore';
import { computeScoreboard, type ScoreboardState } from './scoreboard';

export type DerivedState = {
  scoreboard: ScoreboardState;
  boxScore: BoxScore;
};

/**
 * The full projection: recomputed from the log on every append. A whole game is
 * under a thousand events and a full replay is well under a millisecond, so
 * there is deliberately no caching or incremental update (spec §12).
 */
export function computeDerived(game: Game): DerivedState {
  return {
    scoreboard: computeScoreboard(
      game.events,
      game.ruleSet,
      game.clock.period,
    ),
    boxScore: computeBoxScore(game.events),
  };
}
