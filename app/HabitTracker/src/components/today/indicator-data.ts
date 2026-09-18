import type {
  DailyRecord,
  HabitIndicator,
  HabitType,
  HabitGoals,
} from '@/types/habits';

export const INDICATOR_INFO: {
  id: HabitType;
  name: string;
  unit: string;
  icon: string;
}[] = [
  { id: 'tobacco', name: 'Tabaco', unit: 'cigarrillos', icon: '🚭' },
  { id: 'alcohol', name: 'Alcohol', unit: 'unidades', icon: '🍺' },
  { id: 'exercise', name: 'Ejercicio', unit: 'minutos', icon: '🏃' },
  { id: 'diet', name: 'Dieta', unit: 'puntuación', icon: '🥗' },
  { id: 'sleep', name: 'Sueño', unit: 'duración', icon: '😴' },
  { id: 'anxiety', name: 'Ansiedad', unit: 'nivel', icon: '😰' },
  { id: 'weight', name: 'Peso', unit: 'kg', icon: '⚖️' },
  { id: 'motivation', name: 'Motivación', unit: 'nivel', icon: '🔥' },

  { id: 'hydration', name: 'Hidratación', unit: 'litros', icon: '💧' },
  { id: 'meditation', name: 'Meditación', unit: 'minutos', icon: '🧘' },
  { id: 'reading', name: 'Lectura', unit: 'minutos', icon: '📚' },
  { id: 'nap', name: 'Descanso / siesta', unit: 'minutos', icon: '🥱' },
  { id: 'sun_exposure', name: 'Exposición al sol', unit: 'minutos', icon: '☀️' },
  { id: 'steps', name: 'Pasos diarios', unit: 'pasos', icon: '🚶' },
  { id: 'housework', name: 'Orden / tareas domésticas', unit: 'minutos', icon: '🧹' },
  { id: 'screen_time', name: 'Tiempo de pantalla', unit: 'minutos', icon: '🎮' },
  { id: 'phone_time', name: 'Tiempo de móvil', unit: 'minutos', icon: '📱' },
  { id: 'concentration', name: 'Concentración', unit: 'nivel', icon: '🧠' },
  { id: 'sex', name: 'Sexo', unit: 'sí / no', icon: '❤️' },
  { id: 'expenses', name: 'Control de gastos', unit: 'sí / no', icon: '💰' },
];

export function getIndicators(
  record: DailyRecord | null,
  goals?: HabitGoals | null,
): HabitIndicator[] {
  const values: Record<HabitType, string | number | null | undefined> = {
  tobacco: record?.tobacco_cigarettes,
  alcohol: record?.alcohol_units,
  exercise: record?.exercise_minutes,
  diet: record?.diet_score == null ? null : `${record.diet_score}/10`,
  sleep:
    record?.sleep_hours == null || record.sleep_minutes == null
      ? null
      : `${record.sleep_hours} h ${record.sleep_minutes} min`,
  anxiety:
    record?.anxiety_score == null ? null : `${record.anxiety_score}/10`,
  weight: record?.weight_kg,
  motivation:
    record?.motivation_score == null
      ? null
      : `${record.motivation_score}/10`,

  hydration: record?.hydration_liters,
  meditation: record?.meditation_minutes,
  reading: record?.reading_minutes,
  nap: record?.nap_minutes,
sun_exposure: record?.sun_exposure_minutes,
steps: record?.steps_count,
housework: record?.housework_minutes,
screen_time: record?.screen_time_minutes,
phone_time: record?.phone_time_minutes,
  concentration:
    record?.concentration_score == null
      ? null
      : `${record.concentration_score}/10`,
  sex: record?.sex == null ? null : record.sex ? 'Sí' : 'No',
  expenses:
    record?.expense_control == null
      ? null
      : record.expense_control
        ? 'Sí'
        : 'No',
};

  return INDICATOR_INFO
    .filter((indicator) => goals?.[indicator.id]?.enabled !== false)
    .map((indicator) => ({
      ...indicator,
      value: values[indicator.id] ?? 'Sin registrar',
    }));
}