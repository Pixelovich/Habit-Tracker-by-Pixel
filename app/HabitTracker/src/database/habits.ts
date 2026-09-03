import type { SQLiteDatabase } from 'expo-sqlite';

import type { HabitType, HabitValue, DailyRecord } from '@/types/habits';

const HABIT_COLUMNS: Record<HabitType, string[]> = {
  tobacco: ['tobacco_cigarettes'],
  alcohol: ['alcohol_units'],
  exercise: ['exercise_minutes'],
  diet: ['diet_score'],
  sleep: ['sleep_hours', 'sleep_minutes', 'sleep_uninterrupted'],
  anxiety: ['anxiety_score'],
  weight: ['weight_kg'],
  motivation: ['motivation_score'],
};

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS daily_records (
      date TEXT PRIMARY KEY NOT NULL,
      tobacco_cigarettes INTEGER,
      alcohol_units REAL,
      exercise_minutes INTEGER,
      diet_score INTEGER,
      sleep_hours INTEGER,
      sleep_minutes INTEGER,
      sleep_uninterrupted INTEGER,
      anxiety_score INTEGER,
      weight_kg REAL,
      motivation_score INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailyRecord(
  database: SQLiteDatabase,
  date = getLocalDateKey(),
): Promise<DailyRecord | null> {
  return database.getFirstAsync<DailyRecord>(
    'SELECT * FROM daily_records WHERE date = ?',
    date,
  );
}

export async function saveHabitValue(
  database: SQLiteDatabase,
  habitType: HabitType,
  value: HabitValue,
  date = getLocalDateKey(),
) {
  const now = new Date().toISOString();
  const columns = HABIT_COLUMNS[habitType];
  const values = habitType === 'sleep'
    ? [
        date,
        (value as { hours: number }).hours,
        (value as { minutes: number }).minutes,
        (value as { uninterrupted: boolean }).uninterrupted ? 1 : 0,
        now,
        now,
      ]
    : [date, value as number, now, now];
  const insertColumns = ['date', ...columns, 'created_at', 'updated_at'];
  const placeholders = insertColumns.map(() => '?').join(', ');
  const updates = columns.map((column) => `${column} = excluded.${column}`).join(', ');

  await database.runAsync(
    `INSERT INTO daily_records (${insertColumns.join(', ')}) VALUES (${placeholders})
     ON CONFLICT(date) DO UPDATE SET ${updates}, updated_at = excluded.updated_at`,
    ...values,
  );
}
