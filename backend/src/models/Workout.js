const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do exercício é obrigatório'],
    trim: true
  },
  muscleGroup: {
    type: String,
    required: [true, 'Grupo muscular é obrigatório'],
    enum: [
      'peito', 'costas', 'ombro', 'biceps', 'triceps', 
      'perna', 'gluteo', 'abdomen', 'cardio', 'full_body'
    ]
  },
  sets: [{
    reps: {
      type: Number,
      required: [true, 'Número de repetições é obrigatório'],
      min: [1, 'Mínimo 1 repetição'],
      max: [100, 'Máximo 100 repetições']
    },
    weight: {
      type: Number,
      min: [0, 'Peso não pode ser negativo'],
      max: [1000, 'Peso máximo é 1000kg']
    },
    duration: {
      type: Number, // em segundos
      min: [0, 'Duração não pode ser negativa']
    },
    restTime: {
      type: Number, // em segundos
      default: 60,
      min: [0, 'Tempo de descanso não pode ser negativo']
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notas não podem ter mais de 500 caracteres']
  }
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },
  name: {
    type: String,
    required: [true, 'Nome do treino é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  type: {
    type: String,
    required: [true, 'Tipo de treino é obrigatório'],
    enum: ['força', 'hipertrofia', 'resistência', 'cardio', 'flexibilidade', 'funcional'],
    default: 'força'
  },
  difficulty: {
    type: String,
    enum: ['iniciante', 'intermediário', 'avançado'],
    default: 'intermediário'
  },
  exercises: [exerciseSchema],
  duration: {
    type: Number, // em minutos
    min: [5, 'Duração mínima é 5 minutos'],
    max: [300, 'Duração máxima é 300 minutos']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calorias não podem ser negativas']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  rating: {
    type: Number,
    min: [1, 'Avaliação mínima é 1'],
    max: [5, 'Avaliação máxima é 5']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notas não podem ter mais de 1000 caracteres']
  },
  isTemplate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual para calcular duração total do treino
workoutSchema.virtual('totalDuration').get(function() {
  if (this.duration) return this.duration;
  
  // Calcular baseado nos exercícios se não tiver duração definida
  let total = 0;
  this.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      total += (set.duration || 0) + (set.restTime || 60);
    });
  });
  return Math.round(total / 60); // Converter para minutos
});

// Virtual para calcular total de séries
workoutSchema.virtual('totalSets').get(function() {
  return this.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
});

// Virtual para calcular progresso do treino
workoutSchema.virtual('progress').get(function() {
  if (!this.exercises.length) return 0;
  
  let completedSets = 0;
  let totalSets = 0;
  
  this.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      totalSets++;
      if (set.completed) completedSets++;
    });
  });
  
  return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
});

// Middleware para marcar como completo quando todas as séries forem feitas
workoutSchema.pre('save', function(next) {
  if (this.exercises.length > 0) {
    const allSetsCompleted = this.exercises.every(exercise => 
      exercise.sets.every(set => set.completed)
    );
    
    if (allSetsCompleted && !this.completed) {
      this.completed = true;
      this.completedAt = new Date();
    }
  }
  next();
});

// Índices para performance
workoutSchema.index({ user: 1, createdAt: -1 });
workoutSchema.index({ user: 1, completed: 1 });
workoutSchema.index({ type: 1 });

module.exports = mongoose.model('Workout', workoutSchema); 