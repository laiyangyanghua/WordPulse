import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  Plus, 
  Volume2, 
  Sparkles, 
  Trash2, 
  Gamepad2, 
  BookOpen, 
  Filter, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Lightbulb,
  Download,
  Upload,
  X
} from 'lucide-react';
import { WordItem, WordCategory, MasteryLevel } from '../types';
import { sound } from '../services/sound';

interface WordVaultProps {
  words: WordItem[];
  onAddWord: (word: WordItem) => void;
  onDeleteWord: (wordId: string) => void;
  onUpdateMastery: (wordId: string, level: MasteryLevel) => void;
  onToggleBookmark: (wordId: string) => void;
  onPlayGameWithWords: (wordIds: string[]) => void;
  onGoToStoryWithWords: (wordIds: string[]) => void;
  onOpenWordDetail: (word: WordItem) => void;
}

export const WordVault: React.FC<WordVaultProps> = ({
  words,
  onAddWord,
  onDeleteWord,
  onUpdateMastery,
  onToggleBookmark,
  onPlayGameWithWords,
  onGoToStoryWithWords,
  onOpenWordDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<WordCategory | 'all'>('all');
  const [masteryFilter, setMasteryFilter] = useState<number | 'all'>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Word Form State
  const [newWord, setNewWord] = useState<string>('');
  const [newPhonetic, setNewPhonetic] = useState<string>('');
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [newPos, setNewPos] = useState<string>('n.');
  const [newExampleEn, setNewExampleEn] = useState<string>('');
  const [newExampleCn, setNewExampleCn] = useState<string>('');
  const [newMnemonic, setNewMnemonic] = useState<string>('');
  const [newCategory, setNewCategory] = useState<WordCategory>('daily');
  const [isAiFilling, setIsAiFilling] = useState<boolean>(false);

  // Filtered list
  const filteredWords = words.filter((w) => {
    if (onlyBookmarked && !w.isBookmarked) return false;
    if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
    if (masteryFilter !== 'all' && w.masteryLevel !== masteryFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        w.word.toLowerCase().includes(term) ||
        w.meaning.toLowerCase().includes(term) ||
        w.exampleEn.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Calculate stats
  const totalCount = words.length;
  const masteredCount = words.filter((w) => w.masteryLevel === 3).length;
  const learningCount = words.filter((w) => w.masteryLevel === 1 || w.masteryLevel === 2).length;
  const rawCount = words.filter((w) => w.masteryLevel === 0).length;
  const bookmarkedCount = words.filter((w) => w.isBookmarked).length;
  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  const handleToggleSelectAll = () => {
    if (selectedWordIds.length === filteredWords.length) {
      setSelectedWordIds([]);
    } else {
      setSelectedWordIds(filteredWords.map((w) => w.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    sound.playSelect();
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAiAutoComplete = async () => {
    if (!newWord.trim()) return;
    setIsAiFilling(true);
    sound.playSelect();

    try {
      const res = await fetch('/api/auto-complete-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: newWord.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.phonetic) setNewPhonetic(data.phonetic);
        if (data.meaning) setNewMeaning(data.meaning);
        if (data.partOfSpeech) setNewPos(data.partOfSpeech);
        if (data.exampleEn) setNewExampleEn(data.exampleEn);
        if (data.exampleCn) setNewExampleCn(data.exampleCn);
        if (data.mnemonic) setNewMnemonic(data.mnemonic);
        if (data.category) setNewCategory(data.category as WordCategory);
        sound.playVictory();
      }
    } catch (err) {
      console.warn('AI autocomplete failed:', err);
    } finally {
      setIsAiFilling(false);
    }
  };

  const handleSaveNewWord = () => {
    if (!newWord.trim() || !newMeaning.trim()) return;
    sound.playVictory();

    const created: WordItem = {
      id: `custom-${Date.now()}`,
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || `/${newWord.trim()}/`,
      meaning: newMeaning.trim(),
      partOfSpeech: newPos || 'n.',
      exampleEn: newExampleEn.trim() || `The word "${newWord}" is useful.`,
      exampleCn: newExampleCn.trim() || `单词“${newWord}”非常实用。`,
      mnemonic: newMnemonic.trim(),
      category: newCategory,
      difficulty: 'medium',
      masteryLevel: 0,
      isBookmarked: true,
      lastPracticed: Date.now(),
    };

    onAddWord(created);
    setShowAddModal(false);

    // Reset form
    setNewWord('');
    setNewPhonetic('');
    setNewMeaning('');
    setNewExampleEn('');
    setNewExampleCn('');
    setNewMnemonic('');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(words, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wordpulse_vocabulary_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 py-3 space-y-3 select-none pb-20">
      
      {/* Mobile Stats & Overview Card */}
      <div className="bg-slate-850/95 p-3.5 rounded-3xl border border-slate-700/80 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-black text-white">生词本与词库</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportJson}
              title="导出词库"
              className="p-1.5 bg-slate-800 active:scale-90 text-slate-300 rounded-xl border border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playSelect();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>加生词</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">总收录</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">{totalCount}</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-emerald-400">已掌握</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{masteredCount}</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-amber-400">复习中</div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{learningCount}</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="text-[10px] text-rose-400">待强化</div>
            <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{rawCount}</div>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="space-y-1 pt-0.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>掌握率</span>
            <span className="font-bold text-indigo-300">{masteryPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(masteredCount / (totalCount || 1)) * 100}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${(learningCount / (totalCount || 1)) * 100}%` }}
              className="bg-amber-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${(rawCount / (totalCount || 1)) * 100}%` }}
              className="bg-rose-500 h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索单词、释义或例句..."
            className="w-full pl-8 pr-8 py-2 bg-slate-850/90 border border-slate-700/80 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <button
            onClick={() => setOnlyBookmarked((b) => !b)}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1 ${
              onlyBookmarked
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-850/90 text-amber-400 border border-slate-700/80'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>收藏 ({bookmarkedCount})</span>
          </button>

          {(
            [
              { id: 'all', label: '全部' },
              { id: 'daily', label: '日常' },
              { id: 'workplace', label: '职场' },
              { id: 'travel', label: '旅行' },
              { id: 'fantasy', label: '奇幻' },
              { id: 'emotion', label: '情感' },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all active:scale-95 ${
                categoryFilter === c.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-850/90 text-slate-400 border border-slate-700/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Batch Actions Bar (when items checked) */}
      {selectedWordIds.length > 0 && (
        <div className="fixed bottom-16 left-3 right-3 max-w-lg mx-auto z-40 bg-indigo-950/95 border border-indigo-500/70 p-2.5 rounded-2xl flex items-center justify-between shadow-2xl animate-slide-up">
          <div className="text-xs text-indigo-200 font-bold px-1">
            已选 {selectedWordIds.length} 词
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPlayGameWithWords(selectedWordIds)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 active:scale-95 text-white rounded-xl text-xs font-bold"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>专项消消乐</span>
            </button>
            <button
              onClick={() => onGoToStoryWithWords(selectedWordIds)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-600 active:scale-95 text-white rounded-xl text-xs font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>编入故事</span>
            </button>
            <button
              onClick={() => setSelectedWordIds([])}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Word Cards List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={
                filteredWords.length > 0 &&
                selectedWordIds.length === filteredWords.length
              }
              onChange={handleToggleSelectAll}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>全选当前 (共 {filteredWords.length} 条)</span>
          </label>
        </div>

        {filteredWords.map((word) => {
          const isSelected = selectedWordIds.includes(word.id);
          const masteryBadge = [
            { label: '生疏', bg: 'bg-rose-950/60 text-rose-300 border-rose-800' },
            { label: '学习中', bg: 'bg-amber-950/60 text-amber-300 border-amber-800' },
            { label: '熟悉', bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800' },
            { label: '已掌握', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' },
          ][word.masteryLevel];

          return (
            <div
              key={word.id}
              className={`p-3 rounded-2xl border transition-all select-none ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/70 shadow-md'
                  : 'bg-slate-850/90 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                
                {/* Checkbox + Word Info */}
                <div className="flex items-start gap-2.5 overflow-hidden">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectOne(word.id)}
                    className="mt-1 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base font-extrabold font-outfit text-white">
                        {word.word}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {word.phonetic}
                      </span>
                      <button
                        onClick={() => sound.speak(word.word)}
                        title="朗读"
                        className="p-1 text-slate-400 hover:text-indigo-300 active:scale-90"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meaning */}
                    <div className="text-xs font-semibold text-indigo-200 mt-0.5 truncate">
                      <span className="text-indigo-400 mr-1 text-[11px]">{word.partOfSpeech}</span>
                      {word.meaning}
                    </div>
                  </div>
                </div>

                {/* Right Bookmark & Mastery */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onToggleBookmark(word.id);
                    }}
                    className="p-1 text-slate-400 hover:text-amber-400 active:scale-90"
                  >
                    {word.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${masteryBadge.bg}`}>
                    {masteryBadge.label}
                  </span>
                </div>
              </div>

              {/* Mnemonic Hook */}
              {word.mnemonic && (
                <div className="mt-2 text-[10px] text-amber-200/90 bg-amber-950/20 border border-amber-500/20 p-1.5 rounded-xl flex items-start gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{word.mnemonic}</span>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateMastery(word.id, 0)}
                    className="px-2 py-0.5 rounded bg-slate-800 active:bg-rose-950 text-slate-400 hover:text-rose-300 text-[10px]"
                  >
                    生疏
                  </button>
                  <button
                    onClick={() => onUpdateMastery(word.id, 1)}
                    className="px-2 py-0.5 rounded bg-slate-800 active:bg-amber-950 text-slate-400 hover:text-amber-300 text-[10px]"
                  >
                    模糊
                  </button>
                  <button
                    onClick={() => onUpdateMastery(word.id, 3)}
                    className="px-2 py-0.5 rounded bg-slate-800 active:bg-emerald-950 text-slate-400 hover:text-emerald-300 text-[10px]"
                  >
                    掌握
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onGoToStoryWithWords([word.id])}
                    className="text-purple-400 hover:text-purple-300 font-bold text-[10px] flex items-center gap-0.5"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>看场景</span>
                  </button>
                  {word.id.startsWith('custom-') && (
                    <button
                      onClick={() => onDeleteWord(word.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Word Bottom Sheet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-3.5 animate-slide-up pb-safe">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>录入新单词到生词本</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Word input + AI Auto Complete */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="输入英语单词..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAiAutoComplete}
                  disabled={isAiFilling || !newWord.trim()}
                  className="px-2.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAiFilling ? '补全中' : 'AI智能补全'}</span>
                </button>
              </div>

              {/* Meaning & Phonetic */}
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  value={newPhonetic}
                  onChange={(e) => setNewPhonetic(e.target.value)}
                  placeholder="音标 /.../"
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="中文释义..."
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Mnemonic Hook */}
              <div>
                <textarea
                  rows={2}
                  value={newMnemonic}
                  onChange={(e) => setNewMnemonic(e.target.value)}
                  placeholder="💡 记忆法则 / 谐音梗 / 联想助记..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Example sentence */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={newExampleEn}
                  onChange={(e) => setNewExampleEn(e.target.value)}
                  placeholder="英文例句..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={newExampleCn}
                  onChange={(e) => setNewExampleCn(e.target.value)}
                  placeholder="例句中文翻译..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleSaveNewWord}
                disabled={!newWord.trim() || !newMeaning.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                保存生词
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
