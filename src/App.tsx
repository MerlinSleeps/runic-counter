import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Settings, 
  X, 
  Users, 
  RefreshCw 
} from 'lucide-react';


export default function App() {

  const [playerCount, setPlayerCount] = useState<number>(2);
  
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const handleIncrement = (index: number) => {
    setScores(prevScores => 
      prevScores.map((score, i) => (i === index ? score + 1 : score))
    );
  };

  const handleDecrement = (index: number) => {
    setScores(prevScores =>
      prevScores.map((score, i) => (i === index ? Math.max(0, score - 1) : score))
    );
  };

  const handleResetGame = () => {
    setScores([0, 0, 0, 0]);
    setShowSettings(false);
  };

  const handleSetPlayerCount = (count: number) => {
    setPlayerCount(count);
    handleResetGame(); // Reset scores when player count changes
    setShowSettings(false);
  };

  const getGridClass = () => {
    switch (playerCount) {
      case 1:
        return 'grid-cols-1 grid-rows-1';
      case 2:
        return 'grid-cols-1 grid-rows-2';
      case 3:
        return 'grid-cols-2 grid-rows-2'; // 1 top, 2 bottom
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-1 grid-rows-2';
    }
  };


  const getPlayerClass = (index: number) => {
    let classes = 'relative flex flex-col items-center justify-around p-4 border-yellow-500/30';
    
    if (playerCount === 2) {
      if (index === 0) classes += ' rotate-180 border-b';
    } else if (playerCount === 3) {
      if (index === 0) classes += ' col-span-2 border-b rotate-180';
      if (index === 1) classes += ' border-r';
    } else if (playerCount === 4) {
      if (index === 0) classes += ' border-r border-b rotate-180';
      if (index === 1) classes += ' border-b rotate-180';
      if (index === 2) classes += ' border-r';
    }
    
    return classes;
  };


  return (
    <main className="fixed inset-0 bg-gray-900 text-white font-sans select-none">
      
      <div className={`h-full w-full grid ${getGridClass()}`}>
        {scores.slice(0, playerCount).map((score, index) => (
          <div key={index} className={getPlayerClass(index)}>
            
            <span className="text-xl md:text-2xl font-bold text-yellow-400 opacity-80 tracking-wider">
              PLAYER {index + 1}
            </span>
            
            <span 
              className={`font-black text-8xl md:text-9xl ${
                score >= 8 ? 'text-yellow-400' : 'text-white'
              } transition-colors duration-200`}
              style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
            >
              {score}
            </span>
            
            <div className="flex gap-4 md:gap-8">
              <button
                onClick={() => handleDecrement(index)}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                           bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200
                           active:transform active:scale-90"
                aria-label={`Decrement Player ${index + 1} score`}
              >
                <Minus size={48} />
              </button>
              <button
                onClick={() => handleIncrement(index)}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                           bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200
                           active:transform active:scale-90"
                aria-label={`Increment Player ${index + 1} score`}
              >
                <Plus size={48} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-3 bg-gray-800/80 rounded-full text-yellow-400
                   hover:bg-gray-700/80 transition-all duration-200 z-10"
        aria-label="Open Settings"
      >
        <Settings size={28} />
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm 
                       border border-yellow-500/50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
                aria-label="Close Settings"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-3">
                  <Users size={16} className="inline-block mr-2 -mt-1" />
                  Select Players
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleSetPlayerCount(count)}
                      className={`p-4 rounded-lg font-bold text-xl transition-all duration-200
                                  ${
                                    playerCount === count
                                      ? 'bg-yellow-500 text-gray-900 ring-2 ring-yellow-300'
                                      : 'bg-gray-700 text-white hover:bg-gray-600'
                                  }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-500 mb-3">
                  <RefreshCw size={16} className="inline-block mr-2 -mt-1" />
                  Game Actions
                </label>
                <button
                  onClick={handleResetGame}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-lg 
                             bg-red-600/90 text-white font-bold text-lg
                             hover:bg-red-500 transition-all duration-200"
                >
                  <RefreshCw size={20} />
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}