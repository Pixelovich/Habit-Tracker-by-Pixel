import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { IndicatorStatCard } from '@/components/statistics/indicator-stat-card';
import { ScoreChart } from '@/components/statistics/score-chart';
import { SummaryCard } from '@/components/statistics/summary-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useStatistics } from '@/hooks/use-statistics';
import type { StatisticsPeriod } from '@/types/habits';

export default function StatisticsScreen() {
  const { period, setPeriod, data, loading, error, refresh } = useStatistics();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <ThemedText type="title" style={styles.title}>Estadísticas</ThemedText>
          <View style={styles.periods}>
            {[7, 30, 90].map((option) => {
              const selected = period === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setPeriod(option as StatisticsPeriod)}
                  style={[styles.periodButton, selected && styles.periodButtonSelected]}
                >
                  <ThemedText style={[styles.periodText, selected && styles.periodTextSelected]}>{option} días</ThemedText>
                </Pressable>
              );
            })}
          </View>

          {loading ? (
            <View style={styles.state}><ActivityIndicator color="#2196F3" /></View>
          ) : error ? (
            <View style={styles.state}>
              <ThemedText style={styles.stateTitle}>No se pudieron cargar las estadísticas.</ThemedText>
              <Pressable onPress={() => void refresh()} style={styles.retryButton}>
                <ThemedText style={styles.retryText}>Reintentar</ThemedText>
              </Pressable>
            </View>
          ) : data?.daysWithRecords === 0 ? (
            <View style={styles.state}>
              <ThemedText style={styles.stateTitle}>Todavía no hay datos para este periodo.</ThemedText>
              <ThemedText style={styles.stateMessage}>Registra tus hábitos para empezar a ver tu evolución.</ThemedText>
            </View>
          ) : data ? (
            <>
              <SummaryCard data={data} />
              <ScoreChart points={data.scoreEvolution} />
              <ThemedText style={styles.sectionTitle}>Indicadores</ThemedText>
              <View style={styles.indicators}>
                {data.indicators.map((indicator) => <IndicatorStatCard key={indicator.id} indicator={indicator} />)}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.four, paddingBottom: Spacing.six },
  wrapper: { width: '100%', maxWidth: Platform.OS === 'web' ? MaxContentWidth : undefined, alignSelf: 'center', gap: Spacing.three },
  title: { fontSize: 32, marginTop: Spacing.two },
  periods: { flexDirection: 'row', gap: Spacing.two },
  periodButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.two, borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
  periodButtonSelected: { backgroundColor: '#2196F3' },
  periodText: { fontSize: 13, fontWeight: '600' },
  periodTextSelected: { color: '#FFFFFF' },
  state: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.six, gap: Spacing.two },
  stateTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  stateMessage: { opacity: 0.65, textAlign: 'center' },
  retryButton: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: 10, backgroundColor: '#2196F3' },
  retryText: { color: '#FFFFFF', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: Spacing.one },
  indicators: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
