import { INDICATOR_INFO } from '@/components/today/indicator-data';
import { calculateDailyScore, calculateStreak } from '@/services/scoring';
import type {
  DailyRecord,
  DailyScorePoint,
  HabitType,
  IndicatorStatistics,
  StatisticsData,
} from '@/types/habits';

type NumericValue = number | null;

function isNumber(value: NumericValue): value is number {
  return value != null && Number.isFinite(value);
}

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getSleepHours(record: DailyRecord): NumericValue {
  if (!isNumber(record.sleep_hours) || !isNumber(record.sleep_minutes)) return null;
  return record.sleep_hours + record.sleep_minutes / 60;
}

function getIndicatorValue(record: DailyRecord, id: HabitType): NumericValue {
  switch (id) {
    case 'tobacco': return record.tobacco_cigarettes;
    case 'alcohol': return record.alcohol_units;
    case 'exercise': return record.exercise_minutes;
    case 'diet': return record.diet_score;
    case 'sleep': return getSleepHours(record);
    case 'anxiety': return record.anxiety_score;
    case 'weight': return record.weight_kg;
    case 'motivation': return record.motivation_score;
  }
}

function formatValue(value: number, suffix = ''): string {
  return `${round(value)}${suffix}`;
}

function formatSigned(value: number, suffix = ''): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${round(value)}${suffix}`;
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStatisticsDateRange(period: 7 | 30 | 90, endDate = new Date()): { startDate: string; endDate: string } {
  const start = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - period + 1);
  return { startDate: getDateKey(start), endDate: getDateKey(endDate) };
}

export function calculateScoreEvolution(records: DailyRecord[], startDate: string, endDate: string): DailyScorePoint[] {
  const recordsByDate = new Map(records.map((record) => [record.date, record]));
  const points: DailyScorePoint[] = [];
  const current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  while (current <= end) {
    const date = getDateKey(current);
    const record = recordsByDate.get(date);
    points.push({ date, score: record ? calculateDailyScore(record).score : null });
    current.setDate(current.getDate() + 1);
  }
  return points;
}

function calculateIndicatorStatistics(records: DailyRecord[]): IndicatorStatistics[] {
  return INDICATOR_INFO.map((indicator) => {
    const values = records
      .map((record) => getIndicatorValue(record, indicator.id))
      .filter(isNumber);
    const first = values[0];
    const last = values[values.length - 1];
    const trend = values.length > 1 ? last - first : null;
    let primaryMetric = indicator.id === 'weight' ? 'Sin datos' : 'Sin registrar';
    let secondaryMetric: string | null = null;

    if (values.length > 0) {
      switch (indicator.id) {
        case 'tobacco': primaryMetric = formatValue(average(values), ' cig/día'); break;
        case 'alcohol': primaryMetric = formatValue(average(values), ' ud/día'); break;
        case 'exercise':
          primaryMetric = formatValue(average(values), ' min/día');
          secondaryMetric = `${values.filter((value) => value > 0).length} días con ejercicio`;
          break;
        case 'diet': primaryMetric = `${formatValue(average(values))}/10`; break;
        case 'sleep': primaryMetric = formatValue(average(values), ' h'); break;
        case 'anxiety': primaryMetric = `${formatValue(average(values))}/10`; break;
        case 'weight':
          primaryMetric = formatValue(last, ' kg');
          secondaryMetric = trend == null ? null : `Cambio: ${formatSigned(trend, ' kg')}`;
          break;
        case 'motivation': primaryMetric = `${formatValue(average(values))}/10`; break;
      }
    }

    return {
      id: indicator.id,
      name: indicator.name,
      icon: indicator.icon,
      primaryMetric,
      secondaryMetric,
      trend,
      recordsCount: values.length,
    };
  });
}

export function calculateStatistics(records: DailyRecord[], startDate: string, endDate: string): StatisticsData {
  const dailyScores = records.map((record) => ({ record, score: calculateDailyScore(record) }));
  const scoredDays = dailyScores.filter(({ score }) => score.registeredCount > 0);
  const orderedScores = [...scoredDays].sort((left, right) => right.score.score - left.score.score);
  const best = orderedScores[0];
  const worst = orderedScores[orderedScores.length - 1];

  return {
    averageScore: round(average(scoredDays.map(({ score }) => score.score)), 0),
    bestDay: best ? { date: best.record.date, score: best.score.score } : null,
    worstDay: worst ? { date: worst.record.date, score: worst.score.score } : null,
    daysWithRecords: scoredDays.length,
    completeDays: dailyScores.filter(({ score }) => score.registeredCount === score.totalIndicators).length,
    averageCoverage: round(average(scoredDays.map(({ score }) => score.coverage)), 0),
    currentStreak: calculateStreak(records),
    scoreEvolution: calculateScoreEvolution(records, startDate, endDate),
    indicators: calculateIndicatorStatistics(records),
  };
}