import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import { INDICATOR_INFO } from '@/components/today/indicator-data';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useGoals } from '@/hooks/use-goals';
import { useTheme } from '@/hooks/use-theme';
import type { HabitGoal, HabitType } from '@/types/habits';

function formatGoal(goal: HabitGoal): string {
  switch (goal.habitType) {
    case 'tobacco': return `${goal.targetValue ?? 0} cigarrillos`;
    case 'alcohol': return `${goal.targetValue ?? 0} unidades`;
    case 'exercise': return `${goal.minimumValue ?? 0}-${goal.maximumValue ?? 0} min`;
    case 'diet': return `${goal.targetValue ?? 0}/10`;
    case 'sleep': {
      const totalMinutes = goal.targetValue ?? 0;
      return `${Math.floor(totalMinutes / 60)} h ${totalMinutes % 60} min${goal.uninterrupted ? ' ininterrumpidas' : ''}`;
    }
    case 'anxiety': return `${goal.targetValue ?? 0}/10`;
    case 'weight': return `${goal.targetValue ?? 0} kg`;
    case 'motivation': return `${goal.targetValue ?? 0}/10`;
  }
}

function toNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function GoalInput({
  label,
  value,
  onChangeText,
  keyboardType = 'number-pad',
}: {
  label: string;
  value: number | null;
  onChangeText: (value: string) => void;
  keyboardType?: 'decimal-pad' | 'number-pad';
}) {
  const theme = useTheme();
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        value={value == null ? '' : String(value)}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
        selectTextOnFocus
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { goals, loading, saving, error, updateGoal, save } = useGoals();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await save();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <ThemedText type="title" style={styles.title}>Ajustes</ThemedText>
          <ThemedText style={styles.sectionTitle}>Mis objetivos</ThemedText>

          {loading || !goals ? (
            <View style={styles.state}><ActivityIndicator color="#2196F3" /></View>
          ) : (
            <>
              <View style={styles.goals}>
                {INDICATOR_INFO.map((indicator) => {
                  const goal = goals[indicator.id];
                  return (
                    <ThemedView key={indicator.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <ThemedText style={styles.icon}>{indicator.icon}</ThemedText>
                        <View style={styles.cardTitle}>
                          <ThemedText style={styles.name}>{indicator.name}</ThemedText>
                          <ThemedText style={styles.current}>Objetivo: {formatGoal(goal)}</ThemedText>
                        </View>
                      </View>

                      {indicator.id === 'exercise' ? (
                        <View style={styles.fieldsRow}>
                          <GoalInput label="Mínimo (min)" value={goal.minimumValue} onChangeText={(value) => updateGoal('exercise', { minimumValue: toNumber(value) })} />
                          <GoalInput label="Óptimo (min)" value={goal.maximumValue} onChangeText={(value) => updateGoal('exercise', { maximumValue: toNumber(value) })} />
                        </View>
                      ) : indicator.id === 'sleep' ? (
                        <>
                          <View style={styles.fieldsRow}>
                            <GoalInput
                              label="Horas"
                              value={goal.targetValue == null ? null : Math.floor(goal.targetValue / 60)}
                              onChangeText={(value) => {
                                const hours = toNumber(value) ?? 0;
                                const minutes = (goal.targetValue ?? 0) % 60;
                                updateGoal('sleep', { targetValue: hours * 60 + minutes });
                              }}
                            />
                            <GoalInput
                              label="Minutos"
                              value={goal.targetValue == null ? null : goal.targetValue % 60}
                              onChangeText={(value) => {
                                const minutes = toNumber(value) ?? 0;
                                const hours = Math.floor((goal.targetValue ?? 0) / 60);
                                updateGoal('sleep', { targetValue: hours * 60 + minutes });
                              }}
                            />
                          </View>
                          <View style={styles.switchRow}>
                            <ThemedText>Ininterrumpido</ThemedText>
                            <Switch value={goal.uninterrupted ?? false} onValueChange={(value) => updateGoal('sleep', { uninterrupted: value })} />
                          </View>
                        </>
                      ) : (
                        <GoalInput
                          label="Valor objetivo"
                          value={goal.targetValue}
                          keyboardType={indicator.id === 'weight' ? 'decimal-pad' : 'number-pad'}
                          onChangeText={(value) => updateGoal(indicator.id as HabitType, { targetValue: toNumber(value) })}
                        />
                      )}
                    </ThemedView>
                  );
                })}
              </View>

              {error ? <ThemedText style={styles.error}>{error.message}</ThemedText> : null}
              {saved ? <ThemedText style={styles.confirmation}>Objetivos guardados.</ThemedText> : null}
              <Pressable onPress={() => void handleSave()} disabled={saving} style={[styles.saveButton, saving && styles.disabledButton]}>
                <ThemedText style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar objetivos'}</ThemedText>
              </Pressable>
            </>
          )}
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
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  goals: { gap: Spacing.two },
  card: { padding: Spacing.three, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)', gap: Spacing.three },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  icon: { fontSize: 24 },
  cardTitle: { flex: 1, gap: Spacing.one },
  name: { fontSize: 16, fontWeight: '700' },
  current: { fontSize: 13, opacity: 0.65 },
  fieldsRow: { flexDirection: 'row', gap: Spacing.two },
  inputGroup: { flex: 1, gap: Spacing.one },
  inputLabel: { fontSize: 12, opacity: 0.7 },
  input: { minHeight: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.two, fontSize: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  state: { alignItems: 'center', paddingVertical: Spacing.six },
  error: { color: '#D32F2F' },
  confirmation: { color: '#188038', textAlign: 'center' },
  saveButton: { alignItems: 'center', paddingVertical: Spacing.three, borderRadius: 12, backgroundColor: '#2196F3' },
  disabledButton: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});