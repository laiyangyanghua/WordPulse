import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Bookmark, 
  BookmarkCheck, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  XCircle,
  BookOpen,
  Layers
} from 'lucide-react';
import { WordItem, WordCategory, MasteryLevel } from '../types';
import { sound } from '../services/sound';

interface FlashcardDeckProps {
  words: WordItem[];
  onUpdateWordMastery: (wordId: string, level: MasteryLevel) => void;
  onToggleBookmark: (wordId: string) => void;
  onGoToStoryWithWords: (wordIds: string[]) => void;
  onAddPoints: (pts: number) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  words,
  onUpdateWordMastery,
  onToggleBookmark,
  onGoToStoryWithWords,
  onAddPoints,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all' | 'bookmarked'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [autoPronounce, setAutoPronounce] = useState<boolean>(true);

  // Filter words
  const filteredWords = words.filter((w) => {
    if (selectedCategory === 'bookmarked') return !!w.isBookmarked;
    if (selectedCategory === 'all') return true;
    return w.category === selectedCategory;
  });

  const currentWord: WordItem | undefined = filteredWords[currentIndex] || filteredWords[0];

  // Auto pronounce on card change
  useEffect(() => {
    setIsFlipped(false);
    if (currentWord && autoPronounce) {
      sound.speak(currentWord.word);
    }
  }, [currentIndex, currentWord, autoPronounce]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredWords.length, isFlipped]);

  const handleFlip = () => {
    sound.playFlip();
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (filteredWords.length === 0) return;
    sound.playSelect();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrev = () => {
    if (filteredWords.length === 0) return;
    sound.playSelect();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleShuffle = () => {
    sound.playSelect();
    if (filteredWords.length <= 1) return;
    const rand = Math.floor(Math.random() * filteredWords.length);
    setCurrentIndex(rand);
    setIsFlipped(false);
  };

  const handleSetMastery = (level: MasteryLevel) => {
    if (!currentWord) return;
    sound.playSelect();
    onUpdateWordMastery(currentWord.id, level);
    onAddPoints(5);
    handleNext();
  };

  if (!currentWord) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">当前分类下暂无词卡</h3>
        <p className="text-xs text-slate-400">请切换分类或前往生词本添加收藏词汇。</p>
        <button
          onClick={() => setSelectedCategory('all')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
        >
          查看全部词库
        </button>
      </div>
    );
  }

  const masteryLabels = ['生疏', '学习中', '熟悉', '已掌握'];
  const masteryColors = ['text-rose-400', 'text-amber-400', 'text-cyan-400', 'text-emerald-400'];

  return (
    <div className="w-full max-w-lg mx-auto px-3 py-3 space-y-3 select-none">
      
      {/* Category Pills Carousel + Quick Actions */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1 text-xs font-medium">
          {(
            [
              { id: 'all', label: '全部' },
              { id: 'daily', label: '日常' },
              { id: 'workplace', label: '职场' },
              { id: 'travel', label: '旅行' },
              { id: 'fantasy', label: '奇幻' },
              { id: 'emotion', label: '情感' },
              { id: 'bookmarked', label: '⭐收藏' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playSelect();
                setSelectedCategory(tab.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-850/90 text-slate-400 border border-slate-700/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shuffle Button */}
        <button
          onClick={handleShuffle}
          title="随机乱序"
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 text-slate-300 transition-all shrink-0"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Progress & Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span>进度:</span>
          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 text-[11px] font-mono">
            {currentIndex + 1} / {filteredWords.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>熟练度:</span>
          <span className={`font-bold text-[11px] ${masteryColors[currentWord.masteryLevel]}`}>
            {masteryLabels[currentWord.masteryLevel]}
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 w-full min-h-[340px] sm:min-h-[360px]">
        <div
          onClick={handleFlip}
          className={`relative w-full h-full min-h-[340px] sm:min-h-[360px] rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer select-none ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-slate-850 via-slate-800 to-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 flex flex-col justify-between shadow-xl shadow-indigo-950/40">
            
            {/* Top Bar on Card */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
                {currentWord.partOfSpeech} · {currentWord.difficulty}
              </span>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    sound.playSelect();
                    onToggleBookmark(currentWord.id);
                  }}
                  title="收藏生词"
                  className="p-2 rounded-xl bg-slate-800/80 active:scale-90 text-slate-300 hover:text-amber-400 transition-all"
                >
                  {currentWord.isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => sound.speak(currentWord.word)}
                  title="朗读单词"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-90 text-white shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Word & Phonetic Center */}
            <div className="text-center my-auto py-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-wide">
                {currentWord.word}
              </h2>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-slate-400 font-mono text-sm sm:text-base">
                  {currentWord.phonetic}
                </span>
              </div>
            </div>

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <RotateCw className="w-3 h-3 text-indigo-400 animate-spin" />
              <span>轻触卡片翻转查看释义与记忆法</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            
            {/* Top Bar on Back */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold font-outfit text-white">{currentWord.word}</span>
                <span className="text-[11px] text-slate-400 font-mono">{currentWord.phonetic}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.speak(currentWord.word);
                }}
                className="p-1.5 rounded-lg bg-indigo-600 text-white active:scale-90 transition-transform"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Meaning & Details Content */}
            <div className="space-y-2.5 my-auto py-1 text-left">
              
              {/* Chinese Meaning */}
              <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60">
                <div className="text-[10px] text-indigo-300 font-bold uppercase mb-0.5">
                  中文释义
                </div>
                <div className="text-base font-bold text-slate-100">
                  <span className="text-indigo-400 mr-1.5 text-xs font-mono">{currentWord.partOfSpeech}</span>
                  {currentWord.meaning}
                </div>
              </div>

              {/* Mnemonic Trick / Memory Hook */}
              {currentWord.mnemonic && (
                <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold mb-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>联想助记法则</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-100/90 leading-snug">
                    {currentWord.mnemonic}
                  </p>
                </div>
              )}

              {/* Example Sentence */}
              <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/40 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-semibold">例句语境</div>
                <div className="text-xs text-slate-200 font-medium italic">
                  "{currentWord.exampleEn}"
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentWord.exampleCn}
                </div>
              </div>
            </div>

            {/* Bottom Flip back hint */}
            <div className="text-center text-[10px] text-slate-400">
              轻触翻回正面
            </div>
          </div>
        </div>
      </div>

      {/* Big Thumb Friendly Rating & Next/Prev Controls */}
      <div className="space-y-2 pt-1">
        
        {/* Self-Assessment Mastery Buttons (Row 1) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSetMastery(0)}
            className="flex items-center justify-center gap-1 py-2.5 px-2 bg-rose-950/60 hover:bg-rose-900/70 active:scale-95 text-rose-200 border border-rose-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>生疏</span>
          </button>

          <button
            onClick={() => handleSetMastery(1)}
            className="flex items-center justify-center gap-1 py-2.5 px-2 bg-amber-950/60 hover:bg-amber-900/70 active:scale-95 text-amber-200 border border-amber-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>模糊</span>
          </button>

          <button
            onClick={() => handleSetMastery(3)}
            className="flex items-center justify-center gap-1 py-2.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/70 active:scale-95 text-emerald-200 border border-emerald-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>已掌握</span>
          </button>
        </div>

        {/* Prev / Next & Story Shortcut (Row 2) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl border border-slate-700 transition-all shrink-0"
            title="上一张"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onGoToStoryWithWords([currentWord.id])}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 bg-purple-600/20 hover:bg-purple-600/30 active:scale-95 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>把此词放入场景故事</span>
          </button>

          <button
            onClick={handleNext}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl border border-slate-700 transition-all shrink-0"
            title="下一张"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
