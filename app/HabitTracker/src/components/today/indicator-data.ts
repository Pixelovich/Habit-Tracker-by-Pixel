import type { DailyRecord, HabitIndicator, HabitType } from '@/types/habits';

export const INDICATOR_INFO: { id: HabitType; name: string; unit: string; icon: string }[] = [
  { id: 'tobacco', name: 'Tabaco', unit: 'cigarrillos', icon: '🚭' },
  { id: 'alcohol', name: 'Alcohol', unit: 'unidades', icon: '🍺' },
  { id: 'exercise', name: 'Ejercicio', unit: 'minutos', icon: '🏃' },
  { id: 'diet', name: 'Dieta', unit: 'puntuación', icon: '🥗' },
  { id: 'sleep', name: 'Sueño', unit: 'duración', icon: '😴' },
  { id: 'anxiety', name: 'Ansiedad', unit: 'nivel', icon: '😰' },
  { id: 'weight', name: 'Peso', unit: 'kg', icon: '⚖️' },
  { id: 'motivation', name: 'Motivación', unit: 'nivel', icon: '🔥' },
];

export function getIndicators(record: DailyRecord | null): HabitIndicator[] {
  const values = {
    tobacco: record?.tobacco_cigarettes,
    alcohol: record?.alcohol_units,
    exercise: record?.exercise_minutes,
    diet: record?.diet_score == null ? null : `${record.diet_score}/10`,
    sleep: record?.sleep_hours == null || record.sleep_minutes == null
      ? null
      : `${record.sleep_hours} h ${record.sleep_minutes} min`,
    anxiety: record?.anxiety_score == null ? null : `${record.anxiety_score}/10`,
    weight: record?.weight_kg,
    motivation: record?.motivation_score == null ? null : `${record.motivation_score}/10`,
  };

  return INDICATOR_INFO.map((indicator) => ({
    ...indicator,
    value: values[indicator.id] ?? 'Sin registrar',
  }));
}
