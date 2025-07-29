const Workout = require('../models/Workout');

// Criar treino
const createWorkout = async (req, res) => {
  try {
    const { name, type, difficulty, exercises, duration, notes, isTemplate } = req.body;
    const userId = req.user._id;

    const workout = new Workout({
      user: userId,
      name,
      type,
      difficulty,
      exercises,
      duration,
      notes,
      isTemplate
    });

    await workout.save();

    res.status(201).json({
      success: true,
      message: 'Treino criado com sucesso',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter todos os treinos do usuário
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, completed, type, isTemplate } = req.query;

    const filter = { user: userId };
    if (completed !== undefined) filter.completed = completed === 'true';
    if (type) filter.type = type;
    if (isTemplate !== undefined) filter.isTemplate = isTemplate === 'true';

    const workouts = await Workout.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name');

    const total = await Workout.countDocuments(filter);

    res.json({
      success: true,
      data: {
        workouts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter treinos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter treino específico
const getWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workout = await Workout.findOne({ _id: id, user: userId })
      .populate('user', 'name');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Erro ao obter treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar treino
const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const workout = await Workout.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Treino atualizado com sucesso',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar treino
const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const workout = await Workout.findOneAndDelete({ _id: id, user: userId });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Treino deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Marcar série como completa
const completeSet = async (req, res) => {
  try {
    const { workoutId, exerciseIndex, setIndex, completed } = req.body;
    const userId = req.user._id;

    const workout = await Workout.findOne({ _id: workoutId, user: userId });
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    if (exerciseIndex >= workout.exercises.length) {
      return res.status(400).json({
        success: false,
        message: 'Índice do exercício inválido'
      });
    }

    const exercise = workout.exercises[exerciseIndex];
    if (setIndex >= exercise.sets.length) {
      return res.status(400).json({
        success: false,
        message: 'Índice da série inválido'
      });
    }

    exercise.sets[setIndex].completed = completed;
    await workout.save();

    res.json({
      success: true,
      message: 'Série atualizada com sucesso',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar série:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Avaliar treino
const rateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Avaliação deve ser entre 1 e 5'
      });
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: id, user: userId },
      { rating },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Treino não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Treino avaliado com sucesso',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Erro ao avaliar treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter estatísticas de treino
const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query; // dias

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Workout.aggregate([
      { $match: { user: userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          completedWorkouts: { $sum: { $cond: ['$completed', 1, 0] } },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const typeStats = await Workout.aggregate([
      { $match: { user: userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          totalWorkouts: 0,
          completedWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          averageRating: 0
        },
        typeStats
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de treino:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  completeSet,
  rateWorkout,
  getWorkoutStats
}; 