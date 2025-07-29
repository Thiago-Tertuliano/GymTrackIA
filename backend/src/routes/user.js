const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

// Validações
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres'),
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('Idade deve ser entre 16 e 100 anos'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Altura deve ser entre 100 e 250 cm'),
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Peso deve ser entre 30 e 300 kg'),
  body('goal')
    .optional()
    .isIn(['perder_peso', 'ganhar_massa', 'manter', 'definir', 'força'])
    .withMessage('Objetivo inválido'),
  body('activityLevel')
    .optional()
    .isIn(['sedentario', 'leve', 'moderado', 'ativo', 'muito_ativo'])
    .withMessage('Nível de atividade inválido')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

const deleteAccountValidation = [
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória para deletar a conta')
];

// Rotas (todas requerem autenticação)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfileValidation, validate, updateProfile);
router.put('/password', auth, changePasswordValidation, validate, changePassword);
router.delete('/account', auth, deleteAccountValidation, validate, deleteAccount);
router.get('/stats', auth, getUserStats);

module.exports = router; 