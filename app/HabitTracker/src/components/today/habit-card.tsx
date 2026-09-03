import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { HabitIndicator } from '@/types/habits';

interface HabitCardProps {
  indicator: HabitIndicator;
  onPress?: () => void;
}

export function HabitCard({ indicator, onPress }: HabitCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={styles.touchable}
    >
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          {/* Icono y nombre a la izquierda */}
          <View style={styles.leftSection}>
            <ThemedText style={styles.icon}>{indicator.icon}</ThemedText>
            <View style={styles.nameSection}>
              <ThemedText style={styles.name}>
                {indicator.name}
              </ThemedText>
            </View>
          </View>

          {/* Valor a la derecha */}
          <View style={styles.rightSection}>
            <ThemedText style={styles.value}>
              {indicator.value}
            </ThemedText>
            <ThemedText style={styles.unit}>
              {indicator.unit}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: Spacing.four,
    marginVertical: Spacing.one,
  },
  container: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  icon: {
    fontSize: 20,
  },
  nameSection: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  unit: {
    fontSize: 11,
    opacity: 0.5,
  },
});
