import type { TeamId } from '../game/types';

export type EventType =
  | 'POINTS_1'
  | 'POINTS_2'
  | 'POINTS_3'
  | 'SHOT_MISSED_2'
  | 'SHOT_MISSED_3'
  | 'FREE_THROW_MISSED'
  | 'FOUL_PERSONAL'
  | 'FOUL_TECHNICAL'
  | 'FOUL_UNSPORTSMANLIKE'
  | 'REBOUND_OFFENSIVE'
  | 'REBOUND_DEFENSIVE'
  | 'ASSIST'
  | 'STEAL'
  | 'BLOCK'
  | 'TURNOVER'
  | 'TIMEOUT'
  | 'POSSESSION_SET'
  | 'PERIOD_END'
  | 'SCORE_ADJUSTMENT'
  | 'CLOCK_SET';

export type GameEvent = {
  id: string;
  gameId: string;
  /** Assigned by the host on acceptance; `0` until then. Ordering is by `seq`. */
  seq: number;
  deviceId: string;
  /** Diagnostic only — never used for ordering. */
  createdAt: number;
  period: number;
  clockMs: number;
  /** True when created while disconnected: counts stay correct, ordering may not. */
  clockEstimated: boolean;
  type: EventType;
  teamId: TeamId;
  playerId: string | null;
  /**
   * Payload for the two events that carry a number:
   * `SCORE_ADJUSTMENT` -> signed point delta, `CLOCK_SET` -> remaining ms.
   * `null` for every other event type.
   */
  value: number | null;
  /** Voiding is a flag, never a deletion. */
  voided: boolean;
};
