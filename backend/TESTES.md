# 🧪 Testes - GymTrack IA

## 📋 Visão Geral

Este documento descreve a estrutura de testes implementada para o GymTrack IA, incluindo testes unitários, de integração e de API.

## 🏗️ Estrutura de Testes

```
tests/
├── setup.js                    # Configuração global dos testes
├── helpers/
│   └── testUtils.js           # Utilitários para testes
├── unit/
│   ├── models/
│   │   ├── User.test.js       # Testes do modelo User
│   │   ├── Workout.test.js    # Testes do modelo Workout
│   │   ├── Diet.test.js       # Testes do modelo Diet
│   │   └── Progress.test.js   # Testes do modelo Progress
│   ├── controllers/
│   │   ├── authController.test.js
│   │   ├── userController.test.js
│   │   ├── exerciseController.test.js
│   │   ├── workoutController.test.js
│   │   ├── dietController.test.js
│   │   ├── progressController.test.js
│   │   └── aiController.test.js
│   ├── services/
│   │   ├── exerciseService.test.js
│   │   └── aiService.test.js
│   └── middlewares/
│       ├── auth.test.js
│       ├── errorHandler.test.js
│       └── validate.test.js
├── integration/
│   ├── auth.test.js           # Testes de fluxo de autenticação
│   ├── exercise.test.js       # Testes de fluxo de exercícios
│   ├── workout.test.js        # Testes de fluxo de treinos
│   ├── diet.test.js           # Testes de fluxo de dietas
│   └── progress.test.js       # Testes de fluxo de progresso
└── api/
    ├── auth.test.js           # Testes de endpoints de auth
    ├── exercise.test.js       # Testes de endpoints de exercícios
    ├── workout.test.js        # Testes de endpoints de treinos
    ├── diet.test.js           # Testes de endpoints de dietas
    └── progress.test.js       # Testes de endpoints de progresso
```

## ⚙️ Configuração

### **Dependências de Teste**
```json
{
  "jest": "^29.6.2",
  "mongodb-memory-server": "^9.1.3",
  "supertest": "^6.3.3"
}
```

### **Scripts de Teste**
```bash
npm test              # Executar todos os testes
npm run test:watch    # Executar testes em modo watch
npm run test:coverage # Executar testes com cobertura
npm run test:ci       # Executar testes para CI/CD
```

### **Configuração do Jest**
- Ambiente: Node.js
- Banco de dados: MongoDB em memória
- Timeout: 10 segundos
- Cobertura: HTML, LCOV, texto
- Mocks automáticos

## 🧪 Tipos de Testes

### **1. Testes Unitários**

#### **Modelos (Models)**
- ✅ Validação de dados
- ✅ Métodos personalizados
- ✅ Virtuais (IMC, categorias)
- ✅ Índices e constraints
- ✅ Relacionamentos

#### **Controllers**
- ✅ Lógica de negócio
- ✅ Validação de entrada
- ✅ Tratamento de erros
- ✅ Respostas HTTP
- ✅ Autenticação

#### **Services**
- ✅ Integração com APIs externas
- ✅ Processamento de dados
- ✅ Mocks de dependências
- ✅ Tratamento de erros

#### **Middlewares**
- ✅ Autenticação JWT
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Rate limiting

### **2. Testes de Integração**

#### **Fluxos Completos**
- ✅ Registro → Login → Perfil
- ✅ Criar → Editar → Deletar recursos
- ✅ Autenticação em rotas protegidas
- ✅ Validação de permissões

#### **Banco de Dados**
- ✅ CRUD completo
- ✅ Relacionamentos
- ✅ Transações
- ✅ Performance

### **3. Testes de API**

#### **Endpoints**
- ✅ Status codes corretos
- ✅ Estrutura JSON válida
- ✅ Validação de entrada
- ✅ Autenticação obrigatória

#### **Respostas**
- ✅ Dados corretos
- ✅ Mensagens apropriadas
- ✅ Paginação
- ✅ Filtros

