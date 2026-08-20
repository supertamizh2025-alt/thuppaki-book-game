import { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { T } from '../translations';

interface GameLogProps {
  entries: LogEntry[];
}

const TYPE_STYLES: Record<LogEntry['type'], string> = {
  draw: 'text-slate-300',
  build: 'text-emerald-400',
  arm: 'text-amber-300 font-semibold',
  attack: 'text-red-300 font-semibold',
  eliminate: 'text-red-400 font-bold',
  skip: 'text-slate-500 italic',
  win: 'text-yellow-300 font-black text-sm',
  info: 'text-slate-400',
};

const TYPE_DOT: Record<LogEntry['type'], string> = {
  draw: 'bg-slate-500',
  build: 'bg-emerald-500',
  arm: 'bg-amber-400',
  attack: 'bg-red-400',
  eliminate: 'bg-red-600',
  skip: 'bg-slate-600',
  win: 'bg-yellow-400',
  info: 'bg-slate-600',
};

export default function GameLog({ entries }: GameLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [entries.length]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-300 text-sm font-semibold">{T.gameLog.en}</span>
        <span className="text-slate-500 text-xs">/ {T.gameLog.ta}</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      <div
        ref={containerRef}
        className="h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
      >
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={`
              flex items-start gap-2 text-xs px-2 py-1.5 rounded-lg
              transition-all duration-300
              ${i === 0 ? 'bg-slate-800/80' : 'bg-slate-800/30'}
              ${TYPE_STYLES[entry.type]}
            `}
          >
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_DOT[entry.type]}`} />
            <div className="flex-1 min-w-0">
              <div className="leading-tight">{entry.english}</div>
              <div className="text-slate-500 mt-0.5 leading-tight">{entry.tamil}</div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center text-slate-600 text-xs pt-4">
            No events yet / இன்னும் நிகழ்வுகள் இல்லை
          </div>
        )}
      </div>
    </div>
  );
}
