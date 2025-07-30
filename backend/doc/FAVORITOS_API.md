# API de Favoritos - GymTrack IA

## 📋 Visão Geral

O sistema de favoritos permite que usuários salvem exercícios favoritos para acesso rápido. Todas as rotas de favoritos requerem autenticação.

## 🔐 Autenticação

Todas as rotas de favoritos precisam do token de autenticação no header:
```
Authorization: Bearer <seu_token_jwt>
```

## 📡 Endpoints

### 1. **GET** `/api/exercise/favorites`
**Buscar favoritos do usuário**

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Favoritos encontrados",
  "data": {
    "favorites": [
      {
        "id": "0001",
        "name": "Push-up",
        "muscleGroup": "chest",
        "equipment": "body weight",
        "target": "pectoralis major",
        "gifUrl": "https://...",
        "instructions": [...],
        "instructions_pt": [...],
        "addedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 1
  }
}
```

### 2. **POST** `/api/exercise/favorites`
**Adicionar exercício aos favoritos**

**Body (Opção 1 - Apenas ID):**
```json
{
  "exerciseId": "0001"
}
```

**Body (Opção 2 - Dados completos):**
```json
{
  "exerciseId": "123",
  "name": "Supino Reto",
  "muscleGroup": "peito",
  "equipment": "barbell",
  "target": "peito",
  "gifUrl": "https://example.com/supino.gif",
  "instructions": ["Deite no banco", "Agarre a barra", "Levante o peso"],
  "source": "wger"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Exercício adicionado aos favoritos",
  "data": {
    "exerciseId": "0001",
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erros Possíveis:**
- `400`: ID do exercício é obrigatório
- `404`: Exercício não encontrado
- `400`: Exercício já está nos favoritos

### 3. **DELETE** `/api/exercise/favorites/:exerciseId`
**Remover exercício dos favoritos**

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Exercício removido dos favoritos",
  "data": {
    "exerciseId": "0001"
  }
}
```

**Erros Possíveis:**
- `400`: ID do exercício é obrigatório
- `404`: Exercício não está nos favoritos

### 4. **GET** `/api/exercise/favorites/check/:exerciseId`
**Verificar se exercício está nos favoritos**

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Status do favorito verificado",
  "data": {
    "exerciseId": "0001",
    "isFavorite": true
  }
}
```

## 🗄️ Estrutura do Banco

### Campo `favoriteExercises` no modelo User:
```javascript
favoriteExercises: [{
  exerciseId: {
    type: String,
    required: true
  },
  exerciseData: {
    name: String,
    muscleGroup: String,
    equipment: String,
    target: String,
    gifUrl: String,
    instructions: [String],
    source: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}]
```

## ⚡ Funcionalidades

### ✅ **Implementadas:**
- ✅ Adicionar exercício aos favoritos
- ✅ Remover exercício dos favoritos
- ✅ Listar todos os favoritos do usuário
- ✅ Verificar se exercício está nos favoritos
- ✅ Validação de exercício existente
- ✅ Prevenção de duplicatas
- ✅ Tratamento de erros robusto
- ✅ Autenticação obrigatória

### 🔄 **Fluxo de Funcionamento:**
1. Usuário faz login e recebe token JWT
2. Usuário adiciona exercícios aos favoritos via POST
3. Sistema verifica se exercício existe na API externa
4. Sistema salva referência no banco de dados
5. Usuário pode listar, verificar e remover favoritos

## 🛡️ Segurança

- Todas as rotas requerem autenticação
- Validação de entrada em todos os endpoints
- Verificação de existência do exercício antes de adicionar
- Prevenção de duplicatas nos favoritos
- Tratamento de erros sem exposição de dados sensíveis

## 📝 Exemplos de Uso

### Adicionar Favorito (Apenas ID):
```bash
curl -X POST http://localhost:3000/api/exercise/favorites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"exerciseId": "0001"}'
```

### Adicionar Favorito (Dados Completos):
```bash
curl -X POST http://localhost:3000/api/exercise/favorites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "123",
    "name": "Supino Reto",
    "muscleGroup": "peito",
    "equipment": "barbell",
    "target": "peito",
    "gifUrl": "https://example.com/supino.gif",
    "instructions": ["Deite no banco", "Agarre a barra", "Levante o peso"],
    "source": "wger"
  }'
```

### Listar Favoritos:
```bash
curl -X GET http://localhost:3000/api/exercise/favorites \
  -H "Authorization: Bearer <token>"
```

### Verificar Favorito:
```bash
curl -X GET http://localhost:3000/api/exercise/favorites/check/0001 \
  -H "Authorization: Bearer <token>"
```

### Remover Favorito:
```bash
curl -X DELETE http://localhost:3000/api/exercise/favorites/0001 \
  -H "Authorization: Bearer <token>"
``` 