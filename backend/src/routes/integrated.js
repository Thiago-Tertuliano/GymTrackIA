const express = require('express');
const router = express.Router();
const integratedController = require('../controllers/integratedController');
const { auth } = require('../middlewares/auth');

// ===== ROTAS PÚBLICAS =====

// Exercícios da Wger
router.get('/exercises', integratedController.getWgerExercises);

// Alimentos da Wger
router.get('/foods', integratedController.getWgerFoods);

// ===== ROTAS PROTEGIDAS =====

// Sugestões com IA
router.post('/ai/suggest-workout', auth, integratedController.suggestWorkoutWithAI);
router.post('/ai/suggest-diet', auth, integratedController.suggestDietWithAI);
router.post('/ai/analyze-progress', auth, integratedController.analyzeProgressWithAI);
router.post('/ai/chat', auth, integratedController.chatWithAI);

// Cálculos automáticos
router.get('/calculations/nutrition', auth, integratedController.calculateNutritionNeeds);
router.post('/calculations/calories', auth, integratedController.estimateCaloriesBurned);

module.exports = router; 