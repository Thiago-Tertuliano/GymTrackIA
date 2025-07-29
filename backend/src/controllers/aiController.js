const axios = require('axios');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');
const Progress = require('../models/Progress');

// Configuração da API do Hugging Face
const HUGGING_FACE_API_URL = process.env.HUGGING_FACE_API_URL;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Função para fazer chamada à API do Hugging Face
const callHuggingFaceAPI = async (prompt) => {
  try {
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 segundos
      }
    );

    return response.data[0]?.generated_text || 'Desculpe, não consegui gerar uma resposta.';
  } catch (error) {
    console.error('Erro na API do Hugging Face:', error);
    throw new Error('Erro ao conectar com o serviço de IA');
  }
};

// Gerar sugestão de treino
const generateWorkoutSuggestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { goal, muscleGroup, difficulty, duration } = req.body;

    // Buscar dados do usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar histórico de treinos
    const recentWorkouts = await Workout.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Construir prompt para IA
    const prompt = `
    Você é um personal trainer especializado. Gere um treino personalizado em português brasileiro.

    Dados do usuário:
    - Nome: ${user.name}
    - Idade: ${user.age} anos
    - Altura: ${user.height}cm
    - Peso: ${user.weight}kg
    - Objetivo: ${goal || user.goal}
    - Nível de atividade: ${user.activityLevel}

    Parâmetros do treino:
    - Grupo muscular foco: ${muscleGroup || 'geral'}
    - Dificuldade: ${difficulty || 'intermediário'}
    - Duração: ${duration || 60} minutos

    Histórico recente de treinos: ${recentWorkouts.length > 0 ? 
      recentWorkouts.map(w => `${w.name} (${w.type})`).join(', ') : 'Nenhum treino registrado'}

    Gere um treino completo com:
    1. Nome do treino
    2. Lista de exercícios com séries, repetições e pesos sugeridos
    3. Dicas de execução
    4. Tempo de descanso entre séries
    5. Observações importantes

    Responda em formato JSON válido com a estrutura:
    {
      "name": "Nome do treino",
      "type": "tipo do treino",
      "difficulty": "dificuldade",
      "duration": "duração estimada",
      "exercises": [
        {
          "name": "Nome do exercício",
          "muscleGroup": "grupo muscular",
          "sets": [
            {
              "reps": "número de repetições",
              "weight": "peso sugerido",
              "restTime": "tempo de descanso"
            }
          ],
          "notes": "dicas de execução"
        }
      ],
      "tips": "dicas gerais do treino"
    }
    `;

    const aiResponse = await callHuggingFaceAPI(prompt);

    // Tentar extrair JSON da resposta
    let workoutData;
    try {
      // Procurar por JSON na resposta
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Resposta não contém JSON válido');
      }
    } catch (parseError) {
      // Se não conseguir parsear JSON, criar estrutura básica
      workoutData = {
        name: `Treino ${muscleGroup || 'Personalizado'}`,
        type: 'força',
        difficulty: difficulty || 'intermediário',
        duration: duration || 60,
        exercises: [],
        tips: aiResponse
      };
    }

    res.json({
      success: true,
      message: 'Sugestão de treino gerada com sucesso',
      data: {
        workout: workoutData,
        aiResponse: aiResponse
      }
    });
  } catch (error) {
    console.error('Erro ao gerar sugestão de treino:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

// Gerar sugestão de dieta
const generateDietSuggestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, targetCalories, restrictions } = req.body;

    // Buscar dados do usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar histórico de dietas
    const recentDiets = await Diet.find({ user: userId })
      .sort({ date: -1 })
      .limit(3);

    // Construir prompt para IA
    const prompt = `
    Você é um nutricionista especializado. Gere uma dieta personalizada em português brasileiro.

    Dados do usuário:
    - Nome: ${user.name}
    - Idade: ${user.age} anos
    - Altura: ${user.height}cm
    - Peso: ${user.weight}kg
    - Objetivo: ${user.goal}
    - Nível de atividade: ${user.activityLevel}

    Parâmetros da dieta:
    - Tipo: ${type || 'manutenção'}
    - Calorias alvo: ${targetCalories || 2000} kcal
    - Restrições: ${restrictions || 'nenhuma'}

    Histórico recente de dietas: ${recentDiets.length > 0 ? 
      recentDiets.map(d => `${d.name} (${d.type})`).join(', ') : 'Nenhuma dieta registrada'}

    Gere uma dieta completa com:
    1. Nome da dieta
    2. Lista de refeições com horários
    3. Alimentos e quantidades
    4. Informações nutricionais (calorias, proteínas, carboidratos, gorduras)
    5. Dicas de preparo
    6. Observações importantes

    Responda em formato JSON válido com a estrutura:
    {
      "name": "Nome da dieta",
      "type": "tipo da dieta",
      "targetCalories": "calorias alvo",
      "meals": [
        {
          "name": "Nome da refeição",
          "type": "tipo da refeição",
          "time": "horário",
          "foods": [
            {
              "name": "Nome do alimento",
              "quantity": "quantidade",
              "unit": "unidade",
              "calories": "calorias",
              "protein": "proteína",
              "carbs": "carboidratos",
              "fat": "gordura"
            }
          ],
          "notes": "observações"
        }
      ],
      "tips": "dicas gerais da dieta"
    }
    `;

    const aiResponse = await callHuggingFaceAPI(prompt);

    // Tentar extrair JSON da resposta
    let dietData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        dietData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Resposta não contém JSON válido');
      }
    } catch (parseError) {
      dietData = {
        name: `Dieta ${type || 'Personalizada'}`,
        type: type || 'manutenção',
        targetCalories: targetCalories || 2000,
        meals: [],
        tips: aiResponse
      };
    }

    res.json({
      success: true,
      message: 'Sugestão de dieta gerada com sucesso',
      data: {
        diet: dietData,
        aiResponse: aiResponse
      }
    });
  } catch (error) {
    console.error('Erro ao gerar sugestão de dieta:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

// Analisar progresso e dar feedback
const analyzeProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query;

    // Buscar dados do usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar dados de progresso
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const progressRecords = await Progress.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const workouts = await Workout.find({
      user: userId,
      createdAt: { $gte: startDate }
    });

    const diets = await Diet.find({
      user: userId,
      date: { $gte: startDate }
    });

    if (progressRecords.length === 0) {
      return res.json({
        success: true,
        message: 'Análise de progresso gerada',
        data: {
          analysis: {
            summary: 'Ainda não há dados suficientes para análise.',
            recommendations: [
              'Comece registrando seu peso atual',
              'Faça pelo menos um treino por semana',
              'Registre suas refeições diariamente'
            ],
            nextSteps: 'Continue registrando seus dados para receber análises mais detalhadas.'
          }
        }
      });
    }

    // Calcular mudanças
    const firstRecord = progressRecords[0];
    const lastRecord = progressRecords[progressRecords.length - 1];
    const weightChange = lastRecord.weight - firstRecord.weight;
    const totalWorkouts = workouts.length;
    const completedWorkouts = workouts.filter(w => w.completed).length;
    const totalDiets = diets.length;
    const completedDiets = diets.filter(d => d.completed).length;

    // Construir prompt para análise
    const prompt = `
    Você é um personal trainer e nutricionista especializado. Analise o progresso do usuário e dê feedback personalizado em português brasileiro.

    Dados do usuário:
    - Nome: ${user.name}
    - Idade: ${user.age} anos
    - Altura: ${user.height}cm
    - Peso inicial: ${firstRecord.weight}kg
    - Peso atual: ${lastRecord.weight}kg
    - Mudança de peso: ${weightChange}kg
    - Objetivo: ${user.goal}

    Atividade no período:
    - Treinos realizados: ${totalWorkouts}
    - Treinos completados: ${completedWorkouts}
    - Dietas registradas: ${totalDiets}
    - Dietas completadas: ${completedDiets}

    Forneça uma análise completa incluindo:
    1. Resumo do progresso
    2. Pontos positivos
    3. Áreas de melhoria
    4. Recomendações específicas
    5. Próximos passos
    6. Motivação

    Responda em formato JSON válido com a estrutura:
    {
      "summary": "resumo do progresso",
      "positives": ["pontos positivos"],
      "improvements": ["áreas de melhoria"],
      "recommendations": ["recomendações específicas"],
      "nextSteps": "próximos passos",
      "motivation": "mensagem motivacional"
    }
    `;

    const aiResponse = await callHuggingFaceAPI(prompt);

    // Tentar extrair JSON da resposta
    let analysisData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Resposta não contém JSON válido');
      }
    } catch (parseError) {
      analysisData = {
        summary: 'Análise de progresso gerada com sucesso.',
        positives: ['Mantendo consistência nos registros'],
        improvements: ['Pode melhorar a frequência dos treinos'],
        recommendations: ['Continue registrando seus dados'],
        nextSteps: 'Mantenha a consistência e continue evoluindo.',
        motivation: 'Você está no caminho certo! Continue assim!'
      };
    }

    res.json({
      success: true,
      message: 'Análise de progresso gerada com sucesso',
      data: {
        analysis: analysisData,
        stats: {
          weightChange,
          totalWorkouts,
          completedWorkouts,
          totalDiets,
          completedDiets,
          period: parseInt(period)
        },
        aiResponse: aiResponse
      }
    });
  } catch (error) {
    console.error('Erro ao analisar progresso:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

// Chat com IA
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem é obrigatória'
      });
    }

    // Buscar dados do usuário para contexto
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Construir prompt com contexto
    const prompt = `
    Você é um assistente de fitness e nutrição especializado. Responda em português brasileiro de forma amigável e profissional.

    Contexto do usuário:
    - Nome: ${user.name}
    - Idade: ${user.age} anos
    - Altura: ${user.height}cm
    - Peso: ${user.weight}kg
    - Objetivo: ${user.goal}
    - Nível de atividade: ${user.activityLevel}

    Contexto adicional: ${context || 'Nenhum contexto adicional'}

    Mensagem do usuário: ${message}

    Responda de forma clara, motivacional e com dicas práticas. Seja específico e use linguagem acessível.
    `;

    const aiResponse = await callHuggingFaceAPI(prompt);

    res.json({
      success: true,
      message: 'Resposta gerada com sucesso',
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro no chat com IA:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

module.exports = {
  generateWorkoutSuggestion,
  generateDietSuggestion,
  analyzeProgress,
  chatWithAI
}; 