import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Settings,
  X,
  Users,
  RefreshCw,
  Ban
} from 'lucide-react';

const RUNE_DATA = {
  'Fury': {
    color: 'text-rune-fury',
    borderColor: 'border-rune-fury',
    glow: 'drop-shadow-glow-fury',
    icon: 'icons/runes/fury.jpg'
  },
  'Body': {
    color: 'text-rune-body',
    borderColor: 'border-rune-body',
    glow: 'drop-shadow-glow-body',
    icon: 'icons/runes/body.jpg'
  },
  'Calm': {
    color: 'text-rune-calm',
    borderColor: 'border-rune-calm',
    glow: 'drop-shadow-glow-calm',
    icon: 'icons/runes/calm.jpg'
  },
  'Order': {
    color: 'text-rune-order',
    borderColor: 'border-rune-order',
    glow: 'drop-shadow-glow-order',
    icon: 'icons/runes/order.jpg'
  },
  'Mind': {
    color: 'text-rune-mind',
    borderColor: 'border-rune-mind',
    glow: 'drop-shadow-glow-mind',
    icon: 'icons/runes/mind.jpg'
  },
  'Chaos': {
    color: 'text-rune-chaos',
    borderColor: 'border-rune-chaos',
    glow: 'drop-shadow-glow-chaos',
    icon: 'icons/runes/chaos.jpg'
  },
};

