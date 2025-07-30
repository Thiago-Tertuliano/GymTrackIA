const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Configurar variáveis de ambiente para teste
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.RAPID_API_KEY = 'test-api-key';

// Setup global antes de todos os testes
beforeAll(async () => {
  // Iniciar servidor MongoDB em memória
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Conectar ao banco de teste
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup após cada teste
afterEach(async () => {
  // Limpar todas as coleções
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.deleteMany({});
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }
});

// Cleanup após todos os testes
afterAll(async () => {
  // Desconectar do banco
  await mongoose.disconnect();
  
  // Parar servidor MongoDB
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Mock para console.log durante testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}; 