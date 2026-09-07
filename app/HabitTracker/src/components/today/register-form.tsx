import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { DailyRecord, HabitType, HabitValue } from '@/types/habits';

interface RegisterFormProps {
  visible: boolean;
  habitType: HabitType | null;
  record: DailyRecord | null;
  onCancel: () => void;
  onSave: (value: HabitValue) => Promise<void>;
}

const DETAILS: Record<HabitType, { name: string; unit: string }> = {
  tobacco: { name: 'Tabaco', unit: 'cigarrillos' },
  alcohol: { name: 'Alcohol', unit: 'unidades' },
  exercise: { name: 'Ejercicio', unit: 'minutos' },
  diet: { name: 'Dieta', unit: '0-10' },
  sleep: { name: 'Sueño', unit: 'duración' },
  anxiety: { name: 'Ansiedad', unit: '0-10' },
  weight: { name: 'Peso', unit: 'kg' },
  motivation: { name: 'Motivación', unit: '0-10' },
};

export function RegisterForm({ visible, habitType, record, onCancel, onSave }: RegisterFormProps) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [uninterrupted, setUninterrupted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const resetTask = setTimeout(() => {
      if (!habitType) return;
      if (habitType === 'sleep') {
        setHours(record?.sleep_hours?.toString() ?? '');
        setMinutes(record?.sleep_minutes?.toString() ?? '');
        setUninterrupted(record?.sleep_uninterrupted === 1);
      } else {
        const existing = record?.[`${habitType === 'tobacco' ? 'tobacco_cigarettes' : habitType === 'alcohol' ? 'alcohol_units' : habitType === 'exercise' ? 'exercise_minutes' : habitType === 'diet' ? 'diet_score' : habitType === 'anxiety' ? 'anxiety_score' : habitType === 'weight' ? 'weight_kg' : 'motivation_score'}` as keyof DailyRecord];
        setValue(existing == null ? '' : String(existing));
      }
      setValidationError('');
    }, 0);

    return () => clearTimeout(resetTask);
  }, [habitType, record, visible]);

  const handleSave = async () => {
    if (!habitType) return;
    setValidationError('');
    let nextValue: HabitValue;

    if (habitType === 'sleep') {
      const parsedHours = Number(hours);
      const parsedMinutes = Number(minutes);
      if (!Number.isInteger(parsedHours) || parsedHours < 0 || !Number.isInteger(parsedMinutes) || parsedMinutes < 0 || parsedMinutes > 59) {
        setValidationError('Introduce horas enteras y minutos entre 0 y 59.');
        return;
      }
      nextValue = { hours: parsedHours, minutes: parsedMinutes, uninterrupted };
    } else {
      const parsedValue = Number(value);
      const isInteger = ['tobacco', 'exercise', 'diet', 'anxiety', 'motivation'].includes(habitType);
      const isScale = ['diet', 'anxiety', 'motivation'].includes(habitType);
      if (!Number.isFinite(parsedValue) || parsedValue < 0 || (isInteger && !Number.isInteger(parsedValue)) || (isScale && parsedValue > 10)) {
        setValidationError(isScale ? 'Introduce un número entero entre 0 y 10.' : 'Introduce un valor válido igual o mayor que 0.');
        return;
      }
      nextValue = parsedValue;
    }

    try {
      setSaving(true);
      await onSave(nextValue);
      onCancel();
    } catch {
      setValidationError('No se pudo guardar el registro.');
    } finally {
      setSaving(false);
    }
  };

  if (!habitType) return null;
  const detail = DETAILS[habitType];
  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.textSecondary }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.overlay}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ThemedView style={styles.container}>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>Registrar {detail.name}</ThemedText>
              <ThemedText style={styles.unit}>{detail.unit}</ThemedText>
            </View>
            <Pressable onPress={onCancel} style={styles.closeButton}>
              <ThemedText style={styles.closeText}>✕</ThemedText>
            </Pressable>
          </View>

          {habitType === 'sleep' ? (
            <View style={styles.sleepRow}>
              <View style={styles.sleepInput}>
                <ThemedText style={styles.label}>Horas</ThemedText>
                <TextInput value={hours} onChangeText={setHours} keyboardType="number-pad" style={inputStyle} />
              </View>
              <View style={styles.sleepInput}>
                <ThemedText style={styles.label}>Minutos</ThemedText>
                <TextInput value={minutes} onChangeText={setMinutes} keyboardType="number-pad" style={inputStyle} />
              </View>
              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>Ininterrumpido</ThemedText>
                <Switch value={uninterrupted} onValueChange={setUninterrupted} />
              </View>
            </View>
          ) : (
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType={habitType === 'weight' || habitType === 'alcohol' ? 'decimal-pad' : 'number-pad'}
              placeholder="Valor"
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
              autoFocus
            />
          )}

          {validationError ? <ThemedText style={styles.error}>{validationError}</ThemedText> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={saving}>
              <ThemedText>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={() => void handleSave()} disabled={saving}>
              <ThemedText style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar'}</ThemedText>
            </TouchableOpacity>
          </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  scrollView: { flex: 1 },
  overlay: { flexGrow: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  container: { width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.four },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.three },
  title: { fontSize: 20, fontWeight: '700' },
  unit: { fontSize: 13, opacity: 0.6 },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 24 },
  label: { fontSize: 13, marginBottom: Spacing.one },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, fontSize: 16, minHeight: 44 },
  sleepRow: { gap: Spacing.three },
  sleepInput: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  error: { color: '#D32F2F', marginTop: Spacing.two },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  cancelButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: 12, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
  saveButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: 12, backgroundColor: '#2196F3' },
  saveText: { color: '#FFFFFF', fontWeight: '600' },
});
