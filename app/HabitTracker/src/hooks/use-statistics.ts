import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { getDailyRecordsInRange } from '@/database/habits';
import { getGoals } from '@/database/settings';
import { calculateStatistics, getStatisticsDateRange } from '@/services/statistics';
import type { StatisticsData, StatisticsPeriod } from '@/types/habits';

export function useStatistics() {
  const database = useSQLiteContext();
  const [period, setPeriod] = useState<StatisticsPeriod>(7);
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const range = getStatisticsDateRange(period);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [records, goals] = await Promise.all([
        getDailyRecordsInRange(database, range.startDate, range.endDate),
        getGoals(database),
      ]);
      setData(calculateStatistics(records, range.startDate, range.endDate, goals));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('No se pudieron cargar las estadísticas'));
    } finally {
      setLoading(false);
    }
  }, [database, range.endDate, range.startDate]);

  useEffect(() => {
    const loadTask = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(loadTask);
  }, [refresh]);

  return { period, setPeriod, data, loading, error, refresh };
}