import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import SimpleChart from '@/components/SimpleChart';

interface ProgressData {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
}

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [progressData, setProgressData] = useState<ProgressData[]>([
    {
      id: '1',
      date: '2024-01-01',
      weight: 75.5,
      bodyFat: 18,
      muscleMass: 35,
      notes: 'Início do programa',
    },
    {
      id: '2',
      date: '2024-01-08',
      weight: 74.8,
      bodyFat: 17.5,
      muscleMass: 35.5,
      notes: 'Boa semana de treino',
    },
    {
      id: '3',
      date: '2024-01-15',
      weight: 74.2,
      bodyFat: 17,
      muscleMass: 36,
      notes: 'Mantendo consistência',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProgress, setNewProgress] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    notes: '',
  });

  // Dados do usuário (simulados)
  const userHeight = 175; // cm
  const currentWeight = progressData[progressData.length - 1]?.weight || 75;
  const bmi = (currentWeight / Math.pow(userHeight / 100, 2)).toFixed(1);
  const bmiCategory = getBMICategory(parseFloat(bmi));

  const totalWeightLoss = progressData.length > 1 
    ? progressData[0].weight - progressData[progressData.length - 1].weight 
    : 0;

  const addProgress = () => {
    if (newProgress.weight) {
      const progress: ProgressData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(newProgress.weight),
        bodyFat: newProgress.bodyFat ? parseFloat(newProgress.bodyFat) : undefined,
        muscleMass: newProgress.muscleMass ? parseFloat(newProgress.muscleMass) : undefined,
        notes: newProgress.notes || undefined,
      };
      setProgressData([...progressData, progress]);
      setNewProgress({ weight: '', bodyFat: '', muscleMass: '', notes: '' });
      setModalVisible(false);
    }
  };

  function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  }

  const ProgressCard = ({ title, value, unit, color, subtitle }: {
    title: string;
    value: string | number;
    unit: string;
    color: string;
    subtitle?: string;
  }) => (
    <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <ThemedText style={[styles.progressTitle, { color: colors.text }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.progressValue, { color }]}>
        {value}{unit}
      </ThemedText>
      {subtitle && (
        <ThemedText style={[styles.progressSubtitle, { color: colors.icon }]}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );

  const ProgressEntry = ({ entry }: { entry: ProgressData }) => (
    <View style={[styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.entryHeader}>
        <ThemedText style={[styles.entryDate, { color: colors.text }]}>
          {entry.date}
        </ThemedText>
        <ThemedText style={[styles.entryWeight, { color: colors.tint }]}>
          {entry.weight} kg
        </ThemedText>
      </View>
      
      <View style={styles.entryDetails}>
        {entry.bodyFat && (
          <View style={styles.detailItem}>
            <ThemedText style={[styles.detailLabel, { color: colors.text }]}>
              Gordura Corporal:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: '#FF6B6B' }]}>
              {entry.bodyFat}%
            </ThemedText>
          </View>
        )}
        
        {entry.muscleMass && (
          <View style={styles.detailItem}>
            <ThemedText style={[styles.detailLabel, { color: colors.text }]}>
              Massa Muscular:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: '#00FF7F' }]}>
              {entry.muscleMass} kg
            </ThemedText>
          </View>
        )}
      </View>
      
      {entry.notes && (
        <ThemedText style={[styles.entryNotes, { color: colors.text }]}>
          {entry.notes}
        </ThemedText>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Meu Progresso
        </ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={() => setModalVisible(true)}
        >
          <IconSymbol size={24} name="plus" color="#FFFFFF" />
        </TouchableOpacity>
      </ThemedView>

      {/* Cards de Resumo */}
      <ThemedView style={styles.summaryContainer}>
        <View style={styles.summaryGrid}>
          <ProgressCard
            title="Peso Atual"
            value={currentWeight}
            unit=" kg"
            color={colors.tint}
          />
          <ProgressCard
            title="IMC"
            value={bmi}
            unit=""
            color={colors.secondary}
            subtitle={bmiCategory}
          />
        </View>
        
        <View style={styles.summaryGrid}>
          <ProgressCard
            title="Perda Total"
            value={totalWeightLoss.toFixed(1)}
            unit=" kg"
            color={totalWeightLoss > 0 ? '#00FF7F' : '#FF6B6B'}
          />
          <ProgressCard
            title="Registros"
            value={progressData.length}
            unit=""
            color={colors.accent}
          />
        </View>
      </ThemedView>

      {/* Gráfico de Evolução */}
      <ThemedView style={styles.chartContainer}>
        <SimpleChart
          data={progressData.map(entry => ({
            label: entry.date.split('-')[2], // Dia do mês
            value: entry.weight,
            color: colors.tint,
          }))}
          title="Evolução do Peso"
          height={120}
        />
      </ThemedView>

      {/* Histórico */}
      <ThemedView style={styles.historyContainer}>
        <ThemedText style={[styles.historyTitle, { color: colors.text }]}>
          Histórico de Medidas
        </ThemedText>
        {progressData.map((entry) => (
          <ProgressEntry key={entry.id} entry={entry} />
        ))}
      </ThemedView>

      {/* Modal para adicionar progresso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Nova Medida
            </ThemedText>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Peso (kg)"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
              value={newProgress.weight}
              onChangeText={(text) => setNewProgress({ ...newProgress, weight: text })}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Gordura Corporal (%)"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
              value={newProgress.bodyFat}
              onChangeText={(text) => setNewProgress({ ...newProgress, bodyFat: text })}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Massa Muscular (kg)"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
              value={newProgress.muscleMass}
              onChangeText={(text) => setNewProgress({ ...newProgress, muscleMass: text })}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Observações (opcional)"
              placeholderTextColor={colors.icon}
              value={newProgress.notes}
              onChangeText={(text) => setNewProgress({ ...newProgress, notes: text })}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.tint }]}
                onPress={addProgress}
              >
                <ThemedText style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  Adicionar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
  },
  entryWeight: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryDetails: {
    gap: 8,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  entryNotes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 