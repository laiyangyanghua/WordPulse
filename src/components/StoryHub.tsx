import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Gamepad2, 
  Play, 
  Plus, 
  Check, 
  HelpCircle, 
  Layers, 
  Clock, 
  Bot, 
  Tag, 
  Send,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  List
} from 'lucide-react';
import { StoryScene, WordItem } from '../types';
import { sound } from '../services/sound';

interface StoryHubProps {
  builtinStories: StoryScene[];
  customStories: StoryScene[];
  allWords: WordItem[];
  preSelectedWordIds?: string[];
  onSaveNewStory: (story: StoryScene) => void;
  onPlayGameWithWords: (wordIds: string[]) => void;
  onAddPoints: (pts: number) => void;
  onToggleBookmark?: (wordId: string) => void;
}

export const StoryHub: React.FC<StoryHubProps> = ({
  builtinStories,
  customStories,
  allWords,
  preSelectedWordIds = [],
  onSaveNewStory,
  onPlayGameWithWords,
  onAddPoints,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'builtin' | 'generator'>('builtin');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(builtinStories[0]?.id || '');
  const [displayMode, setDisplayMode] = useState<'bilingual' | 'en' | 'cloze'>('bilingual');
  const [showStoryPicker, setShowStoryPicker] = useState<boolean>(false);
  
  // Interactive popup on word click
  const [hoveredWord, setHoveredWord] = useState<{
    word: string;
    id?: string;
    phonetic?: string;
    meaning?: string;
    tip?: string;
  } | null>(null);

  // Quiz State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // AI Generator state
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>(
    preSelectedWordIds.length > 0 ? preSelectedWordIds : allWords.slice(0, 4).map((w) => w.id)
  );
  const [customWordInput, setCustomWordInput] = useState<string>('');
  const [genre, setGenre] = useState<string>('日常温情 (Cozy Slice of Life)');
  const [style, setStyle] = useState<string>('幽默风趣 (Humorous & Fun)');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const allAvailableStories = [...customStories, ...builtinStories];
  const activeStory =
    allAvailableStories.find((s) => s.id === selectedStoryId) || builtinStories[0];

  const handleSelectStory = (id: string) => {
    sound.playSelect();
    setSelectedStoryId(id);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setHoveredWord(null);
    setShowStoryPicker(false);
  };

  const handleToggleSelectWordForAI = (id: string) => {
    sound.playSelect();
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomWordToAI = () => {
    if (!customWordInput.trim()) return;
    sound.playSelect();
    const wordClean = customWordInput.trim().toLowerCase();
    const existing = allWords.find((w) => w.word.toLowerCase() === wordClean);
    if (existing) {
      if (!selectedWordIds.includes(existing.id)) {
        setSelectedWordIds((prev) => [...prev, existing.id]);
      }
    } else {
      setSelectedWordIds((prev) => [...prev, `custom-${wordClean}`]);
    }
    setCustomWordInput('');
  };

  const handleGenerateStory = async () => {
    if (selectedWordIds.length === 0) {
      setGenerateError('请至少勾选 1 个生词用于串联故事！');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    sound.playSelect();

    const wordsToPass: string[] = selectedWordIds.map((id) => {
      if (id.startsWith('custom-')) return id.replace('custom-', '');
      const match = allWords.find((w) => w.word.toLowerCase() === id.toLowerCase() || w.id === id);
      return match ? match.word : id;
    });

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: wordsToPass,
          genre,
          style,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '场景生成请求失败');
      }

      const data = await response.json();
      const newStory: StoryScene = {
        id: `ai-story-${Date.now()}`,
        title: data.title || 'AI Generated Scenario',
        titleCn: data.titleCn || 'AI 生词串联场景',
        category: 'custom',
        tag: 'AI 智能创作',
        intro: `巧妙串联生词：${wordsToPass.join(', ')}`,
        targetWordIds: selectedWordIds,
        targetWords: wordsToPass,
        contentEn: data.contentEn || '',
        contentCn: data.contentCn || '',
        vocabularyNotes: data.vocabularyNotes || [],
        quiz: data.quiz,
        isAiGenerated: true,
        createdAt: Date.now(),
      };

      onSaveNewStory(newStory);
      setSelectedStoryId(newStory.id);
      setActiveTab('builtin');
      sound.playVictory();
      onAddPoints(25);
    } catch (err: any) {
      console.error(err);
      setGenerateError(err.message || '生成失败，请检查网络或配置');
    } finally {
      setIsGenerating(false);
    }
  };

  // Render English Text with Clickable Target Words & Cloze Support
  const renderInteractiveEnglishText = (story: StoryScene) => {
    const text = story.contentEn;
    const targetWords = story.targetWords.map((w) => w.toLowerCase());
    const regex = /([a-zA-Z]+|[^\s\w]+|\s+)/g;
    const tokens = text.match(regex) || [text];

    return (
      <div className="text-sm sm:text-base leading-relaxed text-slate-200 font-normal">
        {tokens.map((token, index) => {
          const clean = token.toLowerCase().trim();
          const isTarget = targetWords.includes(clean);

          if (!isTarget) {
            return <span key={index}>{token}</span>;
          }

          const matchedWordObj = allWords.find((w) => w.word.toLowerCase() === clean);
          const vocabNote = story.vocabularyNotes.find(
            (n) => n.word.toLowerCase() === clean
          );

          if (displayMode === 'cloze') {
            return (
              <span
                key={index}
                className="inline-block mx-0.5 px-2 py-0.5 bg-indigo-950/80 border border-indigo-500/50 rounded-lg text-indigo-300 font-mono text-xs underline cursor-pointer active:scale-95"
                title="点击显示该空生词"
                onClick={() => {
                  sound.speak(clean);
                  setHoveredWord({
                    word: clean,
                    id: matchedWordObj?.id,
                    phonetic: matchedWordObj?.phonetic,
                    meaning: matchedWordObj?.meaning || vocabNote?.meaning || '重点生词',
                    tip: vocabNote?.contextTip || matchedWordObj?.mnemonic || '在语境中观察该词的搭配。',
                  });
                }}
              >
                [ _ ({matchedWordObj?.meaning || vocabNote?.meaning || '生词'}) ]
              </span>
            );
          }

          return (
            <span
              key={index}
              onClick={() => {
                sound.speak(clean);
                setHoveredWord({
                  word: clean,
                  id: matchedWordObj?.id,
                  phonetic: matchedWordObj?.phonetic,
                  meaning: matchedWordObj?.meaning || vocabNote?.meaning || '重点目标词',
                  tip: vocabNote?.contextTip || matchedWordObj?.mnemonic || '结合故事情景加深记忆。',
                });
              }}
              className="inline-block mx-0.5 px-1.5 py-0.5 rounded-lg bg-indigo-500/20 active:bg-indigo-500/40 text-indigo-200 border border-indigo-500/40 font-bold active:scale-95 transition-all cursor-pointer shadow-sm text-xs sm:text-sm"
            >
              {token}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 py-3 space-y-3 select-none">
      
      {/* Top Segment Mode Switcher */}
      <div className="bg-slate-850/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-md flex items-center gap-1.5">
        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('builtin');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'builtin'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>场景剧本馆 ({allAvailableStories.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('generator');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'generator'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
          <span>AI 串联工坊</span>
        </button>
      </div>

      {/* VIEW 1: STORY READER */}
      {activeTab === 'builtin' && (
        <div className="space-y-3">
          
          {/* Mobile Story Selector Pill Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playSelect();
                setShowStoryPicker(!showStoryPicker);
              }}
              className="flex-1 flex items-center justify-between p-2.5 bg-slate-850/90 hover:bg-slate-800 active:scale-98 border border-slate-700/80 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 shrink-0">
                  {activeStory.tag}
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {activeStory.titleCn}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStoryPicker ? 'rotate-180' : ''}`} />
            </button>

            {/* Read Mode Toggle Pills */}
            <div className="flex items-center gap-0.5 bg-slate-850/90 p-1 rounded-2xl border border-slate-700/80 text-[11px] shrink-0">
              <button
                onClick={() => setDisplayMode('bilingual')}
                className={`px-2 py-1 rounded-xl font-bold transition-colors ${
                  displayMode === 'bilingual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                双语
              </button>
              <button
                onClick={() => setDisplayMode('en')}
                className={`px-2 py-1 rounded-xl font-bold transition-colors ${
                  displayMode === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                纯英
              </button>
              <button
                onClick={() => setDisplayMode('cloze')}
                className={`px-2 py-1 rounded-xl font-bold transition-colors ${
                  displayMode === 'cloze'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                填空
              </button>
            </div>
          </div>

          {/* Story Selector Dropdown Menu / Bottom Sheet */}
          {showStoryPicker && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-2.5 space-y-1.5 max-h-64 overflow-y-auto no-scrollbar shadow-2xl animate-scale-in">
              {allAvailableStories.map((s) => {
                const isSelected = s.id === selectedStoryId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectStory(s.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-indigo-300 border border-slate-700">
                        {s.tag}
                      </span>
                      {s.isAiGenerated && (
                        <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                          <Bot className="w-2.5 h-2.5" /> AI
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-100">{s.titleCn}</div>
                    <div className="text-[10px] text-slate-400 font-outfit line-clamp-1">{s.title}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Story Reader Main Card */}
          {activeStory && (
            <div className="bg-slate-850 border border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
              
              {/* Header inside story */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
                <div className="overflow-hidden">
                  <h2 className="text-base sm:text-lg font-black text-white truncate">
                    {activeStory.titleCn}
                  </h2>
                  <p className="text-xs font-outfit text-indigo-300/80 truncate">
                    {activeStory.title}
                  </p>
                </div>

                {/* Actions: Speak all & launch Word Match */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => sound.speak(activeStory.contentEn, 0.88)}
                    title="朗读短剧英文"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 text-indigo-300 border border-slate-700 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const wordIds = activeStory.targetWordIds.filter((id) =>
                        allWords.some((w) => w.id === id)
                      );
                      onPlayGameWithWords(wordIds.length > 0 ? wordIds : allWords.slice(0, 6).map((w) => w.id));
                    }}
                    title="将本篇生词开启消消乐游戏"
                    className="flex items-center gap-1 px-2.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>消消乐</span>
                  </button>
                </div>
              </div>

              {/* Interactive English Text Box */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
                <div className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>轻触高亮色块生词，可即时朗读并查看记忆法则</span>
                </div>
                {renderInteractiveEnglishText(activeStory)}
              </div>

              {/* Chinese Translation Box (if bilingual) */}
              {displayMode === 'bilingual' && (
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    情景中文译文
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeStory.contentCn}
                  </p>
                </div>
              )}

              {/* Target Words & Notes Grid */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  本篇生词助记要点
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeStory.vocabularyNotes.map((note, idx) => (
                    <div
                      key={idx}
                      onClick={() => sound.speak(note.word)}
                      className="p-2.5 bg-slate-800/60 active:bg-slate-800 border border-slate-700/60 rounded-xl transition-all cursor-pointer active:scale-98"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-indigo-300 font-outfit">
                          {note.word}
                        </span>
                        <span className="text-[11px] text-slate-300 font-medium">
                          {note.meaning}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        {note.contextTip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehension Quiz */}
              {activeStory.quiz && (
                <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>情境自测：{activeStory.quiz.question}</span>
                  </div>

                  <div className="space-y-1.5">
                    {activeStory.quiz.options.map((opt, oIdx) => {
                      const isChosen = selectedAnswer === oIdx;
                      const isCorrect = oIdx === activeStory.quiz!.answerIndex;

                      let styleClasses =
                        'bg-slate-800/80 border-slate-700 text-slate-300 active:bg-slate-750';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          styleClasses =
                            'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isChosen && !isCorrect) {
                          styleClasses =
                            'bg-rose-950/80 border-rose-500 text-rose-200';
                        }
                      } else if (isChosen) {
                        styleClasses = 'bg-indigo-600 border-indigo-400 text-white';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => {
                            sound.playSelect();
                            setSelectedAnswer(oIdx);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all active:scale-98 ${styleClasses}`}
                        >
                          <span className="font-mono mr-1.5 text-slate-400">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz Submit Action */}
                  {!quizSubmitted && selectedAnswer !== null && (
                    <button
                      onClick={() => {
                        setQuizSubmitted(true);
                        if (selectedAnswer === activeStory.quiz!.answerIndex) {
                          sound.playVictory();
                          onAddPoints(15);
                        } else {
                          sound.playError();
                        }
                      }}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                    >
                      提交答案 (+15 pts)
                    </button>
                  )}

                  {/* Quiz Explanation */}
                  {quizSubmitted && (
                    <div
                      className={`p-2.5 rounded-xl border text-xs leading-snug space-y-1 ${
                        selectedAnswer === activeStory.quiz.answerIndex
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                          : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 text-[11px]">
                        {selectedAnswer === activeStory.quiz.answerIndex ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>回答正确！(+15 积分)</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>解析提示</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px]">{activeStory.quiz.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: AI STORY GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-slate-850 border border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
          
          <div className="text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-black text-white">AI 生词串联场景工坊</h2>
            <p className="text-xs text-slate-400">
              挑选 2~6 个生词，由 AI 瞬间编织为情景短剧
            </p>
          </div>

          {/* Word Selector Chips */}
          <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300">
                勾选目标生词 (已选 {selectedWordIds.length} 个)
              </label>
              <button
                onClick={() => setSelectedWordIds([])}
                className="text-[10px] text-rose-400 hover:underline"
              >
                清空
              </button>
            </div>

            {/* Word Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto no-scrollbar p-0.5">
              {allWords.map((w) => {
                const isSelected = selectedWordIds.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => handleToggleSelectWordForAI(w.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-800/90 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span className="font-mono">{w.word}</span>
                    <span className="text-[10px] text-slate-300 opacity-80">({w.meaning.slice(0, 3)})</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomWordToAI()}
                placeholder="或输入自定义词汇(按Enter添加)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleAddCustomWordToAI}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold"
              >
                添加
              </button>
            </div>
          </div>

          {/* Genre & Tone dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                场景题材
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="日常温情 (Cozy Slice of Life)">☕ 日常温情与社交</option>
                <option value="职场进阶与科技 (Tech & Workplace)">💼 职场进阶与科技</option>
                <option value="奇幻魔法与炼金 (Magic & Alchemy)">🧙 奇幻魔法与炼金</option>
                <option value="星际科幻未来 (Cyberpunk & Sci-Fi)">🚀 星际科幻未来</option>
                <option value="旅行探险与荒野 (Travel & Expedition)">🛫 旅行探险与荒野</option>
                <option value="悬疑破案与推理 (Detective & Mystery)">🕵️ 悬疑破案与推理</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                故事基调
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="幽默风趣 (Humorous & Fun)">😄 幽默风趣、脑洞大开</option>
                <option value="跌宕起伏 (Thrilling & Dramatic)">⚡ 紧张刺激、反转不断</option>
                <option value="唯美温存 (Poetic & Cozy)">🌿 唯美温存、治愈心灵</option>
                <option value="地道口语化 (Conversational & Natural)">🗣️ 地道口语、生活会话</option>
              </select>
            </div>
          </div>

          {/* Error Notice */}
          {generateError && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{generateError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={isGenerating || selectedWordIds.length === 0}
            onClick={handleGenerateStory}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
              isGenerating
                ? 'bg-slate-700 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-lg shadow-purple-600/30'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
                <span>AI 正在全力编织生词故事...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>开始生成情境短剧 (+25 pts)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Floating Word Bottom Sheet when clicked in story */}
      {hoveredWord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 max-w-md w-full shadow-2xl space-y-3 animate-slide-up pb-safe">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold font-outfit text-white">
                  {hoveredWord.word}
                </span>
                {hoveredWord.phonetic && (
                  <span className="text-xs text-slate-400 font-mono">
                    {hoveredWord.phonetic}
                  </span>
                )}
                <span className="text-xs text-indigo-300 font-bold bg-indigo-900/80 px-2 py-0.5 rounded-md border border-indigo-700">
                  {hoveredWord.meaning}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => sound.speak(hoveredWord.word)}
                  title="朗读"
                  className="p-2 rounded-xl bg-indigo-600 text-white active:scale-90"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                {hoveredWord.id && onToggleBookmark && (
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onToggleBookmark(hoveredWord.id!);
                    }}
                    title="收藏"
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 active:scale-90"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setHoveredWord(null)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {hoveredWord.tip && (
              <div className="bg-indigo-950/50 border border-indigo-800/60 p-3 rounded-2xl text-xs text-indigo-200 leading-relaxed">
                💡 {hoveredWord.tip}
              </div>
            )}

            <button
              onClick={() => setHoveredWord(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-bold"
            >
              继续阅读
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
