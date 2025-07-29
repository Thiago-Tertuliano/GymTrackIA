const Progress = require('../models/Progress');
const User = require('../models/User');

// Criar registro de progresso
const createProgress = async (req, res) => {
  try {
    const { 
      weight, bodyFat, muscleMass, measurements, photos, notes, 
      mood, energy, sleep, waterIntake 
    } = req.body;
    const userId = req.user._id;

    const progress = new Progress({
      user: userId,
      weight,
      bodyFat,
      muscleMass,
      measurements,
      photos,
      notes,
      mood,
      energy,
      sleep,
      waterIntake
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Progresso registrado com sucesso',
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Erro ao criar progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter todos os registros de progresso
const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, period } = req.query;

    const filter = { user: userId };
    if (period) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));
      filter.date = { $gte: startDate };
    }

    const progress = await Progress.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name height');

    const total = await Progress.countDocuments(filter);

    res.json({
      success: true,
      data: {
        progress,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter registro específico
const getProgressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ _id: id, user: userId })
      .populate('user', 'name height');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Registro de progresso não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Erro ao obter progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar progresso
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const progress = await Progress.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Registro de progresso não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Progresso atualizado com sucesso',
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar progresso
const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOneAndDelete({ _id: id, user: userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Registro de progresso não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Progresso deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter estatísticas de progresso
const getProgressStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query; // dias

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Buscar dados do usuário para cálculos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar registros de progresso
    const progressRecords = await Progress.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    if (progressRecords.length === 0) {
      return res.json({
        success: true,
        data: {
          stats: {
            totalRecords: 0,
            weightChange: 0,
            averageWeight: 0,
            averageBodyFat: 0,
            averageMuscleMass: 0,
            averageEnergy: 0,
            averageSleep: 0,
            averageWaterIntake: 0,
            moodDistribution: {},
            measurementChanges: {}
          },
          trends: [],
          goals: {
            weightGoal: user.goal === 'perder_peso' ? 'diminuir' : user.goal === 'ganhar_massa' ? 'aumentar' : 'manter',
            targetWeight: null
          }
        }
      });
    }

    // Calcular estatísticas
    const firstRecord = progressRecords[0];
    const lastRecord = progressRecords[progressRecords.length - 1];
    const weightChange = lastRecord.weight - firstRecord.weight;

    const averageWeight = progressRecords.reduce((sum, record) => sum + record.weight, 0) / progressRecords.length;
    const averageBodyFat = progressRecords.reduce((sum, record) => sum + (record.bodyFat || 0), 0) / progressRecords.length;
    const averageMuscleMass = progressRecords.reduce((sum, record) => sum + (record.muscleMass || 0), 0) / progressRecords.length;
    const averageEnergy = progressRecords.reduce((sum, record) => sum + (record.energy || 0), 0) / progressRecords.length;
    const averageSleep = progressRecords.reduce((sum, record) => sum + (record.sleep || 0), 0) / progressRecords.length;
    const averageWaterIntake = progressRecords.reduce((sum, record) => sum + (record.waterIntake || 0), 0) / progressRecords.length;

    // Distribuição de humor
    const moodDistribution = progressRecords.reduce((acc, record) => {
      const mood = record.mood || 'neutro';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    // Mudanças nas medidas
    const measurementChanges = {};
    if (firstRecord.measurements && lastRecord.measurements) {
      Object.keys(firstRecord.measurements).forEach(measurement => {
        if (firstRecord.measurements[measurement] && lastRecord.measurements[measurement]) {
          measurementChanges[measurement] = lastRecord.measurements[measurement] - firstRecord.measurements[measurement];
        }
      });
    }

    // Calcular IMC para cada registro
    const trends = progressRecords.map(record => {
      const bmi = user.height ? (record.weight / Math.pow(user.height / 100, 2)).toFixed(1) : null;
      return {
        date: record.date,
        weight: record.weight,
        bmi,
        bodyFat: record.bodyFat,
        muscleMass: record.muscleMass,
        energy: record.energy,
        mood: record.mood
      };
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalRecords: progressRecords.length,
          weightChange,
          averageWeight: averageWeight.toFixed(1),
          averageBodyFat: averageBodyFat.toFixed(1),
          averageMuscleMass: averageMuscleMass.toFixed(1),
          averageEnergy: averageEnergy.toFixed(1),
          averageSleep: averageSleep.toFixed(1),
          averageWaterIntake: averageWaterIntake.toFixed(1),
          moodDistribution,
          measurementChanges
        },
        trends,
        goals: {
          weightGoal: user.goal === 'perder_peso' ? 'diminuir' : user.goal === 'ganhar_massa' ? 'aumentar' : 'manter',
          targetWeight: null // Pode ser implementado futuramente
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter último registro
const getLatestProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.findOne({ user: userId })
      .sort({ date: -1 })
      .populate('user', 'name height');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum registro de progresso encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Erro ao obter último progresso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  getProgressStats,
  getLatestProgress
}; 