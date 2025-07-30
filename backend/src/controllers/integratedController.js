const wgerService = require('../services/wgerService');
const aiService = require('../services/aiService');
const User = require('../models/User');

// ===== EXERCÍCIOS INTEGRADOS =====

// Buscar exercícios da Wger
const getWgerExercises = async (req, res) => {
  try {
    const { limit = 50, category } = req.query;
    
    let exercises;
    if (category) {
      exercises = await wgerService.getExercisesByCategory(category);
    } else {
      exercises = await wgerService.getAllExercises(limit);
    }

    const formattedExercises = exercises.map(exercise => 
      wgerService.formatExercise(exercise)
    );

    res.json({
      success: true,
      message: 'Exercícios encontrados',
      data: {
        exercises: formattedExercises,
        total: formattedExercises.length,
        source: 'wger'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercícios Wger:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// ===== ALIMENTOS INTEGRADOS =====

// Buscar alimentos da Wger
const getWgerFoods = async (req, res) => {
  try {
    const { limit = 50, category } = req.query;
    
    let foods;
    if (category) {
      foods = await wgerService.getFoodsByCategory(category);
    } else {
      foods = await wgerService.getAllFoods(limit);
    }

    const formattedFoods = foods.map(food => 
      wgerService.formatFood(food)
    );

    res.json({
      success: true,
      message: 'Alimentos encontrados',
      data: {
        foods: formattedFoods,
        total: formattedFoods.length,
        source: 'wger'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar alimentos Wger:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// ===== IA INTEGRADA =====

// Sugerir treino com IA
const suggestWorkoutWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const { preferences = {} } = req.body;
    
    const suggestedWorkout = await aiService.suggestWorkout(user, preferences);
    
    // Estimar calorias queimadas
    const estimatedCalories = aiService.estimateCaloriesBurned(suggestedWorkout, user);
    suggestedWorkout.caloriesBurned = estimatedCalories;
    
    // Estimar tempo de recuperação
    const recoveryTime = aiService.estimateRecoveryTime(suggestedWorkout, user);
    suggestedWorkout.recoveryTime = recoveryTime;

    res.json({
      success: true,
      message: 'Treino sugerido com sucesso',
      data: {
        workout: suggestedWorkout,
        user: {
          goal: user.goal,
          activityLevel: user.activityLevel,
          age: user.age
        }
      }
    });
  } catch (error) {
    console.error('Erro ao sugerir treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Sugerir dieta com IA
const suggestDietWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const { preferences = {} } = req.body;
    
    const suggestedDiet = await aiService.suggestDiet(user, preferences);
    
    // Calcular necessidades calóricas
    const calorieNeeds = aiService.calculateCalorieNeeds(user);
    const macros = aiService.calculateMacros(calorieNeeds, user.goal);

    res.json({
      success: true,
      message: 'Dieta sugerida com sucesso',
      data: {
        diet: suggestedDiet,
        calculations: {
          calorieNeeds,
          macros,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory
        },
        user: {
          goal: user.goal,
          weight: user.weight,
          height: user.height,
          age: user.age
        }
      }
    });
  } catch (error) {
    console.error('Erro ao sugerir dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Analisar progresso com IA
const analyzeProgressWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const { progressData } = req.body;
    
    const analysis = await aiService.analyzeProgress(user, progressData);

    res.json({
      success: true,
      message: 'Análise de progresso concluída',
      data: {
        analysis,
        user: {
          goal: user.goal,
          currentWeight: user.weight,
          targetWeight: progressData.targetWeight || user.weight
        }
      }
    });
  } catch (error) {
    console.error('Erro ao analisar progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Chat com IA
const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem é obrigatória'
      });
    }

    const response = await aiService.chat(user, message);

    res.json({
      success: true,
      message: 'Resposta gerada com sucesso',
      data: {
        response,
        user: {
          name: user.name,
          goal: user.goal
        }
      }
    });
  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// ===== CÁLCULOS AUTOMÁTICOS =====

// Calcular necessidades nutricionais
const calculateNutritionNeeds = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const calorieNeeds = aiService.calculateCalorieNeeds(user);
    const macros = aiService.calculateMacros(calorieNeeds, user.goal);

    res.json({
      success: true,
      message: 'Necessidades nutricionais calculadas',
      data: {
        calorieNeeds,
        macros,
        user: {
          goal: user.goal,
          weight: user.weight,
          height: user.height,
          age: user.age,
          activityLevel: user.activityLevel,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory
        }
      }
    });
  } catch (error) {
    console.error('Erro ao calcular necessidades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Estimar calorias queimadas
const estimateCaloriesBurned = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const { workout } = req.body;
    
    if (!workout) {
      return res.status(400).json({
        success: false,
        message: 'Dados do treino são obrigatórios'
      });
    }

    const caloriesBurned = aiService.estimateCaloriesBurned(workout, user);
    const recoveryTime = aiService.estimateRecoveryTime(workout, user);

    res.json({
      success: true,
      message: 'Estimativas calculadas',
      data: {
        caloriesBurned,
        recoveryTime,
        workout: {
          type: workout.type,
          difficulty: workout.difficulty,
          duration: workout.duration
        },
        user: {
          weight: user.weight,
          age: user.age
        }
      }
    });
  } catch (error) {
    console.error('Erro ao estimar calorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  // Exercícios
  getWgerExercises,
  
  // Alimentos
  getWgerFoods,
  
  // IA
  suggestWorkoutWithAI,
  suggestDietWithAI,
  analyzeProgressWithAI,
  chatWithAI,
  
  // Cálculos
  calculateNutritionNeeds,
  estimateCaloriesBurned
}; 