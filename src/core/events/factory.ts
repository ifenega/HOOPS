import type { TeamId } from '../game/types';
import type { EventType, GameEvent } from './types';

/**
 * Identity fields (`id`, `createdAt`, `deviceId`) are passed in rather than
 * generated here — that keeps /core free of uuid/crypto/RN imports. The caller
 * in /state supplies them.
 */
export type NewEventInput = {
  id: string;
  gameId: string;
  deviceId: string;
  createdAt: number;
  period: number;
  clockMs: number;
  clockEstimated: boolean;
  type: EventType;
  teamId: TeamId;
  playerId?: string | null;
  value?: number | null;
};

export function createEvent(input: NewEventInput): GameEvent {
  return {
    id: input.id,
    gameId: input.gameId,
    seq: 0,
    deviceId: input.deviceId,
    createdAt: input.createdAt,
    period: input.period,
    clockMs: input.clockMs,
    clockEstimated: input.clockEstimated,
    type: input.type,
    teamId: input.teamId,
    playerId: input.playerId ?? null,
    value: input.value ?? null,
    voided: false,
  };
}
