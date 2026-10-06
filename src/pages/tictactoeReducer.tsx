export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameMode = 'singlePlayer' | 'multiPlayer';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface IScore {
  X: number;
  O: number;
  draws: number;
}

export interface ITicTacToe {
  board: Cell[];
  history: number[];
  currentPlayer: Player;
  winner?: Player;
  winningLine?: number[];
  isDraw: boolean;
  score: IScore;
  mode?: GameMode;
  difficulty: Difficulty;
  humanPlayer: Player;
}

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const emptyBoard = (): Cell[] => Array<Cell>(9).fill(null);

export const initialState: ITicTacToe = {
  board: emptyBoard(),
  history: [],
  currentPlayer: 'X',
  winner: undefined,
  winningLine: undefined,
  isDraw: false,
  score: { X: 0, O: 0, draws: 0 },
  difficulty: 'hard',
  humanPlayer: 'X'
};

export const findWinner = (board: Cell[]): { winner?: Player; line?: number[] } => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }

  return {};
};

export enum TicTacToeType {
  PLAY = 'PLAY',
  UNDO = 'UNDO',
  NEW_ROUND = 'NEW_ROUND',
  RESET_SCORE = 'RESET_SCORE',
  CHOOSE_GAME_MODE = 'CHOOSE_GAME_MODE',
  BACK_TO_MENU = 'BACK_TO_MENU',
  SET_DIFFICULTY = 'SET_DIFFICULTY'
}

export type IAction =
  | { type: TicTacToeType.PLAY; payload: number }
  | { type: TicTacToeType.UNDO }
  | { type: TicTacToeType.NEW_ROUND }
  | { type: TicTacToeType.RESET_SCORE }
  | { type: TicTacToeType.CHOOSE_GAME_MODE; payload: GameMode }
  | { type: TicTacToeType.BACK_TO_MENU }
  | { type: TicTacToeType.SET_DIFFICULTY; payload: Difficulty };

const freshRound = (state: ITicTacToe): ITicTacToe => ({
  ...state,
  board: emptyBoard(),
  history: [],
  currentPlayer: 'X',
  winner: undefined,
  winningLine: undefined,
  isDraw: false
});

export const ticTacToeReducer = (state: ITicTacToe, action: IAction): ITicTacToe => {
  switch (action.type) {
    case TicTacToeType.CHOOSE_GAME_MODE:
      return { ...freshRound(state), mode: action.payload, score: { X: 0, O: 0, draws: 0 } };

    case TicTacToeType.BACK_TO_MENU:
      return { ...freshRound(state), mode: undefined };

    case TicTacToeType.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload };

    case TicTacToeType.NEW_ROUND:
      return freshRound(state);

    case TicTacToeType.RESET_SCORE:
      return { ...freshRound(state), score: { X: 0, O: 0, draws: 0 } };

    case TicTacToeType.PLAY: {
      const index = action.payload;

      // A finished round, an occupied square or an out-of-range index is a no-op.
      if (state.winner || state.isDraw) return state;
      if (index < 0 || index > 8 || state.board[index]) return state;

      const board = [...state.board];
      board[index] = state.currentPlayer;

      const { winner, line } = findWinner(board);
      const isDraw = !winner && board.every((cell) => cell !== null);

      return {
        ...state,
        board,
        history: [...state.history, index],
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        winningLine: line,
        isDraw,
        score: winner
          ? { ...state.score, [winner]: state.score[winner] + 1 }
          : isDraw
          ? { ...state.score, draws: state.score.draws + 1 }
          : state.score
      };
    }

    case TicTacToeType.UNDO: {
      if (!state.history.length) return state;

      // Against the bot, step back over its reply as well so it stays the human's turn.
      const steps = state.mode === 'singlePlayer' && state.history.length > 1 ? 2 : 1;
      const history = state.history.slice(0, -steps);
      const board = emptyBoard();
      history.forEach((square, move) => {
        board[square] = move % 2 === 0 ? 'X' : 'O';
      });

      const wasDecided = Boolean(state.winner) || state.isDraw;

      return {
        ...state,
        board,
        history,
        currentPlayer: history.length % 2 === 0 ? 'X' : 'O',
        winner: undefined,
        winningLine: undefined,
        isDraw: false,
        // Take back the point the undone round awarded.
        score: !wasDecided
          ? state.score
          : state.winner
          ? { ...state.score, [state.winner]: Math.max(0, state.score[state.winner] - 1) }
          : { ...state.score, draws: Math.max(0, state.score.draws - 1) }
      };
    }

    default:
      return state;
  }
};
