import React from 'react';

interface ILogProps {
  history: number[];
  labels: { X: string; O: string };
}

const Log: React.FC<ILogProps> = ({ history, labels }) => {
  const entries = history
    .map((square, move) => ({
      move,
      who: move % 2 === 0 ? labels.X : labels.O,
      mark: move % 2 === 0 ? 'X' : 'O',
      square: square + 1
    }))
    .reverse();

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-white/40">Move History</p>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-white/40">No moves have been played yet.</p>
      ) : (
        <ol className="mt-3 max-h-44 space-y-1.5 overflow-y-auto pr-1 text-sm">
          {entries.map((entry) => (
            <li
              key={entry.move}
              className="flex animate-flash-up items-center justify-between gap-3 text-white/60"
            >
              <span className="truncate">
                <span className={entry.mark === 'X' ? 'text-cyan-200' : 'text-fuchsia-200'}>
                  {entry.mark}
                </span>{' '}
                {entry.who}
              </span>
              <span className="tabular-nums text-white/35">Square {entry.square}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Log;
