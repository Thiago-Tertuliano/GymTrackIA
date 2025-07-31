const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando GymTrack Full Stack...\n');

// Função para executar comandos
function runCommand(command, args, cwd, label) {
  return new Promise((resolve, reject) => {
    console.log(`📦 ${label}...`);
    
    const process = spawn(command, args, { 
      cwd,
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${label} finalizado`);
        resolve();
      } else {
        console.error(`❌ ${label} falhou com código ${code}`);
        reject(new Error(`${label} falhou`));
      }
    });

    process.on('error', (error) => {
      console.error(`❌ Erro ao executar ${label}:`, error);
      reject(error);
    });
  });
}

// Função para iniciar servidor
function startServer(cwd, label) {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Iniciando ${label}...`);
    
    const process = spawn('npm', ['run', 'start-dev'], { 
      cwd,
      stdio: 'inherit',
      shell: true
    });

    // Aguardar um pouco para o servidor inicializar
    setTimeout(() => {
      console.log(`✅ ${label} iniciado com sucesso!`);
      resolve(process);
    }, 3000);

    process.on('error', (error) => {
      console.error(`❌ Erro ao iniciar ${label}:`, error);
      reject(error);
    });
  });
}

async function main() {
  try {
    const backendPath = path.join(__dirname, 'backend');
    const frontendPath = path.join(__dirname, 'frontend');

    // Verificar se os diretórios existem
    const fs = require('fs');
    if (!fs.existsSync(backendPath)) {
      throw new Error('Diretório backend não encontrado');
    }
    if (!fs.existsSync(frontendPath)) {
      throw new Error('Diretório frontend não encontrado');
    }

    console.log('🔧 Configurando ambiente...\n');

    // Instalar dependências do backend
    await runCommand('npm', ['install'], backendPath, 'Instalando dependências do backend');

    // Instalar dependências do frontend
    await runCommand('npm', ['install'], frontendPath, 'Instalando dependências do frontend');

    console.log('\n🚀 Iniciando servidores...\n');

    // Iniciar backend
    const backendProcess = await startServer(backendPath, 'Backend');

    // Aguardar um pouco antes de iniciar o frontend
    setTimeout(async () => {
      try {
        // Iniciar frontend
        const frontendProcess = await startServer(frontendPath, 'Frontend (Expo)');
        
        console.log('\n🎉 GymTrack Full Stack iniciado com sucesso!');
        console.log('📱 Backend: http://localhost:3000');
        console.log('📱 Frontend: Expo DevTools');
        console.log('\n🛑 Pressione Ctrl+C para encerrar todos os servidores\n');

        // Tratamento de interrupção
        process.on('SIGINT', () => {
          console.log('\n🛑 Encerrando servidores...');
          backendProcess.kill('SIGINT');
          frontendProcess.kill('SIGINT');
          process.exit(0);
        });

      } catch (error) {
        console.error('❌ Erro ao iniciar frontend:', error);
        backendProcess.kill('SIGINT');
        process.exit(1);
      }
    }, 5000);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main(); 