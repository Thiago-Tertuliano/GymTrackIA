const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando GymTrack Backend...');

// Criar arquivo .env se não existir
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  const envContent = `# Configurações do Servidor
PORT=3000
NODE_ENV=development

# MongoDB
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
RAPID_API_KEY=demo_key_for_development

# Wger API
WGER_API_KEY=demo_key_for_development
WGER_USERNAME=demo_user
WGER_PASSWORD=demo_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081,exp://localhost:8081,http://192.168.1.100:8081
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado com sucesso!');
}

console.log('🌐 Iniciando servidor...');
console.log('📱 Backend rodando em: http://localhost:3000');
console.log('🛑 Pressione Ctrl+C para encerrar\n');

// Iniciar o servidor diretamente
require('./server.js'); 