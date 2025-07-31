const API_BASE_URL = 'http://192.168.0.51:3000/api';

async function testWorkoutAPI() {
  console.log('🧪 Testando API de Workouts...\n');

  try {
    // Teste 1: Buscar treinos
    console.log('1️⃣ Testando GET /workout...');
    const response = await fetch(`${API_BASE_URL}/workout`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Treinos carregados com sucesso!');
      console.log('📊 Dados recebidos:', data);
    } else {
      console.log('❌ Erro na resposta:', response.status, response.statusText);
    }

  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }
}

testWorkoutAPI(); 