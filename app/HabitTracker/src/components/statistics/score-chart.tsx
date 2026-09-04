import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { DailyScorePoint } from '@/types/habits';

interface ScoreChartProps {
  points: DailyScorePoint[];
}

function formatDate(dateKey: string): string {
  const [, month, day] = dateKey.split('-').map(Number);
  return `${day}/${month}`;
}

export function ScoreChart({ points }: ScoreChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(260, Math.min(width - 80, 720));
  const plotWidth = chartWidth - 34;
  const columnWidth = plotWidth / Math.max(points.length, 1);

  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.title}>Evolución de puntuación</ThemedText>
      <View style={[styles.chart, { width: chartWidth }]}>
        <View style={styles.axisLabels}>
          <ThemedText style={styles.axisText}>100</ThemedText>
          <ThemedText style={styles.axisText}>50</ThemedText>
          <ThemedText style={styles.axisText}>0</ThemedText>
        </View>
        <View style={[styles.plot, { width: plotWidth }]}>
          {[0, 50, 100].map((value) => (
            <View key={value} style={[styles.gridLine, { bottom: `${value}%` }]} />
          ))}
          <View style={styles.columns}>
            {points.map((point) => (
              <View key={point.date} style={[styles.column, { width: columnWidth }]}>
                <View
                  style={[
                    styles.bar,
                    point.score == null ? styles.emptyBar : styles.scoreBar,
                    { height: point.score == null ? 8 : `${Math.max(point.score, 3)}%` },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.dateAxis, { marginLeft: 34, width: plotWidth }]}>
        {points.map((point, index) => {
          const showLabel = points.length <= 10 || index === 0 || index === Math.floor(points.length / 2) || index === points.length - 1;
          return <ThemedText key={point.date} style={[styles.date, { width: columnWidth }]}>{showLabel ? formatDate(point.date) : ''}</ThemedText>;
        })}
      </View>
      <ThemedText style={styles.legend}>Las barras grises indican días sin registros.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)', overflow: 'hidden' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.three },
  chart: { height: 150, flexDirection: 'row' },
  axisLabels: { width: 30, justifyContent: 'space-between', paddingBottom: 2 },
  axisText: { fontSize: 10, opacity: 0.55 },
  plot: { height: 130, position: 'relative', justifyContent: 'flex-end' },
  gridLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderTopColor: 'rgba(0, 0, 0, 0.08)' },
  columns: { height: '100%', flexDirection: 'row', alignItems: 'flex-end' },
  column: { height: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 2 },
  bar: { width: '100%', maxWidth: 24, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  scoreBar: { backgroundColor: '#2196F3' },
  emptyBar: { backgroundColor: '#D6D9DE' },
  dateAxis: { flexDirection: 'row', marginTop: Spacing.one },
  date: { fontSize: 10, textAlign: 'center', opacity: 0.6 },
  legend: { fontSize: 11, opacity: 0.55, marginTop: Spacing.two },
});