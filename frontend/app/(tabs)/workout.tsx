import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  View, 
  TextInput, 
  Modal,
  FlatList,
  Alert,
  Text
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import GymButton from '@/components/GymButton';
import GymHeader from '@/components/GymHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import apiService from '@/services/api';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  target: string;
  gifUrl?: string;
  instructions?: string[];
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  exercises: WorkoutExercise[];
  duration?: number;
  notes?: string;
  date: string;
}

interface ExerciseSection {
  title: string;
  data: Exercise[];
}

export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [muscleGroupsModalVisible, setMuscleGroupsModalVisible] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [exercisesByMuscleGroup, setExercisesByMuscleGroup] = useState<ExerciseSection[]>([]);
  const [searchText, setSearchText] = useState('');
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    exercises: [] as WorkoutExercise[],
    notes: '',
  });
  
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  const muscleGroups = [
    'peito', 'costas', 'ombro', 'biceps', 'triceps', 
    'perna', 'gluteo', 'abdomen', 'cardio', 'full_body'
  ];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    console.log('🔄 muscleGroupsModalVisible mudou para:', muscleGroupsModalVisible);
  }, [muscleGroupsModalVisible]);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const workoutsData = await apiService.getWorkouts();
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      setWorkouts([
        {
          id: '1',
          name: 'Treino A - Peito e Tríceps',
          type: 'hipertrofia',
          difficulty: 'intermediário',
          exercises: [],
          date: '2024-01-15',
        },
        {
          id: '2',
          name: 'Treino B - Costas e Bíceps',
          type: 'força',
          difficulty: 'intermediário',
          exercises: [],
          date: '2024-01-17',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExercisesForMuscle = async (muscleGroup: string) => {
    try {
      setIsLoadingExercises(true);
      const exercises = await apiService.getWgerExercises(50, muscleGroup);
      setAvailableExercises(exercises);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      const mockExercises: Exercise[] = [
        {
          id: '1',
          name: 'Supino Reto',
          muscleGroup: 'peito',
          equipment: 'barra',
          target: 'peito',
        },
        {
          id: '2',
          name: 'Supino Inclinado',
          muscleGroup: 'peito',
          equipment: 'barra',
          target: 'peito',
        },
        {
          id: '3',
          name: 'Flexão de Braço',
          muscleGroup: 'peito',
          equipment: 'peso corporal',
          target: 'peito',
        },
      ];
      setAvailableExercises(mockExercises);
    } finally {
      setIsLoadingExercises(false);
    }
  };

  const loadAllExercisesByMuscleGroup = async () => {
    try {
      setIsLoadingExercises(true);
      const allExercises: ExerciseSection[] = [];
      
      for (const muscleGroup of muscleGroups) {
        try {
          const exercises = await apiService.getWgerExercises(20, muscleGroup);
          
          if (exercises.length > 0) {
            allExercises.push({
              title: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1),
              data: exercises
            });
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          const mockExercises: Exercise[] = [
            {
              id: `${muscleGroup}-1`,
              name: `${muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)} - Exercício 1`,
              muscleGroup: muscleGroup,
              equipment: 'barra',
              target: muscleGroup,
            },
            {
              id: `${muscleGroup}-2`,
              name: `${muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)} - Exercício 2`,
              muscleGroup: muscleGroup,
              equipment: 'halteres',
              target: muscleGroup,
            },
          ];
          allExercises.push({
            title: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1),
            data: mockExercises
          });
        }
      }
      
      setExercisesByMuscleGroup(allExercises);
    } catch (error) {
      console.error('Erro ao carregar exercícios por grupo muscular:', error);
    } finally {
      setIsLoadingExercises(false);
    }
  };

  const addWorkout = async () => {
    if (!newWorkout.name.trim()) {
      Alert.alert('Erro', 'Nome do treino é obrigatório');
      return;
    }

    if (newWorkout.exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício ao treino');
      return;
    }

    try {
      const workoutData = {
        name: newWorkout.name,
        exercises: newWorkout.exercises.map(ex => ({
          name: ex.exercise.name,
          muscleGroup: ex.exercise.muscleGroup,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime,
        })),
        notes: newWorkout.notes,
      };

      await apiService.createWorkout(workoutData);
      setModalVisible(false);
      setNewWorkout({
        name: '',
        exercises: [],
        notes: '',
      });
      loadWorkouts();
      Alert.alert('Sucesso', 'Treino criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      Alert.alert('Erro', 'Erro ao criar treino');
    }
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    const workoutExercise: WorkoutExercise = {
      exercise,
      sets: 3,
      reps: 12,
      weight: 0,
      restTime: 60,
    };

    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, workoutExercise],
    }));
  };

  const removeExerciseFromWorkout = (index: number) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const openMuscleGroupsModal = async () => {
    console.log('🎯 openMuscleGroupsModal chamada');
    setMuscleGroupsModalVisible(true);
    console.log('🎯 Modal deveria estar visível agora!');
  };

  const WorkoutCard = ({ workout }: { workout: Workout }) => (
    <TouchableOpacity style={[styles.workoutCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.workoutHeader}>
        <ThemedText style={[styles.workoutName, { color: colors.text }]}>
          {workout.name}
        </ThemedText>
        <View style={[styles.difficultyBadge, { backgroundColor: colors.tint }]}>
          <ThemedText style={[styles.difficultyText, { color: '#FFFFFF' }]}>
            {workout.difficulty}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.workoutDetails}>
        <View style={styles.detailItem}>
          <IconSymbol size={16} name="dumbbell.fill" color={colors.icon} />
          <ThemedText style={[styles.detailText, { color: colors.text }]}>
            {workout.type}
          </ThemedText>
        </View>
        
        <View style={styles.detailItem}>
          <IconSymbol size={16} name="calendar" color={colors.icon} />
          <ThemedText style={[styles.detailText, { color: colors.text }]}>
            {workout.date}
          </ThemedText>
        </View>
        
        <View style={styles.detailItem}>
          <IconSymbol size={16} name="list.bullet" color={colors.icon} />
          <ThemedText style={[styles.detailText, { color: colors.text }]}>
            {workout.exercises?.length || 0} exercícios
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ExerciseItem = ({ exercise, onPress }: { exercise: Exercise; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.exerciseItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.exerciseInfo}>
        <ThemedText style={[styles.exerciseName, { color: colors.text }]}>
          {exercise.name}
        </ThemedText>
        <ThemedText style={[styles.exerciseEquipment, { color: colors.icon }]}>
          {exercise.equipment} • {exercise.muscleGroup}
        </ThemedText>
      </View>
      <IconSymbol size={20} name="plus.circle" color={colors.tint} />
    </TouchableOpacity>
  );

  const SelectedExerciseItem = ({ exercise, index }: { exercise: WorkoutExercise; index: number }) => (
    <View style={[styles.selectedExerciseItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.exerciseInfo}>
        <ThemedText style={[styles.exerciseName, { color: colors.text }]}>
          {exercise.exercise.name}
        </ThemedText>
        <ThemedText style={[styles.exerciseDetails, { color: colors.icon }]}>
          {exercise.sets} séries x {exercise.reps} reps • {exercise.restTime}s descanso
        </ThemedText>
      </View>
      <TouchableOpacity onPress={() => removeExerciseFromWorkout(index)}>
        <IconSymbol size={20} name="minus.circle" color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <GymHeader
        title="Meus Treinos"
        subtitle="Gerencie seus treinos personalizados"
        rightAction={{
          icon: 'plus',
          onPress: () => setModalVisible(true),
        }}
      />

      <ScrollView style={styles.content}>
        {isLoading ? (
          <LoadingSpinner size="large" text="Carregando treinos..." />
        ) : workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol size={64} name="dumbbell" color={colors.icon} />
            <ThemedText style={[styles.emptyText, { color: colors.text }]}>
              Nenhum treino encontrado
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              Crie seu primeiro treino personalizado
            </ThemedText>
          </View>
        ) : (
          workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))
        )}
      </ScrollView>

      {/* Modal para criar novo treino */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Novo Treino
            </ThemedText>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Nome do treino"
              placeholderTextColor={colors.icon}
              value={newWorkout.name}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, name: text })}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Observações (opcional)"
              placeholderTextColor={colors.icon}
              value={newWorkout.notes}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, notes: text })}
              multiline
            />

            <ThemedText style={[styles.label, { color: colors.text }]}>
              Exercícios ({newWorkout.exercises.length})
            </ThemedText>

            {newWorkout.exercises.length === 0 ? (
              <View style={styles.emptyExercisesState}>
                <IconSymbol size={32} name="dumbbell" color={colors.icon} />
                <ThemedText style={[styles.emptyExercisesText, { color: colors.icon }]}>
                  Nenhum exercício adicionado
                </ThemedText>
                <ThemedText style={[styles.emptyExercisesSubtext, { color: colors.icon }]}>
                  Adicione exercícios para criar seu treino
                </ThemedText>
              </View>
            ) : (
              newWorkout.exercises.map((exercise, index) => (
                <SelectedExerciseItem key={index} exercise={exercise} index={index} />
              ))
            )}

            <View style={styles.fullWidthButton}>
              <GymButton
                title="Selecionar Exercícios"
                onPress={() => {
                  console.log('🎯 Botão "Selecionar Exercícios" clicado');
                  openMuscleGroupsModal();
                }}
                variant="primary"
                size="medium"
              />
            </View>

            <View style={styles.fullWidthButton}>
              <GymButton
                title="TESTE - Abrir Modal Direto"
                onPress={() => {
                  console.log('🎯 Teste modal direto');
                  Alert.alert('Teste', 'Modal funcionando!');
                  setMuscleGroupsModalVisible(true);
                }}
                variant="outline"
                size="medium"
              />
            </View>

            <View style={styles.buttonRow}>
              <GymButton
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="medium"
              />
              
              <GymButton
                title="Criar Treino"
                onPress={addWorkout}
                variant="primary"
                size="medium"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para selecionar exercícios por grupo muscular específico */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={exerciseModalVisible}
        onRequestClose={() => setExerciseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, maxHeight: '80%' }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Exercícios - {selectedMuscleGroup.charAt(0).toUpperCase() + selectedMuscleGroup.slice(1)}
            </ThemedText>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Buscar exercícios..."
              placeholderTextColor={colors.icon}
              value={searchText}
              onChangeText={setSearchText}
            />

            {isLoadingExercises ? (
              <LoadingSpinner size="medium" text="Carregando exercícios..." />
            ) : (
              <FlatList
                data={availableExercises.filter(ex => 
                  ex.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ExerciseItem
                    exercise={item}
                    onPress={() => {
                      addExerciseToWorkout(item);
                      setExerciseModalVisible(false);
                      setSearchText('');
                    }}
                  />
                )}
                style={styles.exerciseList}
                showsVerticalScrollIndicator={false}
              />
            )}

            <GymButton
              title="Fechar"
              onPress={() => {
                setExerciseModalVisible(false);
                setSearchText('');
              }}
              variant="outline"
              size="medium"
            />
          </View>
        </View>
      </Modal>

      {/* Modal para visualizar todos os grupos musculares */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={muscleGroupsModalVisible}
        onRequestClose={() => setMuscleGroupsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, maxHeight: '90%' }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              TESTE - Modal Funcionando!
            </ThemedText>

            <ThemedText style={{ color: colors.icon, textAlign: 'center', marginBottom: 15, fontSize: 14 }}>
              Se você está vendo isso, o modal está funcionando!
            </ThemedText>

            <ScrollView style={styles.muscleGroupsList} showsVerticalScrollIndicator={false}>
              {muscleGroups.map((muscleGroup) => (
                <TouchableOpacity
                  key={muscleGroup}
                  style={[
                    styles.muscleGroupCard,
                    { 
                      backgroundColor: colors.surface, 
                      borderColor: '#FF6B6B',
                      borderWidth: 2
                    }
                  ]}
                  onPress={async () => {
                    console.log('🎯 Card clicado:', muscleGroup);
                    setMuscleGroupsModalVisible(false);
                    setSelectedMuscleGroup(muscleGroup);
                    await loadExercisesForMuscle(muscleGroup);
                    setExerciseModalVisible(true);
                  }}
                >
                  <View style={styles.muscleGroupCardHeader}>
                    <Text style={styles.muscleIcon}>💪</Text>
                    <View style={styles.muscleGroupInfo}>
                      <ThemedText style={[styles.muscleGroupName, { color: colors.text }]}>
                        {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
                      </ThemedText>
                      <ThemedText style={[styles.muscleGroupCount, { color: colors.icon }]}>
                        5 exercícios
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.exercisePreview}>
                    <ThemedText style={[styles.exercisePreviewText, { color: colors.icon }]}>
                      • Supino Reto
                    </ThemedText>
                    <ThemedText style={[styles.exercisePreviewText, { color: colors.icon }]}>
                      • Flexão de Braço
                    </ThemedText>
                    <ThemedText style={[styles.exercisePreviewText, { color: colors.tint }]}>
                      +3 mais...
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <GymButton
              title="Fechar"
              onPress={() => setMuscleGroupsModalVisible(false)}
              variant="outline"
              size="medium"
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyExercisesState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  emptyExercisesText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyExercisesSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    zIndex: 1001,
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fullWidthButton: {
    marginBottom: 12,
  },
  exerciseList: {
    maxHeight: 300,
  },
  muscleGroupsList: {
    maxHeight: 400,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseEquipment: {
    fontSize: 12,
    marginTop: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  selectedExerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  muscleGroupCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  muscleGroupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  muscleIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  muscleGroupInfo: {
    flex: 1,
  },
  muscleGroupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  muscleGroupCount: {
    fontSize: 12,
  },
  exercisePreview: {
    flexDirection: 'column',
    gap: 4,
  },
  exercisePreviewText: {
    fontSize: 12,
  },
}); 