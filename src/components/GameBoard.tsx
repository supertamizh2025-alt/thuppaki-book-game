import { GameState } from '../types';
import { T } from '../translations';
import NumberRow from './NumberRow';
import CenterPanel from './CenterPanel';
import GameLog from './GameLog';

interface GameBoardProps {
  state: GameState;
  onDraw: () => void;
  onAttackSelect: (value: number) => void;
  onReset: () => void;
}

const DIFFICULTY_LABEL = { easy: T.easy, medium: T.medium, hard: T.hard };
const DIFFICULTY_COLOR = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-red-400' };

export default function GameBoard({ state, onDraw, onAttackSelect, onReset }: GameBoardProps) {
  const { phase, humanNumbers, computerNumbers, drawnNumber, drawnBy, winner, difficulty } = state;

  const isAttackPhase = phase === 'humanAttack';
  const isComputerTurn = phase === 'computerTurn';

  const drawnHuman = drawnBy === 'human' ? drawnNumber : null;
  const drawnComputer = drawnBy === 'computer' ? drawnNumber : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700/60 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent leading-none">
              {T.title.en}
            </h1>
            <p className="text-amber-600/70 text-xs">{T.title.ta}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className={`text-xs font-bold ${DIFFICULTY_COLOR[difficulty]}`}>
                {DIFFICULTY_LABEL[difficulty].en}
              </span>
              <span className={`text-[10px] ml-1 ${DIFFICULTY_COLOR[difficulty]} opacity-70`}>
                / {DIFFICULTY_LABEL[difficulty].ta}
              </span>
            </div>
            <button
              onClick={onReset}
              className="text-slate-400 hover:text-slate-200 text-xs border border-slate-600 hover:border-slate-400
                px-2 py-1 rounded-lg transition-all duration-150"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Status bar — drawn number */}
      {drawnNumber !== null && (
        <div className={`
          px-4 py-2 text-center text-sm font-semibold
          ${drawnBy === 'human'
            ? 'bg-amber-500/10 border-b border-amber-500/20 text-amber-300'
            : 'bg-blue-500/10 border-b border-blue-500/20 text-blue-300'
          }
        `}>
          <span className="font-black text-lg mx-1">{drawnNumber}</span>
          {T.drawn.en} · {T.drawn.ta}
          {' '}—{' '}
          <span className="opacity-80">{drawnBy === 'human' ? T.player1.en : T.computer.en}</span>
          {isComputerTurn && (
            <span className="ml-2 text-blue-400 text-xs animate-pulse">{T.thinking.ta}</span>
          )}
        </div>
      )}

      {/* Winner banner */}
      {phase === 'gameover' && winner && (
        <div className="relative bg-gradient-to-r from-slate-800 via-amber-900/40 to-slate-800 border-b border-amber-500/40 px-4 py-5">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-amber-400/80 text-xs font-semibold uppercase tracking-widest">{T.winner.ta}</p>
            <h2 className="text-3xl font-black text-amber-300 mt-1">
              {winner === 'human' ? T.player1.en : T.computer.en}{' '}
              <span className="text-amber-400">{T.wins.en}</span>
            </h2>
            <p className="text-amber-500/70 text-sm mt-1">
              {winner === 'human' ? T.player1.ta : T.computer.ta} {T.wins.ta}
            </p>
            <button
              onClick={onReset}
              className="mt-4 inline-flex flex-col items-center bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                text-slate-900 font-black px-8 py-2.5 rounded-2xl transition-all duration-200
                hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30"
            >
              <span>{T.playAgain.en}</span>
              <span className="text-xs font-semibold opacity-80">{T.playAgain.ta}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main board */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-3 py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-0 min-h-[480px]">
          {/* Human column */}
          <div className="flex flex-col">
            <div className="text-center mb-3 pb-2 border-b border-amber-700/30">
              <span className="text-amber-300 text-sm font-bold block">{T.player1.en}</span>
              <span className="text-amber-500/70 text-xs">{T.player1.ta}</span>
            </div>
            <div className="flex flex-col gap-1">
              {humanNumbers.map(num => (
                <NumberRow
                  key={num.value}
                  num={num}
                  side="human"
                  isHighlighted={drawnHuman === num.value}
                  isAttackTarget={false}
                  onAttackSelect={undefined}
                />
              ))}
            </div>
          </div>

          {/* Center divider + panel */}
          <div className="flex flex-col items-center border-x border-slate-700/40 mx-1 min-w-[130px]">
            <div className="h-full flex items-stretch w-full">
              <CenterPanel
                state={state}
                onDraw={onDraw}
                onAttackSelect={onAttackSelect}
              />
            </div>
          </div>

          {/* Computer column */}
          <div className="flex flex-col">
            <div className="text-center mb-3 pb-2 border-b border-blue-700/30">
              <span className="text-blue-300 text-sm font-bold block">{T.computer.en}</span>
              <span className="text-blue-500/70 text-xs">{T.computer.ta}</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              {computerNumbers.map(num => (
                <NumberRow
                  key={num.value}
                  num={num}
                  side="computer"
                  isHighlighted={drawnComputer === num.value}
                  isAttackTarget={isAttackPhase && !num.eliminated}
                  onAttackSelect={onAttackSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game log */}
      <div className="max-w-3xl mx-auto w-full px-3 pb-4 border-t border-slate-700/40 pt-3">
        <GameLog entries={state.log} />
      </div>
    </div>
  );
}
