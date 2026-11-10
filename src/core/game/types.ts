import type { ClockState } from '../clock/clock';
import type { GameEvent } from '../events/types';
import type { RuleSet } from '../rules/types';

export type TeamId = 'home' | 'away';

export type Player = {
  id: string;
  name: string;
  /** A string: `0` and `00` are both legal jersey numbers and are distinct. */
  number: string;
  onCourt: boolean;
};

export type Team = {
  id: TeamId;
  name: string;
  players: Player[];
};

export type Roster = {
  home: Team;
  away: Team;
};

export type GameStatus = 'setup' | 'live' | 'ended';

export type Game = {
  id: string;
  code: string;
  ruleSet: RuleSet;
  /** Null for Quick Score and Run modes, which have no roster. */
  roster: Roster | null;
  clock: ClockState;
  events: GameEvent[];
  status: GameStatus;
  createdAt: number;
};
