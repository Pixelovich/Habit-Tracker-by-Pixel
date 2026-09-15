import { supabase } from '@/services/supabase';
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
  tobacco: {
    habitType: 'tobacco',
    targetValue: 0,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: null,
  },
  alcohol: {
    habitType: 'alcohol',
    targetValue: 0,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: null,
  },
  exercise: {
    habitType: 'exercise',
    targetValue: null,
    minimumValue: 45,
    maximumValue: 75,
    uninterrupted: null,
  },
  diet: {
    habitType: 'diet',
    targetValue: 10,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: null,
  },
  sleep: {
    habitType: 'sleep',
    targetValue: 480,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: true,
  },
  anxiety: {
    habitType: 'anxiety',
    targetValue: 0,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: null,
  },
  weight: {
    habitType: 'weight',
    targetValue: 78,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: null,
  },
  motivation: {
    habitType: 'motivation',
    targetValue: 10,
    minimumValue: null,
    maximumValue: null,
    uninterrupted: null,
  },
};

interface HabitGoalRow {
  habit_type: HabitType;
  target_value: number | null;
  minimum_value: number | null;
  maximum_value: number | null;
  uninterrupted: boolean | null;
}

function toHabitGoal(row: HabitGoalRow): HabitGoal {
  return {
    habitType: row.habit_type,
    targetValue: row.target_value,
    minimumValue: row.minimum_value,
    maximumValue: row.maximum_value,
    uninterrupted: row.uninterrupted,
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

export async function getGoals(): Promise<HabitGoals> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('habit_goals')
    .select(
      'habit_type, target_value, minimum_value, maximum_value, uninterrupted',
    )
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  const goals = { ...DEFAULT_HABIT_GOALS };

  for (const row of data ?? []) {
    goals[row.habit_type as HabitType] = toHabitGoal(row);
  }

  return goals;
}

export async function getGoal(
  habitType: HabitType,
): Promise<HabitGoal | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('habit_goals')
    .select(
      'habit_type, target_value, minimum_value, maximum_value, uninterrupted',
    )
    .eq('user_id', userId)
    .eq('habit_type', habitType)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toHabitGoal(data) : null;
}

export async function saveGoal(goal: HabitGoal): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('habit_goals')
    .upsert(
      {
        user_id: userId,
        habit_type: goal.habitType,
        target_value: goal.targetValue,
        minimum_value: goal.minimumValue,
        maximum_value: goal.maximumValue,
        uninterrupted: goal.uninterrupted,
      },
      {
        onConflict: 'user_id,habit_type',
      },
    );

  if (error) {
    throw error;
  }
}