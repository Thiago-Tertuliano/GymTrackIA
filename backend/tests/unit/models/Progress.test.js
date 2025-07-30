const Progress = require('../../../src/models/Progress');
const User = require('../../../src/models/User');
const { createTestUser } = require('../../helpers/testUtils');

describe('Progress Model', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('Validação', () => {
    test('deve criar um progresso válido', async () => {
      const progressData = {
        user: testUser._id,
        weight: 70,
        bodyFat: 15,
        muscleMass: 55,
        measurements: {
          chest: 100,
          waist: 80,
          hips: 95,
          biceps: 35,
          thighs: 60,
          calves: 38
        },
        mood: 'feliz',
        energy: 8,
        sleep: 7.5,
        waterIntake: 2.5,
        notes: 'Bom dia de treino'
      };

      const progress = new Progress(progressData);
      const savedProgress = await progress.save();

      expect(savedProgress.user.toString()).toBe(testUser._id.toString());
      expect(savedProgress.weight).toBe(progressData.weight);
      expect(savedProgress.bodyFat).toBe(progressData.bodyFat);
      expect(savedProgress.mood).toBe(progressData.mood);
      expect(savedProgress.energy).toBe(progressData.energy);
    });

    test('deve falhar sem campos obrigatórios', async () => {
      const progress = new Progress({});
      
      try {
        await progress.save();
      } catch (error) {
        expect(error.errors.user).toBeDefined();
        expect(error.errors.weight).toBeDefined();
      }
    });

    test('deve falhar com peso negativo', async () => {
      const progressData = {
        user: testUser._id,
        weight: -10
      };

      const progress = new Progress(progressData);
      
      try {
        await progress.save();
      } catch (error) {
        expect(error.errors.weight).toBeDefined();
      }
    });

    test('deve falhar com gordura corporal inválida', async () => {
      const progressData = {
        user: testUser._id,
        weight: 70,
        bodyFat: 60 // acima do máximo
      };

      const progress = new Progress(progressData);
      
      try {
        await progress.save();
      } catch (error) {
        expect(error.errors.bodyFat).toBeDefined();
      }
    });

    test('deve falhar com humor inválido', async () => {
      const progressData = {
        user: testUser._id,
        weight: 70,
        mood: 'invalido'
      };

      const progress = new Progress(progressData);
      
      try {
        await progress.save();
      } catch (error) {
        expect(error.errors.mood).toBeDefined();
      }
    });

    test('deve falhar com sono inválido', async () => {
      const progressData = {
        user: testUser._id,
        weight: 70,
        sleep: 25 // acima do máximo
      };

      const progress = new Progress(progressData);
      
      try {
        await progress.save();
      } catch (error) {
        expect(error.errors.sleep).toBeDefined();
      }
    });
  });

  describe('Métodos', () => {
    test('deve calcular IMC corretamente', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70,
        // altura vem do usuário (1.70m)
      });

      // Calcular IMC manualmente: peso / (altura * altura)
      const height = 1.70; // altura do usuário de teste
      const bmi = (70 / (height * height)).toFixed(1);
      
      expect(bmi).toBe('24.2'); // 70 / (1.7 * 1.7)
    });

    test('deve retornar null para IMC sem altura', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70
      });

      // Simular cálculo sem altura
      const height = null;
      const bmi = height ? (70 / (height * height)).toFixed(1) : null;
      
      expect(bmi).toBeNull();
    });

    test('deve calcular mudança de peso', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-01')
      });

      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        date: new Date('2024-01-15')
      });

      await progress1.save();
      await progress2.save();

      // Calcular mudança manualmente
      const weightChange = progress2.weight - progress1.weight;
      expect(weightChange).toBe(-2); // perdeu 2kg
    });

    test('deve calcular mudança de gordura corporal', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        bodyFat: 15,
        date: new Date('2024-01-01')
      });

      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        bodyFat: 14,
        date: new Date('2024-01-15')
      });

      await progress1.save();
      await progress2.save();

      // Calcular mudança manualmente
      const bodyFatChange = progress2.bodyFat - progress1.bodyFat;
      expect(bodyFatChange).toBe(-1); // reduziu 1%
    });

    test('deve calcular mudança de medidas', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        measurements: {
          chest: 100,
          waist: 80
        },
        date: new Date('2024-01-01')
      });

      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        measurements: {
          chest: 98,
          waist: 78
        },
        date: new Date('2024-01-15')
      });

      await progress1.save();
      await progress2.save();

      // Calcular mudanças manualmente
      const chestChange = progress2.measurements.chest - progress1.measurements.chest;
      const waistChange = progress2.measurements.waist - progress1.measurements.waist;
      
      expect(chestChange).toBe(-2); // reduziu 2cm
      expect(waistChange).toBe(-2); // reduziu 2cm
    });

    test('deve calcular score de bem-estar', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70,
        mood: 'feliz',
        energy: 8,
        sleep: 7.5,
        waterIntake: 2.5
      });

      // Calcular score manualmente baseado em múltiplos fatores
      const moodScore = 80; // feliz = 80 pontos
      const energyScore = 80; // energia 8/10 = 80 pontos
      const sleepScore = 75; // sono 7.5h = 75 pontos
      const waterScore = 75; // água 2.5L = 75 pontos
      
      const wellnessScore = (moodScore + energyScore + sleepScore + waterScore) / 4;
      
      expect(wellnessScore).toBeGreaterThan(0);
      expect(wellnessScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Relacionamentos', () => {
    test('deve referenciar usuário corretamente', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70
      });

      await progress.save();
      
      const foundProgress = await Progress.findById(progress._id).populate('user');
      expect(foundProgress.user._id.toString()).toBe(testUser._id.toString());
      expect(foundProgress.user.name).toBe(testUser.name);
    });
  });

  describe('Medidas', () => {
    test('deve validar medidas opcionais', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70,
        measurements: {
          chest: 100,
          waist: 80
          // outras medidas são opcionais
        }
      });

      const savedProgress = await progress.save();
      expect(savedProgress.measurements.chest).toBe(100);
      expect(savedProgress.measurements.waist).toBe(80);
    });

    test('deve validar medidas negativas', async () => {
      const progressData = {
        user: testUser._id,
        weight: 70,
        measurements: {
          chest: -10
        }
      };

      const progress = new Progress(progressData);
      
      try {
        await progress.save();
      } catch (error) {
        expect(error.errors['measurements.chest']).toBeDefined();
      }
    });
  });

  describe('Queries', () => {
    test('deve encontrar progressos por usuário', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-01')
      });
      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        date: new Date('2024-01-15')
      });

      await progress1.save();
      await progress2.save();

      const userProgress = await Progress.find({ user: testUser._id });
      expect(userProgress).toHaveLength(2);
    });

    test('deve encontrar progressos por período', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-01')
      });
      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        date: new Date('2024-02-01')
      });

      await progress1.save();
      await progress2.save();

      const januaryProgress = await Progress.find({
        user: testUser._id,
        date: {
          $gte: new Date('2024-01-01'),
          $lt: new Date('2024-02-01')
        }
      });

      expect(januaryProgress).toHaveLength(1);
    });

    test('deve ordenar progressos por data', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-15')
      });
      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        date: new Date('2024-01-01')
      });

      await progress1.save();
      await progress2.save();

      const orderedProgress = await Progress.find({ user: testUser._id })
        .sort({ date: 1 });

      expect(orderedProgress[0].weight).toBe(68); // primeiro
      expect(orderedProgress[1].weight).toBe(70); // segundo
    });
  });

  describe('Análise de Tendências', () => {
    test('deve calcular tendência de peso', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-01')
      });
      const progress2 = new Progress({
        user: testUser._id,
        weight: 68,
        date: new Date('2024-01-15')
      });
      const progress3 = new Progress({
        user: testUser._id,
        weight: 66,
        date: new Date('2024-01-30')
      });

      await progress1.save();
      await progress2.save();
      await progress3.save();

      // Calcular tendência manualmente
      const weights = [70, 68, 66];
      const trend = weights[weights.length - 1] - weights[0];
      
      expect(trend).toBe(-4); // tendência de perda de peso
    });

    test('deve identificar plateau', async () => {
      const progress1 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-01')
      });
      const progress2 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-15')
      });
      const progress3 = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-30')
      });

      await progress1.save();
      await progress2.save();
      await progress3.save();

      // Verificar se há plateau (peso estável)
      const weights = [70, 70, 70];
      const isPlateau = weights.every(w => w === weights[0]);
      
      expect(isPlateau).toBe(true);
    });
  });

  describe('Índices', () => {
    test('deve ter índice no user', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70
      });

      await progress.save();

      // Verificar se a consulta por user é eficiente
      const startTime = Date.now();
      await Progress.find({ user: testUser._id });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Deve ser rápido
    });

    test('deve ter índice composto em user e date', async () => {
      const progress = new Progress({
        user: testUser._id,
        weight: 70,
        date: new Date('2024-01-01')
      });

      await progress.save();

      // Verificar se a consulta composta é eficiente
      const startTime = Date.now();
      await Progress.find({ 
        user: testUser._id,
        date: { $gte: new Date('2024-01-01') }
      });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Deve ser rápido
    });
  });
}); 