import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { StatisticsData } from '@/types/habits';

interface SummaryCardProps {
  data: StatisticsData;
}

function formatDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function SummaryCard({ data }: SummaryCardProps) {
  const averageLabel = data.completeDays === 0 || data.completeDays < data.daysWithRecords
    ? 'Puntuación media provisional'
    : 'Puntuación media';
  const metrics = [
    [averageLabel, `${data.averageScore}`],
    ['Días registrados', `${data.daysWithRecords}`],
    ['Días completos', `${data.completeDays}`],
    ['Cobertura media', `${data.averageCoverage}%`],
    ['Racha actual', `${data.currentStreak} días`],
  ];

  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.title}>Resumen del periodo</ThemedText>
      <View style={styles.grid}>
        {metrics.map(([label, value]) => (
          <View key={label} style={styles.metric}>
            <ThemedText style={styles.value}>{value}</ThemedText>
            <ThemedText style={styles.label}>{label}</ThemedText>
          </View>
        ))}
      </View>
      {data.bestDay && data.worstDay ? (
        <ThemedText style={styles.detail}>
          Mejor día: {formatDate(data.bestDay.date)} ({data.bestDay.score}) · Peor día: {formatDate(data.worstDay.date)} ({data.worstDay.score})
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.three },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing.three },
  metric: { width: '33.33%', paddingRight: Spacing.two },
  value: { fontSize: 22, fontWeight: '700' },
  label: { fontSize: 12, opacity: 0.6, marginTop: Spacing.one },
  detail: { fontSize: 12, opacity: 0.6, marginTop: Spacing.three },
});