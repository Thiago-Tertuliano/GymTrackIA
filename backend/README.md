# 🏋️‍♂️ GymTrack Backend

Backend da aplicação GymTrack AI - API RESTful para gerenciamento de treinos, dietas e progresso com inteligência artificial.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Hugging Face** - IA para sugestões
- **Helmet** - Segurança
- **CORS** - Cross-origin resource sharing
- **express-validator** - Validação de dados

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── models/         # Modelos do MongoDB
│   ├── routes/         # Rotas da API
│   ├── middlewares/    # Middlewares customizados
│   └── app.js         # Configuração do Express
├── server.js          # Arquivo principal
├── package.json       # Dependências
├── env.example        # Variáveis de ambiente
└── README.md         # Este arquivo
```

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd GymTrack/backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o MongoDB**
- Instale o MongoDB localmente ou use MongoDB Atlas
- Configure a URI no arquivo `.env`

5. **Configure a API do Hugging Face**
- Crie uma conta em [Hugging Face](https://huggingface.co/)
- Obtenha sua API key
- Configure no arquivo `.env`

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gymtrack
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/gymtrack

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=seu_refresh_token_secret_aqui
REFRESH_TOKEN_EXPIRES_IN=30d

# Hugging Face AI
HUGGING_FACE_API_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct
HUGGING_FACE_API_KEY=sua_chave_api_hugging_face_aqui

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,https://gymtrack.app
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Testes
```bash
npm test
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token

### Usuário
- `GET /api/user/profile` - Obter perfil
- `PUT /api/user/profile` - Atualizar perfil
- `PUT /api/user/password` - Alterar senha
- `DELETE /api/user/account` - Deletar conta
- `GET /api/user/stats` - Estatísticas do usuário

### Treinos
- `POST /api/workout` - Criar treino
- `GET /api/workout` - Listar treinos
- `GET /api/workout/:id` - Obter treino específico
- `PUT /api/workout/:id` - Atualizar treino
- `DELETE /api/workout/:id` - Deletar treino
- `POST /api/workout/complete-set` - Marcar série como completa
- `POST /api/workout/:id/rate` - Avaliar treino
- `GET /api/workout/stats` - Estatísticas de treino

### Dietas
- `POST /api/diet` - Criar dieta
- `GET /api/diet` - Listar dietas
- `GET /api/diet/:id` - Obter dieta específica
- `PUT /api/diet/:id` - Atualizar dieta
- `DELETE /api/diet/:id` - Deletar dieta
- `POST /api/diet/complete-meal` - Marcar refeição como completa
- `POST /api/diet/:id/rate` - Avaliar dieta
- `GET /api/diet/stats` - Estatísticas de dieta

### Progresso
- `POST /api/progress` - Criar registro de progresso
- `GET /api/progress` - Listar progresso
- `GET /api/progress/:id` - Obter progresso específico
- `PUT /api/progress/:id` - Atualizar progresso
- `DELETE /api/progress/:id` - Deletar progresso
- `GET /api/progress/stats` - Estatísticas de progresso
- `GET /api/progress/latest` - Último registro de progresso

### IA
- `POST /api/ai/workout-suggestion` - Sugestão de treino
- `POST /api/ai/diet-suggestion` - Sugestão de dieta
- `GET /api/ai/analyze-progress` - Análise de progresso
- `POST /api/ai/chat` - Chat com IA

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Login/Registro**: Retorna `accessToken` e `refreshToken`
2. **Requisições**: Incluir header `Authorization: Bearer <accessToken>`
3. **Refresh**: Usar `refreshToken` para obter novo `accessToken`

## 📊 Modelos de Dados

### Usuário
```javascript
{
  name: String,
  email: String,
  password: String,
  age: Number,
  height: Number,
  weight: Number,
  goal: String,
  activityLevel: String,
  refreshToken: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Treino
```javascript
{
  user: ObjectId,
  name: String,
  type: String,
  difficulty: String,
  exercises: [{
    name: String,
    muscleGroup: String,
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number,
      restTime: Number,
      completed: Boolean
    }],
    notes: String
  }],
  duration: Number,
  caloriesBurned: Number,
  completed: Boolean,
  rating: Number,
  notes: String
}
```

### Dieta
```javascript
{
  user: ObjectId,
  name: String,
  date: Date,
  type: String,
  targetCalories: Number,
  targetProtein: Number,
  targetCarbs: Number,
  targetFat: Number,
  meals: [{
    name: String,
    type: String,
    time: String,
    foods: [{
      name: String,
      quantity: Number,
      unit: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number
    }],
    completed: Boolean
  }],
  completed: Boolean,
  rating: Number
}
```

### Progresso
```javascript
{
  user: ObjectId,
  date: Date,
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number,
    thighs: Number,
    calves: Number
  },
  photos: [{
    type: String,
    url: String,
    uploadedAt: Date
  }],
  mood: String,
  energy: Number,
  sleep: Number,
  waterIntake: Number,
  notes: String
}
```

## 🤖 Integração com IA

A API integra com o Hugging Face para:

- **Sugestões de treino** personalizadas
- **Sugestões de dieta** baseadas no perfil
- **Análise de progresso** com feedback
- **Chat interativo** para dúvidas

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
- **Caching**: Respostas em cache (futuro)
- **Compression**: Respostas comprimidas
- **Connection Pooling**: Conexões reutilizadas

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 📦 Deploy

### Render (Recomendado)
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

### Heroku
```bash
heroku create gymtrack-backend
heroku config:set NODE_ENV=production
git push heroku main
```

### Docker
```bash
docker build -t gymtrack-backend .
docker run -p 3000:3000 gymtrack-backend
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob **Licença Proprietária Restritiva**. 

**⚠️ ATENÇÃO**: Este software é CONFIDENCIAL e PROPRIETÁRIO. É EXPRESSAMENTE PROIBIDO:

- Copiar, reproduzir ou distribuir este software
- Modificar, adaptar ou criar trabalhos derivados
- Engenharia reversa, descompilação ou desmontagem
- Comercializar, vender ou licenciar este software
- Usar este software para fins comerciais sem autorização
- Compartilhar código fonte ou documentação

**Penalidades**: Violações podem resultar em ação legal, multas de até R$ 100.000,00 e bloqueio de acesso.

Para uso comercial ou modificações, entre em contato: **legal@gymtrack.app**

Veja o arquivo [LICENSE](../LICENSE) para detalhes completos.

## 📞 Suporte

- **Email**: suporte@gymtrack.app
- **Issues**: [GitHub Issues](https://github.com/gymtrack/issues)
- **Documentação**: [Wiki](https://github.com/gymtrack/wiki)

---

**GymTrack Backend** - Transformando fitness com IA! 💪 