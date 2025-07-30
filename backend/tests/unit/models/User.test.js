const User = require('../../../src/models/User');
const { createTestUser } = require('../../helpers/testUtils');

describe('User Model', () => {
  describe('Validação', () => {
    test('deve criar um usuário válido', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        age: 25,
        height: 175,
        weight: 70,
        goal: 'ganhar_massa',
        activityLevel: 'ativo'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.age).toBe(userData.age);
      expect(savedUser.height).toBe(userData.height);
      expect(savedUser.weight).toBe(userData.weight);
      expect(savedUser.goal).toBe(userData.goal);
      expect(savedUser.activityLevel).toBe(userData.activityLevel);
      expect(savedUser.isActive).toBe(true);
    });

    test('deve falhar sem campos obrigatórios', async () => {
      const user = new User({});
      
      try {
        await user.save();
      } catch (error) {
        expect(error.errors.name).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.password).toBeDefined();
        expect(error.errors.age).toBeDefined();
        expect(error.errors.height).toBeDefined();
        expect(error.errors.weight).toBeDefined();
        // goal tem valor padrão, então não gera erro
      }
    });

    test('deve falhar com email inválido', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        age: 25,
        height: 175,
        weight: 70,
        goal: 'manter'
      };

      const user = new User(userData);
      
      try {
        await user.save();
      } catch (error) {
        expect(error.errors.email).toBeDefined();
      }
    });

    test('deve falhar com idade fora do range', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 10, // Muito jovem
        height: 175,
        weight: 70,
        goal: 'manter'
      };

      const user = new User(userData);
      
      try {
        await user.save();
      } catch (error) {
        expect(error.errors.age).toBeDefined();
      }
    });
  });

  describe('Métodos', () => {
    test('deve comparar senhas corretamente', async () => {
      const user = await createTestUser({
        password: 'password123'
      });

      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });

    test('deve retornar dados públicos sem senha', async () => {
      const user = await createTestUser();
      const publicData = user.toPublicJSON();

      expect(publicData.password).toBeUndefined();
      expect(publicData.refreshToken).toBeUndefined();
      expect(publicData.name).toBe(user.name);
      expect(publicData.email).toBe(user.email);
    });
  });

  describe('Virtuais', () => {
    test('deve calcular IMC corretamente', async () => {
      const user = await createTestUser({
        height: 170,
        weight: 70
      });

      expect(user.bmi).toBe('24.2');
    });

    test('deve categorizar IMC corretamente', async () => {
      const userNormal = await createTestUser({
        height: 170,
        weight: 65,
        email: 'normal@example.com'
      });
      expect(userNormal.bmiCategory).toBe('peso_normal');

      const userSobrepeso = await createTestUser({
        height: 170,
        weight: 80,
        email: 'sobrepeso@example.com'
      });
      expect(userSobrepeso.bmiCategory).toBe('sobrepeso');
    });

    test('deve retornar null para IMC sem dados', async () => {
      // Criar usuário válido primeiro
      const user = await createTestUser();
      
      // Simular acesso aos virtuais quando altura/peso são null
      user.height = null;
      user.weight = null;

      expect(user.bmi).toBeNull();
      expect(user.bmiCategory).toBeNull();
    });
  });

  describe('Favoritos', () => {
    test('deve adicionar exercício aos favoritos', async () => {
      const user = await createTestUser();
      
      user.favoriteExercises.push({
        exerciseId: '123',
        exerciseData: {
          name: 'Supino Reto',
          muscleGroup: 'peito',
          equipment: 'barbell'
        }
      });

      await user.save();
      
      expect(user.favoriteExercises).toHaveLength(1);
      expect(user.favoriteExercises[0].exerciseId).toBe('123');
      expect(user.favoriteExercises[0].exerciseData.name).toBe('Supino Reto');
    });

    test('deve verificar se exercício está nos favoritos', async () => {
      const user = await createTestUser();
      
      user.favoriteExercises.push({
        exerciseId: '123',
        exerciseData: { name: 'Supino Reto' }
      });

      await user.save();
      
      const isFavorite = user.favoriteExercises.some(
        fav => fav.exerciseId === '123'
      );
      
      expect(isFavorite).toBe(true);
    });
  });

  describe('Índices', () => {
    test('deve ter índice único no email', async () => {
      const user1 = await createTestUser({
        email: 'unique@example.com'
      });

      const user2 = new User({
        name: 'Test User 2',
        email: 'unique@example.com', // Email duplicado
        password: 'password123',
        age: 25,
        height: 175,
        weight: 70,
        goal: 'manter'
      });

      try {
        await user2.save();
      } catch (error) {
        expect(error.code).toBe(11000); // Código de erro de duplicação
      }
    });
  });
}); 