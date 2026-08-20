import StickFigure from './StickFigure';
import { NumberState } from '../types';
import { T } from '../translations';

interface NumberRowProps {
  num: NumberState;
  side: 'human' | 'computer';
  isHighlighted: boolean;
  isAttackTarget: boolean;
  onAttackSelect?: (value: number) => void;
}

export default function NumberRow({ num, side, isHighlighted, isAttackTarget, onAttackSelect }: NumberRowProps) {
  const isArmed = num.stage === 5 && !num.eliminated;
  const isDead = num.eliminated; // used in hard mode display

  const numberBadge = (
    <div className={`
      relative flex flex-col items-center justify-center w-14 h-14 rounded-xl font-black text-2xl
      transition-all duration-300 select-none
      ${num.eliminated
        ? 'bg-slate-700/40 text-slate-600 border border-slate-600'
        : isArmed
          ? 'bg-amber-400/20 text-amber-300 border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
          : isHighlighted
            ? side === 'human'
              ? 'bg-amber-500/30 text-amber-200 border-2 border-amber-400'
              : 'bg-blue-500/30 text-blue-200 border-2 border-blue-400'
            : side === 'human'
              ? 'bg-amber-900/40 text-amber-400 border border-amber-700/50'
              : 'bg-blue-900/40 text-blue-400 border border-blue-700/50'
      }
    `}>
      {num.value}
      {isArmed && (
        <span className="absolute -top-2 -right-1 text-[9px] font-bold text-amber-400 bg-slate-900 px-1 rounded-full leading-tight border border-amber-500">
          {T.armed.ta}
        </span>
      )}
      {isDead && !isArmed && (
        <span className="absolute -top-2 -right-1 text-[8px] font-bold text-red-400 bg-slate-900 px-1 rounded-full leading-tight border border-red-600">
          {T.dead.ta}
        </span>
      )}
    </div>
  );

  const figureCell = (
    <div className={`
      flex items-center justify-center w-20 h-[108px] rounded-lg transition-all duration-300
      ${isAttackTarget
        ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-slate-900 bg-red-900/20 cursor-pointer hover:bg-red-900/40'
        : isHighlighted
          ? side === 'human'
            ? 'bg-amber-900/20 ring-1 ring-amber-500/40'
            : 'bg-blue-900/20 ring-1 ring-blue-500/40'
          : 'bg-transparent'
      }
    `}
      onClick={isAttackTarget && onAttackSelect ? () => onAttackSelect(num.value) : undefined}
    >
      <StickFigure
        stage={num.stage}
        isArmed={isArmed}
        isDead={isDead}
        isEliminated={false}
        isHighlighted={isHighlighted}
        side={side}
      />
    </div>
  );

  return (
    <div className={`
      flex items-center gap-2 px-2 py-1 rounded-xl transition-all duration-300
      ${isHighlighted
        ? side === 'human'
          ? 'bg-amber-900/15'
          : 'bg-blue-900/15'
        : ''
      }
      ${isAttackTarget ? 'ring-1 ring-red-500/50' : ''}
    `}>
      {side === 'human' ? (
        <>
          {numberBadge}
          {figureCell}
        </>
      ) : (
        <>
          {figureCell}
          {numberBadge}
        </>
      )}
    </div>
  );
}
