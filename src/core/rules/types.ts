export type ClockMode = 'countdown' | 'countup' | 'none';

export type RuleSet = {
  id: string;
  name: string;
  clockMode: ClockMode;
  periods: number;
  periodMs: number;
  overtimeMs: number;
  targetScore: number | null;
  winBy: number;
  teamFoulBonus: number | null;
  playerFoulLimit: number | null;
  timeoutsFirstHalf: number | null;
  timeoutsSecondHalf: number | null;
  requiresRoster: boolean;
};
