interface StickFigureProps {
  stage: number;       // 0–5
  isArmed: boolean;    // stage === 5
  isDead: boolean;     // hard mode: eliminated but still in pool
  isEliminated: boolean; // medium: gone
  isHighlighted: boolean;
  side: 'human' | 'computer';
}

export default function StickFigure({ stage, isArmed, isDead, isEliminated, isHighlighted, side }: StickFigureProps) {
  if (isEliminated) {
    return (
      <div className="w-[72px] h-[108px] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center">
          <span className="text-slate-600 text-xl font-bold">✕</span>
        </div>
      </div>
    );
  }

  const baseColor = side === 'human' ? '#f59e0b' : '#60a5fa';
  const armedColor = '#fbbf24';
  const deadColor = '#6b7280';
  const highlightColor = side === 'human' ? '#fde68a' : '#bfdbfe';

  const stroke = isDead ? deadColor : isArmed ? armedColor : isHighlighted ? highlightColor : baseColor;
  const sw = 2.8;
  const glowFilter = isArmed && !isDead ? 'drop-shadow(0 0 6px rgba(251,191,36,0.9))' : undefined;

  if (stage === 0) {
    return <div className="w-[72px] h-[108px]" />;
  }

  return (
    <svg
      viewBox="0 0 80 120"
      width="72"
      height="108"
      style={{ filter: glowFilter }}
      className="transition-all duration-300"
    >
      {/* Head */}
      {stage >= 1 && (
        <circle cx="40" cy="18" r="12" stroke={stroke} fill="none" strokeWidth={sw} strokeLinecap="round" />
      )}

      {/* Body */}
      {stage >= 2 && (
        <line x1="40" y1="30" x2="40" y2="74" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      )}

      {/* Legs */}
      {stage >= 3 && (
        <>
          <line x1="40" y1="74" x2="24" y2="104" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="40" y1="74" x2="56" y2="104" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}

      {/* Hands */}
      {stage >= 4 && (
        <>
          <line x1="40" y1="50" x2="18" y2="65" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="40" y1="50" x2="63" y2="58" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}

      {/* Gun (from right hand tip) */}
      {stage >= 5 && (
        <>
          {/* Barrel */}
          <line x1="63" y1="58" x2="79" y2="53" stroke={stroke} strokeWidth={3.2} strokeLinecap="round" />
          {/* Body of gun */}
          <rect x="62" y="56" width="10" height="6" rx="1" fill={stroke} opacity={0.9} />
          {/* Trigger guard */}
          <line x1="67" y1="62" x2="67" y2="69" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
          {/* Grip */}
          <line x1="63" y1="62" x2="66" y2="68" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {/* Dead X overlay */}
      {isDead && (
        <>
          <line x1="15" y1="5" x2="65" y2="115" stroke="#ef4444" strokeWidth={2} opacity={0.55} strokeLinecap="round" />
          <line x1="65" y1="5" x2="15" y2="115" stroke="#ef4444" strokeWidth={2} opacity={0.55} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
