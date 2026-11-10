import { createEvent } from '../events/factory';
import type { EventType, GameEvent } from '../events/types';
import type { TeamId } from '../game/types';
import { QUICK_SCORE } from '../rules/presets';
import { computeScoreboard } from './scoreboard';

let counter = 0;

function ev(
  type: EventType,
  teamId: TeamId,
  opts: { period?: number; value?: number | null; voided?: boolean } = {},
): GameEvent {
  counter += 1;
  const event = createEvent({
    id: `e${counter}`,
    gameId: 'g1',
    deviceId: 'd1',
    createdAt: counter,
    period: opts.period ?? 1,
    clockMs: 0,
    clockEstimated: false,
    type,
    teamId,
    value: opts.value ?? null,
  });
  return { ...event, voided: opts.voided ?? false };
}

describe('computeScoreboard', () => {
  it('sums points by value', () => {
    const board = computeScoreboard(
      [ev('POINTS_2', 'home'), ev('POINTS_3', 'home'), ev('POINTS_1', 'away')],
      QUICK_SCORE,
      1,
    );
    expect(board.home.score).toBe(5);
    expect(board.away.score).toBe(1);
  });

  it('applies signed score adjustments', () => {
    const board = computeScoreboard(
      [ev('POINTS_3', 'home'), ev('SCORE_ADJUSTMENT', 'home', { value: -2 })],
      QUICK_SCORE,
      1,
    );
    expect(board.home.score).toBe(1);
  });

  it('ignores voided events', () => {
    const board = computeScoreboard(
      [ev('POINTS_2', 'home', { voided: true }), ev('POINTS_2', 'home')],
      QUICK_SCORE,
      1,
    );
    expect(board.home.score).toBe(2);
  });

  it('counts team fouls only for the current period', () => {
    const events = [
      ev('FOUL_PERSONAL', 'home', { period: 1 }),
      ev('FOUL_PERSONAL', 'home', { period: 1 }),
      ev('FOUL_PERSONAL', 'home', { period: 2 }),
    ];
    expect(computeScoreboard(events, QUICK_SCORE, 1).home.teamFoulsThisPeriod).toBe(2);
    expect(computeScoreboard(events, QUICK_SCORE, 2).home.teamFoulsThisPeriod).toBe(1);
  });

  it('enters bonus at the rule threshold', () => {
    const threeFouls = Array.from({ length: 3 }, () => ev('FOUL_PERSONAL', 'away'));
    expect(computeScoreboard(threeFouls, QUICK_SCORE, 1).away.inBonus).toBe(false);
    const fourFouls = Array.from({ length: 4 }, () => ev('FOUL_PERSONAL', 'away'));
    expect(computeScoreboard(fourFouls, QUICK_SCORE, 1).away.inBonus).toBe(true);
  });

  it('tracks timeouts and last-set possession', () => {
    const board = computeScoreboard(
      [ev('TIMEOUT', 'home'), ev('POSSESSION_SET', 'home'), ev('POSSESSION_SET', 'away')],
      QUICK_SCORE,
      1,
    );
    expect(board.home.timeoutsUsed).toBe(1);
    expect(board.possession).toBe('away');
  });
});
