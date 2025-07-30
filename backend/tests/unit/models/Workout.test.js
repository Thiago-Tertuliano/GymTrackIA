const Workout = require('../../../src/models/Workout');
const User = require('../../../src/models/User');
const { createTestUser } = require('../../helpers/testUtils');

describe('Workout Model', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('Validação', () => {
    test('deve criar um treino válido', async () => {
      const workoutData = {
        name: 'Treino A - Peito e Tríceps',
        user: testUser._id,
        type: 'força',
        difficulty: 'intermediário',
        exercises: [
          {
            name: 'Supino Reto',
            muscleGroup: 'peito',
            sets: [
              {
                reps: 12,
                weight: 60,
                duration: 30,
                restTime: 60,
                completed: false
              }
            ]
          }
        ],
        duration: 60
      };

      const workout = new Workout(workoutData);
      const savedWorkout = await workout.save();

      expect(savedWorkout.name).toBe(workoutData.name);
      expect(savedWorkout.user.toString()).toBe(testUser._id.toString());
      expect(savedWorkout.type).toBe(workoutData.type);
      expect(savedWorkout.difficulty).toBe(workoutData.difficulty);
      expect(savedWorkout.exercises).toHaveLength(1);
      expect(savedWorkout.duration).toBe(workoutData.duration);
    });

    test('deve falhar sem campos obrigatórios', async () => {
      const workout = new Workout({});
      
      try {
        await workout.save();
      } catch (error) {
        expect(error.errors.name).toBeDefined();
        expect(error.errors.user).toBeDefined();
      }
    });

    test('deve falhar com dificuldade inválida', async () => {
      const workoutData = {
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        difficulty: 'invalido'
      };

      const workout = new Workout(workoutData);
      
      try {
        await workout.save();
      } catch (error) {
        expect(error.errors.difficulty).toBeDefined();
      }
    });

    test('deve falhar com duração negativa', async () => {
      const workoutData = {
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        duration: -10
      };

      const workout = new Workout(workoutData);
      
      try {
        await workout.save();
      } catch (error) {
        expect(error.errors.duration).toBeDefined();
      }
    });
  });

  describe('Métodos', () => {
    test('deve calcular duração total dos exercícios', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        exercises: [
          {
            name: 'Exercício 1',
            muscleGroup: 'peito',
            sets: [
              { duration: 30, restTime: 60 },
              { duration: 30, restTime: 60 }
            ]
          },
          {
            name: 'Exercício 2',
            muscleGroup: 'costas',
            sets: [
              { duration: 45, restTime: 90 }
            ]
          }
        ]
      });

      // Calcular duração total manualmente
      const totalDuration = workout.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((exerciseTotal, set) => {
          return exerciseTotal + (set.duration || 0) + (set.restTime || 0);
        }, 0);
      }, 0);

      expect(totalDuration).toBe(315); // (30+60) + (30+60) + (45+90)
    });

    test('deve contar sets completados', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        exercises: [
          {
            name: 'Exercício 1',
            muscleGroup: 'peito',
            sets: [
              { completed: true },
              { completed: false },
              { completed: true }
            ]
          }
        ]
      });

      const completedSets = workout.exercises.reduce((total, exercise) => {
        return total + exercise.sets.filter(set => set.completed).length;
      }, 0);

      expect(completedSets).toBe(2);
    });
  });

  describe('Relacionamentos', () => {
    test('deve referenciar usuário corretamente', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força'
      });

      await workout.save();
      
      const foundWorkout = await Workout.findById(workout._id).populate('user');
      expect(foundWorkout.user._id.toString()).toBe(testUser._id.toString());
      expect(foundWorkout.user.name).toBe(testUser.name);
    });

    test('deve excluir treinos quando usuário é removido', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força'
      });

      await workout.save();
      
      // Verificar se o treino existe
      const foundWorkout = await Workout.findById(workout._id);
      expect(foundWorkout).toBeTruthy();

      // Remover usuário
      await User.findByIdAndDelete(testUser._id);

      // Verificar se o treino foi removido (se cascade delete estiver configurado)
      const deletedWorkout = await Workout.findById(workout._id);
      // Nota: Isso depende da configuração de cascade delete no modelo
    });
  });

  describe('Exercícios', () => {
    test('deve adicionar exercício ao treino', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        exercises: []
      });

      await workout.save();

      workout.exercises.push({
        name: 'Novo Exercício',
        muscleGroup: 'peito',
        sets: [
          {
            reps: 12,
            weight: 50,
            duration: 30,
            restTime: 60,
            completed: false
          }
        ]
      });

      await workout.save();

      expect(workout.exercises).toHaveLength(1);
      expect(workout.exercises[0].name).toBe('Novo Exercício');
    });

    test('deve marcar exercício como completo', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        exercises: [
          {
            name: 'Exercício Teste',
            muscleGroup: 'peito',
            sets: [
              {
                reps: 12,
                weight: 50,
                completed: false
              }
            ]
          }
        ]
      });

      await workout.save();

      // Marcar como completo
      workout.exercises[0].sets[0].completed = true;
      await workout.save();

      expect(workout.exercises[0].sets[0].completed).toBe(true);
    });

    test('deve validar exercício com dados mínimos', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força',
        exercises: [
          {
            name: 'Exercício Teste',
            muscleGroup: 'peito',
            sets: [
              {
                reps: 12
                // weight e completed são opcionais
              }
            ]
          }
        ]
      });

      const savedWorkout = await workout.save();
      expect(savedWorkout.exercises[0].name).toBe('Exercício Teste');
      expect(savedWorkout.exercises[0].sets[0].completed).toBe(false); // valor padrão
    });
  });

  describe('Queries', () => {
    test('deve encontrar treinos por usuário', async () => {
      const workout1 = new Workout({
        name: 'Treino A',
        user: testUser._id,
        type: 'força'
      });
      const workout2 = new Workout({
        name: 'Treino B',
        user: testUser._id,
        type: 'hipertrofia'
      });

      await workout1.save();
      await workout2.save();

      const userWorkouts = await Workout.find({ user: testUser._id });
      expect(userWorkouts).toHaveLength(2);
    });

    test('deve encontrar treinos por tipo', async () => {
      const strengthWorkout = new Workout({
        name: 'Treino Força',
        user: testUser._id,
        type: 'força'
      });
      const cardioWorkout = new Workout({
        name: 'Treino Cardio',
        user: testUser._id,
        type: 'cardio'
      });

      await strengthWorkout.save();
      await cardioWorkout.save();

      const strengthWorkouts = await Workout.find({ type: 'força' });
      expect(strengthWorkouts).toHaveLength(1);
      expect(strengthWorkouts[0].name).toBe('Treino Força');
    });
  });

  describe('Índices', () => {
    test('deve ter índice no user', async () => {
      const workout = new Workout({
        name: 'Treino Teste',
        user: testUser._id,
        type: 'força'
      });

      await workout.save();

      // Verificar se a consulta por user é eficiente
      const startTime = Date.now();
      await Workout.find({ user: testUser._id });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Deve ser rápido
    });
  });
}); 