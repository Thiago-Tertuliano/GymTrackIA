const { register, login } = require('../../../src/controllers/authController');
const User = require('../../../src/models/User');

// Mock das variáveis de ambiente
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

describe('AuthController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('register', () => {
    test('deve registrar usuário com dados válidos', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        height: 170,
        weight: 70,
        goal: 'perder_peso'
      };

      mockReq.body = userData;

      // Mock do User.save
      const mockUser = {
        _id: 'mockUserId',
        ...userData,
        save: jest.fn().mockResolvedValue(true),
        toPublicJSON: jest.fn().mockReturnValue({ name: userData.name, email: userData.email })
      };
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User.prototype, 'save').mockResolvedValue(mockUser);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: expect.objectContaining({
          user: expect.objectContaining({
            name: userData.name,
            email: userData.email
          }),
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        })
      });
    });

    test('deve falhar com email já existente', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockReq.body = userData;

      // Mock do User.findOne retornando usuário existente
      jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'existing@example.com' });

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email já está em uso'
      });
    });

    test('deve falhar com dados inválidos', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123' // muito curta
      };

      mockReq.body = invalidData;

      // Mock do User.findOne retornando null
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor'
      });
    });
  });

  describe('login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockReq.body = loginData;

      // Mock do usuário existente
      const mockUser = {
        _id: 'mockUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        toPublicJSON: jest.fn().mockReturnValue({ email: loginData.email }),
        save: jest.fn().mockResolvedValue(true),
        refreshToken: null,
        lastLogin: null
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      // Mock da função generateTokens
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'sign').mockReturnValue('mockToken');

      await login(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login realizado com sucesso',
        data: expect.objectContaining({
          user: expect.objectContaining({
            email: loginData.email
          }),
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        })
      });
    });

    test('deve falhar com email inexistente', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockReq.body = loginData;

      // Mock do User.findOne retornando null
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ou senha inválidos'
      });
    });

    test('deve falhar com senha incorreta', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      mockReq.body = loginData;

      // Mock do usuário existente com senha incorreta
      const mockUser = {
        _id: 'mockUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email ou senha inválidos'
      });
    });
  });
}); 