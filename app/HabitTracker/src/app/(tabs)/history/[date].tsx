import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HabitCard } from '@/components/today/habit-card';
import { RegisterForm } from '@/components/today/register-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getIndicators } from '@/components/today/indicator-data';
import { Spacing } from '@/constants/theme';
import { useDailyHabits } from '@/hooks/use-daily-habits';
import { calculateDailyScore } from '@/services/scoring';
import type { HabitType } from '@/types/habits';

function formatFullDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function HistoryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const selectedDate = Array.isArray(date) ? date[0] : date;
  const { record, save } = useDailyHabits(selectedDate);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
  const score = calculateDailyScore(record);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.back}>Volver</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>{formatFullDate(selectedDate)}</ThemedText>
        <View style={styles.scoreRow}>
          <ThemedText style={styles.score}>{score.score} / 100</ThemedText>
          <ThemedText style={styles.coverage}>{score.registeredCount} de {score.totalIndicators} registrados</ThemedText>
        </View>
        <View style={styles.indicators}>
          {getIndicators(record).map((indicator) => (
            <HabitCard key={indicator.id} indicator={indicator} onPress={() => {
              setSelectedHabit(indicator.id);
              setFormVisible(true);
            }} />
          ))}
        </View>
      </ScrollView>
      <RegisterForm
        visible={formVisible}
        habitType={selectedHabit}
        record={record}
        onCancel={() => setFormVisible(false)}
        onSave={async (value) => {
          if (selectedHabit) await save(selectedHabit, value);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.four },
  back: { color: '#2196F3', fontWeight: '600', marginBottom: Spacing.three },
  title: { fontSize: 28, lineHeight: 36, textTransform: 'capitalize' },
  scoreRow: { marginVertical: Spacing.four },
  score: { fontSize: 40, fontWeight: '700' },
  coverage: { fontSize: 13, opacity: 0.6, marginTop: Spacing.one },
  indicators: { marginHorizontal: -Spacing.four },
});
