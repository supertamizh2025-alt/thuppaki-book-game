import { useState } from 'react';
import { Difficulty } from '../types';
import { T } from '../translations';
import StickFigure from './StickFigure';

interface SetupScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { key: Difficulty; label: typeof T.easy; desc: typeof T.easyDesc; color: string; border: string; glow: string }[] = [
  { key: 'easy', label: T.easy, desc: T.easyDesc, color: 'bg-emerald-900/30', border: 'border-emerald-600', glow: 'shadow-emerald-500/20' },
  { key: 'medium', label: T.medium, desc: T.mediumDesc, color: 'bg-amber-900/30', border: 'border-amber-600', glow: 'shadow-amber-500/20' },
  { key: 'hard', label: T.hard, desc: T.hardDesc, color: 'bg-red-900/30', border: 'border-red-700', glow: 'shadow-red-500/20' },
];

const FIGURE_STAGES = [1, 2, 3, 4, 5] as const;
const STAGE_LABELS = [T.head, T.body, T.legs, T.hands, T.gun];

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [selected, setSelected] = useState<Difficulty>('medium');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent">
            {T.title.en}
          </h1>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>
        <p className="text-amber-500/80 text-2xl font-semibold tracking-widest mb-2">{T.title.ta}</p>
        <p className="text-slate-400 text-sm">{T.subtitle.en} · {T.subtitle.ta}</p>
      </div>

      {/* Figure stages preview */}
      <div className="flex items-end gap-4 mb-10 bg-slate-800/50 rounded-2xl px-6 py-4 border border-slate-700/50">
        {FIGURE_STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-col items-center gap-1">
            <StickFigure
              stage={stage}
              isArmed={stage === 5}
              isDead={false}
              isEliminated={false}
              isHighlighted={false}
              side="human"
            />
            <span className="text-amber-400/70 text-[10px] font-semibold">{STAGE_LABELS[i].ta}</span>
          </div>
        ))}
      </div>

      {/* Difficulty selection */}
      <div className="w-full max-w-lg">
        <div className="text-center mb-4">
          <p className="text-slate-300 text-sm font-semibold">{T.selectDifficulty.en}</p>
          <p className="text-slate-500 text-xs">{T.selectDifficulty.ta}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {DIFFICULTIES.map(({ key, label, desc, color, border, glow }) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
                ${selected === key
                  ? `${color} ${border} shadow-lg ${glow} scale-105`
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/70'
                }
              `}
            >
              <span className={`text-lg font-black ${
                key === 'easy' ? 'text-emerald-400' :
                key === 'medium' ? 'text-amber-400' : 'text-red-400'
              }`}>{label.en}</span>
              <span className={`text-xs ${
                key === 'easy' ? 'text-emerald-500/80' :
                key === 'medium' ? 'text-amber-500/80' : 'text-red-500/80'
              }`}>{label.ta}</span>
              <p className="text-slate-400 text-[10px] text-center leading-relaxed mt-1">{desc.en}</p>
            </button>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={() => onStart(selected)}
          className="w-full flex flex-col items-center bg-amber-500 hover:bg-amber-400 active:bg-amber-600
            text-slate-900 font-black py-4 rounded-2xl transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/30
            hover:shadow-amber-400/40 text-lg"
        >
          <span>{T.startGame.en}</span>
          <span className="text-sm font-semibold opacity-80">{T.startGame.ta}</span>
        </button>
      </div>

      {/* Instructions mini */}
      <div className="mt-8 max-w-sm text-center">
        <p className="text-slate-500 text-xs leading-relaxed">
          Player 1 has odd numbers (1,3,5,7,9) · Computer has even numbers (0,2,4,6,8)<br/>
          வீரர் 1: ஒற்றை எண்கள் · கணினி: இரட்டை எண்கள்
        </p>
        <p className="text-slate-600 text-[11px] mt-2">
          Draw numbers to build your stick figure. Once fully armed, draw again to ATTACK!<br/>
          படத்தை கட்ட எண்களை எடுங்கள். ஆயுதமேந்தியதும் மீண்டும் எடுத்தால் தாக்குதல்!
        </p>
      </div>
    </div>
  );
}
