const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  register,
  login,
  refreshToken,
  logout,
  verifyToken
} = require('../controllers/authController');

const router = express.Router();

// Validações
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('age')
    .isInt({ min: 16, max: 100 })
    .withMessage('Idade deve ser entre 16 e 100 anos'),
  body('height')
    .isFloat({ min: 100, max: 250 })
    .withMessage('Altura deve ser entre 100 e 250 cm'),
  body('weight')
    .isFloat({ min: 30, max: 300 })
    .withMessage('Peso deve ser entre 30 e 300 kg'),
  body('goal')
    .isIn(['perder_peso', 'ganhar_massa', 'manter', 'definir', 'força'])
    .withMessage('Objetivo inválido'),
  body('activityLevel')
    .optional()
    .isIn(['sedentario', 'leve', 'moderado', 'ativo', 'muito_ativo'])
    .withMessage('Nível de atividade inválido')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token é obrigatório')
];

// Rotas
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshTokenValidation, validate, refreshToken);
router.post('/logout', auth, logout);
router.get('/verify', auth, verifyToken);

module.exports = router; 