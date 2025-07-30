const exerciseController = require('../../../src/controllers/exerciseController');
const { createMockRequest, createMockResponse, createTestUser, mockExerciseData } = require('../../helpers/testUtils');

// Mock do exerciseService
jest.mock('../../../src/services/exerciseService');
const exerciseService = require('../../../src/services/exerciseService');

describe('ExerciseController', () => {
  let mockReq, mockRes, testUser;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('getAllExercises', () => {
    test('deve retornar todos os exercícios com sucesso', async () => {
      const mockExercises = [
        { id: '1', name: 'Push-up', bodyPart: 'chest' },
        { id: '2', name: 'Pull-up', bodyPart: 'back' }
      ];

      exerciseService.getAllExercises.mockResolvedValue(mockExercises);
      exerciseService.formatExercise.mockImplementation(exercise => ({
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.bodyPart
      }));

      await exerciseController.getAllExercises(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Exercícios encontrados com sucesso',
        data: {
          exercises: expect.any(Array),
          total: 2
        }
      });
    });

    test('deve retornar 404 quando não há exercícios', async () => {
      exerciseService.getAllExercises.mockResolvedValue([]);

      await exerciseController.getAllExercises(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nenhum exercício encontrado',
        data: { exercises: [], total: 0 }
      });
    });

    test('deve tratar erro interno', async () => {
      exerciseService.getAllExercises.mockRejectedValue(new Error('API Error'));

      await exerciseController.getAllExercises(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor ao buscar exercícios',
        error: 'Erro interno'
      });
    });
  });

  describe('getExercisesByMuscle', () => {
    test('deve retornar exercícios por grupo muscular', async () => {
      const mockExercises = [
        { id: '1', name: 'Push-up', bodyPart: 'chest' }
      ];

      exerciseService.mapMuscleGroup.mockReturnValue('chest');
      exerciseService.getExercisesByMuscle.mockResolvedValue(mockExercises);
      exerciseService.formatExercise.mockImplementation(exercise => ({
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.bodyPart
      }));

      mockReq.params = { muscleGroup: 'peito' };

      await exerciseController.getExercisesByMuscle(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Exercícios para peito encontrados',
        data: {
          exercises: expect.any(Array),
          total: 1,
          muscleGroup: 'peito'
        }
      });
    });

    test('deve retornar 400 sem grupo muscular', async () => {
      mockReq.params = {};

      await exerciseController.getExercisesByMuscle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Grupo muscular é obrigatório'
      });
    });
  });

  describe('addToFavorites', () => {
    beforeEach(async () => {
      testUser = await createTestUser();
      mockReq.user = { id: testUser._id };
    });

    test('deve adicionar exercício aos favoritos com dados completos', async () => {
      mockReq.body = {
        exerciseId: '123',
        name: 'Supino Reto',
        muscleGroup: 'peito',
        equipment: 'barbell',
        target: 'peito',
        gifUrl: 'https://example.com/supino.gif',
        instructions: ['Deite no banco'],
        source: 'wger'
      };

      await exerciseController.addToFavorites(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Exercício adicionado aos favoritos',
        data: {
          exerciseId: '123',
          addedAt: expect.any(Date)
        }
      });
    });

    test('deve adicionar exercício aos favoritos apenas com ID', async () => {
      exerciseService.getExerciseById.mockResolvedValue({
        id: '123',
        name: 'Supino Reto'
      });

      mockReq.body = { exerciseId: '123' };

      await exerciseController.addToFavorites(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Exercício adicionado aos favoritos',
        data: {
          exerciseId: '123',
          addedAt: expect.any(Date)
        }
      });
    });

    test('deve retornar 400 sem exerciseId', async () => {
      mockReq.body = {};

      await exerciseController.addToFavorites(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID do exercício é obrigatório'
      });
    });

    test('deve retornar 400 se exercício já está nos favoritos', async () => {
      testUser.favoriteExercises.push({ exerciseId: '123' });
      await testUser.save();

      mockReq.body = {
        exerciseId: '123',
        name: 'Supino Reto',
        muscleGroup: 'peito',
        equipment: 'barbell'
      };

      await exerciseController.addToFavorites(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Exercício já está nos favoritos'
      });
    });

    test('deve retornar 404 se exercício não existe na API', async () => {
      exerciseService.getExerciseById.mockResolvedValue(null);

      mockReq.body = { exerciseId: '999' };

      await exerciseController.addToFavorites(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Exercício não encontrado na API externa'
      });
    });
  });

  describe('getFavorites', () => {
    beforeEach(async () => {
      testUser = await createTestUser();
      mockReq.user = { id: testUser._id };
    });

    test('deve retornar favoritos do usuário', async () => {
      testUser.favoriteExercises.push({
        exerciseId: '123',
        exerciseData: {
          name: 'Supino Reto',
          muscleGroup: 'peito',
          equipment: 'barbell',
          target: 'peito',
          gifUrl: 'https://example.com/supino.gif',
          instructions: ['Deite no banco']
        },
        addedAt: new Date()
      });
      await testUser.save();

      await exerciseController.getFavorites(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Favoritos encontrados',
        data: {
          favorites: expect.arrayContaining([
            expect.objectContaining({
              id: '123',
              name: 'Supino Reto',
              muscleGroup: 'peito'
            })
          ]),
          total: 1
        }
      });
    });

    test('deve retornar lista vazia quando não há favoritos', async () => {
      await exerciseController.getFavorites(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Nenhum exercício favorito encontrado',
        data: {
          favorites: [],
          total: 0
        }
      });
    });
  });

  describe('removeFromFavorites', () => {
    beforeEach(async () => {
      testUser = await createTestUser();
      mockReq.user = { id: testUser._id };
    });

    test('deve remover exercício dos favoritos', async () => {
      testUser.favoriteExercises.push({ exerciseId: '123' });
      await testUser.save();

      mockReq.params = { exerciseId: '123' };

      await exerciseController.removeFromFavorites(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Exercício removido dos favoritos',
        data: {
          exerciseId: '123'
        }
      });
    });

    test('deve retornar 404 se exercício não está nos favoritos', async () => {
      mockReq.params = { exerciseId: '999' };

      await exerciseController.removeFromFavorites(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Exercício não está nos favoritos'
      });
    });
  });

  describe('checkFavorite', () => {
    beforeEach(async () => {
      testUser = await createTestUser();
      mockReq.user = { id: testUser._id };
    });

    test('deve retornar true se exercício está nos favoritos', async () => {
      testUser.favoriteExercises.push({ exerciseId: '123' });
      await testUser.save();

      mockReq.params = { exerciseId: '123' };

      await exerciseController.checkFavorite(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status do favorito verificado',
        data: {
          exerciseId: '123',
          isFavorite: true
        }
      });
    });

    test('deve retornar false se exercício não está nos favoritos', async () => {
      mockReq.params = { exerciseId: '999' };

      await exerciseController.checkFavorite(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status do favorito verificado',
        data: {
          exerciseId: '999',
          isFavorite: false
        }
      });
    });
  });
}); 