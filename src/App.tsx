import { useGame } from './hooks/useGame';
import SetupScreen from './components/SetupScreen';
import GameBoard from './components/GameBoard';

export default function App() {
  const { state, startGame, drawNumber, selectAttackTarget, resetGame } = useGame();

  if (state.phase === 'setup') {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <GameBoard
      state={state}
      onDraw={drawNumber}
      onAttackSelect={selectAttackTarget}
      onReset={resetGame}
    />
  );
}
