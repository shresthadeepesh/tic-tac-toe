import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {
  findWinner,
  initialState,
  ticTacToeReducer,
  TicTacToeType
} from './pages/tictactoeReducer';
import { getBotMove } from './utils/bot';
import { isMuted, playSound, setMuted } from './utils/sound';

test('renders the game mode picker first', () => {
  render(<App />);
  expect(screen.getByText(/one player/i)).toBeInTheDocument();
  expect(screen.getByText(/two players/i)).toBeInTheDocument();
  expect(screen.getByText(/choose a mode to begin/i)).toBeInTheDocument();
});

test('ignores a click on an occupied square', () => {
  const afterFirst = ticTacToeReducer(initialState, { type: TicTacToeType.PLAY, payload: 0 });
  const afterSecond = ticTacToeReducer(afterFirst, { type: TicTacToeType.PLAY, payload: 0 });
  expect(afterSecond).toBe(afterFirst);
  expect(afterSecond.currentPlayer).toBe('O');
});

test('awards exactly one point for a win', () => {
  const state = [0, 3, 1, 4, 2].reduce(
    (acc, square) => ticTacToeReducer(acc, { type: TicTacToeType.PLAY, payload: square }),
    initialState
  );
  expect(state.winner).toBe('X');
  expect(state.winningLine).toEqual([0, 1, 2]);
  expect(state.score).toEqual({ X: 1, O: 0, draws: 0 });
});

test('detects a draw instead of a winner', () => {
  const state = [0, 1, 2, 4, 3, 5, 7, 6, 8].reduce(
    (acc, square) => ticTacToeReducer(acc, { type: TicTacToeType.PLAY, payload: square }),
    initialState
  );
  expect(state.winner).toBeUndefined();
  expect(state.isDraw).toBe(true);
  expect(state.score.draws).toBe(1);
});

test('undo rewinds the board and takes the point back', () => {
  const won = [0, 3, 1, 4, 2].reduce(
    (acc, square) => ticTacToeReducer(acc, { type: TicTacToeType.PLAY, payload: square }),
    initialState
  );
  const undone = ticTacToeReducer(won, { type: TicTacToeType.UNDO });
  expect(undone.board[2]).toBeNull();
  expect(undone.currentPlayer).toBe('X');
  expect(undone.score).toEqual({ X: 0, O: 0, draws: 0 });
});

test('bot only ever picks an empty square, including square 0', () => {
  const board = [null, 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O'] as const;
  expect(getBotMove([...board], 'O', 'easy')).toBe(0);
  expect(getBotMove([...board], 'O', 'hard')).toBe(0);
});

test('unbeatable bot blocks an immediate loss', () => {
  const board = ['X', 'X', null, null, 'O', null, null, null, null] as const;
  expect(getBotMove([...board], 'O', 'hard')).toBe(2);
  expect(getBotMove([...board], 'O', 'medium')).toBe(2);
});

test('findWinner returns the winning line', () => {
  expect(findWinner(['O', null, null, 'O', null, null, 'O', null, null])).toEqual({
    winner: 'O',
    line: [0, 3, 6]
  });
});

test('sound is a no-op where the Web Audio API is missing', () => {
  expect(() => playSound('win')).not.toThrow();
});

test('the mute preference is remembered', () => {
  setMuted(true);
  expect(isMuted()).toBe(true);
  expect(window.localStorage.getItem('ticTacToe.muted')).toBe('true');
  setMuted(false);
  expect(isMuted()).toBe(false);
});
