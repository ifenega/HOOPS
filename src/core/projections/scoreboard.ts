import type { GameEvent } from '../events/types';
import type { TeamId } from '../game/types';
import type { RuleSet } from '../rules/types';

export type TeamScoreboard = {
  score: number;
  teamFoulsThisPeriod: number;
  inBonus: boolean;
  timeoutsUsed: number;
};

export type ScoreboardState = {
  period: number;
  home: TeamScoreboard;
  away: TeamScoreboard;
  possession: TeamId | null;
};

function emptyTeam(): TeamScoreboard {
  return { score: 0, teamFoulsThisPeriod: 0, inBonus: false, timeoutsUsed: 0 };
}

const FOUL_TYPES = new Set([
  'FOUL_PERSONAL',
  'FOUL_TECHNICAL',
  'FOUL_UNSPORTSMANLIKE',
]);

/** Events replayed in `seq` order; equal `seq` keeps insertion order (stable). */
function inOrder(events: GameEvent[]): GameEvent[] {
  return [...events].sort((a, b) => a.seq - b.seq);
}

/**
 * The scoreboard is derived by replaying the log — never stored as a mutable
 * counter. Team fouls are counted for `currentPeriod` only; the caller passes
 * the authoritative period from the clock.
 */
export function computeScoreboard(
  events: GameEvent[],
  ruleSet: RuleSet,
  currentPeriod: number,
): ScoreboardState {
  const home = emptyTeam();
  const away = emptyTeam();
  let possession: TeamId | null = null;

  for (const event of inOrder(events)) {
    if (event.voided) continue;
    const team = event.teamId === 'home' ? home : away;

    switch (event.type) {
      case 'POINTS_1':
        team.score += 1;
        break;
      case 'POINTS_2':
        team.score += 2;
        break;
      case 'POINTS_3':
        team.score += 3;
        break;
      case 'SCORE_ADJUSTMENT':
        team.score += event.value ?? 0;
        break;
      case 'TIMEOUT':
        team.timeoutsUsed += 1;
        break;
      case 'POSSESSION_SET':
        possession = event.teamId;
        break;
      case 'FOUL_PERSONAL':
      case 'FOUL_TECHNICAL':
      case 'FOUL_UNSPORTSMANLIKE':
        if (event.period === currentPeriod) team.teamFoulsThisPeriod += 1;
        break;
      default:
        break;
    }
  }

  applyBonus(home, ruleSet);
  applyBonus(away, ruleSet);

  return { period: currentPeriod, home, away, possession };
}

function applyBonus(team: TeamScoreboard, ruleSet: RuleSet): void {
  if (ruleSet.teamFoulBonus === null) return;
  team.inBonus = team.teamFoulsThisPeriod >= ruleSet.teamFoulBonus;
}

export { FOUL_TYPES };
