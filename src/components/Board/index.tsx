import React from 'react';
import Square from '../Square';
import { Cell } from '../../pages/tictactoeReducer';

interface IBoardProps {
  board: Cell[];
  winningLine?: number[];
  frozen: boolean;
  // Set briefly when a tap cannot be played, so the board can wobble in reply.
  rejected: boolean;
  onSquareClick: (index: number) => void;
}

const Board: React.FC<IBoardProps> = ({ board, winningLine, frozen, rejected, onSquareClick }) => {
  return (
    <div className={`glass rounded-3xl p-3 sm:p-4 ${rejected ? 'animate-nudge' : ''}`}>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {board.map((value, index) => (
          <Square
            key={index}
            index={index}
            value={value}
            disabled={frozen}
            highlighted={Boolean(winningLine?.includes(index))}
            dimmed={Boolean(winningLine && !winningLine.includes(index))}
            onClick={onSquareClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
