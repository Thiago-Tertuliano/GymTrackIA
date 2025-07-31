const axios = require('axios');

class ExerciseService {
  constructor() {
    this.baseURL = 'https://exercisedb.p.rapidapi.com';
    this.apiKey = process.env.RAPID_API_KEY;
    
    // Debug: verificar se a API key está sendo carregada
    console.log('🔑 RAPID_API_KEY carregada:', this.apiKey ? 'SIM' : 'NÃO');
    console.log('🔑 Valor da API key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NÃO DEFINIDA');
  }

  // Buscar todos os exercícios
  async getAllExercises() {
    try {
      console.log('🔍 Tentando buscar exercícios com API key:', this.apiKey ? 'PRESENTE' : 'AUSENTE');
      
      const options = {
        method: 'GET',
        url: `${this.baseURL}/exercises`,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };
      
      console.log('📡 Fazendo requisição para:', options.url);
      const response = await axios.request(options);
      console.log('✅ Resposta da API recebida com sucesso');
      return response.data;
    } catch (error) {
      console.log('❌ Erro na API:', error.response?.status, error.response?.statusText);
      console.log('⚠️ API key inválida, usando dados mock para desenvolvimento...');
      // Dados mock para desenvolvimento
      return [
        { id: '0001', name: 'Push-up', bodyPart: 'chest', equipment: 'body weight', target: 'pectoralis major', gifUrl: 'https://example.com/pushup.gif' },
        { id: '0002', name: 'Bench Press', bodyPart: 'chest', equipment: 'barbell', target: 'pectoralis major', gifUrl: 'https://example.com/benchpress.gif' },
        { id: '0003', name: 'Dumbbell Fly', bodyPart: 'chest', equipment: 'dumbbell', target: 'pectoralis major', gifUrl: 'https://example.com/fly.gif' },
        { id: '0004', name: 'Pull-up', bodyPart: 'back', equipment: 'body weight', target: 'latissimus dorsi', gifUrl: 'https://example.com/pullup.gif' },
        { id: '0005', name: 'Bent-over Row', bodyPart: 'back', equipment: 'barbell', target: 'latissimus dorsi', gifUrl: 'https://example.com/row.gif' },
        { id: '0006', name: 'Overhead Press', bodyPart: 'shoulders', equipment: 'barbell', target: 'deltoids', gifUrl: 'https://example.com/press.gif' },
        { id: '0007', name: 'Lateral Raise', bodyPart: 'shoulders', equipment: 'dumbbell', target: 'deltoids', gifUrl: 'https://example.com/raise.gif' },
        { id: '0008', name: 'Bicep Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'biceps brachii', gifUrl: 'https://example.com/curl.gif' },
        { id: '0009', name: 'Tricep Dip', bodyPart: 'upper arms', equipment: 'body weight', target: 'triceps brachii', gifUrl: 'https://example.com/dip.gif' },
        { id: '0010', name: 'Squat', bodyPart: 'upper legs', equipment: 'barbell', target: 'quadriceps', gifUrl: 'https://example.com/squat.gif' },
        { id: '0011', name: 'Deadlift', bodyPart: 'upper legs', equipment: 'barbell', target: 'gluteus maximus', gifUrl: 'https://example.com/deadlift.gif' }
      ];
    }
  }

  // Buscar exercícios por grupo muscular
  async getExercisesByMuscle(muscleGroup) {
    try {
      console.log(`🔍 Tentando buscar exercícios para ${muscleGroup} com API key:`, this.apiKey ? 'PRESENTE' : 'AUSENTE');
      
      const options = {
        method: 'GET',
        url: `${this.baseURL}/exercises/bodyPart/${muscleGroup}`,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };
      
      console.log(`📡 Fazendo requisição para: ${options.url}`);
      const response = await axios.request(options);
      console.log(`✅ Resposta da API para ${muscleGroup}: ${response.data.length} exercícios`);
      return response.data;
    } catch (error) {
      console.log(`❌ Erro na API para ${muscleGroup}:`, error.response?.status, error.response?.statusText);
      console.log(`❌ Detalhes do erro:`, error.message);
      console.log('⚠️ API key inválida, usando dados mock para desenvolvimento...');
      // Dados mock para desenvolvimento
      const mockExercises = {
        'chest': [
          { id: '0001', name: 'Push-up', bodyPart: 'chest', equipment: 'body weight', target: 'pectoralis major', gifUrl: 'https://example.com/pushup.gif' },
          { id: '0002', name: 'Bench Press', bodyPart: 'chest', equipment: 'barbell', target: 'pectoralis major', gifUrl: 'https://example.com/benchpress.gif' },
          { id: '0003', name: 'Dumbbell Fly', bodyPart: 'chest', equipment: 'dumbbell', target: 'pectoralis major', gifUrl: 'https://example.com/fly.gif' }
        ],
        'back': [
          { id: '0004', name: 'Pull-up', bodyPart: 'back', equipment: 'body weight', target: 'latissimus dorsi', gifUrl: 'https://example.com/pullup.gif' },
          { id: '0005', name: 'Bent-over Row', bodyPart: 'back', equipment: 'barbell', target: 'latissimus dorsi', gifUrl: 'https://example.com/row.gif' }
        ],
        'shoulders': [
          { id: '0006', name: 'Overhead Press', bodyPart: 'shoulders', equipment: 'barbell', target: 'deltoids', gifUrl: 'https://example.com/press.gif' },
          { id: '0007', name: 'Lateral Raise', bodyPart: 'shoulders', equipment: 'dumbbell', target: 'deltoids', gifUrl: 'https://example.com/raise.gif' }
        ],
        'upper arms': [
          { id: '0008', name: 'Bicep Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'biceps brachii', gifUrl: 'https://example.com/curl.gif' },
          { id: '0009', name: 'Tricep Dip', bodyPart: 'upper arms', equipment: 'body weight', target: 'triceps brachii', gifUrl: 'https://example.com/dip.gif' }
        ],
        'upper legs': [
          { id: '0010', name: 'Squat', bodyPart: 'upper legs', equipment: 'barbell', target: 'quadriceps', gifUrl: 'https://example.com/squat.gif' },
          { id: '0011', name: 'Deadlift', bodyPart: 'upper legs', equipment: 'barbell', target: 'gluteus maximus', gifUrl: 'https://example.com/deadlift.gif' }
        ]
      };
      
      return mockExercises[muscleGroup] || mockExercises['chest'];
    }
  }

  // Buscar exercícios por equipamento
  async getExercisesByEquipment(equipment) {
    try {
      const options = {
        method: 'GET',
        url: `${this.baseURL}/exercises/equipment/${equipment}`,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log('⚠️ API key inválida, usando dados mock para desenvolvimento...');
      // Dados mock para desenvolvimento
      const mockExercisesByEquipment = {
        'barbell': [
          { id: '0002', name: 'Bench Press', bodyPart: 'chest', equipment: 'barbell', target: 'pectoralis major', gifUrl: 'https://example.com/benchpress.gif' },
          { id: '0005', name: 'Bent-over Row', bodyPart: 'back', equipment: 'barbell', target: 'latissimus dorsi', gifUrl: 'https://example.com/row.gif' },
          { id: '0006', name: 'Overhead Press', bodyPart: 'shoulders', equipment: 'barbell', target: 'deltoids', gifUrl: 'https://example.com/press.gif' },
          { id: '0010', name: 'Squat', bodyPart: 'upper legs', equipment: 'barbell', target: 'quadriceps', gifUrl: 'https://example.com/squat.gif' },
          { id: '0011', name: 'Deadlift', bodyPart: 'upper legs', equipment: 'barbell', target: 'gluteus maximus', gifUrl: 'https://example.com/deadlift.gif' }
        ],
        'dumbbell': [
          { id: '0003', name: 'Dumbbell Fly', bodyPart: 'chest', equipment: 'dumbbell', target: 'pectoralis major', gifUrl: 'https://example.com/fly.gif' },
          { id: '0007', name: 'Lateral Raise', bodyPart: 'shoulders', equipment: 'dumbbell', target: 'deltoids', gifUrl: 'https://example.com/raise.gif' },
          { id: '0008', name: 'Bicep Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'biceps brachii', gifUrl: 'https://example.com/curl.gif' }
        ],
        'body weight': [
          { id: '0001', name: 'Push-up', bodyPart: 'chest', equipment: 'body weight', target: 'pectoralis major', gifUrl: 'https://example.com/pushup.gif' },
          { id: '0004', name: 'Pull-up', bodyPart: 'back', equipment: 'body weight', target: 'latissimus dorsi', gifUrl: 'https://example.com/pullup.gif' },
          { id: '0009', name: 'Tricep Dip', bodyPart: 'upper arms', equipment: 'body weight', target: 'triceps brachii', gifUrl: 'https://example.com/dip.gif' }
        ]
      };
      
      return mockExercisesByEquipment[equipment] || mockExercisesByEquipment['barbell'];
    }
  }

  // Buscar exercício específico por ID
  async getExerciseById(id) {
    try {
      const options = {
        method: 'GET',
        url: `${this.baseURL}/exercises/exercise/${id}`,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log('⚠️ API key inválida, usando dados mock para desenvolvimento...');
      // Dados mock para desenvolvimento
      const mockExercises = {
        '0001': { id: '0001', name: 'Push-up', bodyPart: 'chest', equipment: 'body weight', target: 'pectoralis major', gifUrl: 'https://example.com/pushup.gif', instructions: ['Start in a plank position', 'Lower your body', 'Push back up'] },
        '0002': { id: '0002', name: 'Bench Press', bodyPart: 'chest', equipment: 'barbell', target: 'pectoralis major', gifUrl: 'https://example.com/benchpress.gif', instructions: ['Lie on bench', 'Grip barbell', 'Lower and press'] },
        '0003': { id: '0003', name: 'Dumbbell Fly', bodyPart: 'chest', equipment: 'dumbbell', target: 'pectoralis major', gifUrl: 'https://example.com/fly.gif', instructions: ['Lie on bench', 'Hold dumbbells', 'Open arms wide', 'Close arms'] },
        '0004': { id: '0004', name: 'Pull-up', bodyPart: 'back', equipment: 'body weight', target: 'latissimus dorsi', gifUrl: 'https://example.com/pullup.gif', instructions: ['Hang from bar', 'Pull up', 'Lower down'] },
        '0005': { id: '0005', name: 'Bent-over Row', bodyPart: 'back', equipment: 'barbell', target: 'latissimus dorsi', gifUrl: 'https://example.com/row.gif', instructions: ['Bend over', 'Grip barbell', 'Pull to chest'] },
        '0006': { id: '0006', name: 'Overhead Press', bodyPart: 'shoulders', equipment: 'barbell', target: 'deltoids', gifUrl: 'https://example.com/press.gif', instructions: ['Stand with barbell', 'Press overhead', 'Lower down'] },
        '0007': { id: '0007', name: 'Lateral Raise', bodyPart: 'shoulders', equipment: 'dumbbell', target: 'deltoids', gifUrl: 'https://example.com/raise.gif', instructions: ['Hold dumbbells', 'Raise arms', 'Lower down'] },
        '0008': { id: '0008', name: 'Bicep Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'biceps brachii', gifUrl: 'https://example.com/curl.gif', instructions: ['Hold dumbbells', 'Curl up', 'Lower down'] },
        '0009': { id: '0009', name: 'Tricep Dip', bodyPart: 'upper arms', equipment: 'body weight', target: 'triceps brachii', gifUrl: 'https://example.com/dip.gif', instructions: ['Hold bars', 'Lower body', 'Push up'] },
        '0010': { id: '0010', name: 'Squat', bodyPart: 'upper legs', equipment: 'barbell', target: 'quadriceps', gifUrl: 'https://example.com/squat.gif', instructions: ['Stand with barbell', 'Squat down', 'Stand up'] },
        '0011': { id: '0011', name: 'Deadlift', bodyPart: 'upper legs', equipment: 'barbell', target: 'gluteus maximus', gifUrl: 'https://example.com/deadlift.gif', instructions: ['Stand over barbell', 'Grip and lift', 'Lower down'] }
      };
      
      return mockExercises[id] || null;
    }
  }

  // Buscar grupos musculares disponíveis
  async getBodyParts() {
    try {
      const options = {
        method: 'GET',
        url: `${this.baseURL}/exercises/bodyPartList`,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log('⚠️ API key inválida, usando dados mock para desenvolvimento...');
      // Dados mock para desenvolvimento
      return [
        'back', 'cardio', 'chest', 'lower arms', 'lower legs',
        'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
      ];
    }
  }

  // Buscar equipamentos disponíveis
  async getEquipment() {
    try {
      const options = {
        method: 'GET',
        url: `${this.baseURL}/exercises/equipmentList`,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log('⚠️ API key inválida, usando dados mock para desenvolvimento...');
      // Dados mock para desenvolvimento
      return [
        'assisted', 'band', 'barbell', 'body weight', 'bosu ball',
        'cable', 'dumbbell', 'elliptical machine', 'ez barbell',
        'hammer', 'kettlebell', 'leverage machine', 'medicine ball',
        'olympic barbell', 'resistance band', 'roller', 'rope',
        'skierg machine', 'sled machine', 'smith machine',
        'stability ball', 'stationary bike', 'stepmill machine',
        'tire', 'trap bar', 'upper body ergometer', 'weighted',
        'wheel roller'
      ];
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
      'full_body': 'cardio' // Mudando de 'full body' para 'cardio' para evitar erro 422
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