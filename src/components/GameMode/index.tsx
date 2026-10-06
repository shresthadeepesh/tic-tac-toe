import React from 'react';
import { Difficulty, IAction, TicTacToeType } from '../../pages/tictactoeReducer';
import SoundToggle from '../SoundToggle';
import { playSound } from '../../utils/sound';

interface IGameModeProps {
  difficulty: Difficulty;
  dispatch: React.Dispatch<IAction>;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Unbeatable' }
];

const GameMode: React.FC<IGameModeProps> = ({ difficulty, dispatch }) => {
  const choose = (action: IAction) => {
    playSound('ui');
    dispatch(action);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="glass w-full max-w-sm animate-fade-up space-y-8 rounded-3xl p-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-light tracking-[0.2em] text-white/90">TIC TAC TOE</h1>
          <p className="text-sm text-white/50">Choose a mode to begin.</p>
        </div>

        <div className="space-y-3">
          <button
            className="glass-button w-full py-3 text-base"
            onClick={() =>
              choose({ type: TicTacToeType.CHOOSE_GAME_MODE, payload: 'singlePlayer' })
            }
          >
            One Player
          </button>
          <button
            className="glass-button w-full py-3 text-base"
            onClick={() => choose({ type: TicTacToeType.CHOOSE_GAME_MODE, payload: 'multiPlayer' })}
          >
            Two Players
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Bot Difficulty</p>
          <div className="flex gap-2">
            {DIFFICULTIES.map(({ value, label }) => (
              <button
                key={value}
                aria-pressed={difficulty === value}
                className={`glass-button flex-1 px-2 text-xs ${
                  difficulty === value ? 'border-white/40 bg-white/15' : ''
                }`}
                onClick={() => choose({ type: TicTacToeType.SET_DIFFICULTY, payload: value })}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/35">
            Difficulty applies to one-player games. You play X and move first.
          </p>
        </div>

        <SoundToggle />
      </div>
    </div>
  );
};

export default GameMode;
