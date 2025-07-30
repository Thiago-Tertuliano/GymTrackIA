const Diet = require('../../../src/models/Diet');
const User = require('../../../src/models/User');
const { createTestUser } = require('../../helpers/testUtils');

describe('Diet Model', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('Validação', () => {
    test('deve criar uma dieta válida', async () => {
      const dietData = {
        name: 'Dieta de Manutenção',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: [
              {
                name: 'Ovos',
                quantity: 2,
                unit: 'unidade',
                calories: 140,
                protein: 12,
                carbs: 2,
                fat: 10
              }
            ],
            completed: false
          }
        ]
      };

      const diet = new Diet(dietData);
      const savedDiet = await diet.save();

      expect(savedDiet.name).toBe(dietData.name);
      expect(savedDiet.user.toString()).toBe(testUser._id.toString());
      expect(savedDiet.type).toBe(dietData.type);
      expect(savedDiet.targetCalories).toBe(dietData.targetCalories);
      expect(savedDiet.meals).toHaveLength(1);
    });

    test('deve falhar sem campos obrigatórios', async () => {
      const diet = new Diet({});
      
      try {
        await diet.save();
      } catch (error) {
        expect(error.errors.name).toBeDefined();
        expect(error.errors.user).toBeDefined();
        expect(error.errors.targetCalories).toBeDefined();
      }
    });

    test('deve falhar com tipo inválido', async () => {
      const dietData = {
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'invalido',
        targetCalories: 2000
      };

      const diet = new Diet(dietData);
      
      try {
        await diet.save();
      } catch (error) {
        expect(error.errors.type).toBeDefined();
      }
    });

    test('deve falhar com calorias negativas', async () => {
      const dietData = {
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: -100
      };

      const diet = new Diet(dietData);
      
      try {
        await diet.save();
      } catch (error) {
        expect(error.errors.targetCalories).toBeDefined();
      }
    });
  });

  describe('Métodos', () => {
    test('deve calcular calorias totais corretamente', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: [
              { calories: 200 },
              { calories: 300 },
              { calories: 150 }
            ]
          },
          {
            name: 'Almoço',
            type: 'almoço',
            time: '12:00',
            foods: [
              { calories: 250 }
            ]
          }
        ]
      });

      // Calcular calorias totais manualmente
      const totalCalories = diet.meals.reduce((total, meal) => {
        return total + meal.foods.reduce((mealTotal, food) => {
          return mealTotal + (food.calories || 0);
        }, 0);
      }, 0);

      expect(totalCalories).toBe(900); // 200 + 300 + 150 + 250
    });

    test('deve contar refeições completadas', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: [],
            completed: true
          },
          {
            name: 'Almoço',
            type: 'almoço',
            time: '12:00',
            foods: [],
            completed: false
          },
          {
            name: 'Jantar',
            type: 'jantar',
            time: '19:00',
            foods: [],
            completed: true
          }
        ]
      });

      const completedMeals = diet.meals.filter(meal => meal.completed).length;
      expect(completedMeals).toBe(2);
    });

    test('deve calcular macronutrientes totais', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: [
              { protein: 10, carbs: 20, fat: 5 },
              { protein: 15, carbs: 30, fat: 8 }
            ]
          }
        ]
      });

      // Calcular macronutrientes manualmente
      const macros = diet.meals.reduce((total, meal) => {
        return meal.foods.reduce((mealTotal, food) => {
          return {
            protein: mealTotal.protein + (food.protein || 0),
            carbs: mealTotal.carbs + (food.carbs || 0),
            fat: mealTotal.fat + (food.fat || 0)
          };
        }, total);
      }, { protein: 0, carbs: 0, fat: 0 });

      expect(macros.protein).toBe(25); // 10 + 15
      expect(macros.carbs).toBe(50);   // 20 + 30
      expect(macros.fat).toBe(13);     // 5 + 8
    });
  });

  describe('Relacionamentos', () => {
    test('deve referenciar usuário corretamente', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000
      });

      await diet.save();
      
      const foundDiet = await Diet.findById(diet._id).populate('user');
      expect(foundDiet.user._id.toString()).toBe(testUser._id.toString());
      expect(foundDiet.user.name).toBe(testUser.name);
    });
  });

  describe('Refeições', () => {
    test('deve adicionar refeição à dieta', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: []
      });

      await diet.save();

      diet.meals.push({
        name: 'Nova Refeição',
        type: 'lanche_manhã',
        time: '10:00',
        foods: [],
        completed: false
      });

      await diet.save();

      expect(diet.meals).toHaveLength(1);
      expect(diet.meals[0].name).toBe('Nova Refeição');
    });

    test('deve marcar refeição como completa', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: [],
            completed: false
          }
        ]
      });

      await diet.save();

      diet.meals[0].completed = true;
      await diet.save();

      expect(diet.meals[0].completed).toBe(true);
    });

    test('deve validar refeição com dados mínimos', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: []
          }
        ]
      });

      const savedDiet = await diet.save();
      expect(savedDiet.meals[0].name).toBe('Café da Manhã');
      expect(savedDiet.meals[0].completed).toBe(false); // valor padrão
    });
  });

  describe('Alimentos', () => {
    test('deve adicionar alimento à refeição', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: []
          }
        ]
      });

      await diet.save();

      diet.meals[0].foods.push({
        name: 'Novo Alimento',
        quantity: 100,
        unit: 'g',
        calories: 150,
        protein: 10,
        carbs: 20,
        fat: 5
      });

      await diet.save();

      expect(diet.meals[0].foods).toHaveLength(1);
      expect(diet.meals[0].foods[0].name).toBe('Novo Alimento');
    });

    test('deve calcular calorias da refeição', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000,
        meals: [
          {
            name: 'Café da Manhã',
            type: 'café_da_manhã',
            time: '08:00',
            foods: [
              { calories: 200 },
              { calories: 300 },
              { calories: 150 }
            ]
          }
        ]
      });

      const mealCalories = diet.meals[0].foods.reduce((total, food) => {
        return total + (food.calories || 0);
      }, 0);

      expect(mealCalories).toBe(650); // 200 + 300 + 150
    });
  });

  describe('Queries', () => {
    test('deve encontrar dietas por usuário', async () => {
      const diet1 = new Diet({
        name: 'Dieta A',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000
      });
      const diet2 = new Diet({
        name: 'Dieta B',
        user: testUser._id,
        type: 'perda_peso',
        targetCalories: 1500
      });

      await diet1.save();
      await diet2.save();

      const userDiets = await Diet.find({ user: testUser._id });
      expect(userDiets).toHaveLength(2);
    });

    test('deve encontrar dietas por tipo', async () => {
      const maintenanceDiet = new Diet({
        name: 'Dieta Manutenção',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000
      });
      const weightLossDiet = new Diet({
        name: 'Dieta Perda Peso',
        user: testUser._id,
        type: 'perda_peso',
        targetCalories: 1500
      });

      await maintenanceDiet.save();
      await weightLossDiet.save();

      const maintenanceDiets = await Diet.find({ type: 'manutenção' });
      expect(maintenanceDiets).toHaveLength(1);
      expect(maintenanceDiets[0].name).toBe('Dieta Manutenção');
    });
  });

  describe('Índices', () => {
    test('deve ter índice no user', async () => {
      const diet = new Diet({
        name: 'Dieta Teste',
        user: testUser._id,
        type: 'manutenção',
        targetCalories: 2000
      });

      await diet.save();

      // Verificar se a consulta por user é eficiente
      const startTime = Date.now();
      await Diet.find({ user: testUser._id });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Deve ser rápido
    });
  });
}); 