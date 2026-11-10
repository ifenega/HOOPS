import type { TeamId } from '../../core/game/types';

export type TeamPanel = {
  name: string;
  score: number;
  teamFouls: number;
  inBonus: boolean;
  timeoutsUsed: number;
};

export type TeamDisplayConfig = {
  showFouls: boolean;
  showTimeouts: boolean;
  foulPipsMax: number;
  timeoutPipsMax: number;
  foulNumeralThreshold: number;
};

export type LedBoardView = {
  remainingMs: number;
  period: number;
  regulationPeriods: number;
  possession: TeamId | null;
  config: TeamDisplayConfig;
  home: TeamPanel;
  away: TeamPanel;
};
