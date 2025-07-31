const exerciseService = require('../services/exerciseService');
const wgerService = require('../services/wgerService');
const aiService = require('../services/aiService');
const User = require('../models/User');

// ===== EXERCÍCIOS INTEGRADOS =====

// Buscar exercícios da RapidAPI (ExerciseDB)
const getWgerExercises = async (req, res) => {
  try {
    const { limit = 50, category } = req.query;
    
    let exercises;
    
    if (category) {
      // Mapear categoria para o formato da API
      const mappedCategory = exerciseService.mapMuscleGroup(category);
      exercises = await exerciseService.getExercisesByMuscle(mappedCategory);
    } else {
      exercises = await exerciseService.getAllExercises();
    }

    // Limitar resultados se necessário
    if (limit && exercises.length > limit) {
      exercises = exercises.slice(0, limit);
    }

    const formattedExercises = exercises.map(exercise => 
      exerciseService.formatExercise(exercise)
    );

    res.json({
      success: true,
      message: 'Exercícios encontrados',
      data: {
        exercises: formattedExercises,
        total: formattedExercises.length,
        source: 'rapidapi'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
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
      try {
        foods = await wgerService.getFoodsByCategory(category);
      } catch (error) {
        console.error('Erro ao buscar alimentos por categoria, usando fallback:', error.message);
        foods = getMockFoodsByCategory(category);
      }
    } else {
      try {
        foods = await wgerService.getAllFoods(limit);
      } catch (error) {
        console.error('Erro ao buscar alimentos, usando fallback:', error.message);
        foods = getMockFoods(limit);
      }
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

// Função para gerar dados simulados de alimentos
const getMockFoods = (limit = 50) => {
  const mockFoods = [
    {
      id: 1,
      name: 'Frango',
      category: 1,
      energy: 165,
      protein: 31,
      carbohydrates: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      image: null,
      language: 'pt'
    },
    {
      id: 2,
      name: 'Arroz Integral',
      category: 2,
      energy: 111,
      protein: 2.6,
      carbohydrates: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      image: null,
      language: 'pt'
    },
    {
      id: 3,
      name: 'Brócolis',
      category: 3,
      energy: 34,
      protein: 2.8,
      carbohydrates: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      image: null,
      language: 'pt'
    }
  ];

  return mockFoods.slice(0, limit);
};

// Função para gerar dados simulados de alimentos por categoria
const getMockFoodsByCategory = (category) => {
  const categoryMap = {
    'proteinas': [
      {
        id: 1,
        name: 'Frango',
        category: 1,
        energy: 165,
        protein: 31,
        carbohydrates: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0,
        sodium: 74,
        image: null,
        language: 'pt'
      },
      {
        id: 2,
        name: 'Ovos',
        category: 1,
        energy: 155,
        protein: 13,
        carbohydrates: 1.1,
        fat: 11,
        fiber: 0,
        sugar: 1.1,
        sodium: 124,
        image: null,
        language: 'pt'
      }
    ],
    'carboidratos': [
      {
        id: 3,
        name: 'Arroz Integral',
        category: 2,
        energy: 111,
        protein: 2.6,
        carbohydrates: 23,
        fat: 0.9,
        fiber: 1.8,
        sugar: 0.4,
        sodium: 5,
        image: null,
        language: 'pt'
      },
      {
        id: 4,
        name: 'Batata Doce',
        category: 2,
        energy: 86,
        protein: 1.6,
        carbohydrates: 20,
        fat: 0.1,
        fiber: 3,
        sugar: 4.2,
        sodium: 55,
        image: null,
        language: 'pt'
      }
    ]
  };

  return categoryMap[category] || getMockFoods(10);
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