const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },
  date: {
    type: Date,
    required: [true, 'Data é obrigatória'],
    default: Date.now
  },
  weight: {
    type: Number,
    required: [true, 'Peso é obrigatório'],
    min: [30, 'Peso mínimo é 30kg'],
    max: [300, 'Peso máximo é 300kg']
  },
  bodyFat: {
    type: Number,
    min: [5, 'Gordura corporal mínima é 5%'],
    max: [50, 'Gordura corporal máxima é 50%']
  },
  muscleMass: {
    type: Number,
    min: [20, 'Massa muscular mínima é 20kg'],
    max: [150, 'Massa muscular máxima é 150kg']
  },
  measurements: {
    chest: {
      type: Number,
      min: [50, 'Medida mínima é 50cm'],
      max: [200, 'Medida máxima é 200cm']
    },
    waist: {
      type: Number,
      min: [50, 'Medida mínima é 50cm'],
      max: [200, 'Medida máxima é 200cm']
    },
    hips: {
      type: Number,
      min: [50, 'Medida mínima é 50cm'],
      max: [200, 'Medida máxima é 200cm']
    },
    biceps: {
      type: Number,
      min: [20, 'Medida mínima é 20cm'],
      max: [100, 'Medida máxima é 100cm']
    },
    thighs: {
      type: Number,
      min: [30, 'Medida mínima é 30cm'],
      max: [150, 'Medida máxima é 150cm']
    },
    calves: {
      type: Number,
      min: [20, 'Medida mínima é 20cm'],
      max: [100, 'Medida máxima é 100cm']
    }
  },
  photos: [{
    type: {
      type: String,
      enum: ['frontal', 'lateral', 'traseira'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notas não podem ter mais de 1000 caracteres']
  },
  mood: {
    type: String,
    enum: ['muito_feliz', 'feliz', 'neutro', 'triste', 'muito_triste'],
    default: 'neutro'
  },
  energy: {
    type: Number,
    min: [1, 'Energia mínima é 1'],
    max: [10, 'Energia máxima é 10'],
    default: 5
  },
  sleep: {
    type: Number,
    min: [0, 'Sono não pode ser negativo'],
    max: [24, 'Sono máximo é 24 horas']
  },
  waterIntake: {
    type: Number,
    min: [0, 'Consumo de água não pode ser negativo'],
    max: [10, 'Consumo máximo é 10L']
  }
}, {
  timestamps: true
});

// Virtual para calcular IMC
progressSchema.virtual('bmi').get(function() {
  // Precisamos buscar a altura do usuário
  return null; // Será calculado no controller
});

// Virtual para calcular mudança de peso
progressSchema.virtual('weightChange').get(function() {
  // Será calculado comparando com o registro anterior
  return null;
});

// Virtual para calcular mudança de medidas
progressSchema.virtual('measurementChanges').get(function() {
  // Será calculado comparando com o registro anterior
  return null;
});

// Virtual para calcular progresso geral
progressSchema.virtual('overallProgress').get(function() {
  // Será calculado baseado em múltiplos fatores
  return null;
});

// Índices para performance
progressSchema.index({ user: 1, date: -1 });
progressSchema.index({ user: 1, createdAt: -1 });

// Índice composto para consultas por período
progressSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Progress', progressSchema); 