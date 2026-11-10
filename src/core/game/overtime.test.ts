import type { ScoreboardState } from '../projections/scoreboard';
import { FIBA, RUN } from '../rules/presets';
import { isRunModeGameOver, needsOvertime } from './overtime';

function board(homeScore: number, awayScore: number, period: number): ScoreboardState {
  const team = (score: number) => ({
    score,
    teamFoulsThisPeriod: 0,
    inBonus: false,
    timeoutsUsed: 0,
  });
  return { period, home: team(homeScore), away: team(awayScore), possession: null };
}

describe('needsOvertime', () => {
  it('triggers when tied at the end of regulation', () => {
    expect(needsOvertime(board(60, 60, FIBA.periods), FIBA, FIBA.periods)).toBe(true);
  });

  it('does not trigger when a team leads', () => {
    expect(needsOvertime(board(61, 60, FIBA.periods), FIBA, FIBA.periods)).toBe(false);
  });

  it('does not trigger before the final period', () => {
    expect(needsOvertime(board(30, 30, 2), FIBA, 2)).toBe(false);
  });

  it('triggers again when an overtime period ends level', () => {
    expect(needsOvertime(board(70, 70, FIBA.periods + 1), FIBA, FIBA.periods + 1)).toBe(true);
  });

  it('never applies to a clockless run game', () => {
    expect(needsOvertime(board(21, 21, 1), RUN, 1)).toBe(false);
  });
});

describe('isRunModeGameOver', () => {
  it('ends when the target is reached with the required margin', () => {
    expect(isRunModeGameOver(board(21, 15, 1), RUN)).toBe(true);
  });

  it('continues when the target is reached without the margin', () => {
    expect(isRunModeGameOver(board(21, 20, 1), RUN)).toBe(false);
  });

  it('continues before the target', () => {
    expect(isRunModeGameOver(board(18, 10, 1), RUN)).toBe(false);
  });
});
