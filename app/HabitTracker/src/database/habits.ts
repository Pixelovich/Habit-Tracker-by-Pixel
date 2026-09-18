import { supabase } from '@/services/supabase';

import type { HabitType, HabitValue, DailyRecord } from '@/types/habits';

const HABIT_COLUMNS: Record<HabitType, string[]> = {
  tobacco: ['tobacco'],
  alcohol: ['alcohol'],
  exercise: ['exercise'],
  diet: ['diet'],
  sleep: ['sleep_hours', 'sleep_minutes', 'sleep_uninterrupted'],
  anxiety: ['anxiety'],
  weight: ['weight'],
  motivation: ['motivation'],
  hydration: ['hydration'],
  meditation: ['meditation'],
  reading: ['reading'],
  nap: ['nap'],
  sun_exposure: ['sun_exposure'],
  steps: ['steps'],
  housework: ['housework'],
  screen_time: ['screen_time'],
  phone_time: ['phone_time'],
  concentration: ['concentration'],
  sex: ['sex'],
  expenses: ['expenses'],
};

const DAILY_RECORD_COLUMNS = `
  date,
  tobacco,
  alcohol,
  exercise,
  diet,
  sleep_hours,
  sleep_minutes,
  sleep_uninterrupted,
  anxiety,
  weight,
  motivation,
  hydration,
  meditation,
  reading,
  nap,
  sun_exposure,
  steps,
  housework,
  screen_time,
  phone_time,
  concentration,
  sex,
  expenses,
  created_at,
  updated_at
`;

function toDailyRecord(row: {
  date: string;
  tobacco: number | null;
  alcohol: number | null;
  exercise: number | null;
  diet: number | null;
  sleep_hours: number | null;
  sleep_minutes: number | null;
  sleep_uninterrupted: boolean | null;
  anxiety: number | null;
  weight: number | null;
  motivation: number | null;
    hydration: number | null;
  meditation: number | null;
  reading: number | null;
  nap: number | null;
  sun_exposure: number | null;
  steps: number | null;
  housework: number | null;
  screen_time: number | null;
  phone_time: number | null;
  concentration: number | null;
  sex: number | null;
  expenses: number | null;
  created_at: string;
  updated_at: string;
}): DailyRecord {
  return {
    date: row.date,
    tobacco_cigarettes: row.tobacco,
    alcohol_units: row.alcohol,
    exercise_minutes: row.exercise,
    diet_score: row.diet,
    sleep_hours: row.sleep_hours,
    sleep_minutes: row.sleep_minutes,
    sleep_uninterrupted:
      row.sleep_uninterrupted == null
        ? null
        : row.sleep_uninterrupted
          ? 1
          : 0,
    anxiety_score: row.anxiety,
    weight_kg: row.weight,
    motivation_score: row.motivation,
        hydration_liters: row.hydration,
    meditation_minutes: row.meditation,
    reading_minutes: row.reading,
    nap_minutes: row.nap,
    sun_exposure_minutes: row.sun_exposure,
    steps_count: row.steps,
    housework_minutes: row.housework,
    screen_time_minutes: row.screen_time,
    phone_time_minutes: row.phone_time,
    concentration_score: row.concentration,
    sex: row.sex,
    expense_control: row.expenses,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('No hay ningún usuario autenticado');
  }

  return user.id;
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function getDailyRecord(
  date = getLocalDateKey(),
): Promise<DailyRecord | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('daily_records')
    .select(DAILY_RECORD_COLUMNS)
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toDailyRecord(data) : null;
}

export async function getDailyRecords(): Promise<DailyRecord[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('daily_records')
    .select(DAILY_RECORD_COLUMNS)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(toDailyRecord);
}

export async function getDailyRecordsInRange(
  startDate: string,
  endDate: string,
): Promise<DailyRecord[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('daily_records')
    .select(DAILY_RECORD_COLUMNS)
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(toDailyRecord);
}

export async function saveHabitValue(
  habitType: HabitType,
  value: HabitValue,
  date = getLocalDateKey(),
): Promise<void> {
  const userId = await getCurrentUserId();
  const columns = HABIT_COLUMNS[habitType];

  const payload: Record<string, string | number | boolean> = {
    user_id: userId,
    date,
  };

  if (habitType === 'sleep') {
    const sleepValue = value as {
      hours: number;
      minutes: number;
      uninterrupted: boolean;
    };

    payload.sleep_hours = sleepValue.hours;
    payload.sleep_minutes = sleepValue.minutes;
    payload.sleep_uninterrupted = sleepValue.uninterrupted;
  } else {
    payload[columns[0]] = value as number;
  }

  const { error } = await supabase
    .from('daily_records')
    .upsert(payload, {
      onConflict: 'user_id,date',
    });

  if (error) {
    throw error;
  }
}