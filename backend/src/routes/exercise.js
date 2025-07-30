const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { auth } = require('../middlewares/auth');

// Rotas públicas (não precisam de autenticação)
router.get('/all', exerciseController.getAllExercises);
router.get('/body-parts', exerciseController.getBodyParts);
router.get('/equipment', exerciseController.getEquipment);
router.get('/search', exerciseController.searchExercises);

// Rotas com parâmetros
router.get('/muscle/:muscleGroup', exerciseController.getExercisesByMuscle);
router.get('/equipment/:equipment', exerciseController.getExercisesByEquipment);
router.get('/exercise/:id', exerciseController.getExerciseById);

// Rotas protegidas (precisam de autenticação)
router.get('/favorites', auth, exerciseController.getFavorites);
router.post('/favorites', auth, exerciseController.addToFavorites);
router.delete('/favorites/:exerciseId', auth, exerciseController.removeFromFavorites);
router.get('/favorites/check/:exerciseId', auth, exerciseController.checkFavorite);

module.exports = router; 