const Diet = require('../models/Diet');

// Criar dieta
const createDiet = async (req, res) => {
  try {
    const { name, date, type, targetCalories, targetProtein, targetCarbs, targetFat, meals, notes } = req.body;
    const userId = req.user._id;

    const diet = new Diet({
      user: userId,
      name,
      date: date || new Date(),
      type,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      meals,
      notes
    });

    await diet.save();

    res.status(201).json({
      success: true,
      message: 'Dieta criada com sucesso',
      data: {
        diet
      }
    });
  } catch (error) {
    console.error('Erro ao criar dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter todas as dietas do usuário
const getDiets = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, completed, type, date } = req.query;

    const filter = { user: userId };
    if (completed !== undefined) filter.completed = completed === 'true';
    if (type) filter.type = type;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const diets = await Diet.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name');

    const total = await Diet.countDocuments(filter);

    res.json({
      success: true,
      data: {
        diets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter dietas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter dieta específica
const getDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const diet = await Diet.findOne({ _id: id, user: userId })
      .populate('user', 'name');

    if (!diet) {
      return res.status(404).json({
        success: false,
        message: 'Dieta não encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        diet
      }
    });
  } catch (error) {
    console.error('Erro ao obter dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar dieta
const updateDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const diet = await Diet.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!diet) {
      return res.status(404).json({
        success: false,
        message: 'Dieta não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Dieta atualizada com sucesso',
      data: {
        diet
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar dieta
const deleteDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const diet = await Diet.findOneAndDelete({ _id: id, user: userId });

    if (!diet) {
      return res.status(404).json({
        success: false,
        message: 'Dieta não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Dieta deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Marcar refeição como completa
const completeMeal = async (req, res) => {
  try {
    const { dietId, mealIndex, completed } = req.body;
    const userId = req.user._id;

    const diet = await Diet.findOne({ _id: dietId, user: userId });
    if (!diet) {
      return res.status(404).json({
        success: false,
        message: 'Dieta não encontrada'
      });
    }

    if (mealIndex >= diet.meals.length) {
      return res.status(400).json({
        success: false,
        message: 'Índice da refeição inválido'
      });
    }

    diet.meals[mealIndex].completed = completed;
    if (completed) {
      diet.meals[mealIndex].completedAt = new Date();
    } else {
      diet.meals[mealIndex].completedAt = null;
    }

    await diet.save();

    res.json({
      success: true,
      message: 'Refeição atualizada com sucesso',
      data: {
        diet
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar refeição:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Avaliar dieta
const rateDiet = async (req, res) => {
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

    const diet = await Diet.findOneAndUpdate(
      { _id: id, user: userId },
      { rating },
      { new: true }
    );

    if (!diet) {
      return res.status(404).json({
        success: false,
        message: 'Dieta não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Dieta avaliada com sucesso',
      data: {
        diet
      }
    });
  } catch (error) {
    console.error('Erro ao avaliar dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter estatísticas de dieta
const getDietStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query; // dias

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await Diet.aggregate([
      { $match: { user: userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalDiets: { $sum: 1 },
          completedDiets: { $sum: { $cond: ['$completed', 1, 0] } },
          totalCalories: { $sum: '$totalCalories' },
          totalProtein: { $sum: '$totalProtein' },
          totalCarbs: { $sum: '$totalCarbs' },
          totalFat: { $sum: '$totalFat' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const typeStats = await Diet.aggregate([
      { $match: { user: userId, date: { $gte: startDate } } },
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
          totalDiets: 0,
          completedDiets: 0,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          averageRating: 0
        },
        typeStats
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de dieta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createDiet,
  getDiets,
  getDiet,
  updateDiet,
  deleteDiet,
  completeMeal,
  rateDiet,
  getDietStats
}; 