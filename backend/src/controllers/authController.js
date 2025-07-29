const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gerar tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// Registrar usuário
const register = async (req, res) => {
  try {
    const { name, email, password, age, height, weight, goal, activityLevel } = req.body;

    // Verificar se email já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criar usuário
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      age,
      height,
      weight,
      goal,
      activityLevel
    });

    await user.save();

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Salvar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: user.toPublicJSON(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Atualizar refresh token e último login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: user.toPublicJSON(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token é obrigatório'
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Gerar novos tokens
    const { accessToken, newRefreshToken } = generateTokens(user._id);

    // Atualizar refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido ou expirado'
      });
    }

    console.error('Erro no refresh token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    // Remover refresh token
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyToken
}; 