import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Timer, 
  Zap, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  AlertCircle,
  Plus,
  Flame,
  Gamepad2,
  Map,
  Star,
  ChevronLeft,
  Award,
  Layers
} from 'lucide-react';
import { WordItem, MatchCard, GameStats, WordCategory, LevelProgressRecord, GameLevel } from '../types';
import { sound } from '../services/sound';
import { GAME_LEVELS, CHAPTERS } from '../data/levels';
import { LevelMap } from './LevelMap';

interface WordMatchGameProps {
  words: WordItem[];
  onAddPoints: (pts: number) => void;
  onUpdateWordMastery: (wordId: string, delta: number) => void;
  onGoToStoryWithWords: (wordIds: string[]) => void;
  onBookmarkWord: (wordId: string) => void;
}

type GameMode = 'level' | 'timed' | 'vault';
type GameView = 'map' | 'playing';

export const WordMatchGame: React.FC<WordMatchGameProps> = ({
  words,
  onAddPoints,
  onUpdateWordMastery,
  onGoToStoryWithWords,
  onBookmarkWord,
}) => {
  // Game view state
  const [view, setView] = useState<GameView>('map');
  const [mode, setMode] = useState<GameMode>('level');
  
  // Unlocked max level from localStorage
  const [unlockedMaxLevel, setUnlockedMaxLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wordpulse_max_level_v1');
      if (saved) return Math.max(1, Math.min(50, parseInt(saved, 10)));
    } catch {}
    return 1;
  });

  // Level completion and stars records from localStorage
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgressRecord>>(() => {
    try {
      const saved = localStorage.getItem('wordpulse_levels_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Current playing level
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [totalPairs, setTotalPairs] = useState<number>(4);
  const [matchedWordIds, setMatchedWordIds] = useState<string[]>([]);
  const [matchingPairIds, setMatchingPairIds] = useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    matches: 0,
    errors: 0,
    timeRemaining: 60,
    wrongWordIds: [],
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordsRef = useRef(words);
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  // Save progress changes
  const saveLevelResult = useCallback((lvlNum: number, stars: number, score: number, combo: number) => {
    setLevelProgress((prev) => {
      const existing = prev[lvlNum];
      const nextRecord: LevelProgressRecord = {
        stars: Math.max(existing?.stars || 0, stars),
        highScore: Math.max(existing?.highScore || 0, score),
        maxCombo: Math.max(existing?.maxCombo || 0, combo),
        completedAt: Date.now(),
      };
      const updated = { ...prev, [lvlNum]: nextRecord };
      try {
        localStorage.setItem('wordpulse_levels_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // If completed the highest unlocked level, unlock next level!
    if (lvlNum >= unlockedMaxLevel && lvlNum < 50) {
      const nextUnlocked = lvlNum + 1;
      setUnlockedMaxLevel(nextUnlocked);
      try {
        localStorage.setItem('wordpulse_max_level_v1', nextUnlocked.toString());
      } catch {}
    }
  }, [unlockedMaxLevel]);

  // Current Level Object
  const currentLevelObj = GAME_LEVELS.find((l) => l.levelNumber === currentLevelNumber) || GAME_LEVELS[0];

  // Initialize Game Board
  const initBoard = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const allWords = wordsRef.current;
    let selectedWords: WordItem[] = [];

    if (mode === 'level') {
      // Find words defined for this level
      const targetIds = currentLevelObj.targetWordIds;
      const targetWords = targetIds
        .map((id) => allWords.find((w) => w.id === id))
        .filter((w): w is WordItem => Boolean(w));

      // Fallback if some words not found
      if (targetWords.length < currentLevelObj.pairCount) {
        const pool = allWords.filter((w) => w.category === currentLevelObj.category);
        const fillers = (pool.length >= currentLevelObj.pairCount ? pool : allWords).filter(
          (w) => !targetWords.some((tw) => tw.id === w.id)
        );
        selectedWords = [...targetWords, ...fillers].slice(0, currentLevelObj.pairCount);
      } else {
        selectedWords = targetWords.slice(0, currentLevelObj.pairCount);
      }
    } else if (mode === 'vault') {
      let pool = allWords.filter((w) => w.masteryLevel < 2 || w.isBookmarked);
      if (pool.length < 4) pool = allWords;
      selectedWords = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    } else {
      // Timed mode
      selectedWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, 6);
    }

    setTotalPairs(selectedWords.length);
    setMatchedWordIds([]);
    setMatchingPairIds([]);

    const generatedCards: MatchCard[] = [];

    selectedWords.forEach((word) => {
      // English card
      generatedCards.push({
        id: `en-${word.id}-${Math.random()}`,
        wordId: word.id,
        text: word.word,
        phonetic: word.phonetic,
        type: 'en',
        isMatched: false,
        isSelected: false,
        isWrong: false,
      });
      // Chinese meaning card
      generatedCards.push({
        id: `cn-${word.id}-${Math.random()}`,
        wordId: word.id,
        text: word.meaning,
        type: 'cn',
        isMatched: false,
        isSelected: false,
        isWrong: false,
      });
    });

    // Shuffle cards
    const randomized = generatedCards.sort(() => Math.random() - 0.5);
    setCards(randomized);
    setSelectedCardId(null);
    setIsEvaluating(false);
    setIsGameOver(false);
    setEarnedStars(0);

    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      matches: 0,
      errors: 0,
      timeRemaining: mode === 'timed' ? 60 : 0,
      wrongWordIds: [],
    });

    // Start timer for timed mode
    if (mode === 'timed') {
      timerRef.current = setInterval(() => {
        setGameStats((prev) => {
          if (prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsGameOver(true);
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
  }, [mode, currentLevelObj]);

  useEffect(() => {
    if (view === 'playing') {
      initBoard();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, mode, currentLevelNumber, initBoard]);

  // Handle Card Click
  const handleCardClick = (card: MatchCard) => {
    if (isEvaluating || card.isMatched || card.isSelected || isGameOver) return;

    sound.playSelect();

    // If it's an English card, speak it!
    if (card.type === 'en') {
      sound.speak(card.text);
    }

    // First card selected
    if (!selectedCardId) {
      setSelectedCardId(card.id);
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c))
      );
      return;
    }

    // Second card selected - evaluate match
    const firstCard = cards.find((c) => c.id === selectedCardId);
    if (!firstCard) return;

    // Check if matching pair
    const isMatch =
      firstCard.wordId === card.wordId && firstCard.type !== card.type;

    if (isMatch) {
      // MATCH SUCCESS
      setIsEvaluating(true);
      const newCombo = gameStats.combo + 1;
      const pointsEarned = 10 * newCombo;

      sound.playMatchSuccess(newCombo);
      onAddPoints(pointsEarned);
      onUpdateWordMastery(card.wordId, 1);

      // Flash matching celebration state
      setMatchingPairIds([firstCard.id, card.id]);
      setMatchedWordIds((prev) => Array.from(new Set([...prev, card.wordId])));

      setCards((prev) =>
        prev.map((c) =>
          c.id === firstCard.id || c.id === card.id
            ? { ...c, isMatched: true, isSelected: false, isWrong: false }
            : c
        )
      );

      const nextMatches = gameStats.matches + 1;
      const nextCombo = newCombo;
      const nextMaxCombo = Math.max(gameStats.maxCombo, nextCombo);
      const finalScore = gameStats.score + pointsEarned;

      setGameStats((prev) => ({
        ...prev,
        score: finalScore,
        combo: nextCombo,
        maxCombo: nextMaxCombo,
        matches: nextMatches,
        timeRemaining: mode === 'timed' ? prev.timeRemaining + 3 : prev.timeRemaining,
      }));

      // Delay 320ms for visual celebratory flash, then DISAPPEAR the cards completely!
      setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.id !== firstCard.id && c.id !== card.id));
        setMatchingPairIds([]);
        setSelectedCardId(null);
        setIsEvaluating(false);

        // Check if all matched
        if (nextMatches >= totalPairs) {
          setTimeout(() => {
            sound.playVictory();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {}

            // Calculate Stars for level mode
            if (mode === 'level') {
              let stars = 1;
              if (gameStats.errors === 0 && nextMaxCombo >= 3) {
                stars = 3;
              } else if (gameStats.errors <= 1) {
                stars = 2;
              }
              setEarnedStars(stars);
              saveLevelResult(currentLevelNumber, stars, finalScore, nextMaxCombo);
            }

            setIsGameOver(true);
          }, 350);
        }
      }, 320);

    } else {
      // MATCH WRONG
      setIsEvaluating(true);
      sound.playError();

      // Show wrong shake animation
      setCards((prev) =>
        prev.map((c) =>
          c.id === firstCard.id || c.id === card.id
            ? { ...c, isSelected: true, isWrong: true }
            : c
        )
      );

      // Record wrong word
      const wrongId = firstCard.wordId;
      setGameStats((prev) => ({
        ...prev,
        combo: 0,
        errors: prev.errors + 1,
        wrongWordIds: prev.wrongWordIds.includes(wrongId)
          ? prev.wrongWordIds
          : [...prev.wrongWordIds, wrongId],
      }));

      // Reset wrong status after brief delay
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstCard.id || c.id === card.id
              ? { ...c, isSelected: false, isWrong: false }
              : c
          )
        );
        setSelectedCardId(null);
        setIsEvaluating(false);
      }, 550);
    }
  };

  // Quick launch selected level from Map
  const handleSelectLevelFromMap = (lvl: GameLevel) => {
    setCurrentLevelNumber(lvl.levelNumber);
    setMode('level');
    setView('playing');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 py-3 space-y-3 select-none">
      
      {/* View Switcher & Header Bar */}
      <div className="bg-slate-850/90 p-2 rounded-2xl border border-slate-700/80 shadow-md flex items-center justify-between gap-1.5">
        
        {/* Main View Tabs (Map vs Board) */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex-1">
          <button
            onClick={() => {
              sound.playSelect();
              setView('map');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
              view === 'map'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>🗺️ 关卡大地图 (50关)</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setView('playing');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
              view === 'playing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>🎮 正在挑战 {mode === 'level' ? `Lv.${currentLevelNumber}` : mode === 'timed' ? '极速' : '生词'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 🗺️ LEVEL MAP VIEW */}
      {view === 'map' ? (
        <LevelMap
          levelProgress={levelProgress}
          unlockedMaxLevel={unlockedMaxLevel}
          allWords={words}
          onSelectLevel={handleSelectLevelFromMap}
          onQuickPlayCurrent={() => {
            setCurrentLevelNumber(unlockedMaxLevel);
            setMode('level');
            setView('playing');
          }}
        />
      ) : (
        /* VIEW 2: 🎮 PLAYING BOARD VIEW */
        <div className="space-y-3 animate-fade-in">
          {/* Top Mode Segment Bar */}
          <div className="flex items-center justify-between gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  sound.playSelect();
                  setMode('level');
                }}
                className={`py-1 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  mode === 'level'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>第 {currentLevelNumber} 关</span>
                <span className="text-[10px] opacity-80">({currentLevelObj.title})</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setMode('timed');
                }}
                className={`py-1 px-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mode === 'timed'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                60s 极速
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setMode('vault');
                }}
                className={`py-1 px-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mode === 'vault'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                生词攻坚
              </button>
            </div>

            {/* Back to Map button */}
            <button
              onClick={() => {
                sound.playSelect();
                setView('map');
              }}
              title="返回关卡地图"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Map className="w-3.5 h-3.5 text-amber-400" />
              <span>地图</span>
            </button>

            {/* Reload button */}
            <button
              onClick={() => {
                sound.playSelect();
                initBoard();
              }}
              title="重洗当前牌局"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl border border-slate-700 transition-all shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Level Info Strip (in level mode) */}
          {mode === 'level' && (
            <div className="bg-slate-850/80 px-3 py-2 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold font-mono flex items-center justify-center text-[11px] border border-indigo-500/40">
                  {currentLevelNumber}
                </span>
                <div>
                  <span className="font-bold text-white">{currentLevelObj.title}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    {currentLevelObj.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= (levelProgress[currentLevelNumber]?.stars || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mobile Compact Game Stats Strip */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-850/90 p-2 rounded-2xl border border-slate-700/80 shadow-md">
            {/* Score */}
            <div className="text-center p-1 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">得分</div>
              <div className="text-base font-black text-amber-400 font-mono mt-0.5">{gameStats.score}</div>
            </div>

            {/* Combo */}
            <div className="text-center p-1 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">连击</div>
              <div className={`text-base font-black font-mono mt-0.5 ${
                gameStats.combo >= 2 ? 'text-amber-300 animate-pulse' : 'text-slate-400'
              }`}>
                x{gameStats.combo}
              </div>
            </div>

            {/* Matches / Progress */}
            <div className="text-center p-1 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">已消/剩余</div>
              <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                {gameStats.matches}/{totalPairs}
              </div>
            </div>

            {/* Time or Errors */}
            <div className="text-center p-1 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">
                {mode === 'timed' ? '倒计时' : '失误'}
              </div>
              <div className={`text-base font-black font-mono mt-0.5 ${
                mode === 'timed' && gameStats.timeRemaining <= 10
                  ? 'text-rose-400 animate-pulse'
                  : mode === 'timed'
                  ? 'text-cyan-400'
                  : gameStats.errors === 0
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}>
                {mode === 'timed' ? `${gameStats.timeRemaining}s` : `${gameStats.errors} 次`}
              </div>
            </div>
          </div>

          {/* Mobile Card Matrix Grid with Smooth Pop-Out Elimination */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 min-h-[220px]">
            <AnimatePresence mode="popLayout">
              {cards.map((card) => {
                const isEn = card.type === 'en';
                const isMatchingNow = matchingPairIds.includes(card.id);
                
                let cardStyle = 'bg-slate-850/90 border-slate-700/80 text-slate-200 hover:border-slate-500 active:scale-95';

                if (isMatchingNow) {
                  cardStyle = 'bg-emerald-900/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 scale-105 shadow-lg shadow-emerald-500/30';
                } else if (card.isWrong) {
                  cardStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 animate-shake ring-2 ring-rose-500/50';
                } else if (card.isSelected) {
                  cardStyle = 'bg-indigo-950/90 border-indigo-400 text-white ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/20 scale-[0.98]';
                }

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: isMatchingNow ? 1.05 : card.isSelected ? 0.98 : 1, 
                      opacity: 1 
                    }}
                    exit={{ 
                      scale: 0, 
                      opacity: 0, 
                      filter: 'blur(4px)',
                      transition: { duration: 0.25, ease: 'backIn' } 
                    }}
                    onClick={() => handleCardClick(card)}
                    className={`h-20 sm:h-22 p-2.5 rounded-2xl border flex flex-col justify-center items-center text-center cursor-pointer transition-colors duration-150 select-none relative overflow-hidden shadow-sm ${cardStyle}`}
                  >
                    {/* Floating Match Celebration Badge */}
                    {isMatchingNow && (
                      <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute inset-0 bg-emerald-500/30 backdrop-blur-[1px] flex items-center justify-center z-10"
                      >
                        <div className="flex items-center gap-1 text-emerald-200 font-black text-xs bg-emerald-950/80 px-2 py-1 rounded-full border border-emerald-400/60 shadow-md animate-bounce">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>+配对成功!</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Subtle Type Indicator Tag */}
                    <div className="absolute top-1.5 right-2 text-[9px] font-mono tracking-wider opacity-60">
                      {isEn ? (
                        <span className="text-indigo-300 flex items-center gap-0.5">
                          <Volume2 className="w-2.5 h-2.5" /> EN
                        </span>
                      ) : (
                        <span className="text-emerald-300">中文</span>
                      )}
                    </div>

                    <div className="w-full px-1">
                      <span
                        className={`block font-bold tracking-tight break-words line-clamp-2 ${
                          isEn
                            ? 'text-base sm:text-lg font-outfit text-indigo-100 leading-tight'
                            : 'text-xs sm:text-sm font-semibold text-slate-200 leading-tight'
                        }`}
                      >
                        {card.text}
                      </span>

                      {isEn && card.phonetic && (
                        <span className="text-[10px] text-slate-400 font-mono block truncate mt-0.5">
                          {card.phonetic}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty board state when all cards are eliminated */}
            {cards.length === 0 && !isGameOver && (
              <div className="col-span-2 py-12 text-center flex flex-col items-center justify-center gap-2 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-emerald-300">✨ 盘面卡片已全部消除！</div>
              </div>
            )}
          </div>

          {/* Victory / Game Over Modal */}
          {isGameOver && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full text-center shadow-2xl space-y-4 animate-slide-up pb-safe">
                
                {/* Icon & Title */}
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">
                    {gameStats.matches >= totalPairs ? (
                      mode === 'level' ? `🎉 第 ${currentLevelNumber} 关 顺利通关！` : '🎉 消除挑战通关！'
                    ) : (
                      '⏰ 挑战时间到！'
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mode === 'level' ? currentLevelObj.title : '情景记忆神经链接已牢固建立'}
                  </p>
                </div>

                {/* Stars Display in Level Mode */}
                {mode === 'level' && gameStats.matches >= totalPairs && (
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`p-2 rounded-2xl border transition-all duration-300 ${
                          s <= earnedStars
                            ? 'bg-amber-500/20 border-amber-500/50 scale-110 shadow-lg shadow-amber-500/20'
                            : 'bg-slate-800/40 border-slate-800 opacity-40'
                        }`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= earnedStars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Score Strip */}
                <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <div>
                    <div className="text-[10px] text-slate-400">本局得分</div>
                    <div className="text-lg font-black text-amber-400 font-mono">{gameStats.score}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">最大连击</div>
                    <div className="text-lg font-black text-indigo-400 font-mono">x{gameStats.maxCombo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">失误次数</div>
                    <div className={`text-lg font-black font-mono ${gameStats.errors === 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {gameStats.errors} 次
                    </div>
                  </div>
                </div>

                {/* Wrong words review */}
                {gameStats.wrongWordIds.length > 0 && (
                  <div className="bg-rose-950/40 border border-rose-800/60 p-2.5 rounded-xl text-left space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>本局生词已标记，点击 + 收藏至生词本：</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {gameStats.wrongWordIds.map((id) => {
                        const w = words.find((item) => item.id === id);
                        if (!w) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-900/60 text-rose-200 border border-rose-700/50 rounded-md text-[11px] font-mono"
                          >
                            {w.word}
                            <button
                              onClick={() => onBookmarkWord(id)}
                              title="加入生词本"
                              className="hover:text-amber-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  {matchedWordIds.length >= 3 && (
                    <button
                      onClick={() => {
                        onGoToStoryWithWords(matchedWordIds.slice(0, 5));
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/30 transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>把这批词汇一键编入情境故事</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sound.playSelect();
                        setView('map');
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold rounded-xl border border-slate-700 text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <Map className="w-3.5 h-3.5 text-amber-400" />
                      <span>返回地图</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playSelect();
                        initBoard();
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold rounded-xl border border-slate-700 text-xs transition-all"
                    >
                      重玩本关
                    </button>

                    {mode === 'level' && currentLevelNumber < 50 && (
                      <button
                        onClick={() => {
                          sound.playVictory();
                          setCurrentLevelNumber((l) => l + 1);
                          initBoard();
                        }}
                        className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all"
                      >
                        下一关 Lv.{currentLevelNumber + 1}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

