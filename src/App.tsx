import React from 'react';
import TicTacToe from './pages/tictactoe';

const App = () => {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span className="-left-24 -top-24 h-[28rem] w-[28rem] animate-drift bg-indigo-500" />
        <span
          className="-right-32 top-1/4 h-[32rem] w-[32rem] animate-drift bg-fuchsia-500"
          style={{ animationDelay: '-6s' }}
        />
        <span
          className="-bottom-40 left-1/3 h-[30rem] w-[30rem] animate-drift bg-cyan-500"
          style={{ animationDelay: '-12s' }}
        />
      </div>
      <TicTacToe />
    </>
  );
};

export default App;
