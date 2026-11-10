import type { GameEvent, EventType } from '../core/events/types';

const LABELS: Record<EventType, string> = {
  POINTS_1: '+1 point',
  POINTS_2: '+2 points',
  POINTS_3: '+3 points',
  SHOT_MISSED_2: 'Missed 2',
  SHOT_MISSED_3: 'Missed 3',
  FREE_THROW_MISSED: 'Missed FT',
  FOUL_PERSONAL: 'Foul',
  FOUL_TECHNICAL: 'Technical foul',
  FOUL_UNSPORTSMANLIKE: 'Unsportsmanlike foul',
  REBOUND_OFFENSIVE: 'Offensive rebound',
  REBOUND_DEFENSIVE: 'Defensive rebound',
  ASSIST: 'Assist',
  STEAL: 'Steal',
  BLOCK: 'Block',
  TURNOVER: 'Turnover',
  TIMEOUT: 'Timeout',
  POSSESSION_SET: 'Possession',
  PERIOD_END: 'Period end',
  SCORE_ADJUSTMENT: 'Score adjustment',
  CLOCK_SET: 'Clock set',
};

export function describeEvent(event: GameEvent): string {
  const team = event.teamId === 'home' ? 'Home' : 'Away';
  const base = LABELS[event.type] ?? event.type;
  if (event.type === 'SCORE_ADJUSTMENT' && event.value !== null) {
    const sign = event.value > 0 ? '+' : '';
    return `${team} · ${sign}${event.value} pts`;
  }
  return `${team} · ${base}`;
}
