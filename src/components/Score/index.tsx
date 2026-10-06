import React from 'react';
import { IScore } from '../../pages/tictactoeReducer';

interface IScoreProps {
  score: IScore;
  labels: { X: string; O: string };
}

const Score: React.FC<IScoreProps> = ({ score, labels }) => {
  const entries = [
    { key: 'X', label: labels.X, value: score.X, tone: 'text-cyan-200' },
    { key: 'draws', label: 'Draws', value: score.draws, tone: 'text-white/70' },
    { key: 'O', label: labels.O, value: score.O, tone: 'text-fuchsia-200' }
  ];

  return (
    <div className="glass grid grid-cols-3 divide-x divide-white/10 rounded-2xl">
      {entries.map(({ key, label, value, tone }) => (
        <div key={key} className="px-3 py-4 text-center">
          <p className="truncate text-[0.65rem] uppercase tracking-[0.15em] text-white/40">
            {label}
          </p>
          <p className={`mt-1 text-2xl font-light tabular-nums ${tone}`}>{value}</p>
        </div>
      ))}
    </div>
  );
};

export default Score;
