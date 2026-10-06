import React from 'react';
import { Cell } from '../../pages/tictactoeReducer';

interface ISquareProps {
  index: number;
  value: Cell;
  disabled: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onClick: (index: number) => void;
}

const Square: React.FC<ISquareProps> = ({
  index,
  value,
  disabled,
  highlighted,
  dimmed,
  onClick
}) => {
  const playable = !value && !disabled;

  return (
    <button
      type="button"
      aria-label={`Square ${index + 1}: ${value ? value : 'empty'}`}
      disabled={!playable}
      onClick={() => onClick(index)}
      className={`group relative flex aspect-square items-center justify-center rounded-2xl
        border border-white/10 bg-white/5 transition duration-300
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-white/50
        ${
          playable
            ? 'cursor-pointer hover:border-white/25 hover:bg-white/10 active:scale-95'
            : 'cursor-default'
        }
        ${highlighted ? 'border-white/40 bg-white/15' : ''}
        ${dimmed ? 'opacity-40' : ''}`}
    >
      {value && (
        <span
          className={`animate-mark-in text-5xl font-light tracking-tight sm:text-6xl ${
            value === 'X' ? 'text-cyan-200' : 'text-fuchsia-200'
          }`}
          style={{ textShadow: '0 0 24px currentColor' }}
        >
          <span className={`block ${highlighted ? 'animate-win-pulse' : ''}`}>{value}</span>
        </span>
      )}
      {playable && (
        <span className="text-4xl font-light text-white/0 transition duration-300 group-hover:text-white/15">
          +
        </span>
      )}
    </button>
  );
};

export default Square;
