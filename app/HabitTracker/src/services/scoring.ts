import type { DailyRecord, ScoreResult } from '@/types/habits';

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

export function scoreTobacco(value: number): number {
  if (value <= 0) return 100;
  if (value === 1) return 70;
  if (value === 2) return 40;
  if (value === 3) return 20;
  return 0;
}

export function scoreAlcohol(value: number): number {
  if (value <= 0) return 100;
  if (value === 1) return 70;
  if (value === 2) return 40;
  return 0;
}

export function scoreExercise(value: number): number {
  return interpolate(value, [[0, 0], [15, 30], [30, 60], [45, 80], [60, 90], [75, 100]]);
}

export function scoreDiet(value: number): number {
  return value * 10;
}

export function scoreSleep(totalHours: number): number {
  if (totalHours < 5) return 20;
  return interpolate(totalHours, [[5, 40], [6, 60], [7, 80], [8, 100], [8.5, 98], [9, 95], [10, 90], [11, 85]]);
}

export function scoreAnxiety(value: number): number {
  return 100 - value * 10;
}

export function scoreWeight(value: number): number {
  return Math.max(70, 100 - Math.abs(value - 78) * 2);
}

export function scoreMotivation(value: number): number {
  return value * 10;
}

export function calculateDailyScore(record: DailyRecord | null): ScoreResult {
  if (!record) return createResult(0, 0);

  const scores: [number, number][] = [];
  if (isNumber(record.tobacco_cigarettes)) scores.push([WEIGHTS.tobacco, scoreTobacco(record.tobacco_cigarettes)]);
  if (isNumber(record.alcohol_units)) scores.push([WEIGHTS.alcohol, scoreAlcohol(record.alcohol_units)]);
  if (isNumber(record.exercise_minutes)) scores.push([WEIGHTS.exercise, scoreExercise(record.exercise_minutes)]);
  if (isNumber(record.diet_score)) scores.push([WEIGHTS.diet, scoreDiet(record.diet_score)]);
  if (isNumber(record.sleep_hours) && isNumber(record.sleep_minutes)) {
    scores.push([WEIGHTS.sleep, scoreSleep(record.sleep_hours + record.sleep_minutes / 60)]);
  }
  if (isNumber(record.anxiety_score)) scores.push([WEIGHTS.anxiety, scoreAnxiety(record.anxiety_score)]);
  if (isNumber(record.weight_kg)) scores.push([WEIGHTS.weight, scoreWeight(record.weight_kg)]);
  if (isNumber(record.motivation_score)) scores.push([WEIGHTS.motivation, scoreMotivation(record.motivation_score)]);

  const totalWeight = scores.reduce((sum, [weight]) => sum + weight, 0);
  const weightedScore = scores.reduce((sum, [weight, score]) => sum + weight * score, 0);
  return createResult(scores.length, totalWeight === 0 ? 0 : weightedScore / totalWeight);
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
