import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AnimatedCard from '@/components/AnimatedCard';
import StatsCard from '@/components/StatsCard';
import GymHeader from '@/components/GymHeader';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];



  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <GymHeader
        title="Olá, Atleta! 💪"
        subtitle="Vamos treinar hoje?"
      />

      <ThemedView style={styles.cardsContainer}>
        <AnimatedCard
          title="Treinos"
          subtitle="Gerencie seus treinos"
          icon="dumbbell.fill"
          onPress={() => {}}
          gradientColors={['#FFD700', '#FFA500']}
          delay={0}
        />
        
        <AnimatedCard
          title="Dieta"
          subtitle="Acompanhe sua alimentação"
          icon="leaf.fill"
          onPress={() => {}}
          gradientColors={['#00FF7F', '#00BFFF']}
          delay={1}
        />
        
        <AnimatedCard
          title="Progresso"
          subtitle="Veja sua evolução"
          icon="chart.line.uptrend.xyaxis"
          onPress={() => {}}
          gradientColors={['#FF6B6B', '#FF8E53']}
          delay={2}
        />
        
        <AnimatedCard
          title="Coach IA"
          subtitle="Sugestões personalizadas"
          icon="brain.head.profile"
          onPress={() => {}}
          gradientColors={['#9B59B6', '#8E44AD']}
          delay={3}
        />
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedText style={[styles.statsTitle, { color: colors.text }]}>
          Resumo da Semana
        </ThemedText>
        
        <View style={styles.statsGrid}>
          <StatsCard
            title="Treinos"
            value="3"
            icon="dumbbell.fill"
            color={colors.tint}
            delay={4}
            trend="up"
          />
          
          <StatsCard
            title="Meta"
            value="85%"
            icon="target"
            color={colors.secondary}
            delay={5}
            trend="up"
          />
          
          <StatsCard
            title="Calorias"
            value="2.1k"
            icon="flame.fill"
            color={colors.accent}
            delay={6}
            trend="neutral"
          />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 30,
  },

  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
});
