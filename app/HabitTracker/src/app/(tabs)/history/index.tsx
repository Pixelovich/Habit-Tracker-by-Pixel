import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getDailyRecords } from '@/database/habits';
import { calculateDailyScore } from '@/services/scoring';
import type { DailyRecord } from '@/types/habits';

function formatDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (dateKey === todayKey) return 'Hoy';
  if (dateKey === yesterdayKey) return 'Ayer';
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function HistoryScreen() {
  const database = useSQLiteContext();
  const router = useRouter();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const task = setTimeout(() => {
      void getDailyRecords(database).then(setRecords).finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(task);
  }, [database]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>Historial</ThemedText>
        <ThemedText style={styles.subtitle}>Tus registros diarios</ThemedText>
        {loading ? <ActivityIndicator /> : records.length === 0 ? (
          <ThemedText style={styles.empty}>Todavía no hay días registrados.</ThemedText>
        ) : records.map((record) => {
          const score = calculateDailyScore(record);
          return (
            <Pressable key={record.date} onPress={() => router.push(`/history/${record.date}`)}>
              <ThemedView style={styles.card}>
                <ThemedText style={styles.date}>{formatDate(record.date)}</ThemedText>
                <ThemedText style={styles.score}>{score.score} / 100</ThemedText>
                <ThemedText style={styles.coverage}>{score.registeredCount} de {score.totalIndicators} registrados</ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.two },
  title: { fontSize: 32, marginTop: Spacing.two },
  subtitle: { opacity: 0.6, marginBottom: Spacing.two },
  empty: { marginTop: Spacing.four, opacity: 0.6 },
  card: { padding: Spacing.three, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)', marginBottom: Spacing.two },
  date: { fontSize: 16, fontWeight: '600' },
  score: { fontSize: 28, fontWeight: '700', marginTop: Spacing.one },
  coverage: { fontSize: 13, opacity: 0.6 },
});
