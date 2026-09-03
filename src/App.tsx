import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { WordMatchGame } from './components/WordMatchGame';
import { FlashcardDeck } from './components/FlashcardDeck';
import { StoryHub } from './components/StoryHub';
import { WordVault } from './components/WordVault';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { INITIAL_WORDS } from './data/words';
import { BUILTIN_STORIES } from './data/stories';
import { WordItem, StoryScene, UserStats, MasteryLevel } from './types';
import { sound } from './services/sound';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('match');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  
  const [words, setWords] = useState<WordItem[]>(() => {
    try {
      const saved = localStorage.getItem('wordpulse_words_v1');
      if (saved) {
        const parsed: WordItem[] = JSON.parse(saved);
        const savedMap = new Map(parsed.map((w) => [w.id, w]));
        
        // Merge initial words with any saved custom updates (mastery, bookmarks)
        const mergedInitial = INITIAL_WORDS.map((initWord) => {
          const savedItem = savedMap.get(initWord.id);
          return savedItem ? { ...initWord, ...savedItem } : initWord;
        });

        // Retain user's custom created words
        const customWords = parsed.filter(
          (w) => w.id.startsWith('custom-') || !INITIAL_WORDS.some((init) => init.id === w.id)
        );

        return [...customWords, ...mergedInitial];
      }
    } catch {}
    return INITIAL_WORDS;
  });

  const [customStories, setCustomStories] = useState<StoryScene[]>(() => {
    try {
      const saved = localStorage.getItem('wordpulse_custom_stories_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('wordpulse_stats_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      totalPoints: 120,
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      gamesPlayed: 5,
      storiesRead: 2,
      cardsReviewed: 18,
    };
  });

  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>(sound.getAccent());
  const [preSelectedWordIds, setPreSelectedWordIds] = useState<string[]>([]);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);

  // Sync words to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wordpulse_words_v1', JSON.stringify(words));
    } catch {}
  }, [words]);

  // Sync custom stories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wordpulse_custom_stories_v1', JSON.stringify(customStories));
    } catch {}
  }, [customStories]);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wordpulse_stats_v1', JSON.stringify(userStats));
    } catch {}
  }, [userStats]);

  // Points & Streaks Helper
  const addPoints = (pts: number) => {
    setUserStats((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + pts,
    }));
  };

  // Word Mastery Updates
  const handleUpdateMastery = (wordId: string, levelOrDelta: MasteryLevel | number) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id === wordId) {
          let nextLevel: MasteryLevel = w.masteryLevel;
          if (typeof levelOrDelta === 'number' && (levelOrDelta === 1 || levelOrDelta === -1)) {
            nextLevel = Math.max(0, Math.min(3, w.masteryLevel + levelOrDelta)) as MasteryLevel;
          } else {
            nextLevel = levelOrDelta as MasteryLevel;
          }
          return {
            ...w,
            masteryLevel: nextLevel,
            lastPracticed: Date.now(),
            practiceCount: (w.practiceCount || 0) + 1,
          };
        }
        return w;
      })
    );
  };

  const handleToggleBookmark = (wordId: string) => {
    sound.playSelect();
    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, isBookmarked: !w.isBookmarked } : w))
    );
  };

  const handleBookmarkWord = (wordId: string) => {
    sound.playSelect();
    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, isBookmarked: true } : w))
    );
  };

  const handleAddCustomWord = (newWord: WordItem) => {
    setWords((prev) => [newWord, ...prev]);
    addPoints(10);
  };

  const handleDeleteWord = (wordId: string) => {
    sound.playSelect();
    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  const handleSaveNewStory = (story: StoryScene) => {
    setCustomStories((prev) => [story, ...prev]);
    setUserStats((prev) => ({
      ...prev,
      storiesRead: prev.storiesRead + 1,
    }));
  };

  // Cross-Navigation handlers
  const handleGoToStoryWithWords = (wordIds: string[]) => {
    sound.playSelect();
    setPreSelectedWordIds(wordIds);
    setCurrentTab('stories');
  };

  const handlePlayGameWithWords = (wordIds: string[]) => {
    sound.playSelect();
    setCurrentTab('match');
  };

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  const handleToggleAccent = () => {
    const nextAccent = accent === 'en-US' ? 'en-GB' : 'en-US';
    sound.setAccent(nextAccent);
    setAccent(nextAccent);
  };

  const bookmarkedCount = words.filter((w) => w.isBookmarked).length;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-indigo-500 selection:text-white ${
      isPhoneFrame ? 'md:py-8 md:px-4' : ''
    }`}>
      
      {/* Mobile Frame Shell */}
      <div className={`w-full flex flex-col transition-all duration-300 ${
        isPhoneFrame
          ? 'md:max-w-[430px] md:min-h-[860px] md:h-[88vh] md:max-h-[920px] md:rounded-[48px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.2)] md:overflow-hidden md:relative md:bg-slate-900'
          : 'max-w-md md:max-w-lg min-h-screen bg-slate-900'
      }`}>
        
        {/* Phone Dynamic Island Mockup Bar (Desktop phone frame only) */}
        {isPhoneFrame && (
          <div className="hidden md:flex items-center justify-center pt-2 pb-1 bg-slate-900 select-none">
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-between px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/80 border border-indigo-500/40" />
            </div>
          </div>
        )}

        {/* Top Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userStats={userStats}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          accent={accent}
          onToggleAccent={handleToggleAccent}
          onOpenDeployModal={() => setShowDeployModal(true)}
          bookmarkedCount={bookmarkedCount}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame((f) => !f)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto no-scrollbar pb-20 ${
          isPhoneFrame ? 'md:h-[calc(100%-120px)]' : ''
        }`}>
          {currentTab === 'match' && (
            <WordMatchGame
              words={words}
              onAddPoints={addPoints}
              onUpdateWordMastery={(id, delta) => handleUpdateMastery(id, delta)}
              onGoToStoryWithWords={handleGoToStoryWithWords}
              onBookmarkWord={handleBookmarkWord}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardDeck
              words={words}
              onUpdateWordMastery={handleUpdateMastery}
              onToggleBookmark={handleToggleBookmark}
              onGoToStoryWithWords={handleGoToStoryWithWords}
              onAddPoints={addPoints}
            />
          )}

          {currentTab === 'stories' && (
            <StoryHub
              builtinStories={BUILTIN_STORIES}
              customStories={customStories}
              allWords={words}
              preSelectedWordIds={preSelectedWordIds}
              onSaveNewStory={handleSaveNewStory}
              onPlayGameWithWords={handlePlayGameWithWords}
              onAddPoints={addPoints}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentTab === 'vault' && (
            <WordVault
              words={words}
              onAddWord={handleAddCustomWord}
              onDeleteWord={handleDeleteWord}
              onUpdateMastery={handleUpdateMastery}
              onToggleBookmark={handleToggleBookmark}
              onPlayGameWithWords={handlePlayGameWithWords}
              onGoToStoryWithWords={handleGoToStoryWithWords}
              onOpenWordDetail={(w) => sound.speak(w.word)}
            />
          )}
        </main>

        {/* Deployment Instructions Modal */}
        <DeploymentGuideModal
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
        />
      </div>
    </div>
  );
}
