import { StyleSheet, View, Modal, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { HabitType } from '@/types/habits';

interface RegisterMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (habitType: HabitType) => void;
}

const HABIT_OPTIONS: { id: HabitType; name: string; icon: string }[] = [
  { id: 'tobacco', name: 'Tabaco', icon: '🚭' },
  { id: 'alcohol', name: 'Alcohol', icon: '🍺' },
  { id: 'exercise', name: 'Ejercicio', icon: '🏃' },
  { id: 'diet', name: 'Dieta', icon: '🥗' },
  { id: 'sleep', name: 'Sueño', icon: '😴' },
  { id: 'anxiety', name: 'Ansiedad', icon: '😰' },
  { id: 'weight', name: 'Peso', icon: '⚖️' },
  { id: 'motivation', name: 'Motivación', icon: '🔥' },
];

export function RegisterMenu({ visible, onClose, onSelect }: RegisterMenuProps) {
  const handleSelect = (habitType: HabitType) => {
    onSelect?.(habitType);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              Registrar
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeText}>
                ✕
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={HABIT_OPTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleSelect(item.id)}
              >
                <ThemedText style={styles.menuItemIcon}>
                  {item.icon}
                </ThemedText>
                <ThemedText style={styles.menuItemText}>
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <ThemedText style={styles.cancelButtonText}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    marginVertical: Spacing.one,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: Spacing.three,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
  },
});
