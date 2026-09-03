export type WordCategory =
  | 'daily'
  | 'workplace'
  | 'travel'
  | 'fantasy'
  | 'emotion'
  | 'custom';

export type MasteryLevel = 0 | 1 | 2 | 3; // 0: 生疏, 1: 学习中, 2: 熟悉, 3: 已掌握

export interface WordItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleCn: string;
  mnemonic: string; // 联想助记法/谐音梗/词根记忆
  category: WordCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: MasteryLevel;
  isBookmarked?: boolean;
  practiceCount?: number;
  errorCount?: number;
  lastPracticed?: number;
}

export interface StoryVocabularyNote {
  word: string;
  meaning: string;
  contextTip: string;
}

export interface StoryQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface StoryScene {
  id: string;
  title: string;
  titleCn: string;
  category: WordCategory;
  tag: string;
  intro: string;
  targetWordIds: string[];
  targetWords: string[];
  contentEn: string;
  contentCn: string;
  vocabularyNotes: StoryVocabularyNote[];
  quiz?: StoryQuiz;
  isAiGenerated?: boolean;
  createdAt?: number;
}

export interface MatchCard {
  id: string; // unique card id for key
  wordId: string;
  text: string;
  type: 'en' | 'cn';
  phonetic?: string;
  isMatched: boolean;
  isSelected: boolean;
  isWrong: boolean;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  matches: number;
  errors: number;
  timeRemaining: number;
  wrongWordIds: string[];
}

export interface UserStats {
  totalPoints: number;
  streakDays: number;
  lastActiveDate: string;
  gamesPlayed: number;
  storiesRead: number;
  cardsReviewed: number;
}

export interface ChapterInfo {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  levelRange: [number, number];
}

export interface GameLevel {
  levelNumber: number;
  chapterId: number;
  title: string;
  subtitle: string;
  category: WordCategory;
  pairCount: number; // 4 or 6 pairs
  targetWordIds: string[];
}

export interface LevelProgressRecord {
  stars: number; // 0, 1, 2, 3
  highScore: number;
  maxCombo: number;
  completedAt?: number;
}
