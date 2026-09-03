import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { DailyScore } from '@/types/habits';

interface ScoreCardProps {
  score: DailyScore;
}

export function ScoreCard({ score }: ScoreCardProps) {
  return (
    <ThemedView style={styles.container}>
      {/* Sección principal: Puntuación */}
      <View style={styles.scoreMainSection}>
        <View>
          <ThemedText style={styles.scoreLabel}>
            {score.registeredCount === 0
              ? 'Sin datos registrados'
              : score.registeredCount === score.totalIndicators
                ? 'Puntuación diaria'
                : 'Puntuación provisional'}
          </ThemedText>
          <View style={styles.scoreDisplay}>
            <ThemedText style={styles.scoreNumber}>
              {score.current}
            </ThemedText>
            <View style={styles.scoreComplement}>
              <ThemedText style={styles.scoreSeparator}>/</ThemedText>
              <ThemedText style={styles.scoreMaximum}>
                {score.maximum}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Racha a la derecha */}
        <View style={styles.streakBadge}>
          <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
          <View>
            <ThemedText style={styles.streakNumber}>
              {score.streak}
            </ThemedText>
            <ThemedText style={styles.streakLabel}>
              días
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(score.percentage, 100)}%` },
            ]}
          />
        </View>
      </View>

      {/* Meta diaria */}
      <View style={styles.metaSection}>
        <ThemedText style={styles.metaText}>
          Objetivo diario: {score.target}
        </ThemedText>
        <ThemedText style={styles.percentageText}>
          {score.percentage}%
        </ThemedText>
      </View>
      <ThemedText style={styles.coverageText}>
        {score.registeredCount === 0
          ? 'Registra indicadores para evaluar el día'
          : `${score.registeredCount} de ${score.totalIndicators} registrados`}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.four,
    marginVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.15)',
    gap: Spacing.four,
  },
  scoreMainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.one,
    opacity: 0.7,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '700',
  },
  scoreComplement: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  scoreSeparator: {
    fontSize: 32,
    fontWeight: '300',
  },
  scoreMaximum: {
    fontSize: 24,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderRadius: 12,
  },
  streakEmoji: {
    fontSize: 28,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  progressSection: {
    gap: Spacing.two,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '700',
  },
  coverageText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'right',
  },
});
