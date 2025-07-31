import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, TextInput, Modal, FlatList, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import apiService from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  date: string;
}

interface Food {
  id: string;
  name: string;
  category: string;
  energy: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  image?: string;
}

export default function DietScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Café da Manhã',
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 15,
      time: '08:00',
      date: '2024-01-15',
    },
    {
      id: '2',
      name: 'Almoço',
      calories: 650,
      protein: 35,
      carbs: 60,
      fat: 20,
      time: '12:30',
      date: '2024-01-15',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodModalVisible, setFoodModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    time: '',
  });

  const foodCategories = [
    'Frutas', 'Verduras', 'Legumes', 'Carnes', 'Peixes', 
    'Laticínios', 'Cereais', 'Leguminosas', 'Oleaginosas', 'Outros'
  ];

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const loadFoodsForCategory = async (category: string) => {
    try {
      setIsLoading(true);
      const foods = await apiService.getWgerFoods(50, category);
      setAvailableFoods(foods);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      // Dados simulados em caso de erro
      const mockFoods: Food[] = [
        {
          id: '1',
          name: 'Frango',
          category: 'Carnes',
          energy: 165,
          protein: 31,
          carbohydrates: 0,
          fat: 3.6,
          fiber: 0,
          sugar: 0,
          sodium: 74,
        },
        {
          id: '2',
          name: 'Arroz Integral',
          category: 'Cereais',
          energy: 111,
          protein: 2.6,
          carbohydrates: 23,
          fat: 0.9,
          fiber: 1.8,
          sugar: 0.4,
          sodium: 5,
        },
        {
          id: '3',
          name: 'Brócolis',
          category: 'Verduras',
          energy: 34,
          protein: 2.8,
          carbohydrates: 7,
          fat: 0.4,
          fiber: 2.6,
          sugar: 1.5,
          sodium: 33,
        },
      ];
      setAvailableFoods(mockFoods);
    } finally {
      setIsLoading(false);
    }
  };

  const addMeal = () => {
    if (newMeal.name && newMeal.calories && newMeal.protein && newMeal.carbs && newMeal.fat && newMeal.time) {
      const meal: Meal = {
        id: Date.now().toString(),
        name: newMeal.name,
        calories: parseInt(newMeal.calories),
        protein: parseInt(newMeal.protein),
        carbs: parseInt(newMeal.carbs),
        fat: parseInt(newMeal.fat),
        time: newMeal.time,
        date: new Date().toISOString().split('T')[0],
      };
      setMeals([...meals, meal]);
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', time: '' });
      setModalVisible(false);
    }
  };

  const openFoodModal = async (category: string) => {
    setSelectedCategory(category);
    await loadFoodsForCategory(category);
    setFoodModalVisible(true);
  };

  const addFoodToMeal = (food: Food) => {
    // Adicionar alimento à refeição atual
    const updatedMeal = {
      ...newMeal,
      name: food.name,
      calories: food.energy.toString(),
      protein: food.protein.toString(),
      carbs: food.carbohydrates.toString(),
      fat: food.fat.toString(),
    };
    setNewMeal(updatedMeal);
    setFoodModalVisible(false);
  };

  const MacroCard = ({ title, value, unit, color }: { title: string; value: number; unit: string; color: string }) => (
    <View style={[styles.macroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <ThemedText style={[styles.macroTitle, { color: colors.text }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.macroValue, { color }]}>
        {value}{unit}
      </ThemedText>
    </View>
  );

  const MealCard = ({ meal }: { meal: Meal }) => (
    <TouchableOpacity style={[styles.mealCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.mealHeader}>
        <ThemedText style={[styles.mealName, { color: colors.text }]}>
          {meal.name}
        </ThemedText>
        <ThemedText style={[styles.mealTime, { color: colors.icon }]}>
          {meal.time}
        </ThemedText>
      </View>
      
      <View style={styles.mealMacros}>
        <View style={styles.macroItem}>
          <ThemedText style={[styles.macroLabel, { color: colors.text }]}>
            Calorias
          </ThemedText>
          <ThemedText style={[styles.macroValue, { color: colors.tint }]}>
            {meal.calories} kcal
          </ThemedText>
        </View>
        
        <View style={styles.macroItem}>
          <ThemedText style={[styles.macroLabel, { color: colors.text }]}>
            Proteína
          </ThemedText>
          <ThemedText style={[styles.macroValue, { color: '#00FF7F' }]}>
            {meal.protein}g
          </ThemedText>
        </View>
        
        <View style={styles.macroItem}>
          <ThemedText style={[styles.macroLabel, { color: colors.text }]}>
            Carboidratos
          </ThemedText>
          <ThemedText style={[styles.macroValue, { color: '#00BFFF' }]}>
            {meal.carbs}g
          </ThemedText>
        </View>
        
        <View style={styles.macroItem}>
          <ThemedText style={[styles.macroLabel, { color: colors.text }]}>
            Gorduras
          </ThemedText>
          <ThemedText style={[styles.macroValue, { color: '#FFD700' }]}>
            {meal.fat}g
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Minha Dieta
        </ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={() => setModalVisible(true)}
        >
          <IconSymbol size={24} name="plus" color="#FFFFFF" />
        </TouchableOpacity>
      </ThemedView>

      {/* Resumo de Macros */}
      <ThemedView style={styles.macrosContainer}>
        <ThemedText style={[styles.macrosTitle, { color: colors.text }]}>
          Resumo de Hoje
        </ThemedText>
        <View style={styles.macrosGrid}>
          <MacroCard title="Calorias" value={totalCalories} unit=" kcal" color={colors.tint} />
          <MacroCard title="Proteína" value={totalProtein} unit="g" color="#00FF7F" />
          <MacroCard title="Carboidratos" value={totalCarbs} unit="g" color="#00BFFF" />
          <MacroCard title="Gorduras" value={totalFat} unit="g" color="#FFD700" />
        </View>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Refeições
        </ThemedText>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </ThemedView>

      {/* Modal para adicionar refeição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Nova Refeição
            </ThemedText>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Nome da refeição"
              placeholderTextColor={colors.icon}
              value={newMeal.name}
              onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
            />
            
            <TouchableOpacity 
              style={[styles.apiButton, { backgroundColor: colors.tint }]}
              onPress={() => openFoodModal('Carnes')}
            >
              <ThemedText style={styles.apiButtonText}>
                🔍 Buscar Alimentos da API
              </ThemedText>
            </TouchableOpacity>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Horário (ex: 08:00)"
              placeholderTextColor={colors.icon}
              value={newMeal.time}
              onChangeText={(text) => setNewMeal({ ...newMeal, time: text })}
            />
            
            <View style={styles.macroInputs}>
              <TextInput
                style={[styles.macroInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Calorias"
                placeholderTextColor={colors.icon}
                keyboardType="numeric"
                value={newMeal.calories}
                onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
              />
              
              <TextInput
                style={[styles.macroInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Proteína (g)"
                placeholderTextColor={colors.icon}
                keyboardType="numeric"
                value={newMeal.protein}
                onChangeText={(text) => setNewMeal({ ...newMeal, protein: text })}
              />
              
              <TextInput
                style={[styles.macroInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Carboidratos (g)"
                placeholderTextColor={colors.icon}
                keyboardType="numeric"
                value={newMeal.carbs}
                onChangeText={(text) => setNewMeal({ ...newMeal, carbs: text })}
              />
              
              <TextInput
                style={[styles.macroInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Gorduras (g)"
                placeholderTextColor={colors.icon}
                keyboardType="numeric"
                value={newMeal.fat}
                onChangeText={(text) => setNewMeal({ ...newMeal, fat: text })}
              />
            </View>
            
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
                onPress={addMeal}
              >
                <ThemedText style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  Adicionar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para selecionar alimentos da API */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={foodModalVisible}
        onRequestClose={() => setFoodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
              Selecionar Alimento - {selectedCategory}
            </ThemedText>
            
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <FlatList
                data={availableFoods}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.foodItem, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => addFoodToMeal(item)}
                  >
                    <ThemedText style={[styles.foodName, { color: colors.text }]}>
                      {item.name}
                    </ThemedText>
                    <View style={styles.foodMacros}>
                      <ThemedText style={[styles.foodMacro, { color: colors.icon }]}>
                        {item.energy} kcal
                      </ThemedText>
                      <ThemedText style={[styles.foodMacro, { color: '#00FF7F' }]}>
                        P: {item.protein}g
                      </ThemedText>
                      <ThemedText style={[styles.foodMacro, { color: '#00BFFF' }]}>
                        C: {item.carbohydrates}g
                      </ThemedText>
                      <ThemedText style={[styles.foodMacro, { color: '#FFD700' }]}>
                        G: {item.fat}g
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.foodList}
              />
            )}
            
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={() => setFoodModalVisible(false)}
            >
              <ThemedText style={styles.cancelButtonText}>
                Cancelar
              </ThemedText>
            </TouchableOpacity>
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
  macrosContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  macrosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  macroTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mealCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealTime: {
    fontSize: 14,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    marginBottom: 4,
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
  macroInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  macroInput: {
    flex: 1,
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
  apiButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  apiButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  foodList: {
    maxHeight: 300,
  },
  foodItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  foodMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodMacro: {
    fontSize: 12,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 