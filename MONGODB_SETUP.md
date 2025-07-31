# 🗄️ Configuração do MongoDB

## 🚀 Opção 1: Docker (Recomendado)

### 1. Instalar Docker Desktop
- Baixe em: https://www.docker.com/products/docker-desktop/
- Instale e reinicie o computador

### 2. Executar o script automático
```bash
node setup-mongodb.js
```

### 3. Ou executar manualmente
```bash
# Criar container MongoDB
docker run -d --name gymtrack-mongo -p 27017:27017 -e MONGO_INITDB_DATABASE=gymtrack mongo:latest

# Iniciar container (se já existir)
docker start gymtrack-mongo
```

## 🚀 Opção 2: MongoDB Local

### 1. Baixar MongoDB Community Server
- https://www.mongodb.com/try/download/community
- Instale seguindo as instruções

### 2. Iniciar o serviço
```bash
# Windows (como administrador)
net start MongoDB

# Ou manualmente
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

## 🚀 Opção 3: MongoDB Atlas (Gratuito)

### 1. Criar conta gratuita
- https://www.mongodb.com/atlas
- Crie um cluster gratuito

### 2. Obter string de conexão
- Vá em "Connect" → "Connect your application"
- Copie a string de conexão

### 3. Atualizar .env
```env
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.abc123.mongodb.net/gymtrack?retryWrites=true&w=majority
```

## 🧪 Testando a Conexão

### 1. Verificar se MongoDB está rodando
```bash
# Docker
docker ps | grep mongo

# Local
netstat -ano | findstr :27017
```

### 2. Testar conexão
```bash
# MongoDB Compass (GUI)
mongodb://localhost:27017/gymtrack

# Ou via linha de comando
mongo gymtrack
```

## 🔧 Troubleshooting

### Erro: "MongoDB connection failed"
1. **Verifique se o MongoDB está rodando**
2. **Verifique a string de conexão**
3. **Verifique se a porta 27017 está livre**

### Erro: "Authentication failed"
1. **Verifique usuário e senha**
2. **Verifique se o IP está liberado (Atlas)**

### Erro: "Port already in use"
```bash
# Encontre o processo
netstat -ano | findstr :27017

# Mate o processo
taskkill /PID <PID> /F
```

## 📊 Verificando Dados

### MongoDB Compass
- Baixe: https://www.mongodb.com/try/download/compass
- Conecte em: `mongodb://localhost:27017`

### Via linha de comando
```bash
# Conectar ao MongoDB
mongo gymtrack

# Ver databases
show dbs

# Usar database
use gymtrack

# Ver collections
show collections

# Ver documentos
db.workouts.find()
```

## 🎯 Próximos Passos

1. **Configure o MongoDB** (uma das opções acima)
2. **Reinicie o backend**: `cd backend && npm run start-dev`
3. **Teste a API**: `node test-api.js`
4. **Inicie o frontend**: `cd frontend && npm start`

## 📚 Recursos

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker MongoDB](https://hub.docker.com/_/mongo)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) 