import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { getDailyRecord, getLocalDateKey, saveHabitValue } from '@/database/habits';
import { getGoals } from '@/database/settings';
import { calculateDailyScore } from '@/services/scoring';
import type { DailyRecord, HabitGoals, HabitType, HabitValue } from '@/types/habits';

export function useDailyHabits(selectedDate?: string) {
  const database = useSQLiteContext();
  const date = selectedDate ?? getLocalDateKey();
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [goals, setGoals] = useState<HabitGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [nextRecord, nextGoals] = await Promise.all([getDailyRecord(database, date), getGoals(database)]);
      setRecord(nextRecord);
      setGoals(nextGoals);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('No se pudieron cargar los datos'));
    } finally {
      setLoading(false);
    }
  }, [database, date]);

  useEffect(() => {
    const loadTask = setTimeout(() => {
      void refresh();
    }, 0);

    return () => clearTimeout(loadTask);
  }, [refresh]);

  const save = useCallback(async (habitType: HabitType, value: HabitValue) => {
    await saveHabitValue(database, habitType, value, date);
    await refresh();
  }, [database, date, refresh]);

  return { record, goals, score: calculateDailyScore(record, goals ?? undefined), loading, error, save, refresh };
}
