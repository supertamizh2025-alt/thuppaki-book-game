export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'setup' | 'playing' | 'humanAttack' | 'computerTurn' | 'gameover';
export type PlayerType = 'human' | 'computer';

export interface NumberState {
  value: number;
  stage: number; // 0 = empty, 1=head, 2=body, 3=legs, 4=hands, 5=gun (armed)
  eliminated: boolean; // medium: removed; hard: dead; easy: never true
}

export interface LogEntry {
  id: number;
  english: string;
  tamil: string;
  type: 'draw' | 'build' | 'arm' | 'attack' | 'eliminate' | 'skip' | 'win' | 'info';
}

export interface GameState {
  difficulty: Difficulty;
  phase: GamePhase;
  humanNumbers: NumberState[];
  computerNumbers: NumberState[];
  drawnNumber: number | null;
  drawnBy: PlayerType | null;
  attackerNumber: number | null;
  humanScore: number;
  computerScore: number;
  winner: PlayerType | null;
  log: LogEntry[];
}
