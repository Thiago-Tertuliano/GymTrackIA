const axios = require('axios');

class AIService {
  constructor() {
    this.apiUrl = process.env.HUGGING_FACE_API_URL;
    this.apiKey = process.env.HUGGING_FACE_API_KEY;
  }

  // Calcular necessidades calóricas baseadas no perfil
  calculateCalorieNeeds(user) {
    // Fórmula de Harris-Benedict
    let bmr;
    if (user.gender === 'masculino') {
      bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
    } else {
      bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
    }

    // Multiplicador de atividade
    const activityMultipliers = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'ativo': 1.725,
      'muito_ativo': 1.9
    };

    const tdee = bmr * activityMultipliers[user.activityLevel] || 1.55;

    // Ajustar baseado no objetivo
    const goalAdjustments = {
      'perder_peso': -500,
      'ganhar_massa': 300,
      'manter': 0,
      'definir': -200,
      'força': 200
    };

    return Math.round(tdee + (goalAdjustments[user.goal] || 0));
  }

  // Calcular macronutrientes
  calculateMacros(calories, goal) {
    const macroRatios = {
      'perder_peso': { protein: 0.35, carbs: 0.35, fat: 0.30 },
      'ganhar_massa': { protein: 0.30, carbs: 0.45, fat: 0.25 },
      'manter': { protein: 0.25, carbs: 0.50, fat: 0.25 },
      'definir': { protein: 0.35, carbs: 0.40, fat: 0.25 },
      'força': { protein: 0.30, carbs: 0.45, fat: 0.25 }
    };

    const ratios = macroRatios[goal] || macroRatios.manter;

    return {
      protein: Math.round((calories * ratios.protein) / 4), // 4 cal/g
      carbs: Math.round((calories * ratios.carbs) / 4),     // 4 cal/g
      fat: Math.round((calories * ratios.fat) / 9)          // 9 cal/g
    };
  }

  // Sugerir treino baseado no perfil
  async suggestWorkout(user, preferences = {}) {
    try {
      const prompt = `
        Crie um treino personalizado para:
        - Objetivo: ${user.goal}
        - Nível: ${user.activityLevel}
        - Idade: ${user.age}
        - Preferências: ${JSON.stringify(preferences)}
        
        Retorne um JSON com:
        {
          "name": "Nome do treino",
          "type": "tipo",
          "difficulty": "dificuldade",
          "exercises": [
            {
              "name": "Nome do exercício",
              "muscleGroup": "grupo muscular",
              "sets": [
                {
                  "reps": 12,
                  "weight": 0,
                  "restTime": 90,
                  "completed": false
                }
              ]
            }
          ],
          "duration": 60,
          "caloriesBurned": 400
        }
      `;

      const response = await axios.post(this.apiUrl, {
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Tentar extrair JSON da resposta
      const text = response.data[0]?.generated_text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Não foi possível gerar treino válido');
    } catch (error) {
      console.error('Erro ao sugerir treino:', error);
      throw new Error('Falha ao gerar sugestão de treino');
    }
  }

  // Sugerir dieta baseada no perfil
  async suggestDiet(user, preferences = {}) {
    try {
      const calories = this.calculateCalorieNeeds(user);
      const macros = this.calculateMacros(calories, user.goal);

      const prompt = `
        Crie uma dieta personalizada para:
        - Objetivo: ${user.goal}
        - Calorias: ${calories}
        - Proteína: ${macros.protein}g
        - Carboidratos: ${macros.carbs}g
        - Gordura: ${macros.fat}g
        - Preferências: ${JSON.stringify(preferences)}
        
        Retorne um JSON com:
        {
          "name": "Nome da dieta",
          "type": "tipo",
          "targetCalories": ${calories},
          "targetProtein": ${macros.protein},
          "targetCarbs": ${macros.carbs},
          "targetFat": ${macros.fat},
          "meals": [
            {
              "name": "Nome da refeição",
              "type": "tipo",
              "time": "07:00",
              "foods": [
                {
                  "name": "Nome do alimento",
                  "quantity": 100,
                  "unit": "g",
                  "calories": 150,
                  "protein": 10,
                  "carbs": 20,
                  "fat": 5
                }
              ]
            }
          ]
        }
      `;

      const response = await axios.post(this.apiUrl, {
        inputs: prompt,
        parameters: {
          max_length: 1500,
          temperature: 0.7
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const text = response.data[0]?.generated_text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Não foi possível gerar dieta válida');
    } catch (error) {
      console.error('Erro ao sugerir dieta:', error);
      throw new Error('Falha ao gerar sugestão de dieta');
    }
  }

  // Analisar progresso e dar feedback
  async analyzeProgress(user, progressData) {
    try {
      const prompt = `
        Analise o progresso do usuário:
        - Perfil: ${JSON.stringify(user)}
        - Progresso: ${JSON.stringify(progressData)}
        
        Forneça feedback e sugestões em português.
      `;

      const response = await axios.post(this.apiUrl, {
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.5
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data[0]?.generated_text || 'Análise não disponível';
    } catch (error) {
      console.error('Erro ao analisar progresso:', error);
      throw new Error('Falha ao analisar progresso');
    }
  }

  // Chat interativo
  async chat(user, message) {
    try {
      const prompt = `
        Você é um personal trainer e nutricionista especializado.
        Usuário: ${JSON.stringify(user)}
        Mensagem: ${message}
        
        Responda de forma profissional e motivacional em português.
      `;

      const response = await axios.post(this.apiUrl, {
        inputs: prompt,
        parameters: {
          max_length: 300,
          temperature: 0.8
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data[0]?.generated_text || 'Desculpe, não consegui processar sua mensagem.';
    } catch (error) {
      console.error('Erro no chat:', error);
      throw new Error('Falha no chat');
    }
  }

  // Estimar tempo de recuperação
  estimateRecoveryTime(workout, user) {
    const intensity = workout.difficulty === 'avançado' ? 3 : 
                     workout.difficulty === 'intermediário' ? 2 : 1;
    
    const baseRecovery = {
      'peito': 48,
      'costas': 48,
      'ombro': 24,
      'biceps': 24,
      'triceps': 24,
      'perna': 72,
      'gluteo': 48,
      'abdomen': 24
    };

    const muscleGroups = workout.exercises.map(ex => ex.muscleGroup);
    const maxRecovery = Math.max(...muscleGroups.map(mg => baseRecovery[mg] || 24));
    
    return Math.round(maxRecovery * intensity * (user.age > 40 ? 1.2 : 1));
  }

  // Estimar calorias queimadas
  estimateCaloriesBurned(workout, user) {
    const baseCalories = {
      'força': 4,
      'hipertrofia': 5,
      'resistência': 6,
      'cardio': 8,
      'flexibilidade': 2,
      'funcional': 6
    };

    const caloriesPerMinute = baseCalories[workout.type] || 4;
    const duration = workout.duration || 60;
    const intensity = workout.difficulty === 'avançado' ? 1.3 : 
                     workout.difficulty === 'intermediário' ? 1.1 : 1;

    return Math.round(caloriesPerMinute * duration * intensity * (user.weight / 70));
  }
}

module.exports = new AIService(); 