import type { EventType, GameEvent } from './types';

const KNOWN_EVENT_TYPES: ReadonlySet<EventType> = new Set([
  'POINTS_1',
  'POINTS_2',
  'POINTS_3',
  'SHOT_MISSED_2',
  'SHOT_MISSED_3',
  'FREE_THROW_MISSED',
  'FOUL_PERSONAL',
  'FOUL_TECHNICAL',
  'FOUL_UNSPORTSMANLIKE',
  'REBOUND_OFFENSIVE',
  'REBOUND_DEFENSIVE',
  'ASSIST',
  'STEAL',
  'BLOCK',
  'TURNOVER',
  'TIMEOUT',
  'POSSESSION_SET',
  'PERIOD_END',
  'SCORE_ADJUSTMENT',
  'CLOCK_SET',
]);

export function isKnownEventType(type: string): type is EventType {
  return KNOWN_EVENT_TYPES.has(type as EventType);
}

/** The two event types that require a numeric `value` to be meaningful. */
function requiresNumericValue(type: EventType): boolean {
  return type === 'SCORE_ADJUSTMENT' || type === 'CLOCK_SET';
}

/**
 * A structural check for an event arriving from storage or the wire. Unknown
 * types are treated as invalid so callers can ignore them rather than throw —
 * forward compatibility for a mixed-version session (spec §13).
 */
export function isValidEvent(event: GameEvent): boolean {
  if (!isKnownEventType(event.type)) return false;
  if (typeof event.id !== 'string' || event.id.length === 0) return false;
  if (event.teamId !== 'home' && event.teamId !== 'away') return false;
  if (requiresNumericValue(event.type) && typeof event.value !== 'number') {
    return false;
  }
  return true;
}
