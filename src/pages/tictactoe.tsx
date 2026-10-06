import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { IAction, initialState, ticTacToeReducer, TicTacToeType } from './tictactoeReducer';
import { getBotMove } from '../utils/bot';
import { playSound } from '../utils/sound';
import ChooseGameMode from '../components/GameMode';
import Board from '../components/Board';
import Log from '../components/Log';
import Score from '../components/Score';
import Status from '../components/Status';
import SoundToggle from '../components/SoundToggle';

const BOT_DELAY = 420;
// Long enough for the last mark to finish its 260ms entry and for the winning
// line to read before the overlay covers the board.
const RESULT_DELAY = 900;
// Matches the shake and nudge keyframe durations.
const SHAKE_DURATION = 620;
const NUDGE_DURATION = 340;

const TicTacToe = () => {
  const [state, dispatch] = useReducer(ticTacToeReducer, initialState);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [rejected, setRejected] = useState(false);
  const rejectTimer = useRef<number>();
  const {
    board,
    history,
    currentPlayer,
    winner,
    winningLine,
    isDraw,
    score,
    mode,
    difficulty,
    humanPlayer
  } = state;

  const labels = useMemo(
    () => (mode === 'singlePlayer' ? { X: 'You', O: 'Bot' } : { X: 'Player X', O: 'Player O' }),
    [mode]
  );

  const decided = Boolean(winner) || isDraw;
  const botTurn = mode === 'singlePlayer' && !decided && currentPlayer !== humanPlayer;
  const frozen = decided || botTurn;
  const playerLost = Boolean(winner) && mode === 'singlePlayer' && winner !== humanPlayer;

  // The round is over the moment the move lands, so the result sound and the
  // screen shake fire straight away while the overlay is held back; otherwise
  // it would cover the deciding mark mid-animation.
  useEffect(() => {
    if (!decided) {
      setShowResult(false);
      setShaking(false);
      return;
    }

    playSound(isDraw ? 'draw' : playerLost ? 'lose' : 'win');

    const timers = [window.setTimeout(() => setShowResult(true), RESULT_DELAY)];

    if (playerLost) {
      setShaking(true);
      timers.push(window.setTimeout(() => setShaking(false), SHAKE_DURATION));
    }

    return () => timers.forEach(clearTimeout);
  }, [decided, isDraw, playerLost]);

  useEffect(() => () => clearTimeout(rejectTimer.current), []);

  const play = useCallback(
    (index: number) => {
      // A tap the rules will not accept gets a wobble rather than silence.
      if (frozen || board[index]) {
        clearTimeout(rejectTimer.current);
        setRejected(true);
        rejectTimer.current = window.setTimeout(() => setRejected(false), NUDGE_DURATION);
        return;
      }

      playSound(currentPlayer === 'X' ? 'placeX' : 'placeO');
      dispatch({ type: TicTacToeType.PLAY, payload: index });
    },
    [frozen, board, currentPlayer]
  );

  // Fires a sound alongside the dispatch for the controls that are not moves.
  const run = useCallback((action: IAction, sound: 'ui' | 'undo' = 'ui') => {
    playSound(sound);
    dispatch(action);
  }, []);

  // The bot reads the board straight from state, so it can never land on a
  // square the player just took.
  useEffect(() => {
    if (!botTurn) return;

    const timer = setTimeout(() => {
      const square = getBotMove(board, currentPlayer, difficulty);
      if (square >= 0) {
        playSound(currentPlayer === 'X' ? 'placeX' : 'placeO');
        dispatch({ type: TicTacToeType.PLAY, payload: square });
      }
    }, BOT_DELAY);

    return () => clearTimeout(timer);
  }, [botTurn, board, currentPlayer, difficulty]);

  // Keys 1 to 9 map to the board, reading left to right and top to bottom.
  useEffect(() => {
    if (!mode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const square = Number(event.key) - 1;
      if (Number.isInteger(square) && square >= 0 && square <= 8) play(square);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, play]);

  if (!mode) {
    return <ChooseGameMode difficulty={difficulty} dispatch={dispatch} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-5 sm:p-8">
      <Status
        open={showResult}
        winner={winner}
        isDraw={isDraw}
        moves={history.length}
        labels={labels}
        playerLost={playerLost}
        dispatch={dispatch}
      />

      <div
        className={`grid w-full max-w-4xl animate-fade-up gap-6 md:grid-cols-[20rem_1fr]
          md:items-start ${shaking ? 'animate-shake' : ''}`}
      >
        <div className="order-2 space-y-4 md:order-1">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-sm uppercase tracking-[0.25em] text-white/50">Tic Tac Toe</h1>
            <div className="flex gap-2">
              <SoundToggle />
              <button
                className="glass-button px-3 py-1.5 text-xs"
                onClick={() => run({ type: TicTacToeType.BACK_TO_MENU })}
              >
                Main Menu
              </button>
            </div>
          </div>

          <Score score={score} labels={labels} />

          <div className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-white/40">
                Current Turn
              </p>
              <p className="text-lg font-light text-white/90">
                <span className={currentPlayer === 'X' ? 'text-cyan-200' : 'text-fuchsia-200'}>
                  {currentPlayer}
                </span>{' '}
                {labels[currentPlayer]}
              </p>
            </div>
            {botTurn && (
              <span className="animate-pulse text-xs text-white/50">The bot is thinking…</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              className="glass-button flex-1"
              disabled={!history.length}
              onClick={() => run({ type: TicTacToeType.UNDO }, 'undo')}
            >
              Undo
            </button>
            <button
              className="glass-button flex-1"
              disabled={!history.length}
              onClick={() => run({ type: TicTacToeType.NEW_ROUND })}
            >
              New Round
            </button>
            <button
              className="glass-button flex-1"
              onClick={() => run({ type: TicTacToeType.RESET_SCORE })}
            >
              Reset Scores
            </button>
          </div>

          <Log history={history} labels={labels} />
        </div>

        <div className="order-1 md:order-2">
          <Board
            board={board}
            winningLine={winningLine}
            frozen={frozen}
            rejected={rejected}
            onSquareClick={play}
          />
        </div>
      </div>
    </main>
  );
};

export default TicTacToe;
