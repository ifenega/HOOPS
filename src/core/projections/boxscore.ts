import type { GameEvent } from '../events/types';

export type PlayerStatLine = {
  playerId: string;
  points: number;
  fouls: number;
  reboundsOffensive: number;
  reboundsDefensive: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
};

export type BoxScore = Record<string, PlayerStatLine>;

function emptyLine(playerId: string): PlayerStatLine {
  return {
    playerId,
    points: 0,
    fouls: 0,
    reboundsOffensive: 0,
    reboundsDefensive: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
  };
}

/**
 * Per-player stat lines derived from the log. Only events tagged with a
 * `playerId` contribute — Quick Score and Run games (no roster) yield an empty
 * box score. Reused unchanged by Phase 3's roster stats.
 */
export function computeBoxScore(events: GameEvent[]): BoxScore {
  const box: BoxScore = {};

  const lineFor = (playerId: string): PlayerStatLine => {
    const existing = box[playerId];
    if (existing) return existing;
    const created = emptyLine(playerId);
    box[playerId] = created;
    return created;
  };

  for (const event of events) {
    if (event.voided || event.playerId === null) continue;
    const line = lineFor(event.playerId);

    switch (event.type) {
      case 'POINTS_1':
        line.points += 1;
        line.freeThrowsMade += 1;
        line.freeThrowsAttempted += 1;
        break;
      case 'POINTS_2':
        line.points += 2;
        line.fieldGoalsMade += 1;
        line.fieldGoalsAttempted += 1;
        break;
      case 'POINTS_3':
        line.points += 3;
        line.fieldGoalsMade += 1;
        line.fieldGoalsAttempted += 1;
        break;
      case 'SHOT_MISSED_2':
      case 'SHOT_MISSED_3':
        line.fieldGoalsAttempted += 1;
        break;
      case 'FREE_THROW_MISSED':
        line.freeThrowsAttempted += 1;
        break;
      case 'FOUL_PERSONAL':
      case 'FOUL_TECHNICAL':
      case 'FOUL_UNSPORTSMANLIKE':
        line.fouls += 1;
        break;
      case 'REBOUND_OFFENSIVE':
        line.reboundsOffensive += 1;
        break;
      case 'REBOUND_DEFENSIVE':
        line.reboundsDefensive += 1;
        break;
      case 'ASSIST':
        line.assists += 1;
        break;
      case 'STEAL':
        line.steals += 1;
        break;
      case 'BLOCK':
        line.blocks += 1;
        break;
      case 'TURNOVER':
        line.turnovers += 1;
        break;
      default:
        break;
    }
  }

  return box;
}
