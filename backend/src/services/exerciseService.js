const axios = require('axios');

class ExerciseService {
  constructor() {
    this.baseURL = 'https://exercisedb.p.rapidapi.com';
    this.apiKey = process.env.RAPID_API_KEY;
  }

  // Buscar todos os exercícios
  async getAllExercises() {
    try {
      const response = await axios.get(`${this.baseURL}/exercises`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error.message);
      throw new Error('Falha ao buscar exercícios');
    }
  }

  // Buscar exercícios por grupo muscular
  async getExercisesByMuscle(muscleGroup) {
    try {
      const response = await axios.get(`${this.baseURL}/exercises/bodyPart/${muscleGroup}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exercícios por músculo:', error.message);
      throw new Error('Falha ao buscar exercícios por grupo muscular');
    }
  }

  // Buscar exercícios por equipamento
  async getExercisesByEquipment(equipment) {
    try {
      const response = await axios.get(`${this.baseURL}/exercises/equipment/${equipment}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exercícios por equipamento:', error.message);
      throw new Error('Falha ao buscar exercícios por equipamento');
    }
  }

  // Buscar exercício específico por ID
  async getExerciseById(id) {
    try {
      const response = await axios.get(`${this.baseURL}/exercises/exercise/${id}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar exercício:', error.message);
      throw new Error('Falha ao buscar exercício');
    }
  }

  // Buscar grupos musculares disponíveis
  async getBodyParts() {
    try {
      const response = await axios.get(`${this.baseURL}/exercises/bodyPartList`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar grupos musculares:', error.message);
      throw new Error('Falha ao buscar grupos musculares');
    }
  }

  // Buscar equipamentos disponíveis
  async getEquipment() {
    try {
      const response = await axios.get(`${this.baseURL}/exercises/equipmentList`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error.message);
      throw new Error('Falha ao buscar equipamentos');
    }
  }

  // Mapear grupos musculares do nosso sistema para a API
  mapMuscleGroup(ourMuscleGroup) {
    const muscleMap = {
      'peito': 'chest',
      'costas': 'back',
      'ombro': 'shoulders',
      'biceps': 'upper arms',
      'triceps': 'upper arms',
      'perna': 'upper legs',
      'gluteo': 'upper legs',
      'abdomen': 'waist',
      'cardio': 'cardio',
      'full_body': 'full body'
    };
    return muscleMap[ourMuscleGroup] || 'chest';
  }

  // Formatar exercício da API para nosso formato
  formatExercise(apiExercise) {
    return {
      id: apiExercise.id,
      name: apiExercise.name,
      muscleGroup: apiExercise.bodyPart,
      equipment: apiExercise.equipment,
      target: apiExercise.target,
      gifUrl: apiExercise.gifUrl,
      instructions: apiExercise.instructions || [],
      secondaryMuscles: apiExercise.secondaryMuscles || [],
      instructions_pt: this.translateInstructions(apiExercise.instructions || [])
    };
  }

  // Traduzir instruções para português (simplificado)
  translateInstructions(instructions) {
    const translations = {
      'Stand': 'Fique em pé',
      'Sit': 'Sente-se',
      'Lie': 'Deite-se',
      'Hold': 'Segure',
      'Lift': 'Levante',
      'Lower': 'Abaixe',
      'Push': 'Empurre',
      'Pull': 'Puxe',
      'Bend': 'Dobre',
      'Extend': 'Estenda',
      'Rotate': 'Gire',
      'Twist': 'Torça',
      'Squeeze': 'Aperte',
      'Contract': 'Contraia',
      'Relax': 'Relaxe'
    };

    return instructions.map(instruction => {
      let translated = instruction;
      Object.entries(translations).forEach(([en, pt]) => {
        translated = translated.replace(new RegExp(en, 'gi'), pt);
      });
      return translated;
    });
  }
}

module.exports = new ExerciseService(); 