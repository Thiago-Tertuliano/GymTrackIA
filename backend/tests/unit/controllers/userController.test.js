const { getProfile, updateProfile, changePassword, deleteAccount, getUserStats } = require('../../../src/controllers/userController');
const User = require('../../../src/models/User');

describe('UserController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { _id: 'mockUserId' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getProfile', () => {
    test('deve retornar perfil do usuário autenticado', async () => {
      const mockUser = {
        _id: 'mockUserId',
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        height: 170,
        weight: 70,
        goal: 'perder_peso',
        toPublicJSON: jest.fn().mockReturnValue({
          name: 'Test User',
          email: 'test@example.com'
        })
      };

      mockReq.user = mockUser;

      await getProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          user: expect.objectContaining({
            name: mockUser.name,
            email: mockUser.email
          })
        })
      });
    });

    test('deve falhar sem usuário autenticado', async () => {
      mockReq.user = null;

      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });
  });

  describe('updateProfile', () => {
    test('deve atualizar perfil com dados válidos', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 26,
        height: 175,
        weight: 72
      };

      mockReq.body = updateData;
      mockReq.user = { _id: 'mockUserId' };

      const mockUpdatedUser = {
        _id: 'mockUserId',
        ...updateData,
        toPublicJSON: jest.fn().mockReturnValue(updateData)
      };

      // Mock do findByIdAndUpdate com chain de select
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUpdatedUser)
      });
      jest.spyOn(User, 'findByIdAndUpdate').mockImplementation(mockFindByIdAndUpdate);

      await updateProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: expect.objectContaining({
          user: updateData
        })
      });
    });

    test('deve falhar com dados inválidos', async () => {
      const invalidData = {
        age: -5,
        height: 50 // muito baixo
      };

      mockReq.body = invalidData;
      mockReq.user = {
        _id: 'mockUserId',
        save: jest.fn().mockRejectedValue(new Error('Validation error'))
      };

      await updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });
  });

  describe('changePassword', () => {
    test('deve alterar senha com dados válidos', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123'
      };

      mockReq.body = passwordData;
      mockReq.user = { _id: 'mockUserId' };

      const mockUser = {
        _id: 'mockUserId',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      await changePassword(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    });

    test('deve falhar com senha atual incorreta', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      mockReq.body = passwordData;
      mockReq.user = { _id: 'mockUserId' };

      const mockUser = {
        _id: 'mockUserId',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      await changePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Senha atual incorreta'
      });
    });

    test('deve falhar com nova senha muito curta', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: '123' // muito curta
      };

      mockReq.body = passwordData;
      mockReq.user = {
        _id: 'mockUserId',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      await changePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });
  });

  describe('deleteAccount', () => {
    test('deve deletar conta com confirmação', async () => {
      const deleteData = {
        password: 'password123'
      };

      mockReq.body = deleteData;
      mockReq.user = { _id: 'mockUserId' };

      const mockUser = {
        _id: 'mockUserId',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      await deleteAccount(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Conta deletada com sucesso'
      });
    });

    test('deve falhar com senha incorreta', async () => {
      const deleteData = {
        password: 'wrongpassword'
      };

      mockReq.body = deleteData;
      mockReq.user = { _id: 'mockUserId' };

      const mockUser = {
        _id: 'mockUserId',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      await deleteAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Senha incorreta'
      });
    });
  });

  describe('getUserStats', () => {
    test('deve retornar estatísticas do usuário', async () => {
      const mockUser = {
        _id: 'mockUserId',
        name: 'Test User',
        age: 25,
        height: 170,
        weight: 70,
        goal: 'perder_peso',
        bmi: '24.2',
        bmiCategory: 'peso_normal',
        activityLevel: 'moderado',
        createdAt: new Date(),
        lastLogin: new Date()
      };

      mockReq.user = { _id: 'mockUserId' };
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      await getUserStats(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          stats: expect.objectContaining({
            bmi: mockUser.bmi,
            bmiCategory: mockUser.bmiCategory,
            age: mockUser.age
          })
        })
      });
    });

    test('deve falhar com usuário não encontrado', async () => {
      mockReq.user = null;

      await getUserStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });
  });
}); 