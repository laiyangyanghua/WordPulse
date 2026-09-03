import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Lock, 
  Play, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  Sun, 
  Briefcase, 
  Plane, 
  Heart, 
  X,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { ChapterInfo, GameLevel, LevelProgressRecord, WordItem } from '../types';
import { CHAPTERS, GAME_LEVELS } from '../data/levels';
import { sound } from '../services/sound';

interface LevelMapProps {
  levelProgress: Record<number, LevelProgressRecord>;
  unlockedMaxLevel: number;
  allWords: WordItem[];
  onSelectLevel: (level: GameLevel) => void;
  onQuickPlayCurrent: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  levelProgress,
  unlockedMaxLevel,
  allWords,
  onSelectLevel,
  onQuickPlayCurrent,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(() => {
    // Default to the chapter containing the current unlocked level
    const curr = GAME_LEVELS.find((l) => l.levelNumber === unlockedMaxLevel);
    return curr ? curr.chapterId : 1;
  });

  const [inspectingLevel, setInspectingLevel] = useState<GameLevel | null>(null);

  // Total stats calculations
  const totalLevels = GAME_LEVELS.length; // 50
  const completedLevelsCount = Object.keys(levelProgress).length;
  const totalStarsCollected = (Object.values(levelProgress) as LevelProgressRecord[]).reduce(
    (acc, cur) => acc + (cur?.stars || 0),
    0
  );
  const maxPossibleStars = totalLevels * 3; // 150

