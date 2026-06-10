export interface Entry {
  id: string;
  text: string;
  question: string;
  timestamp: number;
  moodKeywords: string[];
  score: number;
  drawnCards: TarotCard[];
}

export interface Reading {
  id: string;
  question: string;
  cards: TarotCard[];
  interpretation?: string;
  timestamp: number;
}

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  meaning: string;
  upright: string;
  keywords: string[];
}

export interface WeeklyData {
  weekId: string;
  weekStart: number;
  weekEnd: number;
  dailyScores: { day: string; score: number; hasEntry: boolean; label: string }[];
  averageScore: number;
  lowestScore: number;
  lowestDay: string;
  encouragement: string;
}

export interface AppData {
  entries: Entry[];
  lastEntryDate: string | null;
  streak: number;
  readings: Reading[];
  weeklyArchive: WeeklyData[];
}

export type SectionId = 'hero' | 'draw' | 'crystal' | 'past' | 'index';