type RuneName = keyof typeof RUNE_DATA;

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

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [playerRunes, setPlayerRunes] = useState<string[][]>([[], [], [], []]);

  const [showRuneModalFor, setShowRuneModalFor] = useState<number | null>(null);

  const [animationDirections, setAnimationDirections] = useState<number[]>([1, 1, 1, 1]);

  const [gameMode, setGameMode] = useState<'standard' | '2v2'>(() =>
    getFromStorage('runicCounterGameMode', 'standard')
  );

  const winScore = gameMode === 'standard' ? 8 : 11;
  
  const isGameInWinningState = scores.some(score => score >= winScore);

  useEffect(() => {
    localStorage.setItem('runicCounterPlayerCount', JSON.stringify(playerCount));
  }, [playerCount]);

  useEffect(() => {
    localStorage.setItem('runicCounterScores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('runicCounterGameMode', JSON.stringify(gameMode));
  }, [gameMode]);

  const handleIncrement = (index: number) => {
    setAnimationDirections(prev => prev.map((dir, i) => (i === index ? 1 : dir)));

    setScores(prevScores =>
      prevScores.map((score, i) => (i === index ? Math.min(winScore, score + 1) : score)));
  };

  const handleDecrement = (index: number) => {
    setAnimationDirections(prev => prev.map((dir, i) => (i === index ? -1 : dir)));
    setScores(prevScores =>
      prevScores.map((score, i) => (i === index ? Math.max(0, score - 1) : score))
    );
  };

  const handleResetGame = () => {
    setScores([0, 0, 0, 0]);
    setAnimationDirections([1, 1, 1, 1]);
    setShowSettings(false);
  };

  const handleSetPlayerCount = (count: number) => {
    setPlayerCount(count);
    handleResetGame();
    if (count !== 2) {
      setGameMode('standard');
    }
    setShowSettings(false);
  };

  const handleSetStandardMode = () => {
    setGameMode('standard');
    setShowSettings(false);
  };

  const handleSet2v2Mode = () => {
    setGameMode('2v2');
    setPlayerCount(2); // Force 2-player layout
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
    let classes = 'relative p-4 bg-transparent border border-arcane-gold/30 transition-all duration-300 h-full';

    if (scores[index] >= winScore) {
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

  const handleRuneSelect = (runeName: RuneName) => {
    if (showRuneModalFor === null) return;

    setPlayerRunes(currentRunes => {
      const newRunes = [...currentRunes];
      const runesForThisPlayer = newRunes[showRuneModalFor];
      const isSelected = runesForThisPlayer.includes(runeName);
      const canSelect = runesForThisPlayer.length < 2;

      if (isSelected) {
        newRunes[showRuneModalFor] = runesForThisPlayer.filter(r => r !== runeName);
      } else if (canSelect) {
        newRunes[showRuneModalFor] = [...runesForThisPlayer, runeName];
      }
      return newRunes;
    });
  };

  const handleClearRunes = () => {
    if (showRuneModalFor === null) return;

    setPlayerRunes(currentRunes => {
      const newRunes = [...currentRunes];
      newRunes[showRuneModalFor] = [];
      return newRunes;
    });
  };

  return (
    <main className="fixed inset-0 text-arcane-gold font-arcane select-none bg-gradient-arcane">
      <div className={`h-full w-full grid ${getGridClass()} gap-1 bg-transparent`}>
        {scores.slice(0, playerCount).map((score, index) => (
          <div key={index} className={getPlayerClass(index)}>
            <div className="flex flex-col items-center justify-around h-full landscape:hidden">

              {/* Top content (Label + Runes) */}
              <div className="flex flex-col items-center gap-2">
                {/*  Runes */}
                <div className="flex gap-2">
                  {playerRunes[index].map((runeName) => (
                    <img
                      key={runeName}
                      src={RUNE_DATA[runeName as RuneName].icon}
                      alt={runeName}
                      className={`player-rune-icon ${RUNE_DATA[runeName as RuneName].glow}`}
                    />
                  ))}
                </div>

                {/* Player Label */}
                <button
                  onClick={() => setShowRuneModalFor(index)}
                  className="text-xl md:text-2xl text-arcane-gold/70 tracking-[.2em] uppercase
                             hover:text-hextech-blue transition-colors duration-200"
                >
                  {gameMode === '2v2' ? 'Team' : 'Player'} {index + 1}
                </button>
              </div>

              {/* Score (Center) */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={score}
                  initial={{ y: animationDirections[index] * 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: animationDirections[index] * -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`player-score ${score >= winScore
                    ? 'text-hextech-blue text-shadow-glow-blue'
                    : 'text-arcane-gold text-shadow-glow-gold'
                  }`}
                >
                  {score}
                </motion.span>
              </AnimatePresence>

              {/* Buttons (Bottom) */}
              <div className="flex gap-4 md:gap-8">
                <button
                  onClick={() => handleDecrement(index)}
                  className="player-button"
                  aria-label={`Decrement Player ${index + 1} score`}
                >
                  <Minus className="player-button-icon" />
                </button>
                <button
                  onClick={() => handleIncrement(index)}
                  className="player-button"
                  aria-label={`Increment Player ${index + 1} score`}
                >
                  <Plus className="player-button-icon" />
                </button>
              </div>
            </div>

            {/* --- 2. LANDSCAPE LAYOUT --- */}
            <div className="hidden landscape:flex flex-col justify-start h-full w-full">

              {/* TOP PART: Label and Runes */}
              <div className="relative w-full text-center">
                <div className="absolute top-0 left-0 flex gap-2">
                  {playerRunes[index].map((runeName) => (
                    <img
                      key={runeName}
                      src={RUNE_DATA[runeName as RuneName].icon}
                      alt={runeName}
                      className={`player-rune-icon ${RUNE_DATA[runeName as RuneName].glow}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setShowRuneModalFor(index)}
                  className="text-xl md:text-2xl landscape:lg:mt-4 text-arcane-gold/70 tracking-[.2em] uppercase
                             hover:text-hextech-blue transition-colors duration-200"
                >
                  {gameMode === '2v2' ? 'Team' : 'Player'} {index + 1}
                </button>
              </div>

              {/* BOTTOM PART: [Button] [Score] [Button] */}
              <div className="flex flex-row items-center justify-evenly h-full w-full">
                {/* Decrement Button */}
                <button
                  onClick={() => handleDecrement(index)}
                  className="player-button"
                  aria-label={`Decrement Player ${index + 1} score`}
                >
                  <Minus className="player-button-icon" />
                </button>

                {/* Score (Center) */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={score}
                    initial={{ y: animationDirections[index] * 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: animationDirections[index] * -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`player-score ${score >= winScore
                      ? 'text-hextech-blue text-shadow-glow-blue'
                      : 'text-arcane-gold text-shadow-glow-gold'
                    }`}
                  >
                    {score}
                  </motion.span>
                </AnimatePresence>

                <button
                  onClick={() => handleIncrement(index)}
                  className="player-button"
                  aria-label={`Increment Player ${index + 1} score`}
                >
                  <Plus className="player-button-icon" />
                </button>
              </div>
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
          className={`settings-button
                     ${isGameInWinningState
              ? 'text-hextech-blue'
              : 'text-arcane-gold hover:text-hextech-blue'
            }`}
          aria-label="Open Settings"
        >
          <Settings className='settings-button-icon' />
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div
            className="bg-arcane-plate rounded-2xl shadow-xl w-full max-w-sm 
                       border-2 border-arcane-gold/50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-arcane-gold/20">
              <h2 className="text-2xl font-arcane text-white">Settings</h2>
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
                <label className="block text-sm font-arcane text-arcane-gold mb-3">
                  <Users size={16} className="inline-block mr-2 -mt-1" />
                  Game Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSetStandardMode}
                    className={`p-4 rounded-lg font-arcane text-lg transition-all duration-200
                                  ${gameMode === 'standard'
                        ? 'bg-arcane-gold text-arcane-dark ring-2 ring-hextech-blue'
                        : 'bg-arcane-dark text-white hover:bg-arcane-dark/70 border border-arcane-gold/30'
                      }`}
                  >
                    Standard (8)
                  </button>
                  <button
                    onClick={handleSet2v2Mode}
                    className={`p-4 rounded-lg font-arcane text-lg transition-all duration-200
                                  ${gameMode === '2v2'
                        ? 'bg-arcane-gold text-arcane-dark ring-2 ring-hextech-blue'
                        : 'bg-arcane-dark text-white hover:bg-arcane-dark/70 border border-arcane-gold/30'
                      }`}
                  >
                    2v2 (11)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-arcane text-arcane-gold mb-3">
                  <Users size={16} className="inline-block mr-2 -mt-1" />
                  Select Players
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleSetPlayerCount(count)}
                      // --- ADD THIS DISABLED LOGIC ---
                      disabled={gameMode === '2v2' && count !== 2}
                      className={`p-4 rounded-lg font-arcane text-xl transition-all duration-200
                                  ${playerCount === count
                          ? 'bg-arcane-gold text-arcane-dark ring-2 ring-hextech-blue'
                          : 'bg-arcane-dark text-white hover:bg-arcane-dark/70 border border-arcane-gold/30'
                        }
                                  ${/* --- ADD THIS DISABLED STYLE --- */''}
                                  ${gameMode === '2v2' && count !== 2 && 'opacity-50 cursor-not-allowed'}
                                `}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-arcane text-red-500 mb-3">
                  <RefreshCw size={16} className="inline-block mr-2 -mt-1" />
                  Game Actions
                </label>
                <button
                  onClick={handleResetGame}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-lg 
                             bg-red-600/90 text-white font-arcane text-lg
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRuneModalFor(null)}
        >
          <div
            className="bg-arcane-plate rounded-2xl shadow-xl w-full max-w-sm 
                       border-2 border-arcane-gold/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="p-5 landscape:p-1">

              {showRuneModalFor !== null && (() => {
                const runesForThisPlayer = playerRunes[showRuneModalFor];
                const canSelect = runesForThisPlayer.length < 2;

                const RuneButton = ({ name }: { name: RuneName }) => {
                  const isSelected = runesForThisPlayer.includes(name);
                  return (
                    <button
                      onClick={() => handleRuneSelect(name)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg font-arcane text-sm font-bold transition-all duration-200
                                  w-24 h-24
                                  border ${RUNE_DATA[name].color}
                                  ${isSelected
                          ? `bg-arcane-gold/20 ${RUNE_DATA[name].borderColor}`
                          : 'bg-arcane-dark border-arcane-gold/30 opacity-70 hover:opacity-100'
                        }
                                  ${!isSelected && !canSelect && 'opacity-30 cursor-not-allowed'}
                                `}
                    >
                      <img
                        src={RUNE_DATA[name].icon}
                        alt={name}
                        className={`w-10 h-10 rounded-md transition-all ${isSelected ? RUNE_DATA[name].glow : 'opacity-80'}`}
                      />
                      {name}
                    </button>
                  );
                };

                return (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex justify-center gap-3">
                      <RuneButton name="Fury" />
                      <RuneButton name="Body" />
                    </div>
                    <div className="flex justify-center gap-3">
                      <RuneButton name="Chaos" />
                      <button
                        onClick={handleClearRunes}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg font-arcane text-sm font-bold transition-all duration-200
                                    w-24 h-24
                                    border border-arcane-gold/50 text-arcane-gold/70
                                    bg-arcane-dark hover:opacity-100 hover:text-arcane-gold hover:border-arcane-gold`}
                      >
                        <Ban className="w-10 h-10 opacity-80" />
                        Clear
                      </button>

                      <RuneButton name="Order" />
                    </div>
                    <div className="flex justify-center gap-3">
                      <RuneButton name="Mind" />
                      <RuneButton name="Calm" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}