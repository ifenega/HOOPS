import type { Game, GameStatus } from '../core/game/types';
import { KEYS, storage } from './mmkv-storage';

export type GameSummary = {
  id: string;
  code: string;
  ruleSetName: string;
  homeScore: number;
  awayScore: number;
  status: GameStatus;
  createdAt: number;
};

/**
 * Persist the full game. Returns false on write failure — the one error the
 * caller must surface loudly, because it means unrecoverable data loss (§13).
 */
export function saveGame(game: Game): boolean {
  try {
    storage.set(KEYS.game(game.id), JSON.stringify(game));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(gameId: string): Game | null {
  const raw = storage.getString(KEYS.game(gameId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Game;
  } catch {
    return null;
  }
}

export function setActiveGameId(gameId: string | null): void {
  if (gameId === null) {
    storage.delete(KEYS.activeGame);
    return;
  }
  storage.set(KEYS.activeGame, gameId);
}

export function getActiveGameId(): string | null {
  return storage.getString(KEYS.activeGame);
}

export function readGameIndex(): GameSummary[] {
  const raw = storage.getString(KEYS.gameIndex);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GameSummary[];
  } catch {
    return [];
  }
}

export function appendToGameIndex(summary: GameSummary): void {
  const index = readGameIndex().filter((entry) => entry.id !== summary.id);
  index.unshift(summary);
  storage.set(KEYS.gameIndex, JSON.stringify(index));
}
