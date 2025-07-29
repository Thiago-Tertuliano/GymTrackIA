const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createDiet,
  getDiets,
  getDiet,
  updateDiet,
  deleteDiet,
  completeMeal,
  rateDiet,
  getDietStats
} = require('../controllers/dietController');

const router = express.Router();

// Validações
const createDietValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome da dieta deve ter entre 1 e 100 caracteres'),
  body('type')
    .isIn(['manutenção', 'perda_peso', 'ganho_massa', 'definição', 'vegetariana', 'vegana'])
    .withMessage('Tipo de dieta inválido'),
  body('targetCalories')
    .isFloat({ min: 800, max: 5000 })
    .withMessage('Calorias alvo devem ser entre 800 e 5000'),
  body('targetProtein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Proteína alvo não pode ser negativa'),
  body('targetCarbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carboidratos alvo não podem ser negativos'),
  body('targetFat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Gordura alvo não pode ser negativa'),
  body('meals')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma refeição é obrigatória'),
  body('meals.*.name')
    .trim()
    .notEmpty()
    .withMessage('Nome da refeição é obrigatório'),
  body('meals.*.type')
    .isIn(['café_da_manhã', 'lanche_manhã', 'almoço', 'lanche_tarde', 'jantar', 'ceia'])
    .withMessage('Tipo de refeição inválido'),
  body('meals.*.time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário deve estar no formato HH:MM'),
  body('meals.*.foods')
    .isArray({ min: 1 })
    .withMessage('Pelo menos um alimento é obrigatório'),
  body('meals.*.foods.*.name')
    .trim()
    .notEmpty()
    .withMessage('Nome do alimento é obrigatório'),
  body('meals.*.foods.*.quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Quantidade deve ser pelo menos 0.1'),
  body('meals.*.foods.*.unit')
    .isIn(['g', 'ml', 'unidade', 'colher', 'xícara', 'fatia'])
    .withMessage('Unidade inválida'),
  body('meals.*.foods.*.calories')
    .isFloat({ min: 0 })
    .withMessage('Calorias não podem ser negativas'),
  body('meals.*.foods.*.protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Proteína não pode ser negativa'),
  body('meals.*.foods.*.carbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carboidratos não podem ser negativos'),
  body('meals.*.foods.*.fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Gordura não pode ser negativa'),
  body('meals.*.foods.*.fiber')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fibra não pode ser negativa'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notas não podem ter mais de 1000 caracteres')
];

const updateDietValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome da dieta deve ter entre 1 e 100 caracteres'),
  body('type')
    .optional()
    .isIn(['manutenção', 'perda_peso', 'ganho_massa', 'definição', 'vegetariana', 'vegana'])
    .withMessage('Tipo de dieta inválido'),
  body('targetCalories')
    .optional()
    .isFloat({ min: 800, max: 5000 })
    .withMessage('Calorias alvo devem ser entre 800 e 5000'),
  body('targetProtein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Proteína alvo não pode ser negativa'),
  body('targetCarbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carboidratos alvo não podem ser negativos'),
  body('targetFat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Gordura alvo não pode ser negativa'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notas não podem ter mais de 1000 caracteres')
];

const completeMealValidation = [
  body('dietId')
    .notEmpty()
    .withMessage('ID da dieta é obrigatório'),
  body('mealIndex')
    .isInt({ min: 0 })
    .withMessage('Índice da refeição deve ser um número inteiro'),
  body('completed')
    .isBoolean()
    .withMessage('Status de conclusão deve ser um booleano')
];

const rateDietValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Avaliação deve ser entre 1 e 5')
];

// Rotas
router.post('/', auth, createDietValidation, validate, createDiet);
router.get('/', auth, getDiets);
router.get('/stats', auth, getDietStats);
router.get('/:id', auth, getDiet);
router.put('/:id', auth, updateDietValidation, validate, updateDiet);
router.delete('/:id', auth, deleteDiet);
router.post('/complete-meal', auth, completeMealValidation, validate, completeMeal);
router.post('/:id/rate', auth, rateDietValidation, validate, rateDiet);

module.exports = router; 