import { useState, useCallback } from 'react';
import type { AppData, Entry, Reading, TarotCard, WeeklyData } from '@/types';
import { analyzeMood, getMoodLabel, getEncouragement, getWeeklyLowEncouragement } from '@/lib/tarotData';

const STORAGE_KEY = 'velvet-tarot-data-v2';

function getInitialData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return {
    entries: [],
    lastEntryDate: null,
    streak: 0,
    readings: [],
    weeklyArchive: [],
  };
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLocalStorage() {
  const [data, setData] = useState<AppData>(getInitialData);

  const addEntry = useCallback((text: string, question: string, drawnCards: TarotCard[]) => {
    const { score, keywords } = analyzeMood(text + ' ' + question);
    const now = Date.now();
    const today = new Date().toDateString();

    setData((prev) => {
      let newStreak = prev.streak;
      if (prev.lastEntryDate) {
        const lastDate = new Date(prev.lastEntryDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = prev.streak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newEntry: Entry = {
        id: `entry-${now}`,
        text,
        question,
        timestamp: now,
        moodKeywords: keywords,
        score,
        drawnCards,
      };

      // Check if we need to archive a completed week
      const newEntries = [newEntry, ...prev.entries];
      const updatedWeeklyArchive = updateWeeklyArchive(newEntries, [...prev.weeklyArchive]);

      const newData: AppData = {
        ...prev,
        entries: newEntries,
        lastEntryDate: today,
        streak: newStreak,
        weeklyArchive: updatedWeeklyArchive,
      };

      saveData(newData);
      return newData;
    });
  }, []);

  const addReading = useCallback((question: string, cards: TarotCard[], interpretation?: string) => {
    const newReading: Reading = {
      id: `reading-${Date.now()}`,
      question,
      cards,
      interpretation,
      timestamp: Date.now(),
    };

    setData((prev) => {
      const newData: AppData = {
        ...prev,
        readings: [newReading, ...prev.readings],
      };
      saveData(newData);
      return newData;
    });
  }, []);

  const getWeeklyScores = useCallback(() => {
    const now = Date.now();
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const result: { day: string; score: number; hasEntry: boolean; label: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toDateString();
      const dayEntries = data.entries.filter((e) => new Date(e.timestamp).toDateString() === dayStr);

      if (dayEntries.length > 0) {
        const avgScore = Math.round(dayEntries.reduce((sum, e) => sum + e.score, 0) / dayEntries.length);
        result.push({ day: days[d.getDay()], score: avgScore, hasEntry: true, label: getMoodLabel(avgScore) });
      } else {
        result.push({ day: days[d.getDay()], score: 0, hasEntry: false, label: '暂无记录' });
      }
    }

    return result;
  }, [data.entries]);

  const getAverageScore = useCallback(() => {
    if (data.entries.length === 0) return 0;
    return Math.round(data.entries.reduce((sum, e) => sum + e.score, 0) / data.entries.length);
  }, [data.entries]);

  const getCurrentWeekData = useCallback((): WeeklyData | null => {
    const weeklyScores = getWeeklyScores();
    const hasAnyEntry = weeklyScores.some((d) => d.hasEntry);
    if (!hasAnyEntry) return null;

    const validScores = weeklyScores.filter((d) => d.hasEntry).map((d) => d.score);
    const avg = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    const lowest = Math.min(...validScores);
    const lowestDay = weeklyScores.find((d) => d.score === lowest)?.day || '';

    return {
      weekId: `week-${Date.now()}`,
      weekStart: Date.now() - 6 * 24 * 60 * 60 * 1000,
      weekEnd: Date.now(),
      dailyScores: weeklyScores,
      averageScore: avg,
      lowestScore: lowest,
      lowestDay,
      encouragement: getEncouragement(avg),
    };
  }, [getWeeklyScores]);

  return {
    data,
    addEntry,
    addReading,
    getWeeklyScores,
    getAverageScore,
    getCurrentWeekData,
  };
}

function updateWeeklyArchive(entries: Entry[], _archive: WeeklyData[]): WeeklyData[] {
  // Group entries by week
  const weekMap = new Map<string, Entry[]>();

  entries.forEach((entry) => {
    const d = new Date(entry.timestamp);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toDateString();

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, []);
    }
    weekMap.get(weekKey)!.push(entry);
  });

  const newArchive: WeeklyData[] = [];

  weekMap.forEach((weekEntries, weekKey) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekStartDate = new Date(weekKey);
    const dailyScores = days.map((dayName, idx) => {
      const dayDate = new Date(weekStartDate);
      dayDate.setDate(weekStartDate.getDate() + idx);
      const dayStr = dayDate.toDateString();
      const dayEntries = weekEntries.filter((e) => new Date(e.timestamp).toDateString() === dayStr);

      if (dayEntries.length > 0) {
        const avgScore = Math.round(dayEntries.reduce((sum, e) => sum + e.score, 0) / dayEntries.length);
        return { day: dayName, score: avgScore, hasEntry: true, label: getMoodLabel(avgScore) };
      }
      return { day: dayName, score: 0, hasEntry: false, label: '暂无记录' };
    });

    const validScores = dailyScores.filter((d) => d.hasEntry).map((d) => d.score);
    if (validScores.length === 0) return;

    const avg = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    const lowest = Math.min(...validScores);
    const lowestDay = dailyScores.find((d) => d.score === lowest && d.hasEntry)?.day || '';

    newArchive.push({
      weekId: weekKey,
      weekStart: weekStartDate.getTime(),
      weekEnd: weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000,
      dailyScores,
      averageScore: avg,
      lowestScore: lowest,
      lowestDay,
      encouragement: getWeeklyLowEncouragement(),
    });
  });

  // Sort by week start, most recent first
  return newArchive.sort((a, b) => b.weekStart - a.weekStart);
}
