const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando GymTrack Backend...');

// Criar arquivo .env se não existir
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  const envContent = `# Configurações do Servidor
PORT=3000
NODE_ENV=development

# MongoDB (Desenvolvimento - In Memory)
MONGODB_URI=mongodb://localhost:27017/gymtrack

# JWT
JWT_SECRET=gymtrack_jwt_secret_dev_2024
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=gymtrack_refresh_secret_dev_2024
REFRESH_TOKEN_EXPIRES_IN=30d

# Hugging Face AI
HUGGING_FACE_API_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct
HUGGING_FACE_API_KEY=hf_demo_key_for_development

# RapidAPI (ExerciseDB)
RAPID_API_KEY=31416e5bc3msh776e172857ed71ap1d87b1jsnabb04be7b087r

# Wger API
WGER_API_KEY=ea9801d6604c4d60c2c879b13bdaedadaeb659e0
WGER_USERNAME=ThiagoTertuliano
WGER_PASSWORD=Tertuliano1805!!!

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081,exp://localhost:8081,http://192.168.0.51:8081,exp://192.168.0.51:8081
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado com sucesso!');
}

// Instalar dependências se necessário
console.log('📦 Verificando dependências...');
const installProcess = spawn('npm', ['install'], { 
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

installProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Dependências instaladas!');
    
    // Iniciar servidor
    console.log('🌐 Iniciando servidor...');
    const serverProcess = spawn('node', ['server.js'], { 
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    serverProcess.on('close', (code) => {
      console.log(`❌ Servidor encerrado com código ${code}`);
    });

    // Tratamento de interrupção
    process.on('SIGINT', () => {
      console.log('\n🛑 Encerrando servidor...');
      serverProcess.kill('SIGINT');
      process.exit(0);
    });

  } else {
    console.error('❌ Erro ao instalar dependências');
    process.exit(1);
  }
}); 