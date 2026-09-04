/**
 * Tipos de datos para los hábitos y su seguimiento
 */

export type HabitType = 'tobacco' | 'alcohol' | 'exercise' | 'diet' | 'sleep' | 'anxiety' | 'weight' | 'motivation';

export interface HabitIndicator {
  id: HabitType;
  name: string;
  value: string | number;
  unit: string;
  icon?: string;
  color?: string;
}

export interface DailyRecord {
  date: string;
  tobacco_cigarettes: number | null;
  alcohol_units: number | null;
  exercise_minutes: number | null;
  diet_score: number | null;
  sleep_hours: number | null;
  sleep_minutes: number | null;
  sleep_uninterrupted: number | null;
  anxiety_score: number | null;
  weight_kg: number | null;
  motivation_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface SleepValue {
  hours: number;
  minutes: number;
  uninterrupted: boolean;
}

export type HabitValue = number | SleepValue;

export interface ScoreResult {
  score: number;
  registeredCount: number;
  totalIndicators: number;
  coverage: number;
  current: number;
  maximum: number;
  target: number;
  percentage: number;
  streak: number;
}

export type DailyScore = ScoreResult;

export interface DailyData {
  date: Date;
  score: DailyScore;
  indicators: HabitIndicator[];
}

export interface HabitGoal {
  habitType: HabitType;
  targetValue: number | null;
  minimumValue: number | null;
  maximumValue: number | null;
  uninterrupted: boolean | null;
}

export type HabitGoals = Record<HabitType, HabitGoal>;

export type StatisticsPeriod = 7 | 30 | 90;

export interface DailyScorePoint {
  date: string;
  score: number | null;
}

export interface IndicatorStatistics {
  id: HabitType;
  name: string;
  icon: string;
  primaryMetric: string;
  secondaryMetric: string | null;
  trend: number | null;
  recordsCount: number;
}

export interface StatisticsData {
  averageScore: number;
  bestDay: { date: string; score: number } | null;
  worstDay: { date: string; score: number } | null;
  daysWithRecords: number;
  completeDays: number;
  averageCoverage: number;
  currentStreak: number;
  scoreEvolution: DailyScorePoint[];
  indicators: IndicatorStatistics[];
}
