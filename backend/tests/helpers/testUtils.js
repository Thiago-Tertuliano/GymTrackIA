const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');

/**
 * Criar token JWT para testes
 */
const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Criar usuário de teste
 */
const createTestUser = async (userData = {}) => {
  const timestamp = Date.now();
  const defaultUser = {
    name: 'Test User',
    email: `test-${timestamp}@example.com`,
    password: 'password123',
    age: 25,
    height: 170,
    weight: 70,
    goal: 'manter',
    activityLevel: 'moderado'
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

/**
 * Criar request mock
 */
const createMockRequest = (data = {}) => {
  return {
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
    headers: data.headers || {},
    user: data.user || null,
    ...data
  };
};

/**
 * Criar response mock
 */
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock do axios para APIs externas
 */
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

/**
 * Dados de exercício de teste
 */
const mockExerciseData = {
  id: '123',
  name: 'Supino Reto',
  muscleGroup: 'peito',
  equipment: 'barbell',
  target: 'peito',
  gifUrl: 'https://example.com/supino.gif',
  instructions: ['Deite no banco', 'Agarre a barra', 'Levante o peso'],
  source: 'wger'
};

/**
 * Dados de treino de teste
 */
const mockWorkoutData = {
  name: 'Treino A - Peito e Tríceps',
  description: 'Treino focado em peito e tríceps',
  exercises: [
    {
      name: 'Supino Reto',
      sets: 3,
      reps: 12,
      weight: 60,
      completed: false
    }
  ],
  duration: 60,
  difficulty: 'intermediario'
};

/**
 * Dados de dieta de teste
 */
const mockDietData = {
  name: 'Dieta de Manutenção',
  description: 'Dieta equilibrada para manutenção',
  meals: [
    {
      name: 'Café da Manhã',
      foods: [
        {
          name: 'Aveia',
          quantity: 50,
          unit: 'g',
          calories: 180,
          protein: 6,
          carbs: 30,
          fat: 3
        }
      ],
      completed: false
    }
  ],
  totalCalories: 2000
};

/**
 * Dados de progresso de teste
 */
const mockProgressData = {
  date: new Date(),
  weight: 70,
  bodyFat: 15,
  measurements: {
    chest: 100,
    waist: 80,
    arms: 35
  },
  mood: 'bom',
  energy: 'alta',
  sleep: 8,
  hydration: 2.5
};

module.exports = {
  generateTestToken,
  createTestUser,
  createMockRequest,
  createMockResponse,
  mockAxios,
  mockExerciseData,
  mockWorkoutData,
  mockDietData,
  mockProgressData
}; 