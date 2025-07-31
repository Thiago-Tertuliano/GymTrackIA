const axios = require('axios');

class WgerService {
  constructor() {
    this.baseURL = 'https://wger.de/api/v2';
    this.apiKey = process.env.WGER_API_KEY;
  }

  // Obter headers com autenticação
  getHeaders() {
    return {
      'Authorization': `Token ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ===== EXERCÍCIOS =====

  // Buscar todos os exercícios
  async getAllExercises(limit = 100) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/exercise/?limit=${limit}`, { headers });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error.message);
      throw new Error('Falha ao buscar exercícios');
    }
  }

  // Buscar exercícios por categoria
  async getExercisesByCategory(categoryId) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/exercise/?category=${categoryId}`, { headers });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar exercícios por categoria:', error.message);
      throw new Error('Falha ao buscar exercícios por categoria');
    }
  }

  // Buscar exercício específico
  async getExerciseById(id) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/exercise/${id}/`, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exercício:', error.message);
      throw new Error('Falha ao buscar exercício');
    }
  }

  // Buscar categorias de exercícios
  async getExerciseCategories() {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/exercisecategory/`, { headers });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error.message);
      throw new Error('Falha ao buscar categorias');
    }
  }

  // ===== ALIMENTOS =====

  // Buscar todos os alimentos
  async getAllFoods(limit = 100) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/ingredient/?limit=${limit}`, { headers });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error.message);
      throw new Error('Falha ao buscar alimentos');
    }
  }

  // Buscar alimento específico
  async getFoodById(id) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/ingredient/${id}/`, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alimento:', error.message);
      throw new Error('Falha ao buscar alimento');
    }
  }

  // Buscar alimentos por categoria
  async getFoodsByCategory(categoryId) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/ingredient/?category=${categoryId}`, { headers });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar alimentos por categoria:', error.message);
      throw new Error('Falha ao buscar alimentos por categoria');
    }
  }

  // Buscar categorias de alimentos
  async getFoodCategories() {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/ingredientcategory/`, { headers });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar categorias de alimentos:', error.message);
      throw new Error('Falha ao buscar categorias de alimentos');
    }
  }

  // Buscar informações nutricionais
  async getNutritionInfo(foodId) {
    try {
      const headers = this.getHeaders();
      const response = await axios.get(`${this.baseURL}/ingredient/${foodId}/nutrition/`, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações nutricionais:', error.message);
      throw new Error('Falha ao buscar informações nutricionais');
    }
  }

  // ===== FORMATAÇÃO =====

  // Formatar exercício para nosso padrão
  formatExercise(wgerExercise) {
    return {
      id: wgerExercise.id,
      name: wgerExercise.name,
      description: wgerExercise.description,
      category: wgerExercise.category,
      muscles: wgerExercise.muscles || [],
      muscles_secondary: wgerExercise.muscles_secondary || [],
      equipment: wgerExercise.equipment || [],
      images: wgerExercise.images || [],
      videos: wgerExercise.videos || [],
      variations: wgerExercise.variations || null,
      instructions: wgerExercise.instructions || [],
      language: wgerExercise.language
    };
  }

  // Formatar alimento para nosso padrão
  formatFood(wgerFood) {
    return {
      id: wgerFood.id,
      name: wgerFood.name,
      category: wgerFood.category,
      energy: wgerFood.energy || 0,
      protein: wgerFood.protein || 0,
      carbohydrates: wgerFood.carbohydrates || 0,
      fat: wgerFood.fat || 0,
      fiber: wgerFood.fiber || 0,
      sugar: wgerFood.sugar || 0,
      sodium: wgerFood.sodium || 0,
      image: wgerFood.image,
      language: wgerFood.language
    };
  }

  // Mapear grupos musculares
  mapMuscleGroups(wgerMuscles) {
    const muscleMap = {
      'Anterior deltoid': 'ombro',
      'Biceps brachii': 'biceps',
      'Brachialis': 'biceps',
      'Gastrocnemius': 'perna',
      'Gluteus maximus': 'gluteo',
      'Latissimus dorsi': 'costas',
      'Obliquus externus abdominis': 'abdomen',
      'Pectoralis major': 'peito',
      'Quadriceps femoris': 'perna',
      'Rectus abdominis': 'abdomen',
      'Serratus anterior': 'peito',
      'Soleus': 'perna',
      'Trapezius': 'costas',
      'Triceps brachii': 'triceps'
    };

    return wgerMuscles.map(muscle => ({
      name: muscle.name,
      category: muscleMap[muscle.name] || 'outros'
    }));
  }
}

module.exports = new WgerService(); 