// Usar fetch nativo do Node.js

const API_BASE_URL = 'http://192.168.0.51:3000/api';

async function testAPI() {
  console.log('🧪 Testando conexão com a API...\n');

  try {
    // Teste 1: Verificar se o servidor está rodando
    console.log('1️⃣ Testando endpoint básico...');
    const response = await fetch(`${API_BASE_URL}/exercise/body-parts`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Servidor respondendo!');
      console.log('📊 Dados recebidos:', data);
    } else {
      console.log('❌ Erro na resposta:', response.status, response.statusText);
    }

  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('1. Verifique se o backend está rodando');
    console.log('2. Verifique se o IP está correto');
    console.log('3. Verifique se o firewall não está bloqueando');
  }
}

testAPI(); 