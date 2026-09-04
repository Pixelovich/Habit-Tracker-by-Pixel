import { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TodayHeader } from '@/components/today/header';
import { ScoreCard } from '@/components/today/score-card';
import { HabitCard } from '@/components/today/habit-card';
import { RegisterMenu } from '@/components/today/register-menu';
import { RegisterForm } from '@/components/today/register-form';
import { getIndicators } from '@/components/today/indicator-data';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useDailyHabits } from '@/hooks/use-daily-habits';
import type { HabitType } from '@/types/habits';

// Datos de perfil
const PROFILE = {
  name: 'Luis',
  initials: 'LL',
  edition: 'Desarrollado por: L. Lecumberri',
};

export default function TodayScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
  const { record, score, save } = useDailyHabits();

  const handleRegisterPress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const handleMenuSelect = useCallback((habitType: HabitType) => {
    setSelectedHabit(habitType);
    setFormVisible(true);
  }, []);

  const indicators = getIndicators(record);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentWrapper}>
            {/* Encabezado */}
            <TodayHeader
              date={new Date()}
              userName={PROFILE.name}
              userInitials={PROFILE.initials}
              editionLabel={PROFILE.edition}
            />

            {/* Puntuación principal */}
            <ScoreCard score={score} />

            {/* Indicadores del día */}
            <View style={styles.indicatorsSection}>
              <ThemedText style={styles.indicatorsTitle}>
                HOY
              </ThemedText>
              {indicators.map((indicator) => (
                <HabitCard
                  key={indicator.id}
                  indicator={indicator}
                  onPress={() => {
                    setSelectedHabit(indicator.id);
                    setFormVisible(true);
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Botón de acción flotante */}
        <View style={styles.footerContainer}>
          <View style={styles.contentWrapper}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegisterPress}
              activeOpacity={0.85}
            >
              <ThemedText style={styles.registerButtonText}>
                + Registrar
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Menú de registro */}
      <RegisterMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelect={handleMenuSelect}
      />
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.three,
  },
  contentWrapper: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
  },
  indicatorsSection: {
    marginVertical: Spacing.three,
  },
  indicatorsTitle: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    paddingBottom: Platform.select({
      ios: Spacing.three,
      android: BottomTabInset + Spacing.two,
      web: Spacing.three,
    }),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: Spacing.three,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
