const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  completeSet,
  rateWorkout,
  getWorkoutStats
} = require('../controllers/workoutController');

const router = express.Router();

// Validações
const createWorkoutValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome do treino deve ter entre 1 e 100 caracteres'),
  body('type')
    .isIn(['força', 'hipertrofia', 'resistência', 'cardio', 'flexibilidade', 'funcional'])
    .withMessage('Tipo de treino inválido'),
  body('difficulty')
    .optional()
    .isIn(['iniciante', 'intermediário', 'avançado'])
    .withMessage('Dificuldade inválida'),
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('Pelo menos um exercício é obrigatório'),
  body('exercises.*.name')
    .trim()
    .notEmpty()
    .withMessage('Nome do exercício é obrigatório'),
  body('exercises.*.muscleGroup')
    .isIn(['peito', 'costas', 'ombro', 'biceps', 'triceps', 'perna', 'gluteo', 'abdomen', 'cardio', 'full_body'])
    .withMessage('Grupo muscular inválido'),
  body('exercises.*.sets')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma série é obrigatória'),
  body('exercises.*.sets.*.reps')
    .isInt({ min: 1, max: 100 })
    .withMessage('Repetições devem ser entre 1 e 100'),
  body('exercises.*.sets.*.weight')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Peso deve ser entre 0 e 1000kg'),
  body('exercises.*.sets.*.duration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Duração não pode ser negativa'),
  body('exercises.*.sets.*.restTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tempo de descanso não pode ser negativo'),
  body('duration')
    .optional()
    .isFloat({ min: 5, max: 300 })
    .withMessage('Duração deve ser entre 5 e 300 minutos'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notas não podem ter mais de 1000 caracteres')
];

const updateWorkoutValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome do treino deve ter entre 1 e 100 caracteres'),
  body('type')
    .optional()
    .isIn(['força', 'hipertrofia', 'resistência', 'cardio', 'flexibilidade', 'funcional'])
    .withMessage('Tipo de treino inválido'),
  body('difficulty')
    .optional()
    .isIn(['iniciante', 'intermediário', 'avançado'])
    .withMessage('Dificuldade inválida'),
  body('duration')
    .optional()
    .isFloat({ min: 5, max: 300 })
    .withMessage('Duração deve ser entre 5 e 300 minutos'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notas não podem ter mais de 1000 caracteres')
];

const completeSetValidation = [
  body('workoutId')
    .notEmpty()
    .withMessage('ID do treino é obrigatório'),
  body('exerciseIndex')
    .isInt({ min: 0 })
    .withMessage('Índice do exercício deve ser um número inteiro'),
  body('setIndex')
    .isInt({ min: 0 })
    .withMessage('Índice da série deve ser um número inteiro'),
  body('completed')
    .isBoolean()
    .withMessage('Status de conclusão deve ser um booleano')
];

const rateWorkoutValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Avaliação deve ser entre 1 e 5')
];

// Middleware de desenvolvimento (sem autenticação)
const devAuth = (req, res, next) => {
  req.user = { id: 'dev-user-123', name: 'Developer' };
  next();
};

// Rotas (sem autenticação em desenvolvimento)
router.post('/', devAuth, createWorkoutValidation, validate, createWorkout);
router.get('/', devAuth, getWorkouts);
router.get('/stats', devAuth, getWorkoutStats);
router.get('/:id', devAuth, getWorkout);
router.put('/:id', devAuth, updateWorkoutValidation, validate, updateWorkout);
router.delete('/:id', devAuth, deleteWorkout);
router.post('/complete-set', devAuth, completeSetValidation, validate, completeSet);
router.post('/:id/rate', devAuth, rateWorkoutValidation, validate, rateWorkout);

module.exports = router; 