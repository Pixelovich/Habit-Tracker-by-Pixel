import { DEFAULT_HABIT_GOALS } from '@/database/settings';
import type { DailyRecord, HabitGoals, ScoreResult } from '@/types/habits';

const TOTAL_INDICATORS = 8;
const WEIGHTS = {
  tobacco: 20,
  alcohol: 15,
  exercise: 15,
  diet: 15,
  sleep: 15,
  anxiety: 10,
  weight: 5,
  motivation: 5,
} as const;

type ScorePoint = [value: number, score: number];

function interpolate(value: number, points: ScorePoint[]): number {
  if (value <= points[0][0]) return points[0][1];
  for (let index = 1; index < points.length; index += 1) {
    const [upperValue, upperScore] = points[index];
    const [lowerValue, lowerScore] = points[index - 1];
    if (value <= upperValue) {
      const fraction = (value - lowerValue) / (upperValue - lowerValue);
      return lowerScore + fraction * (upperScore - lowerScore);
    }
  }
  return points[points.length - 1][1];
}

function isNumber(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value);
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPreviousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return getDateKey(date);
}

export function scoreTobacco(value: number, targetValue = 0): number {
  const difference = value - targetValue;
  if (difference <= 0) return 100;
  if (difference === 1) return 70;
  if (difference === 2) return 40;
  if (difference === 3) return 20;
  return 0;
}

export function scoreAlcohol(value: number, targetValue = 0): number {
  const difference = value - targetValue;
  if (difference <= 0) return 100;
  if (difference === 1) return 70;
  if (difference === 2) return 40;
  return 0;
}

export function scoreExercise(value: number, minimumValue = 45, maximumValue = 75): number {
  const range = maximumValue - minimumValue;
  return interpolate(value, [
    [0, 0],
    [minimumValue / 3, 30],
    [(minimumValue * 2) / 3, 60],
    [minimumValue, 80],
    [minimumValue + range / 2, 90],
    [maximumValue, 100],
  ]);
}

export function scoreDiet(value: number, targetValue = 10): number {
  return targetValue > 0 ? (value / targetValue) * 100 : 0;
}

export function scoreSleep(totalHours: number, targetMinutes = 480): number {
  const targetHours = targetMinutes / 60;
  const points: ScorePoint[] = [
    [targetHours - 3, 40],
    [targetHours - 2, 60],
    [targetHours - 1, 80],
    [targetHours, 100],
    [targetHours + 0.5, 98],
    [targetHours + 1, 95],
    [targetHours + 2, 90],
    [targetHours + 3, 85],
  ];
  if (totalHours < targetHours - 3) return 20;
  return interpolate(totalHours, points);
}

export function scoreAnxiety(value: number, targetValue = 0): number {
  return 100 - (value - targetValue) * 10;
}

export function scoreWeight(value: number, targetValue = 78): number {
  return Math.max(70, 100 - Math.abs(value - targetValue) * 2);
}

export function scoreMotivation(value: number, targetValue = 10): number {
  return targetValue > 0 ? (value / targetValue) * 100 : 0;
}

export function calculateDailyScore(record: DailyRecord | null, goals: HabitGoals = DEFAULT_HABIT_GOALS): ScoreResult {
  if (!record) return createResult(0, 0);

  const scores: [number, number][] = [];
  if (isNumber(record.tobacco_cigarettes)) scores.push([WEIGHTS.tobacco, scoreTobacco(record.tobacco_cigarettes, goals.tobacco.targetValue ?? 0)]);
  if (isNumber(record.alcohol_units)) scores.push([WEIGHTS.alcohol, scoreAlcohol(record.alcohol_units, goals.alcohol.targetValue ?? 0)]);
  if (isNumber(record.exercise_minutes)) scores.push([WEIGHTS.exercise, scoreExercise(record.exercise_minutes, goals.exercise.minimumValue ?? 45, goals.exercise.maximumValue ?? 75)]);
  if (isNumber(record.diet_score)) scores.push([WEIGHTS.diet, scoreDiet(record.diet_score, goals.diet.targetValue ?? 10)]);
  if (isNumber(record.sleep_hours) && isNumber(record.sleep_minutes)) {
    scores.push([WEIGHTS.sleep, scoreSleep(record.sleep_hours + record.sleep_minutes / 60, goals.sleep.targetValue ?? 480)]);
  }
  if (isNumber(record.anxiety_score)) scores.push([WEIGHTS.anxiety, scoreAnxiety(record.anxiety_score, goals.anxiety.targetValue ?? 0)]);
  if (isNumber(record.weight_kg)) scores.push([WEIGHTS.weight, scoreWeight(record.weight_kg, goals.weight.targetValue ?? 78)]);
  if (isNumber(record.motivation_score)) scores.push([WEIGHTS.motivation, scoreMotivation(record.motivation_score, goals.motivation.targetValue ?? 10)]);

  const totalWeight = scores.reduce((sum, [weight]) => sum + weight, 0);
  const weightedScore = scores.reduce((sum, [weight, score]) => sum + weight * score, 0);
  return createResult(scores.length, totalWeight === 0 ? 0 : weightedScore / totalWeight);
}

export function calculateStreak(records: DailyRecord[], goals?: HabitGoals): number {
  const recordsByDate = new Map(records.map((record) => [record.date, record]));
  const dates = [...recordsByDate.keys()].sort().reverse();
  if (dates.length === 0) return 0;

  let streak = 0;
  let dateKey = dates[0];
  while (true) {
    const record = recordsByDate.get(dateKey);
    const score = calculateDailyScore(record ?? null, goals);
    if (!record || score.registeredCount !== score.totalIndicators || score.score < 80) break;
    streak += 1;
    dateKey = getPreviousDateKey(dateKey);
  }
  return streak;
}

function createResult(registeredCount: number, rawScore: number): ScoreResult {
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const coverage = Math.round((registeredCount / TOTAL_INDICATORS) * 100);
  return {
    score,
    registeredCount,
    totalIndicators: TOTAL_INDICATORS,
    coverage,
    current: score,
    maximum: 100,
    target: 80,
    percentage: score,
    streak: 0,
  };
}
