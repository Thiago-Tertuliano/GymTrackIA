const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do alimento é obrigatório'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0.1, 'Quantidade mínima é 0.1']
  },
  unit: {
    type: String,
    required: [true, 'Unidade é obrigatória'],
    enum: ['g', 'ml', 'unidade', 'colher', 'xícara', 'fatia'],
    default: 'g'
  },
  calories: {
    type: Number,
    required: [true, 'Calorias são obrigatórias'],
    min: [0, 'Calorias não podem ser negativas']
  },
  protein: {
    type: Number,
    min: [0, 'Proteína não pode ser negativa'],
    default: 0
  },
  carbs: {
    type: Number,
    min: [0, 'Carboidratos não podem ser negativos'],
    default: 0
  },
  fat: {
    type: Number,
    min: [0, 'Gordura não pode ser negativa'],
    default: 0
  },
  fiber: {
    type: Number,
    min: [0, 'Fibra não pode ser negativa'],
    default: 0
  }
});

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da refeição é obrigatório'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Tipo de refeição é obrigatório'],
    enum: ['café_da_manhã', 'lanche_manhã', 'almoço', 'lanche_tarde', 'jantar', 'ceia'],
    default: 'almoço'
  },
  time: {
    type: String, // formato HH:MM
    required: [true, 'Horário da refeição é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido']
  },
  foods: [foodItemSchema],
  notes: {
    type: String,
    maxlength: [500, 'Notas não podem ter mais de 500 caracteres']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
});

const dietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },
  name: {
    type: String,
    required: [true, 'Nome da dieta é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'Data da dieta é obrigatória'],
    default: Date.now
  },
  type: {
    type: String,
    required: [true, 'Tipo de dieta é obrigatório'],
    enum: ['manutenção', 'perda_peso', 'ganho_massa', 'definição', 'vegetariana', 'vegana'],
    default: 'manutenção'
  },
  targetCalories: {
    type: Number,
    required: [true, 'Calorias alvo são obrigatórias'],
    min: [800, 'Calorias mínimas são 800'],
    max: [5000, 'Calorias máximas são 5000']
  },
  targetProtein: {
    type: Number,
    min: [0, 'Proteína alvo não pode ser negativa'],
    default: 0
  },
  targetCarbs: {
    type: Number,
    min: [0, 'Carboidratos alvo não podem ser negativos'],
    default: 0
  },
  targetFat: {
    type: Number,
    min: [0, 'Gordura alvo não pode ser negativa'],
    default: 0
  },
  meals: [mealSchema],
  notes: {
    type: String,
    maxlength: [1000, 'Notas não podem ter mais de 1000 caracteres']
  },
  completed: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [1, 'Avaliação mínima é 1'],
    max: [5, 'Avaliação máxima é 5']
  }
}, {
  timestamps: true
});

// Virtual para calcular calorias totais consumidas
dietSchema.virtual('totalCalories').get(function() {
  return this.meals.reduce((total, meal) => {
    return total + meal.foods.reduce((mealTotal, food) => {
      return mealTotal + food.calories;
    }, 0);
  }, 0);
});

// Virtual para calcular proteína total
dietSchema.virtual('totalProtein').get(function() {
  return this.meals.reduce((total, meal) => {
    return total + meal.foods.reduce((mealTotal, food) => {
      return mealTotal + food.protein;
    }, 0);
  }, 0);
});

// Virtual para calcular carboidratos totais
dietSchema.virtual('totalCarbs').get(function() {
  return this.meals.reduce((total, meal) => {
    return total + meal.foods.reduce((mealTotal, food) => {
      return mealTotal + food.carbs;
    }, 0);
  }, 0);
});

// Virtual para calcular gordura total
dietSchema.virtual('totalFat').get(function() {
  return this.meals.reduce((total, meal) => {
    return total + meal.foods.reduce((mealTotal, food) => {
      return mealTotal + food.fat;
    }, 0);
  }, 0);
});

// Virtual para calcular progresso da dieta
dietSchema.virtual('progress').get(function() {
  if (!this.meals.length) return 0;
  
  const completedMeals = this.meals.filter(meal => meal.completed).length;
  return Math.round((completedMeals / this.meals.length) * 100);
});

// Virtual para calcular diferença das calorias alvo
dietSchema.virtual('calorieDifference').get(function() {
  return this.totalCalories - this.targetCalories;
});

// Middleware para marcar como completo quando todas as refeições forem feitas
dietSchema.pre('save', function(next) {
  if (this.meals.length > 0) {
    const allMealsCompleted = this.meals.every(meal => meal.completed);
    
    if (allMealsCompleted && !this.completed) {
      this.completed = true;
    }
  }
  next();
});

// Índices para performance
dietSchema.index({ user: 1, date: -1 });
dietSchema.index({ user: 1, completed: 1 });
dietSchema.index({ type: 1 });

module.exports = mongoose.model('Diet', dietSchema); 