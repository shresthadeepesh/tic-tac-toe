import React from 'react';
import { IAction, Player, TicTacToeType } from '../../pages/tictactoeReducer';

interface IStatusProps {
  open: boolean;
  winner?: Player;
  isDraw: boolean;
  moves: number;
  labels: { X: string; O: string };
  // True when the bot has just beaten the player, which changes the wording.
  playerLost: boolean;
  dispatch: React.Dispatch<IAction>;
}

// Full-screen frosted overlay shown once a round is decided.
const Status: React.FC<IStatusProps> = ({
  open,
  winner,
  isDraw,
  moves,
  labels,
  playerLost,
  dispatch
}) => {
  if (!open || (!winner && !isDraw)) return null;

  const headline = () => {
    if (!winner) return 'It is a draw';
    if (playerLost) return 'The bot wins this round';
    return `${labels[winner]} ${labels[winner] === 'You' ? 'win' : 'wins'} this round`;
  };

  const detail = () => {
    if (!winner) return 'Every square is filled and neither player got three in a row.';
    return `Won in ${moves} ${moves === 1 ? 'move' : 'moves'}.`;
  };

  return (
    <div
      role="alertdialog"
      aria-label="Round result"
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/50 p-6 backdrop-blur-md"
    >
      <div
        className={`glass w-full max-w-sm space-y-6 rounded-3xl p-8 text-center ${
          playerLost ? 'animate-shake' : 'animate-flash-up'
        }`}
      >
        {winner ? (
          <div className="space-y-2">
            <p
              className={`text-6xl font-light ${
                winner === 'X' ? 'text-cyan-200' : 'text-fuchsia-200'
              }`}
              style={{ textShadow: '0 0 28px currentColor' }}
            >
              {winner}
            </p>
            <h2 className="text-xl font-light text-white/90">{headline()}</h2>
            <p className="text-sm text-white/45">{detail()}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-light text-white/90">{headline()}</h2>
            <p className="text-sm text-white/45">{detail()}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="glass-button flex-1 py-3"
            onClick={() => dispatch({ type: TicTacToeType.NEW_ROUND })}
          >
            Play Again
          </button>
          <button
            className="glass-button flex-1 py-3"
            onClick={() => dispatch({ type: TicTacToeType.UNDO })}
          >
            Undo Last Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default Status;
