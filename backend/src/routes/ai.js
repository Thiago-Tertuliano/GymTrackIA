const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  generateWorkoutSuggestion,
  generateDietSuggestion,
  analyzeProgress,
  chatWithAI
} = require('../controllers/aiController');

const router = express.Router();

// Validações
const workoutSuggestionValidation = [
  body('goal')
    .optional()
    .isIn(['perder_peso', 'ganhar_massa', 'manter', 'definir', 'força'])
    .withMessage('Objetivo inválido'),
  body('muscleGroup')
    .optional()
    .isIn(['peito', 'costas', 'ombro', 'biceps', 'triceps', 'perna', 'gluteo', 'abdomen', 'cardio', 'full_body'])
    .withMessage('Grupo muscular inválido'),
  body('difficulty')
    .optional()
    .isIn(['iniciante', 'intermediário', 'avançado'])
    .withMessage('Dificuldade inválida'),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage('Duração deve ser entre 15 e 180 minutos')
];

const dietSuggestionValidation = [
  body('type')
    .optional()
    .isIn(['manutenção', 'perda_peso', 'ganho_massa', 'definição', 'vegetariana', 'vegana'])
    .withMessage('Tipo de dieta inválido'),
  body('targetCalories')
    .optional()
    .isInt({ min: 800, max: 5000 })
    .withMessage('Calorias alvo devem ser entre 800 e 5000'),
  body('restrictions')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Restrições não podem ter mais de 500 caracteres')
];

const chatValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Mensagem deve ter entre 1 e 1000 caracteres'),
  body('context')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Contexto não pode ter mais de 500 caracteres')
];

// Rotas
router.post('/workout-suggestion', auth, workoutSuggestionValidation, validate, generateWorkoutSuggestion);
router.post('/diet-suggestion', auth, dietSuggestionValidation, validate, generateDietSuggestion);
router.get('/analyze-progress', auth, analyzeProgress);
router.post('/chat', auth, chatValidation, validate, chatWithAI);

module.exports = router; 