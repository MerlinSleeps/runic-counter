import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Settings, 
  X, 
  Users, 
  RefreshCw,
  Gem 
} from 'lucide-react';

const RUNE_DATA = {
  Fury: 'text-red-500',
  Calm: 'text-green-500',
  Body: 'text-orange-500',
  Order: 'text-yellow-400',
  Mind: 'text-blue-400',
  Chaos: 'text-purple-500',
};

const RUNE_NAMES = Object.keys(RUNE_DATA);

function getFromStorage<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved) as T;
  }
  return defaultValue;
}

export default function App() {

  const [playerCount, setPlayerCount] = useState<number>(() => 
    getFromStorage('runicCounterPlayerCount', 2)
  );
  
  const [scores, setScores] = useState<number[]>(() => 
    getFromStorage('runicCounterScores', [0, 0, 0, 0])
  );
  
  const isGameInWinningState = scores.some(score => score >= 8);

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [playerRunes, setPlayerRunes] = useState<string[][]>([[], [], [], []]);

  const [showRuneModalFor, setShowRuneModalFor] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('runicCounterPlayerCount', JSON.stringify(playerCount));
  }, [playerCount]);

  useEffect(() => {
    localStorage.setItem('runicCounterScores', JSON.stringify(scores));
  }, [scores]);
  
  const handleIncrement = (index: number) => {
    setScores(prevScores => 
      prevScores.map((score, i) => (i === index ? Math.min(11, score + 1) : score))
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
    handleResetGame();
    setShowSettings(false);
  };

  const getGridClass = () => {
    switch (playerCount) {
      case 1:
        return 'grid-cols-1 grid-rows-1';
      case 2:
        return 'grid-cols-1 grid-rows-2';
      case 3:
        return 'grid-cols-2 grid-rows-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-1 grid-rows-2';
    }
  };


const getPlayerClass = (index: number) => {
    let classes = 'relative flex flex-col items-center justify-around p-4 bg-transparent border border-arcane-gold/30 transition-all duration-300';
    
    if (scores[index] >= 8) {
      classes += ' shadow-glow-blue';
    }

    if (playerCount === 2) {
      if (index === 0) classes += ' rotate-180';
    } else if (playerCount === 3) {
      if (index === 0) classes += ' col-span-2 rotate-180';
    } else if (playerCount === 4) {
      if (index === 0) classes += ' rotate-180';
      if (index === 1) classes += ' rotate-180';
    }
    
    return classes;
  };


return (
  <main className="fixed inset-0 text-arcane-gold font-arcane select-none bg-gradient-arcane">
      <div className={`h-full w-full grid ${getGridClass()} gap-1 bg-transparent`}>
        {scores.slice(0, playerCount).map((score, index) => (
          <div key={index} className={getPlayerClass(index)}>
            
            <button 
              onClick={() => setShowRuneModalFor(index)}
              className="text-xl md:text-2xl text-arcane-gold/70 tracking-[.2em] uppercase
                        hover:text-hextech-blue transition-colors duration-200">
              Player {index + 1}
            </button>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={score}

                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}

                className={`font-arcane font-black text-8xl md:text-9xl ${
                  score >= 8
                    ? 'text-hextech-blue text-shadow-glow-blue' // Winning glow
                    : 'text-arcane-gold text-shadow-glow-gold' // Base score glow
                }`}
              >
                {score}
              </motion.span>
            </AnimatePresence>
            
            <div className="absolute top-4 left-4 flex gap-2">
                  {playerRunes[index].map((runeName) => (
                    <Gem 
                      key={runeName} 
                      className={`w-6 h-6 ${RUNE_DATA[runeName as keyof typeof RUNE_DATA]} opacity-80`} 
                      strokeWidth={3} 
                    />
                  ))}
                </div>

            <div className="flex gap-4 md:gap-8">
              <button
                onClick={() => handleDecrement(index)}
                className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center
                          clip-[polygon(0%_15%,_15%_0%,_85%_0%,_100%_15%,_100%_85%,_85%_100%,_15%_100%,_0%_85%)]
                          bg-arcane-dark/50 text-arcane-gold/70 border-2 border-arcane-gold/30
                          hover:bg-arcane-dark hover:border-arcane-gold/70 transition-all duration-200
                          active:transform active:scale-90"
                aria-label={`Decrement Player ${index + 1} score`}
              >
                <Minus size={48} />
              </button>

              <button
                onClick={() => handleIncrement(index)}
                className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center
                          clip-[polygon(0%_15%,_15%_0%,_85%_0%,_100%_15%,_100%_85%,_85%_100%,_15%_100%,_0%_85%)]
                          bg-arcane-dark/50 text-arcane-gold/70 border-2 border-arcane-gold/30
                          hover:bg-arcane-dark hover:border-arcane-gold/70 transition-all duration-200
                          active:transform active:scale-90"
                aria-label={`Increment Player ${index + 1} score`}
              >
                <Plus size={48} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`absolute 
                   ${playerCount === 1 ? 'top-4 right-4' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
                   p-0.5 
                   btn-octagon 
                   transition-all duration-200 z-10
                   ${isGameInWinningState 
                     ? 'bg-hextech-blue shadow-glow-blue' 
                     : 'bg-arcane-gold shadow-glow-gold hover:bg-hextech-blue hover:shadow-glow-blue'
                   }`}>
        <button
          onClick={() => setShowSettings(true)}
          className={`p-3 
                     bg-arcane-plate 
                     btn-octagon 
                     transition-all duration-200
                     ${isGameInWinningState 
                       ? 'text-hextech-blue' 
                       : 'text-arcane-gold hover:text-hextech-blue'
                     }`}
          aria-label="Open Settings"
        >
          <Settings size={28} />
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-arcane-plate rounded-2xl shadow-xl w-full max-w-sm 
                       border-2 border-arcane-gold/50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-arcane-gold/20">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-arcane-dark hover:text-white"
                aria-label="Close Settings"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-arcane-gold mb-3">
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
                                      ? 'bg-arcane-gold text-arcane-dark ring-2 ring-hextech-blue'
                                      : 'bg-arcane-dark text-white hover:bg-arcane-dark/70 border border-arcane-gold/30'
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

      {showRuneModalFor !== null && (
        <div 
          // This is the background overlay
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRuneModalFor(null)} // Close modal on background click
        >
          <div 
            // This is the modal content. We stop the background click from closing it.
            className="bg-arcane-plate rounded-2xl shadow-xl w-full max-w-sm 
                       border-2 border-arcane-gold/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside it
          >
            {/* --- Modal Header --- */}
            <div className="flex justify-between items-center p-5 border-b border-arcane-gold/20">
              <h2 className="text-2xl font-bold text-white">Player {showRuneModalFor + 1} Runes</h2>
              <button
                onClick={() => setShowRuneModalFor(null)}
                className="p-2 rounded-lg text-gray-400 hover:bg-arcane-dark hover:text-white"
                aria-label="Close Rune Selector"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Modal Body (Rune Grid) --- */}
            <div className="p-5">
              <label className="block text-sm font-medium text-arcane-gold mb-3">
                Select exactly 2 runes:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {RUNE_NAMES.map((runeName) => {
                  const isSelected = playerRunes[showRuneModalFor].includes(runeName);
                  const canSelect = playerRunes[showRuneModalFor].length < 2;

                  return (
                    <button
                      key={runeName}
                      onClick={() => {
                        // This logic handles selection/deselection and the 2-rune limit
                        setPlayerRunes(currentRunes => {
                          const newRunes = [...currentRunes];
                          const runesForThisPlayer = newRunes[showRuneModalFor];

                          if (isSelected) {
                            // De-select: Remove it
                            newRunes[showRuneModalFor] = runesForThisPlayer.filter(r => r !== runeName);
                          } else if (canSelect) {
                            // Select: Add it
                            newRunes[showRuneModalFor] = [...runesForThisPlayer, runeName];
                          }
                          // If 2 are already selected and not de-selecting, do nothing.
                          return newRunes;
                        });
                      }}
                      className={`p-4 rounded-lg font-arcane text-lg font-bold transition-all duration-200
                                  border ${RUNE_DATA[runeName as keyof typeof RUNE_DATA]}
                                  ${isSelected
                                    ? 'bg-arcane-gold/20 border-arcane-gold text-shadow-glow-gold' // Selected state
                                    : 'bg-arcane-dark border-arcane-gold/30 opacity-70 hover:opacity-100' // Default state
                                  }
                                  ${!isSelected && !canSelect && 'opacity-30 cursor-not-allowed'} // Disabled state
                                `}
                    >
                      {runeName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}