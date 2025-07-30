# 🏋️‍♂️ GymTrack Backend

Backend completo para o app GymTrack AI com autenticação, CRUD de treinos/dietas, IA integrada e acompanhamento de progresso.

## 🚀 Funcionalidades

### ✅ **Autenticação & Usuários**
- Registro e login com JWT + Refresh Token
- Perfil completo com cálculo automático de IMC
- Alteração de senha e exclusão de conta
- Estatísticas personalizadas

### ✅ **Gestão de Treinos**
- CRUD completo de treinos
- Exercícios com séries, pesos e repetições
- Marcar séries como completas
- Avaliação e estatísticas de treino
- Templates de treino

### ✅ **Gestão de Dietas**
- CRUD completo de dietas
- Refeições com alimentos e macros
- Marcar refeições como completas
- Cálculo automático de calorias
- Avaliação e estatísticas

### ✅ **Acompanhamento de Progresso**
- CRUD completo de progresso
- Medidas corporais e fotos
- Humor, energia, sono e hidratação
- Análise de tendências e mudanças
- Gráficos de evolução

### ✅ **Inteligência Artificial**
- Integração com Hugging Face
- Sugestões de treino personalizadas
- Sugestões de dieta baseadas no perfil
- Análise de progresso com feedback
- Chat interativo com IA

### ✅ **API de Exercícios**
- Busca de exercícios por grupo muscular
- Sistema de favoritos
- Integração com APIs externas
- Verificação de exercícios existentes

## 🛠️ Tecnologias

- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Hugging Face** para IA
- **Multer** + Sharp para upload de imagens
- **Jest** para testes
- **Helmet** + CORS para segurança

## 📦 Instalação

### 1. **Clone o repositório**
```bash
git clone <repository-url>
cd GymTrackIA/backend
```

### 2. **Instale as dependências**
```bash
npm install
```

### 3. **Configure o ambiente**
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Configure as variáveis no arquivo .env
```

### 4. **Configure as variáveis de ambiente**
```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gymtrack

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
REFRESH_TOKEN_SECRET=seu_refresh_token_secret

# Hugging Face AI
HUGGING_FACE_API_KEY=sua_chave_api_hugging_face

# APIs externas (opcional)
RAPID_API_KEY=sua_chave_rapid_api
WGER_API_KEY=sua_chave_wger
```

### 5. **Execute o setup**
```bash
npm run setup
```

### 6. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints da API

### 🔐 **Autenticação**
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/verify` - Verificar token

### 👤 **Usuários**
- `GET /api/user/profile` - Obter perfil
- `PUT /api/user/profile` - Atualizar perfil
- `PUT /api/user/password` - Alterar senha
- `DELETE /api/user/account` - Deletar conta
- `GET /api/user/stats` - Estatísticas

### 🏋️‍♂️ **Treinos**
- `GET /api/workout` - Listar treinos
- `POST /api/workout` - Criar treino
- `GET /api/workout/:id` - Obter treino
- `PUT /api/workout/:id` - Atualizar treino
- `DELETE /api/workout/:id` - Deletar treino
- `POST /api/workout/:id/complete-set` - Marcar série
- `POST /api/workout/:id/rate` - Avaliar treino
- `GET /api/workout/stats` - Estatísticas

### 🍽️ **Dietas**
- `GET /api/diet` - Listar dietas
- `POST /api/diet` - Criar dieta
- `GET /api/diet/:id` - Obter dieta
- `PUT /api/diet/:id` - Atualizar dieta
- `DELETE /api/diet/:id` - Deletar dieta
- `POST /api/diet/:id/complete-meal` - Marcar refeição
- `POST /api/diet/:id/rate` - Avaliar dieta
- `GET /api/diet/stats` - Estatísticas

### 📊 **Progresso**
- `GET /api/progress` - Listar progressos
- `POST /api/progress` - Criar progresso
- `GET /api/progress/:id` - Obter progresso
- `PUT /api/progress/:id` - Atualizar progresso
- `DELETE /api/progress/:id` - Deletar progresso
- `GET /api/progress/stats` - Estatísticas
- `GET /api/progress/latest` - Último progresso

### 🤖 **Inteligência Artificial**
- `POST /api/ai/workout-suggestion` - Sugestão de treino
- `POST /api/ai/diet-suggestion` - Sugestão de dieta
- `POST /api/ai/analyze` - Análise de progresso
- `POST /api/ai/chat` - Chat com IA

### 🏃‍♂️ **Exercícios**
- `GET /api/exercise` - Listar exercícios
- `GET /api/exercise/muscle/:group` - Exercícios por grupo
- `GET /api/exercise/favorites` - Favoritos
- `POST /api/exercise/favorites` - Adicionar favorito
- `DELETE /api/exercise/favorites/:id` - Remover favorito
- `GET /api/exercise/favorites/check/:id` - Verificar favorito

## 🧪 Testes

### **Executar todos os testes**
```bash
npm test
```

### **Executar testes com watch**
```bash
npm run test:watch
```

### **Executar testes com cobertura**
```bash
npm run test:coverage
```

### **Executar testes específicos**
```bash
npm test -- tests/unit/controllers/authController.test.js
```

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Controle de origem
- **Rate Limiting**: Proteção contra spam
- **JWT**: Autenticação segura
- **bcrypt**: Hash de senhas
- **Validação**: Dados sanitizados
- **MongoDB**: Injeção de queries prevenida

## 📈 Performance

- **Índices MongoDB**: Consultas otimizadas
- **Pagination**: Listagens paginadas
- **Connection Pooling**: Conexões reutilizadas
- **Error Handling**: Tratamento robusto de erros
- **Logging**: Logs estruturados

## 🚀 Deploy

### **Render (Recomendado)**
1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente
3. Deploy automático

### **Heroku**
1. Crie um app no Heroku
2. Configure as variáveis de ambiente
3. Deploy via Git

### **Vercel**
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 📚 Documentação

- [Estrutura do Projeto](doc/ESTRUTURA.md)
- [API de Favoritos](doc/FAVORITOS_API.md)
- [Testes](TESTES.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a Licença MIT. Veja o arquivo [LICENSE](../LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@gymtrack.app
- GitHub: [Issues](https://github.com/gymtrack/issues)

---

**GymTrack Backend** - Backend completo e robusto para o app de fitness com IA! 🚀 