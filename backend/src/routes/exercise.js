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

// Middleware de desenvolvimento (sem autenticação)
const devAuth = (req, res, next) => {
  req.user = { id: 'dev-user-123', name: 'Developer' };
  next();
};

// Rotas protegidas (precisam de autenticação)
router.get('/favorites', devAuth, exerciseController.getFavorites);
router.post('/favorites', devAuth, exerciseController.addToFavorites);
router.delete('/favorites/:exerciseId', devAuth, exerciseController.removeFromFavorites);
router.get('/favorites/check/:exerciseId', devAuth, exerciseController.checkFavorite);

module.exports = router; 