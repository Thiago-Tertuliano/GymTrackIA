const { spawn } = require('child_process');
const fs = require('fs');

console.log('🐳 Configurando MongoDB com Docker...\n');

// Verificar se Docker está instalado
function checkDocker() {
  return new Promise((resolve) => {
    const dockerCheck = spawn('docker', ['--version'], { stdio: 'pipe' });
    
    dockerCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Docker encontrado');
        resolve(true);
      } else {
        console.log('❌ Docker não encontrado');
        console.log('💡 Instale o Docker Desktop: https://www.docker.com/products/docker-desktop/');
        resolve(false);
      }
    });
  });
}

// Iniciar MongoDB com Docker
function startMongoDB() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando MongoDB...');
    
    const mongoProcess = spawn('docker', [
      'run', '-d',
      '--name', 'gymtrack-mongo',
      '-p', '27017:27017',
      '-e', 'MONGO_INITDB_DATABASE=gymtrack',
      'mongo:latest'
    ], { stdio: 'inherit' });

    mongoProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ MongoDB iniciado com sucesso!');
        console.log('📊 Porta: 27017');
        console.log('🗄️  Database: gymtrack');
        resolve();
      } else {
        console.log('❌ Erro ao iniciar MongoDB');
        reject(new Error('Falha ao iniciar MongoDB'));
      }
    });
  });
}

// Verificar se o container já existe
function checkExistingContainer() {
  return new Promise((resolve) => {
    const checkProcess = spawn('docker', ['ps', '-a', '--filter', 'name=gymtrack-mongo'], { stdio: 'pipe' });
    
    checkProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Container MongoDB já existe');
        resolve(true);
      } else {
        console.log('❌ Container não encontrado');
        resolve(false);
      }
    });
  });
}

// Iniciar container existente
function startExistingContainer() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Iniciando container existente...');
    
    const startProcess = spawn('docker', ['start', 'gymtrack-mongo'], { stdio: 'inherit' });
    
    startProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Container iniciado!');
        resolve();
      } else {
        console.log('❌ Erro ao iniciar container');
        reject(new Error('Falha ao iniciar container'));
      }
    });
  });
}

async function main() {
  try {
    const dockerAvailable = await checkDocker();
    
    if (!dockerAvailable) {
      console.log('\n💡 Alternativas:');
      console.log('1. Instale MongoDB localmente');
      console.log('2. Use MongoDB Atlas (gratuito)');
      console.log('3. Use outro banco de dados');
      return;
    }

    const containerExists = await checkExistingContainer();
    
    if (containerExists) {
      await startExistingContainer();
    } else {
      await startMongoDB();
    }

    console.log('\n🎉 MongoDB configurado com sucesso!');
    console.log('📱 Agora você pode iniciar o backend:');
    console.log('   cd backend && npm run start-dev');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main(); 