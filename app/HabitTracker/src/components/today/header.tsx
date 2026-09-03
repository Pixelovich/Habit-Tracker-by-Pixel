import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProfileAvatar } from '@/components/today/profile-avatar';
import { Spacing } from '@/constants/theme';

interface TodayHeaderProps {
  date: Date;
  userName?: string;
  userInitials?: string;
  editionLabel?: string;
}

export function TodayHeader({
  date,
  userName = 'Luis',
  userInitials = 'LL',
  editionLabel = 'Desarrollado por: L. Lecumberri',
}: TodayHeaderProps) {
  const today = new Date(date);

  // Obtener hora para "Buenos días/tardes/noches"
  const hour = today.getHours();
  let greeting = 'Buenos días';
  if (hour >= 12 && hour < 18) {
    greeting = 'Buenas tardes';
  } else if (hour >= 18) {
    greeting = 'Buenas noches';
  }

  // Formatear fecha
  const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
  const dayNumber = today.getDate();
  const monthName = today.toLocaleDateString('es-ES', { month: 'long' });

  const formattedDate = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dayNumber} de ${monthName}`;

  return (
    <ThemedView style={styles.container}>
      {/* Sección superior con branding y avatar */}
      <View style={styles.brandingRow}>
        <View style={styles.brandingContent}>
          <ThemedText type="title" style={styles.appTitle}>
            Habit Tracker
          </ThemedText>
          <ThemedText type="small" style={styles.editionLabel}>
            Personal Edition · {editionLabel}
          </ThemedText>
        </View>
        <ProfileAvatar initials={userInitials} size={56} />
      </View>

      {/* Sección inferior con saludo y fecha */}
      <View style={styles.greetingSection}>
        <ThemedText type="default" style={styles.greeting}>
          {greeting}, {userName}
        </ThemedText>
        <ThemedText type="small" style={styles.date}>
          {formattedDate}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  brandingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  brandingContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  editionLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  greetingSection: {
    gap: Spacing.one,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    opacity: 0.6,
  },
});