  const currentChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];
  const chapterLevels = GAME_LEVELS.filter((l) => l.chapterId === selectedChapterId);

  // Chapter specific star count
  const chapterStars = chapterLevels.reduce((acc, l) => {
    return acc + (levelProgress[l.levelNumber]?.stars || 0);
  }, 0);
  const chapterMaxStars = chapterLevels.length * 3;

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'Plane':
        return <Plane className="w-4 h-4" />;
      case 'Heart':
        return <Heart className="w-4 h-4" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3.5 pb-8 animate-fade-in">
      {/* Top Total Progress & Stats Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-3.5 sm:p-4 rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-bold text-indigo-300">
                消消乐闯关总览
              </span>
              <span className="text-xs text-slate-400 font-medium">
                全 5 大章节 · 共 50 关
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-1.5">
              <span>词汇进阶大地图</span>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
          </div>

          {/* Quick Continue Button */}
          <button
            onClick={() => {
              sound.playSelect();
              onQuickPlayCurrent();
            }}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>继续 Lv.{unlockedMaxLevel}</span>
          </button>
        </div>

        {/* Global Progress Bar Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">已集星数</div>
            <div className="text-sm sm:text-base font-black text-amber-400 font-mono mt-0.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{totalStarsCollected} / {maxPossibleStars}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">通关进度</div>
            <div className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{completedLevelsCount} / {totalLevels} 关</span>
            </div>
          </div>

          <div className="hidden sm:block bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">当前最高解锁</div>
            <div className="text-sm sm:text-base font-black text-cyan-400 font-mono mt-0.5">
              第 {unlockedMaxLevel} 关
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Selection Tabs (Horizontal Scrollable) */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 px-1 flex items-center justify-between">
          <span>选择章节探索</span>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentChapter.title} (⭐ {chapterStars}/{chapterMaxStars})
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CHAPTERS.map((ch) => {
            const isSelected = ch.id === selectedChapterId;
            const chLevels = GAME_LEVELS.filter((l) => l.chapterId === ch.id);
            const chCompleted = chLevels.filter((l) => levelProgress[l.levelNumber]?.isCompleted || levelProgress[l.levelNumber]?.stars > 0).length;
            const isAllCompleted = chCompleted === chLevels.length;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  sound.playSelect();
                  setSelectedChapterId(ch.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-slate-850 border-indigo-500/80 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${ch.color} ${
                    isSelected ? 'shadow-md' : 'opacity-70'
                  }`}
                >
                  {getChapterIcon(ch.icon)}
                </div>

                <div className="text-left">
                  <div className="text-xs font-bold whitespace-nowrap flex items-center gap-1">
                    <span>{ch.title.split('：')[1]}</span>
                    {isAllCompleted && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Lv.{ch.levelRange[0]}-{ch.levelRange[1]} · {chCompleted}/10
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter Banner */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentChapter.color} flex items-center justify-center text-white shadow-md`}>
            {getChapterIcon(currentChapter.icon)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{currentChapter.title}</h3>
            <p className="text-[11px] text-slate-400">{currentChapter.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">本章星数</div>
          <div className="text-xs font-bold text-amber-400 font-mono">
            ⭐ {chapterStars} / {chapterMaxStars}
          </div>
        </div>
      </div>

      {/* Level Nodes Grid (消消乐关卡泡泡路线网格) */}
      <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {chapterLevels.map((lvl) => {
            const isUnlocked = lvl.levelNumber <= unlockedMaxLevel;
            const progress = levelProgress[lvl.levelNumber];
            const isCompleted = (progress?.stars || 0) > 0;
            const isCurrent = lvl.levelNumber === unlockedMaxLevel;
            const stars = progress?.stars || 0;

            return (
              <button
                key={lvl.levelNumber}
                disabled={!isUnlocked}
                onClick={() => {
                  sound.playSelect();
                  setInspectingLevel(lvl);
                }}
                className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-28 group ${
                  isCurrent
                    ? 'bg-gradient-to-b from-indigo-900/60 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40 animate-pulse'
                    : isCompleted
                    ? 'bg-slate-850/90 hover:bg-slate-800/90 border-slate-700/80 shadow-md hover:border-amber-500/50'
                    : isUnlocked
                    ? 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                    : 'bg-slate-950/60 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Top Row: Level number + Lock/Badge */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isCompleted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isUnlocked
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {lvl.levelNumber}
                  </span>

                  {/* Lock or Status */}
                  <div>
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : isCurrent ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-indigo-500 text-[9px] font-bold text-white">
                        当前
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {lvl.pairCount}对
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Title */}
                <div>
                  <div className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                    {lvl.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {isUnlocked ? lvl.subtitle : '通关前置关卡解锁'}
                  </div>
                </div>

                {/* Bottom: Stars indicator */}
                <div className="flex items-center gap-1 pt-1">
                  {isUnlocked ? (
                    [1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3 h-3 ${
                          starIdx <= stars
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow'
                            : 'text-slate-700'
                        }`}
                      />
                    ))
                  ) : (
                    <div className="h-3 text-[10px] text-slate-600 font-mono">未解锁</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Briefing Modal (关卡详细信息弹窗) */}
      {inspectingLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 animate-slide-up pb-safe">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold rounded-lg">
                    第 {inspectingLevel.levelNumber} 关 · {inspectingLevel.pairCount} 对卡片
                  </span>
                  <span className="text-xs text-slate-400">
                    {CHAPTERS.find((c) => c.id === inspectingLevel.chapterId)?.title}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  {inspectingLevel.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {inspectingLevel.subtitle}
                </p>
              </div>

              <button
                onClick={() => setInspectingLevel(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Level Record if completed */}
            {levelProgress[inspectingLevel.levelNumber] && (
              <div className="bg-slate-850 p-2.5 rounded-2xl border border-slate-700 flex items-center justify-around text-center">
                <div>
                  <div className="text-[10px] text-slate-400">当前星级</div>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= levelProgress[inspectingLevel.levelNumber].stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div>
                  <div className="text-[10px] text-slate-400">历史最高得分</div>
                  <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
                    {levelProgress[inspectingLevel.levelNumber].highScore} 分
                  </div>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div>
                  <div className="text-[10px] text-slate-400">最大连击</div>
                  <div className="text-xs font-black text-indigo-400 font-mono mt-0.5">
                    x{levelProgress[inspectingLevel.levelNumber].maxCombo}
                  </div>
                </div>
              </div>
            )}

            {/* Star Goals Rule Box */}
            <div className="bg-slate-850/80 p-3 rounded-2xl border border-slate-700/80 space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>通关星级标准：</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-400">
                <div className="bg-slate-900/70 p-1.5 rounded-xl text-center border border-slate-800">
                  <div className="text-amber-400 font-bold">⭐ 1 星</div>
                  <div className="mt-0.5">成功消除所有卡片</div>
                </div>
                <div className="bg-slate-900/70 p-1.5 rounded-xl text-center border border-slate-800">
                  <div className="text-amber-400 font-bold">⭐⭐ 2 星</div>
                  <div className="mt-0.5">失误次数 ≤ 1 次</div>
                </div>
                <div className="bg-slate-900/70 p-1.5 rounded-xl text-center border border-slate-800">
                  <div className="text-amber-400 font-bold">⭐⭐⭐ 3 星</div>
                  <div className="mt-0.5">零失误 & 连击≥3</div>
                </div>
              </div>
            </div>

            {/* Target Words Preview (本关预习词卡) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>本关重点词汇预习 ({inspectingLevel.targetWordIds.length} 个)</span>
                <span className="text-[10px] text-slate-500">点击小喇叭可预习发音</span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {inspectingLevel.targetWordIds.map((id) => {
                  const w = allWords.find((item) => item.id === id);
                  if (!w) return null;
                  return (
                    <div
                      key={id}
                      className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/70 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sound.speak(w.word)}
                          title="播放发音"
                          className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <span className="text-xs font-bold text-white font-outfit">
                            {w.word}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                            {w.phonetic}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-300 font-medium truncate max-w-[150px]">
                        {w.meaning}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => {
                sound.playSelect();
                onSelectLevel(inspectingLevel);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-pink-600 hover:from-amber-400 hover:to-indigo-500 active:scale-95 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>开始挑战第 {inspectingLevel.levelNumber} 关</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
