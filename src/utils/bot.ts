import { Cell, Difficulty, findWinner, Player } from '../pages/tictactoeReducer';

const openSquares = (board: Cell[]): number[] =>
  board.reduce<number[]>((acc, cell, index) => (cell ? acc : [...acc, index]), []);

const pickRandom = (squares: number[]): number =>
  squares[Math.floor(Math.random() * squares.length)];

const other = (player: Player): Player => (player === 'X' ? 'O' : 'X');

// Scores the position for `me`, preferring quick wins and slow losses so the
// bot finishes a game it has already won instead of stalling.
const minimax = (board: Cell[], turn: Player, me: Player, depth: number): number => {
  const { winner } = findWinner(board);
  if (winner) return winner === me ? 10 - depth : depth - 10;

  const open = openSquares(board);
  if (!open.length) return 0;

  const scores = open.map((square) => {
    const next = [...board];
    next[square] = turn;
    return minimax(next, other(turn), me, depth + 1);
  });

  return turn === me ? Math.max(...scores) : Math.min(...scores);
};

const bestSquare = (board: Cell[], me: Player): number => {
  const open = openSquares(board);
  let best = open[0];
  let bestScore = -Infinity;

  open.forEach((square) => {
    const next = [...board];
    next[square] = me;
    const score = minimax(next, other(me), me, 1);
    if (score > bestScore) {
      bestScore = score;
      best = square;
    }
  });

  return best;
};

// A square that completes `player`'s line this turn, if there is one.
const winningSquare = (board: Cell[], player: Player): number | undefined =>
  openSquares(board).find((square) => {
    const next = [...board];
    next[square] = player;
    return findWinner(next).winner === player;
  });

export const getBotMove = (board: Cell[], me: Player, difficulty: Difficulty): number => {
  const open = openSquares(board);
  if (!open.length) return -1;

  if (difficulty === 'easy') return pickRandom(open);

  if (difficulty === 'medium') {
    // Take the win, else block, else centre, else corner, else random.
    const win = winningSquare(board, me);
    if (win !== undefined) return win;

    const block = winningSquare(board, other(me));
    if (block !== undefined) return block;

    if (!board[4]) return 4;

    const corners = [0, 2, 6, 8].filter((square) => !board[square]);
    if (corners.length) return pickRandom(corners);

    return pickRandom(open);
  }

  return bestSquare(board, me);
};
