import { GameState, NumberState } from '../types';
import { T } from '../translations';

interface CenterPanelProps {
  state: GameState;
  onDraw: () => void;
  onAttackSelect: (value: number) => void;
}


export default function CenterPanel({ state, onDraw, onAttackSelect }: CenterPanelProps) {
  const { phase, drawnNumber, drawnBy, computerNumbers, humanScore, computerScore, difficulty } = state;

  const isHumanTurn = phase === 'playing';
  const isHumanAttack = phase === 'humanAttack';
  const isComputerTurn = phase === 'computerTurn';

  const attackTargets: NumberState[] = computerNumbers.filter(n => !n.eliminated);

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-6 min-h-full">
      {/* Divider line top */}
      <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-600 to-transparent max-h-8" />

      {/* Turn indicator */}
      <div className="text-center">
        {isComputerTurn ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-blue-300 text-sm font-semibold">{T.computerTurn.en}</span>
            <span className="text-blue-400/70 text-xs">{T.computerTurn.ta}</span>
          </div>
        ) : isHumanAttack ? (
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center animate-pulse">
              <span className="text-red-400 text-lg">⚡</span>
            </div>
            <span className="text-red-300 text-sm font-bold">{T.attack.en}</span>
            <span className="text-red-400/70 text-xs">{T.attack.ta}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-sm font-semibold">{T.yourTurn.en}</span>
            <span className="text-amber-400/70 text-xs">{T.yourTurn.ta}</span>
          </div>
        )}
      </div>

      {/* Drawn number display */}
      {drawnNumber !== null && (
        <div className={`
          flex flex-col items-center justify-center w-16 h-16 rounded-2xl font-black text-3xl
          border-2 transition-all duration-500
          ${drawnBy === 'human'
            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
            : 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_16px_rgba(96,165,250,0.4)]'
          }
        `}>
          {drawnNumber}
          <span className="text-[10px] font-normal mt-0.5 opacity-70">
            {drawnBy === 'human' ? T.player1.ta : T.computer.ta}
          </span>
        </div>
      )}

      {/* Draw button */}
      {isHumanTurn && (
        <button
          onClick={onDraw}
          className="flex flex-col items-center gap-0.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600
            text-slate-900 font-black px-5 py-3 rounded-2xl transition-all duration-200
            hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30
            hover:shadow-amber-400/50"
        >
          <span className="text-base">{T.draw.en}</span>
          <span className="text-xs font-semibold opacity-80">{T.draw.ta}</span>
        </button>
      )}

      {/* Attack target selection */}
      {isHumanAttack && (
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-red-300 text-xs text-center font-semibold">{T.chooseTarget.en}</p>
          <p className="text-red-400/70 text-[10px] text-center">{T.chooseTarget.ta}</p>
          <div className="flex flex-col gap-1.5 w-full">
            {attackTargets.map(n => (
              <button
                key={n.value}
                onClick={() => onAttackSelect(n.value)}
                className="w-full bg-red-900/30 hover:bg-red-700/50 border border-red-700/60 hover:border-red-500
                  text-red-300 hover:text-red-200 font-bold py-2 px-3 rounded-xl
                  transition-all duration-150 hover:scale-105 active:scale-95
                  text-lg shadow-sm hover:shadow-red-500/20"
              >
                {n.value}
                {n.stage === 5 && (
                  <span className="ml-2 text-xs text-amber-400">({T.armed.en})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Score (easy mode) */}
      {difficulty === 'easy' && (
        <div className="flex gap-3 mt-2 bg-slate-800/60 rounded-xl px-3 py-2 border border-slate-700/50">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-amber-400 text-[10px] font-bold">{T.player1.en}</span>
            <span className="text-amber-500/70 text-[9px]">{T.player1.ta}</span>
            <span className="text-2xl font-black text-amber-300">{humanScore}</span>
          </div>
          <div className="w-px bg-slate-600" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-blue-400 text-[10px] font-bold">{T.computer.en}</span>
            <span className="text-blue-500/70 text-[9px]">{T.computer.ta}</span>
            <span className="text-2xl font-black text-blue-300">{computerScore}</span>
          </div>
        </div>
      )}

      <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-600 to-transparent max-h-8" />
    </div>
  );
}
