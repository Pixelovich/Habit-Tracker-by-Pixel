import { useCallback, useEffect, useState } from 'react';

import {
  getDailyRecord,
  getLocalDateKey,
  saveHabitValue,
} from '@/database/habits';
import { getGoals } from '@/database/settings';
import { calculateDailyScore } from '@/services/scoring';
import type {
  DailyRecord,
  HabitGoals,
  HabitType,
  HabitValue,
} from '@/types/habits';

export function useDailyHabits(selectedDate?: string) {
  const date = selectedDate ?? getLocalDateKey();

  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [goals, setGoals] = useState<HabitGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [nextRecord, nextGoals] = await Promise.all([
        getDailyRecord(date),
        getGoals(),
      ]);

      setRecord(nextRecord);
      setGoals(nextGoals);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError
          : new Error('No se pudieron cargar los datos'),
      );
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    const loadTask = setTimeout(() => {
      void refresh();
    }, 0);

    return () => clearTimeout(loadTask);
  }, [refresh]);

  const save = useCallback(
    async (habitType: HabitType, value: HabitValue) => {
      await saveHabitValue(habitType, value, date);
      await refresh();
    },
    [date, refresh],
  );

  return {
    record,
    goals,
    score: calculateDailyScore(record, goals ?? undefined),
    loading,
    error,
    save,
    refresh,
  };
}