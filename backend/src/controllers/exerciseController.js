const exerciseService = require('../services/exerciseService');
const User = require('../models/User');

/**
 * Controller para gerenciar operações relacionadas a exercícios
 */
class ExerciseController {
  
  /**
   * Buscar todos os exercícios
   */
  async getAllExercises(req, res) {
  try {
    const exercises = await exerciseService.getAllExercises();
    
      if (!exercises || exercises.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum exercício encontrado',
          data: { exercises: [], total: 0 }
        });
      }

    const formattedExercises = exercises.map(exercise => 
      exerciseService.formatExercise(exercise)
    );

    res.json({
      success: true,
      message: 'Exercícios encontrados com sucesso',
      data: {
        exercises: formattedExercises,
        total: formattedExercises.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar exercícios',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar exercícios por grupo muscular
   */
  async getExercisesByMuscle(req, res) {
  try {
    const { muscleGroup } = req.params;
      
      if (!muscleGroup) {
        return res.status(400).json({
          success: false,
          message: 'Grupo muscular é obrigatório'
        });
      }

    const mappedMuscle = exerciseService.mapMuscleGroup(muscleGroup);
    const exercises = await exerciseService.getExercisesByMuscle(mappedMuscle);
      
      if (!exercises || exercises.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Nenhum exercício encontrado para ${muscleGroup}`,
          data: { exercises: [], total: 0, muscleGroup }
        });
      }
    
    const formattedExercises = exercises.map(exercise => 
      exerciseService.formatExercise(exercise)
    );

    res.json({
      success: true,
      message: `Exercícios para ${muscleGroup} encontrados`,
      data: {
        exercises: formattedExercises,
        total: formattedExercises.length,
          muscleGroup
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercícios por músculo:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar exercícios por grupo muscular',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar exercícios por equipamento
   */
  async getExercisesByEquipment(req, res) {
  try {
    const { equipment } = req.params;
      
      if (!equipment) {
        return res.status(400).json({
          success: false,
          message: 'Equipamento é obrigatório'
        });
      }
    
    const exercises = await exerciseService.getExercisesByEquipment(equipment);
      
      if (!exercises || exercises.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Nenhum exercício encontrado para o equipamento ${equipment}`,
          data: { exercises: [], total: 0, equipment }
        });
      }
    
    const formattedExercises = exercises.map(exercise => 
      exerciseService.formatExercise(exercise)
    );

    res.json({
      success: true,
      message: `Exercícios com ${equipment} encontrados`,
      data: {
        exercises: formattedExercises,
        total: formattedExercises.length,
          equipment
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercícios por equipamento:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar exercícios por equipamento',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar exercício específico por ID
   */
  async getExerciseById(req, res) {
  try {
    const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID do exercício é obrigatório'
        });
      }
    
    const exercise = await exerciseService.getExerciseById(id);
      
      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: 'Exercício não encontrado',
          data: { exercise: null }
        });
      }

    const formattedExercise = exerciseService.formatExercise(exercise);

    res.json({
      success: true,
      message: 'Exercício encontrado com sucesso',
      data: {
        exercise: formattedExercise
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercício:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar exercício',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar grupos musculares disponíveis
   */
  async getBodyParts(req, res) {
  try {
    const bodyParts = await exerciseService.getBodyParts();

      if (!bodyParts || bodyParts.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum grupo muscular encontrado',
          data: { bodyParts: [] }
        });
      }

    res.json({
      success: true,
      message: 'Grupos musculares encontrados',
      data: {
          bodyParts
      }
    });
  } catch (error) {
    console.error('Erro ao buscar grupos musculares:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar grupos musculares',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar equipamentos disponíveis
   */
  async getEquipment(req, res) {
  try {
    const equipment = await exerciseService.getEquipment();

      if (!equipment || equipment.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum equipamento encontrado',
          data: { equipment: [] }
        });
      }

    res.json({
      success: true,
      message: 'Equipamentos encontrados',
      data: {
          equipment
      }
    });
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar equipamentos',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar exercícios com filtros avançados
   */
  async searchExercises(req, res) {
    try {
      const { 
        muscleGroup, 
        equipment, 
        target, 
        limit = 20,
        page = 1 
      } = req.query;
      
      // Validação dos parâmetros
      const validLimit = Math.min(Math.max(parseInt(limit), 1), 100);
      const validPage = Math.max(parseInt(page), 1);
    
    let exercises = [];
    
      // Buscar exercícios baseado nos filtros
    if (muscleGroup) {
      const mappedMuscle = exerciseService.mapMuscleGroup(muscleGroup);
      exercises = await exerciseService.getExercisesByMuscle(mappedMuscle);
    } else if (equipment) {
      exercises = await exerciseService.getExercisesByEquipment(equipment);
    } else {
      exercises = await exerciseService.getAllExercises();
    }
    
    // Filtrar por target se especificado
    if (target) {
      exercises = exercises.filter(exercise => 
          exercise.target && 
        exercise.target.toLowerCase().includes(target.toLowerCase())
      );
    }
    
      // Paginação
      const totalExercises = exercises.length;
      const startIndex = (validPage - 1) * validLimit;
      const endIndex = startIndex + validLimit;
      const paginatedExercises = exercises.slice(startIndex, endIndex);
      
      const formattedExercises = paginatedExercises.map(exercise => 
      exerciseService.formatExercise(exercise)
    );

    res.json({
      success: true,
      message: 'Exercícios encontrados',
      data: {
        exercises: formattedExercises,
          total: totalExercises,
          page: validPage,
          limit: validLimit,
          totalPages: Math.ceil(totalExercises / validLimit),
        filters: {
          muscleGroup,
          equipment,
            target
          }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({
      success: false,
        message: 'Erro interno do servidor ao buscar exercícios',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Adicionar exercício aos favoritos
   */
  async addToFavorites(req, res) {
    try {
      const { exerciseId, name, muscleGroup, equipment, target, gifUrl, instructions, source } = req.body;
      const userId = req.user.id;
      
      if (!exerciseId) {
        return res.status(400).json({
          success: false,
          message: 'ID do exercício é obrigatório'
        });
      }

      // Verificar se já está nos favoritos
      const user = await User.findById(userId);
      const alreadyFavorite = user.favoriteExercises.some(
        fav => fav.exerciseId === exerciseId
      );

      if (alreadyFavorite) {
        return res.status(400).json({
          success: false,
          message: 'Exercício já está nos favoritos'
        });
      }

      // Se recebeu dados completos do exercício, adicionar diretamente
      if (name && muscleGroup && equipment) {
        user.favoriteExercises.push({ 
          exerciseId,
          exerciseData: {
            name,
            muscleGroup,
            equipment,
            target,
            gifUrl,
            instructions,
            source
          }
        });
        await user.save();

        return res.json({
          success: true,
          message: 'Exercício adicionado aos favoritos',
          data: {
            exerciseId,
            addedAt: new Date()
          }
        });
      }

      // Se não recebeu dados completos, verificar se o exercício existe na API externa
      try {
        const exercise = await exerciseService.getExerciseById(exerciseId);
        if (!exercise) {
          return res.status(404).json({
            success: false,
            message: 'Exercício não encontrado na API externa'
          });
        }
      } catch (apiError) {
        console.error('Erro ao verificar exercício na API:', apiError);
        return res.status(404).json({
          success: false,
          message: 'Exercício não encontrado ou API externa indisponível'
        });
      }

      // Adicionar aos favoritos
      user.favoriteExercises.push({ exerciseId });
      await user.save();

      res.json({
        success: true,
        message: 'Exercício adicionado aos favoritos',
        data: {
          exerciseId,
          addedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao adicionar favorito',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Remover exercício dos favoritos
   */
  async removeFromFavorites(req, res) {
    try {
      const { exerciseId } = req.params;
      const userId = req.user.id;
      
      if (!exerciseId) {
        return res.status(400).json({
          success: false,
          message: 'ID do exercício é obrigatório'
        });
      }

      const user = await User.findById(userId);
      const favoriteIndex = user.favoriteExercises.findIndex(
        fav => fav.exerciseId === exerciseId
      );

      if (favoriteIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Exercício não está nos favoritos'
        });
      }

      // Remover dos favoritos
      user.favoriteExercises.splice(favoriteIndex, 1);
      await user.save();

      res.json({
        success: true,
        message: 'Exercício removido dos favoritos',
        data: {
          exerciseId
        }
      });
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao remover favorito',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Buscar favoritos do usuário
   */
  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user.favoriteExercises || user.favoriteExercises.length === 0) {
        return res.json({
          success: true,
          message: 'Nenhum exercício favorito encontrado',
          data: {
            favorites: [],
            total: 0
          }
        });
      }

      // Buscar detalhes dos exercícios favoritos
      const favoriteExercises = [];
      
      for (const favorite of user.favoriteExercises) {
        try {
          // Se temos dados salvos localmente, usar eles
          if (favorite.exerciseData) {
            const formattedExercise = {
              id: favorite.exerciseId,
              name: favorite.exerciseData.name,
              muscleGroup: favorite.exerciseData.muscleGroup,
              equipment: favorite.exerciseData.equipment,
              target: favorite.exerciseData.target,
              gifUrl: favorite.exerciseData.gifUrl,
              instructions: favorite.exerciseData.instructions || [],
              instructions_pt: favorite.exerciseData.instructions || [],
              addedAt: favorite.addedAt
            };
            favoriteExercises.push(formattedExercise);
          } else {
            // Tentar buscar da API externa
            const exercise = await exerciseService.getExerciseById(favorite.exerciseId);
            if (exercise) {
              const formattedExercise = exerciseService.formatExercise(exercise);
              favoriteExercises.push({
                ...formattedExercise,
                addedAt: favorite.addedAt
              });
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar exercício ${favorite.exerciseId}:`, error);
          // Continuar mesmo se um exercício não for encontrado
        }
      }

      res.json({
        success: true,
        message: 'Favoritos encontrados',
        data: {
          favorites: favoriteExercises,
          total: favoriteExercises.length
        }
      });
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar favoritos',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  /**
   * Verificar se exercício está nos favoritos
   */
  async checkFavorite(req, res) {
    try {
      const { exerciseId } = req.params;
      const userId = req.user.id;
      
      if (!exerciseId) {
        return res.status(400).json({
          success: false,
          message: 'ID do exercício é obrigatório'
        });
      }

      const user = await User.findById(userId);
      const isFavorite = user.favoriteExercises.some(
        fav => fav.exerciseId === exerciseId
      );

      res.json({
        success: true,
        message: 'Status do favorito verificado',
        data: {
          exerciseId,
          isFavorite
        }
      });
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao verificar favorito',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }
}

// Instância do controller
const exerciseController = new ExerciseController();

module.exports = {
  getAllExercises: exerciseController.getAllExercises.bind(exerciseController),
  getExercisesByMuscle: exerciseController.getExercisesByMuscle.bind(exerciseController),
  getExercisesByEquipment: exerciseController.getExercisesByEquipment.bind(exerciseController),
  getExerciseById: exerciseController.getExerciseById.bind(exerciseController),
  getBodyParts: exerciseController.getBodyParts.bind(exerciseController),
  getEquipment: exerciseController.getEquipment.bind(exerciseController),
  searchExercises: exerciseController.searchExercises.bind(exerciseController),
  addToFavorites: exerciseController.addToFavorites.bind(exerciseController),
  removeFromFavorites: exerciseController.removeFromFavorites.bind(exerciseController),
  getFavorites: exerciseController.getFavorites.bind(exerciseController),
  checkFavorite: exerciseController.checkFavorite.bind(exerciseController)
}; 