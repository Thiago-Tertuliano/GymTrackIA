# 🔗 Conexão Frontend ↔ Backend

## 🚀 Início Rápido

### Opção 1: Script Automático (Recomendado)
```bash
# Na raiz do projeto
node start-full-stack.js
```

### Opção 2: Manual
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run start-dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## 📱 Configurações de Rede

### Para Android Emulator
```javascript
// services/api.ts
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

### Para iOS Simulator
```javascript
// services/api.ts
const API_BASE_URL = 'http://localhost:3000/api';
```

### Para Dispositivo Físico
```javascript
// services/api.ts
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Seu IP local
```

## 🔧 Configuração do Backend

### 1. Arquivo .env
O script `start-dev.js` cria automaticamente um arquivo `.env` com:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gymtrack
JWT_SECRET=gymtrack_jwt_secret_dev_2024
# ... outras configurações
```

### 2. MongoDB
- **Local**: Instale MongoDB localmente
- **Cloud**: Use MongoDB Atlas (gratuito)
- **Docker**: `docker run -d -p 27017:27017 mongo`

### 3. CORS
O backend já está configurado para aceitar:
- `http://localhost:3000`
- `http://localhost:19006`
- `http://localhost:8081`
- `exp://localhost:8081`

## 📡 Endpoints Disponíveis

### Exercícios
- `GET /api/exercise/all` - Todos os exercícios
- `GET /api/exercise/muscle/:muscleGroup` - Por grupo muscular
- `GET /api/exercise/body-parts` - Grupos musculares
- `GET /api/exercise/equipment` - Equipamentos

### Treinos
- `GET /api/workout` - Listar treinos
- `POST /api/workout` - Criar treino
- `GET /api/workout/:id` - Obter treino
- `PUT /api/workout/:id` - Atualizar treino
- `DELETE /api/workout/:id` - Deletar treino

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token

## 🧪 Testando a Conexão

### 1. Verificar Backend
```bash
curl http://localhost:3000/api/exercise/body-parts
```

### 2. Verificar Frontend
- Abra o app no Expo
- Vá para a tela de Treinos
- Tente criar um novo treino
- Verifique se os exercícios carregam

### 3. Logs de Debug
```javascript
// No frontend, adicione logs
console.log('API Response:', response);
```

## 🔍 Troubleshooting

### Erro: "Network request failed"
1. **Verifique se o backend está rodando**
   ```bash
   curl http://localhost:3000
   ```

2. **Verifique a URL da API**
   - Android: `10.0.2.2:3000`
   - iOS: `localhost:3000`
   - Físico: Seu IP local

3. **Verifique o CORS**
   ```javascript
   // No backend, adicione seu IP
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://SEU_IP:8081
   ```

### Erro: "MongoDB connection failed"
1. **Instale MongoDB localmente**
2. **Ou use MongoDB Atlas**
3. **Ou use Docker**
   ```bash
   docker run -d -p 27017:27017 mongo
   ```

### Erro: "Port already in use"
```bash
# Encontre o processo
netstat -ano | findstr :3000

# Mate o processo
taskkill /PID <PID> /F
```

## 🚀 Deploy

### Backend (Render/Heroku)
1. Configure as variáveis de ambiente
2. Use MongoDB Atlas
3. Configure CORS para produção

### Frontend (Expo)
1. Configure a URL da API para produção
2. Build para Android/iOS
3. Publique na App Store/Play Store

## 📊 Monitoramento

### Logs do Backend
```bash
# Ver logs em tempo real
tail -f backend/logs/app.log
```

### Logs do Frontend
```bash
# No Expo DevTools
# Console tab
```

## 🔐 Segurança

### Produção
1. Use HTTPS
2. Configure JWT secrets fortes
3. Implemente rate limiting
4. Use MongoDB Atlas
5. Configure CORS adequadamente

### Desenvolvimento
1. Use variáveis de ambiente
2. Não commite secrets
3. Use MongoDB local ou Atlas
4. Configure CORS para desenvolvimento

## 📚 Recursos Adicionais

- [Expo Networking](https://docs.expo.dev/guides/networking/)
- [React Native Fetch](https://reactnative.dev/docs/network)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs
2. Teste os endpoints individualmente
3. Verifique a conectividade de rede
4. Consulte a documentação do Expo/Express 