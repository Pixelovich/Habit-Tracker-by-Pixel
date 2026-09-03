import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function StatisticsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Estadísticas</ThemedText>
      <ThemedText style={styles.message}>Próximamente podrás consultar la evolución de tus hábitos.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: 'center' },
  title: { fontSize: 32, marginBottom: Spacing.three },
  message: { opacity: 0.7 },
});