## 📊 Cobertura de Testes

### **✅ Implementados**
- ✅ Configuração do Jest
- ✅ Setup do banco de teste
- ✅ Utilitários de teste
- ✅ Testes do modelo User
- ✅ Testes do exerciseController
- ✅ Mocks de APIs externas

### **❌ Pendentes**
- ❌ Testes dos outros modelos (Workout, Diet, Progress)
- ❌ Testes dos outros controllers
- ❌ Testes de services
- ❌ Testes de middlewares
- ❌ Testes de integração
- ❌ Testes de API
- ❌ Testes de performance
- ❌ Testes de segurança

## 🚀 Como Executar

### **Executar Todos os Testes**
```bash
npm test
```

### **Executar Testes Específicos**
```bash
# Testes unitários
npm test -- tests/unit/

# Testes de um modelo específico
npm test -- tests/unit/models/User.test.js

# Testes de um controller específico
npm test -- tests/unit/controllers/exerciseController.test.js
```

### **Executar com Cobertura**
```bash
npm run test:coverage
```

### **Executar em Modo Watch**
```bash
npm run test:watch
```

## 📈 Métricas de Qualidade

### **Cobertura Mínima**
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

### **Performance**
- **Tempo máximo**: 10 segundos por teste
- **Memória**: < 100MB por teste
- **Banco**: Limpeza automática entre testes

## 🔧 Utilitários de Teste

### **Funções Disponíveis**
```javascript
// Criar usuário de teste
const user = await createTestUser({
  name: 'Test User',
  email: 'test@example.com'
});

// Gerar token JWT
const token = generateTestToken(user._id);

// Criar request/response mocks
const req = createMockRequest({
  body: { exerciseId: '123' },
  user: { id: user._id }
});
const res = createMockResponse();

// Dados de teste
const exerciseData = mockExerciseData;
const workoutData = mockWorkoutData;
const dietData = mockDietData;
const progressData = mockProgressData;
```

## 🛡️ Boas Práticas

### **1. Isolamento**
- Cada teste é independente
- Banco limpo entre testes
- Mocks para APIs externas

### **2. Nomenclatura**
- Descritivo e claro
- Padrão: "deve [ação] quando [condição]"
- Agrupamento lógico

### **3. Assertions**
- Específicas e precisas
- Verificação de estrutura JSON
- Validação de status codes

### **4. Mocks**
- APIs externas sempre mockadas
- Dependências isoladas
- Dados consistentes

## 🔄 CI/CD

### **GitHub Actions**
```yaml
- name: Run Tests
  run: npm run test:ci
```

### **Pré-commit**
```bash
npm test -- --watchAll=false
```

## 📝 Exemplos de Testes

### **Teste Unitário - Modelo**
```javascript
test('deve calcular IMC corretamente', async () => {
  const user = await createTestUser({
    height: 170,
    weight: 70
  });
  expect(user.bmi).toBe('24.2');
});
```

### **Teste de Controller**
```javascript
test('deve adicionar exercício aos favoritos', async () => {
  const req = createMockRequest({
    body: { exerciseId: '123' },
    user: { id: user._id }
  });
  
  await exerciseController.addToFavorites(req, res);
  
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    message: 'Exercício adicionado aos favoritos'
  });
});
```

### **Teste de API**
```javascript
test('GET /api/exercise/favorites deve retornar 401 sem token', async () => {
  const response = await request(app)
    .get('/api/exercise/favorites')
    .expect(401);
});
```

## 🎯 Próximos Passos

1. **Implementar testes restantes**
   - Modelos Workout, Diet, Progress
   - Controllers restantes
   - Services e middlewares

2. **Testes de integração**
   - Fluxos completos de usuário
   - Cenários de erro
   - Performance

3. **Testes de API**
   - Todos os endpoints
   - Validação de entrada
   - Autenticação

4. **Melhorias**
   - Testes de performance
   - Testes de segurança
   - Testes de carga

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices) 