import type { SQLiteDatabase } from 'expo-sqlite';

import type { HabitGoal, HabitGoals, HabitType } from '@/types/habits';

const HABIT_TYPES: HabitType[] = [
  'tobacco',
  'alcohol',
  'exercise',
  'diet',
  'sleep',
  'anxiety',
  'weight',
  'motivation',
];

export const DEFAULT_HABIT_GOALS: HabitGoals = {
  tobacco: { habitType: 'tobacco', targetValue: 0, minimumValue: null, maximumValue: null, uninterrupted: null },
  alcohol: { habitType: 'alcohol', targetValue: 0, minimumValue: null, maximumValue: null, uninterrupted: null },
  exercise: { habitType: 'exercise', targetValue: null, minimumValue: 45, maximumValue: 75, uninterrupted: null },
  diet: { habitType: 'diet', targetValue: 10, minimumValue: null, maximumValue: null, uninterrupted: null },
  sleep: { habitType: 'sleep', targetValue: 480, minimumValue: null, maximumValue: null, uninterrupted: true },
  anxiety: { habitType: 'anxiety', targetValue: 0, minimumValue: null, maximumValue: null, uninterrupted: null },
  weight: { habitType: 'weight', targetValue: 78, minimumValue: null, maximumValue: null, uninterrupted: null },
  motivation: { habitType: 'motivation', targetValue: 10, minimumValue: null, maximumValue: null, uninterrupted: null },
};

interface HabitGoalRow {
  habit_type: HabitType;
  target_value: number | null;
  minimum_value: number | null;
  maximum_value: number | null;
  uninterrupted: number | null;
}

function toHabitGoal(row: HabitGoalRow): HabitGoal {
  return {
    habitType: row.habit_type,
    targetValue: row.target_value,
    minimumValue: row.minimum_value,
    maximumValue: row.maximum_value,
    uninterrupted: row.uninterrupted == null ? null : row.uninterrupted === 1,
  };
}

export async function initializeGoalsTable(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS habit_goals (
      habit_type TEXT PRIMARY KEY NOT NULL,
      target_value REAL,
      minimum_value REAL,
      maximum_value REAL,
      uninterrupted INTEGER
    );
  `);

  for (const habitType of HABIT_TYPES) {
    const goal = DEFAULT_HABIT_GOALS[habitType];
    await database.runAsync(
      `INSERT INTO habit_goals (habit_type, target_value, minimum_value, maximum_value, uninterrupted)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(habit_type) DO NOTHING`,
      goal.habitType,
      goal.targetValue,
      goal.minimumValue,
      goal.maximumValue,
      goal.uninterrupted == null ? null : goal.uninterrupted ? 1 : 0,
    );
  }
}

export async function getGoals(database: SQLiteDatabase): Promise<HabitGoals> {
  const rows = await database.getAllAsync<HabitGoalRow>(
    'SELECT habit_type, target_value, minimum_value, maximum_value, uninterrupted FROM habit_goals',
  );
  const goals = { ...DEFAULT_HABIT_GOALS };
  for (const row of rows) goals[row.habit_type] = toHabitGoal(row);
  return goals;
}

export async function getGoal(database: SQLiteDatabase, habitType: HabitType): Promise<HabitGoal | null> {
  const row = await database.getFirstAsync<HabitGoalRow>(
    'SELECT habit_type, target_value, minimum_value, maximum_value, uninterrupted FROM habit_goals WHERE habit_type = ?',
    habitType,
  );
  return row ? toHabitGoal(row) : null;
}

export async function saveGoal(database: SQLiteDatabase, goal: HabitGoal): Promise<void> {
  await database.runAsync(
    `INSERT INTO habit_goals (habit_type, target_value, minimum_value, maximum_value, uninterrupted)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(habit_type) DO UPDATE SET
       target_value = excluded.target_value,
       minimum_value = excluded.minimum_value,
       maximum_value = excluded.maximum_value,
       uninterrupted = excluded.uninterrupted`,
    goal.habitType,
    goal.targetValue,
    goal.minimumValue,
    goal.maximumValue,
    goal.uninterrupted == null ? null : goal.uninterrupted ? 1 : 0,
  );
}
