import { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, GameState, NumberState, LogEntry, PlayerType } from '../types';
import { PART_NAMES } from '../translations';

const HUMAN_NUMS = [1, 3, 5, 7, 9];
const COMPUTER_NUMS = [0, 2, 4, 6, 8];
let logId = 0;

function mkLog(english: string, tamil: string, type: LogEntry['type']): LogEntry {
  return { id: ++logId, english, tamil, type };
}

function initNums(values: number[]): NumberState[] {
  return values.map(v => ({ value: v, stage: 0, eliminated: false }));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawPool(numbers: NumberState[], difficulty: Difficulty): number[] {
  if (difficulty === 'medium') return numbers.filter(n => !n.eliminated).map(n => n.value);
  return numbers.map(n => n.value); // easy/hard: all in pool
}

function validTargets(numbers: NumberState[]): NumberState[] {
  return numbers.filter(n => !n.eliminated);
}

function eliminateNum(numbers: NumberState[], target: number, difficulty: Difficulty): NumberState[] {
  return numbers.map(n => {
    if (n.value !== target) return n;
    if (difficulty === 'easy') return { ...n, stage: 0 }; // reset, not eliminated
    return { ...n, stage: 0, eliminated: true };          // medium/hard: gone/dead
  });
}

function checkWin(
  humanNums: NumberState[], computerNums: NumberState[],
  humanScore: number, computerScore: number, difficulty: Difficulty
): PlayerType | null {
  if (difficulty === 'easy') {
    if (humanScore >= 5) return 'human';
    if (computerScore >= 5) return 'computer';
  } else {
    if (computerNums.every(n => n.eliminated)) return 'human';
    if (humanNums.every(n => n.eliminated)) return 'computer';
  }
  return null;
}

const INITIAL_STATE: GameState = {
  difficulty: 'medium',
  phase: 'setup',
  humanNumbers: initNums(HUMAN_NUMS),
  computerNumbers: initNums(COMPUTER_NUMS),
  drawnNumber: null,
  drawnBy: null,
  attackerNumber: null,
  humanScore: 0,
  computerScore: 0,
  winner: null,
  log: [],
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLog = (s: GameState, entry: LogEntry): GameState => ({
    ...s, log: [entry, ...s.log].slice(0, 30),
  });

  const startGame = useCallback((difficulty: Difficulty) => {
    logId = 0;
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({
      ...INITIAL_STATE,
      difficulty,
      phase: 'playing',
      humanNumbers: initNums(HUMAN_NUMS),
      computerNumbers: initNums(COMPUTER_NUMS),
      log: [mkLog('Game started! Player 1 goes first.', 'விளையாட்டு தொடங்கியது! வீரர் 1 முதலில் செல்கிறார்.', 'info')],
    });
  }, []);

  const drawNumber = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const pool = drawPool(prev.humanNumbers, prev.difficulty);
      if (pool.length === 0) return prev;

      const drawn = pickRandom(pool);
      const num = prev.humanNumbers.find(n => n.value === drawn)!;

      // Hard: dead number drawn
      if (prev.difficulty === 'hard' && num.eliminated) {
        return addLog(
          { ...prev, phase: 'computerTurn', drawnNumber: drawn, drawnBy: 'human', attackerNumber: null },
          mkLog(
            `Player 1 drew ${drawn} — DEAD! Turn lost.`,
            `வீரர் 1 ${drawn} எடுத்தார் — இறந்தது! முறை இழந்தது.`,
            'skip'
          )
        );
      }

      // Armed: attack mode
      if (num.stage === 5) {
        return addLog(
          { ...prev, phase: 'humanAttack', drawnNumber: drawn, drawnBy: 'human', attackerNumber: drawn },
          mkLog(
            `Player 1 drew ${drawn} — ATTACK! Choose your target.`,
            `வீரர் 1 ${drawn} எடுத்தார் — தாக்குதல்! இலக்கை தேர்ந்தெடுக்கவும்.`,
            'attack'
          )
        );
      }

      // Build next stage
      const newStage = num.stage + 1;
      const part = PART_NAMES[newStage - 1];
      const newHuman = prev.humanNumbers.map(n => n.value === drawn ? { ...n, stage: newStage } : n);
      const logType = newStage === 5 ? 'arm' : 'build';
      const armNote = newStage === 5 ? ' — ARMED!' : '';
      const armNoteTa = newStage === 5 ? ' — ஆயுதமேந்தியது!' : '';

      return addLog(
        { ...prev, phase: 'computerTurn', humanNumbers: newHuman, drawnNumber: drawn, drawnBy: 'human', attackerNumber: null },
        mkLog(
          `Player 1 drew ${drawn} — Added ${part.en}${armNote}`,
          `வீரர் 1 ${drawn} எடுத்தார் — ${part.ta} சேர்க்கப்பட்டது${armNoteTa}`,
          logType
        )
      );
    });
  }, []);

  const selectAttackTarget = useCallback((targetValue: number) => {
    setState(prev => {
      if (prev.phase !== 'humanAttack') return prev;
      const newComputer = eliminateNum(prev.computerNumbers, targetValue, prev.difficulty);
      const newHumanScore = prev.difficulty === 'easy' ? prev.humanScore + 1 : prev.humanScore;
      const winner = checkWin(prev.humanNumbers, newComputer, newHumanScore, prev.computerScore, prev.difficulty);

      const elimEntry = mkLog(
        `Player 1 ELIMINATED Computer's ${targetValue}!`,
        `வீரர் 1 கணினியின் ${targetValue} ஐ நீக்கினார்!`,
        'eliminate'
      );

      if (winner) {
        let s = addLog({ ...prev, phase: 'gameover', computerNumbers: newComputer, humanScore: newHumanScore, winner, attackerNumber: null }, elimEntry);
        return addLog(s, mkLog('Player 1 WINS! Congratulations!', 'வீரர் 1 வெற்றி பெற்றார்! வாழ்த்துக்கள்!', 'win'));
      }

      return addLog(
        { ...prev, phase: 'computerTurn', computerNumbers: newComputer, humanScore: newHumanScore, attackerNumber: null },
        elimEntry
      );
    });
  }, []);

  // Computer turn automation
  useEffect(() => {
    if (state.phase !== 'computerTurn') return;
    const delay = 1000 + Math.random() * 500;

    timerRef.current = setTimeout(() => {
      setState(prev => {
        if (prev.phase !== 'computerTurn') return prev;
        const pool = drawPool(prev.computerNumbers, prev.difficulty);
        if (pool.length === 0) return { ...prev, phase: 'playing' };

        const drawn = pickRandom(pool);
        const num = prev.computerNumbers.find(n => n.value === drawn)!;

        // Hard: dead number
        if (prev.difficulty === 'hard' && num.eliminated) {
          return addLog(
            { ...prev, phase: 'playing', drawnNumber: drawn, drawnBy: 'computer' },
            mkLog(
              `Computer drew ${drawn} — DEAD! Turn lost.`,
              `கணினி ${drawn} எடுத்தது — இறந்தது! முறை இழந்தது.`,
              'skip'
            )
          );
        }

        // Armed: computer attacks
        if (num.stage === 5) {
          const targets = validTargets(prev.humanNumbers);
          if (targets.length === 0) return { ...prev, phase: 'playing' };
          const target = pickRandom(targets);
          const newHuman = eliminateNum(prev.humanNumbers, target.value, prev.difficulty);
          const newCompScore = prev.difficulty === 'easy' ? prev.computerScore + 1 : prev.computerScore;
          const winner = checkWin(newHuman, prev.computerNumbers, prev.humanScore, newCompScore, prev.difficulty);

          const attackEntry = mkLog(
            `Computer drew ${drawn} — ATTACK! Eliminated Player 1's ${target.value}!`,
            `கணினி ${drawn} எடுத்தது — தாக்குதல்! வீரர் 1 இன் ${target.value} நீக்கப்பட்டது!`,
            'eliminate'
          );

          if (winner) {
            let s = addLog({ ...prev, phase: 'gameover', humanNumbers: newHuman, computerScore: newCompScore, drawnNumber: drawn, drawnBy: 'computer', winner }, attackEntry);
            return addLog(s, mkLog('Computer WINS!', 'கணினி வெற்றி பெற்றது!', 'win'));
          }

          return addLog(
            { ...prev, phase: 'playing', humanNumbers: newHuman, computerScore: newCompScore, drawnNumber: drawn, drawnBy: 'computer' },
            attackEntry
          );
        }

        // Build stage
        const newStage = num.stage + 1;
        const part = PART_NAMES[newStage - 1];
        const newComputer = prev.computerNumbers.map(n => n.value === drawn ? { ...n, stage: newStage } : n);
        const logType = newStage === 5 ? 'arm' : 'build';
        const armNote = newStage === 5 ? ' — ARMED!' : '';
        const armNoteTa = newStage === 5 ? ' — ஆயுதமேந்தியது!' : '';

        return addLog(
          { ...prev, phase: 'playing', computerNumbers: newComputer, drawnNumber: drawn, drawnBy: 'computer' },
          mkLog(
            `Computer drew ${drawn} — Added ${part.en}${armNote}`,
            `கணினி ${drawn} எடுத்தது — ${part.ta} சேர்க்கப்பட்டது${armNoteTa}`,
            logType
          )
        );
      });
    }, delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [state.phase]);

  const resetGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState(s => ({ ...INITIAL_STATE, phase: 'setup', difficulty: s.difficulty }));
  }, []);

  return { state, startGame, drawNumber, selectAttackTarget, resetGame };
}
