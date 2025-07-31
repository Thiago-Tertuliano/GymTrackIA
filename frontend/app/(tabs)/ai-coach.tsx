import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AISuggestion {
  id: string;
  type: 'workout' | 'diet' | 'motivation';
  title: string;
  content: string;
  timestamp: string;
}

export default function AICoachScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Treino de Hipertrofia',
      content: 'Baseado no seu perfil, sugiro um treino focado em hipertrofia com 4 séries de 8-12 repetições. Foque em exercícios compostos como supino, agachamento e levantamento terra.',
      timestamp: '2024-01-15 10:30',
    },
    {
      id: '2',
      type: 'diet',
      title: 'Ajuste na Dieta',
      content: 'Para atingir seus objetivos, aumente a ingestão de proteínas para 2g/kg de peso corporal. Considere adicionar whey protein após o treino.',
      timestamp: '2024-01-14 15:45',
    },
    {
      id: '3',
      type: 'motivation',
      title: 'Dica Motivacional',
      content: 'Lembre-se: consistência é mais importante que perfeição. Continue treinando regularmente e os resultados virão!',
      timestamp: '2024-01-13 09:15',
    },
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'workout' | 'diet' | 'motivation'>('workout');

  const askAI = () => {
    if (userQuery.trim()) {
      setIsLoading(true);
      
      // Simular resposta da IA
      setTimeout(() => {
        const newSuggestion: AISuggestion = {
          id: Date.now().toString(),
          type: selectedType,
          title: getTitleForType(selectedType),
          content: `Baseado na sua pergunta: "${userQuery}", aqui está minha sugestão personalizada para você. Continue focado nos seus objetivos e mantenha a consistência nos treinos e na alimentação.`,
          timestamp: new Date().toLocaleString('pt-BR'),
        };
        
        setSuggestions([newSuggestion, ...suggestions]);
        setUserQuery('');
        setIsLoading(false);
      }, 2000);
    }
  };

  const getTitleForType = (type: string) => {
    switch (type) {
      case 'workout': return 'Sugestão de Treino';
      case 'diet': return 'Sugestão de Dieta';
      case 'motivation': return 'Motivação';
      default: return 'Sugestão';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'workout': return 'dumbbell.fill';
      case 'diet': return 'leaf.fill';
      case 'motivation': return 'heart.fill';
      default: return 'brain.head.profile';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'workout': return '#FFD700';
      case 'diet': return '#00FF7F';
      case 'motivation': return '#FF6B6B';
      default: return colors.tint;
    }
  };

  const SuggestionCard = ({ suggestion }: { suggestion: AISuggestion }) => (
    <View style={[styles.suggestionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.suggestionHeader}>
        <View style={styles.suggestionType}>
          <IconSymbol size={20} name={getIconForType(suggestion.type)} color={getColorForType(suggestion.type)} />
          <ThemedText style={[styles.suggestionTitle, { color: colors.text }]}>
            {suggestion.title}
          </ThemedText>
        </View>
        <ThemedText style={[styles.suggestionTime, { color: colors.icon }]}>
          {suggestion.timestamp}
        </ThemedText>
      </View>
      
      <ThemedText style={[styles.suggestionContent, { color: colors.text }]}>
        {suggestion.content}
      </ThemedText>
    </View>
  );

  const TypeButton = ({ type, label, icon }: { type: 'workout' | 'diet' | 'motivation'; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        { 
          backgroundColor: selectedType === type ? getColorForType(type) : colors.surface,
          borderColor: colors.border 
        }
      ]}
      onPress={() => setSelectedType(type)}
    >
      <IconSymbol size={20} name={icon} color={selectedType === type ? '#FFFFFF' : getColorForType(type)} />
      <ThemedText style={[
        styles.typeButtonText,
        { color: selectedType === type ? '#FFFFFF' : colors.text }
      ]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Coach IA
        </ThemedText>
        <IconSymbol size={32} name="brain.head.profile" color={colors.tint} />
      </ThemedView>

      {/* Seletor de Tipo */}
      <ThemedView style={styles.typeSelector}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Que tipo de sugestão você quer?
        </ThemedText>
        <View style={styles.typeButtons}>
          <TypeButton type="workout" label="Treino" icon="dumbbell.fill" />
          <TypeButton type="diet" label="Dieta" icon="leaf.fill" />
          <TypeButton type="motivation" label="Motivação" icon="heart.fill" />
        </View>
      </ThemedView>

      {/* Input para pergunta */}
      <ThemedView style={styles.queryContainer}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Faça sua pergunta
        </ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.queryInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Ex: Como melhorar meu treino de peito?"
            placeholderTextColor={colors.icon}
            value={userQuery}
            onChangeText={setUserQuery}
            multiline
          />
          <TouchableOpacity
            style={[styles.askButton, { backgroundColor: colors.tint }]}
            onPress={askAI}
            disabled={isLoading || !userQuery.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <IconSymbol size={24} name="paperplane.fill" color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Sugestões */}
      <ThemedView style={styles.suggestionsContainer}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Sugestões Recentes
        </ThemedText>
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </ThemedView>

      {/* Dica */}
      <ThemedView style={styles.tipContainer}>
        <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol size={24} name="lightbulb.fill" color={colors.tint} />
          <ThemedText style={[styles.tipText, { color: colors.text }]}>
            Dica: Seja específico nas suas perguntas para receber sugestões mais precisas!
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  typeSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  queryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  queryInput: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  askButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionTime: {
    fontSize: 12,
  },
  suggestionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 