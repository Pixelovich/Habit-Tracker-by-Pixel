import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { IndicatorStatistics } from '@/types/habits';

interface IndicatorStatCardProps {
  indicator: IndicatorStatistics;
}

export function IndicatorStatCard({ indicator }: IndicatorStatCardProps) {
  const trend = indicator.trend == null ? null : `${indicator.trend > 0 ? '+' : ''}${indicator.trend.toFixed(1)}`;

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.icon}>{indicator.icon}</ThemedText>
        <ThemedText style={styles.name}>{indicator.name}</ThemedText>
      </View>
      <ThemedText style={styles.metric}>{indicator.primaryMetric}</ThemedText>
      {indicator.secondaryMetric ? <ThemedText style={styles.secondary}>{indicator.secondaryMetric}</ThemedText> : null}
      {trend && !indicator.secondaryMetric ? <ThemedText style={styles.secondary}>Tendencia: {trend}</ThemedText> : null}
      <ThemedText style={styles.count}>{indicator.recordsCount} {indicator.recordsCount === 1 ? 'registro' : 'registros'}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 140, padding: Spacing.three, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.two },
  icon: { fontSize: 20 },
  name: { fontSize: 14, fontWeight: '600', flexShrink: 1 },
  metric: { fontSize: 17, fontWeight: '700' },
  secondary: { fontSize: 12, opacity: 0.65, marginTop: Spacing.one },
  count: { fontSize: 11, opacity: 0.5, marginTop: Spacing.two },
});