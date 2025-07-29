#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando GymTrack Backend...\n');

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado com sucesso!');
    console.log('⚠️  Lembre-se de configurar suas variáveis de ambiente no arquivo .env');
  } else {
    console.log('❌ Arquivo env.example não encontrado!');
    process.exit(1);
  }
} else {
  console.log('✅ Arquivo .env já existe!');
}

// Verificar se node_modules existe
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Instalando dependências...');
  console.log('Execute: npm install');
} else {
  console.log('✅ Dependências já instaladas!');
}

// Verificar estrutura de pastas
const requiredDirs = [
  'src/controllers',
  'src/models', 
  'src/routes',
  'src/middlewares'
];

console.log('\n📁 Verificando estrutura de pastas...');
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Criada pasta: ${dir}`);
  } else {
    console.log(`✅ Pasta existe: ${dir}`);
  }
});

console.log('\n🎯 Configuração concluída!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure suas variáveis de ambiente no arquivo .env');
console.log('2. Instale as dependências: npm install');
console.log('3. Configure o MongoDB');
console.log('4. Configure a API do Hugging Face');
console.log('5. Execute: npm run dev');
console.log('\n📚 Consulte o README.md para mais informações!'); 