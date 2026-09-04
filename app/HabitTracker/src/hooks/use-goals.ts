import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { getGoals, saveGoal } from '@/database/settings';
import type { HabitGoal, HabitGoals, HabitType } from '@/types/habits';

type GoalChanges = Partial<Omit<HabitGoal, 'habitType'>>;

export function useGoals() {
  const database = useSQLiteContext();
  const [goals, setGoals] = useState<HabitGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setGoals(await getGoals(database));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('No se pudieron cargar los objetivos'));
    } finally {
      setLoading(false);
    }
  }, [database]);

  useEffect(() => {
    const loadTask = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(loadTask);
  }, [refresh]);

  const updateGoal = useCallback((habitType: HabitType, changes: GoalChanges) => {
    setGoals((current) => {
      if (!current) return current;
      return {
        ...current,
        [habitType]: { ...current[habitType], ...changes },
      };
    });
  }, []);

  const save = useCallback(async () => {
    if (!goals) return;
    try {
      setSaving(true);
      setError(null);
      await Promise.all(Object.values(goals).map((goal) => saveGoal(database, goal)));
      await refresh();
    } catch (saveError) {
      const nextError = saveError instanceof Error ? saveError : new Error('No se pudieron guardar los objetivos');
      setError(nextError);
      throw nextError;
    } finally {
      setSaving(false);
    }
  }, [database, goals, refresh]);

  return { goals, loading, saving, error, updateGoal, save, refresh };
}
