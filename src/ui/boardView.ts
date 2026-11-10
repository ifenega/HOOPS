import type { Game } from '../core/game/types';
import type { DerivedState } from '../core/projections/derived';
import type { TeamScoreboard } from '../core/projections/scoreboard';
import { DISPLAY } from '../config/constants';
import type { LedBoardView, TeamPanel } from './components/boardTypes';

/** Map the derived game state onto the presentational board view. */
export function toBoardView(
  game: Game,
  derived: DerivedState,
  remainingMs: number,
): LedBoardView {
  const rules = game.ruleSet;
  const scoreboard = derived.scoreboard;
  const foulPipsMax = rules.teamFoulBonus ?? DISPLAY.FOUL_PIPS_FALLBACK_MAX;

  return {
    remainingMs,
    period: scoreboard.period,
    regulationPeriods: rules.periods,
    possession: scoreboard.possession,
    config: {
      showFouls: rules.teamFoulBonus !== null,
      showTimeouts: true,
      foulPipsMax,
      timeoutPipsMax: DISPLAY.TIMEOUTS_MAX_PIPS,
      foulNumeralThreshold: foulPipsMax,
    },
    home: panelFor(teamName(game, 'home'), scoreboard.home),
    away: panelFor(teamName(game, 'away'), scoreboard.away),
  };
}

function teamName(game: Game, side: 'home' | 'away'): string {
  const roster = game.roster;
  if (roster) return roster[side].name;
  return side === 'home' ? 'HOME' : 'AWAY';
}

function panelFor(name: string, team: TeamScoreboard): TeamPanel {
  return {
    name,
    score: team.score,
    teamFouls: team.teamFoulsThisPeriod,
    inBonus: team.inBonus,
    timeoutsUsed: team.timeoutsUsed,
  };
}
