const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  getProgressStats,
  getLatestProgress
} = require('../controllers/progressController');

const router = express.Router();

// Validações
const createProgressValidation = [
  body('weight')
    .isFloat({ min: 30, max: 300 })
    .withMessage('Peso deve ser entre 30 e 300 kg'),
  body('bodyFat')
    .optional()
    .isFloat({ min: 5, max: 50 })
    .withMessage('Gordura corporal deve ser entre 5% e 50%'),
  body('muscleMass')
    .optional()
    .isFloat({ min: 20, max: 150 })
    .withMessage('Massa muscular deve ser entre 20kg e 150kg'),
  body('measurements.chest')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Medida do peito deve ser entre 50cm e 200cm'),
  body('measurements.waist')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Medida da cintura deve ser entre 50cm e 200cm'),
  body('measurements.hips')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Medida do quadril deve ser entre 50cm e 200cm'),
  body('measurements.biceps')
    .optional()
    .isFloat({ min: 20, max: 100 })
    .withMessage('Medida do bíceps deve ser entre 20cm e 100cm'),
  body('measurements.thighs')
    .optional()
    .isFloat({ min: 30, max: 150 })
    .withMessage('Medida da coxa deve ser entre 30cm e 150cm'),
  body('measurements.calves')
    .optional()
    .isFloat({ min: 20, max: 100 })
    .withMessage('Medida da panturrilha deve ser entre 20cm e 100cm'),
  body('photos')
    .optional()
    .isArray()
    .withMessage('Fotos devem ser um array'),
  body('photos.*.type')
    .optional()
    .isIn(['frontal', 'lateral', 'traseira'])
    .withMessage('Tipo de foto inválido'),
  body('photos.*.url')
    .optional()
    .isURL()
    .withMessage('URL da foto deve ser válida'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notas não podem ter mais de 1000 caracteres'),
  body('mood')
    .optional()
    .isIn(['muito_feliz', 'feliz', 'neutro', 'triste', 'muito_triste'])
    .withMessage('Humor inválido'),
  body('energy')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Energia deve ser entre 1 e 10'),
  body('sleep')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sono deve ser entre 0 e 24 horas'),
  body('waterIntake')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Consumo de água deve ser entre 0 e 10L')
];

const updateProgressValidation = [
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Peso deve ser entre 30 e 300 kg'),
  body('bodyFat')
    .optional()
    .isFloat({ min: 5, max: 50 })
    .withMessage('Gordura corporal deve ser entre 5% e 50%'),
  body('muscleMass')
    .optional()
    .isFloat({ min: 20, max: 150 })
    .withMessage('Massa muscular deve ser entre 20kg e 150kg'),
  body('measurements.chest')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Medida do peito deve ser entre 50cm e 200cm'),
  body('measurements.waist')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Medida da cintura deve ser entre 50cm e 200cm'),
  body('measurements.hips')
    .optional()
    .isFloat({ min: 50, max: 200 })
    .withMessage('Medida do quadril deve ser entre 50cm e 200cm'),
  body('measurements.biceps')
    .optional()
    .isFloat({ min: 20, max: 100 })
    .withMessage('Medida do bíceps deve ser entre 20cm e 100cm'),
  body('measurements.thighs')
    .optional()
    .isFloat({ min: 30, max: 150 })
    .withMessage('Medida da coxa deve ser entre 30cm e 150cm'),
  body('measurements.calves')
    .optional()
    .isFloat({ min: 20, max: 100 })
    .withMessage('Medida da panturrilha deve ser entre 20cm e 100cm'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notas não podem ter mais de 1000 caracteres'),
  body('mood')
    .optional()
    .isIn(['muito_feliz', 'feliz', 'neutro', 'triste', 'muito_triste'])
    .withMessage('Humor inválido'),
  body('energy')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Energia deve ser entre 1 e 10'),
  body('sleep')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sono deve ser entre 0 e 24 horas'),
  body('waterIntake')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Consumo de água deve ser entre 0 e 10L')
];

// Rotas
router.post('/', auth, createProgressValidation, validate, createProgress);
router.get('/', auth, getProgress);
router.get('/stats', auth, getProgressStats);
router.get('/latest', auth, getLatestProgress);
router.get('/:id', auth, getProgressById);
router.put('/:id', auth, updateProgressValidation, validate, updateProgress);
router.delete('/:id', auth, deleteProgress);

module.exports = router; 