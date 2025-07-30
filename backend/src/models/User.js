const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [50, 'Nome não pode ter mais de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  age: {
    type: Number,
    required: [true, 'Idade é obrigatória'],
    min: [16, 'Idade mínima é 16 anos'],
    max: [100, 'Idade máxima é 100 anos']
  },
  height: {
    type: Number,
    required: [true, 'Altura é obrigatória'],
    min: [100, 'Altura mínima é 100cm'],
    max: [250, 'Altura máxima é 250cm']
  },
  weight: {
    type: Number,
    required: [true, 'Peso é obrigatório'],
    min: [30, 'Peso mínimo é 30kg'],
    max: [300, 'Peso máximo é 300kg']
  },
  goal: {
    type: String,
    required: [true, 'Objetivo é obrigatório'],
    enum: ['perder_peso', 'ganhar_massa', 'manter', 'definir', 'força'],
    default: 'manter'
  },
  activityLevel: {
    type: String,
    enum: ['sedentario', 'leve', 'moderado', 'ativo', 'muito_ativo'],
    default: 'moderado'
  },
  refreshToken: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  favoriteExercises: [{
    exerciseId: {
      type: String,
      required: true
    },
    exerciseData: {
      name: String,
      muscleGroup: String,
      equipment: String,
      target: String,
      gifUrl: String,
      instructions: [String],
      source: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para calcular IMC
userSchema.virtual('bmi').get(function() {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Virtual para categoria do IMC
userSchema.virtual('bmiCategory').get(function() {
  const bmi = this.bmi;
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'abaixo_peso';
  if (bmi < 25) return 'peso_normal';
  if (bmi < 30) return 'sobrepeso';
  if (bmi < 35) return 'obesidade_grau1';
  return 'obesidade_grau2';
});

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para retornar dados públicos do usuário
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  return user;
};

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema); 