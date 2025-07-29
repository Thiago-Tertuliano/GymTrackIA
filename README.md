
# 🏋️‍♂️ GymTrack AI

App de treino e dieta com inteligência artificial open source usando Hugging Face.

---

## 🎯 Objetivo

Criar um app onde os usuários possam:
- Registrar treinos e refeições
- Acompanhar evolução (peso, IMC, metas)
- Receber sugestões de treino e dieta com base no perfil, usando IA gratuita (Hugging Face)

---

## 🧑 Público-Alvo

- Jovens/adultos de 16 a 35 anos
- Devs, universitários, marombeiros, iniciantes ou intermediários na academia
- Pessoas que gostam de praticidade, saúde e tecnologia

---

## 💻 Plataforma

- Mobile App: **React Native (Expo)**
- Futuro: versão web com **Next.js** como dashboard

---

## 🧱 Stack Tecnológica

**Frontend**:
- React Native (Expo)
- React Navigation
- Styled Components / NativeWind
- Axios
- Victory Charts

**Backend**:
- Node.js + Express
- MongoDB (MongoDB Atlas)
- JWT
- Helmet, Dotenv, Mongoose, CORS

**IA**:
- Hugging Face Inference API
- Modelo: `mistralai/Mistral-7B-Instruct`

**Deploy**:
- Backend: Render
- DB: MongoDB Atlas
- IA: Hugging Face pública

---

## 🧩 Funcionalidades (MVP)

- [x] Cadastro/Login com autenticação
- [x] Perfil do usuário: nome, idade, altura, peso, objetivo
- [x] CRUD de treinos
- [x] CRUD de dieta
- [x] Tela de progresso (peso, IMC, metas, gráficos)
- [x] Tela de IA: sugestão de treino/dieta via Hugging Face
- [x] UX intuitivo e moderno

**Extras futuros**:
- Notificações push
- Chat com IA em tempo real
- Login Google/Apple
- Integração com smartwatches

---

## 🎨 Design: UI e UX

**Estilo visual**:
- Minimalista com toques energéticos
- Tipografia moderna (Inter, Montserrat ou Lexend)
- Animações suaves, transições fluidas
- Navegação via bottom tabs

**Cores (modo claro)**:
- Fundo: `#F5F5F5`
- Ação: `#00BFFF` (azul neon)
- Destaque: `#00FF7F` (verde limão)
- Texto: `#333333`
- Botões: `#111111`

**Modo escuro**: base `#121212`, mesmas cores invertidas

---

## 🧰 Bibliotecas Frontend Modernas

| Biblioteca | Uso |
|------------|-----|
| `react-native-reanimated` | Animações de alto nível |
| `react-native-gesture-handler` | Gestos e navegação fluida |
| `moti` | Animações simplificadas e fluidas |
| `expo-linear-gradient` | Gradientes modernos |
| `react-native-svg` + `react-native-svg-charts` | Gráficos customizáveis |
| `react-native-responsive-fontsize` | Fontes adaptáveis |
| `react-native-size-matters` | Estilo responsivo |
| `expo-router` ou `react-navigation` | Rotas e navegação animada |
| `react-native-paper` (opcional) | Componentes estilizados prontos |

**Animações UX**:
- Onboarding animado
- Cards interativos
- Gráficos animados
- Skeleton loading
- Feedback visual em toques e botões

---

## 📲 Telas e Navegação

- **Login/Boas-vindas**
- **Cadastro de Perfil**
- **Dashboard**
- **Treinos**: lista + cadastro
- **Dieta**: refeições + macros
- **Progresso**: gráficos de evolução
- **Coach IA**: sugestões personalizadas

---

## 📁 Organização de Código

**Backend (Node.js)**:
```
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   └── app.js
├── .env
└── server.js
```

**Frontend (React Native)**:
```
app/
├── assets/
├── components/
│   ├── AnimatedCard.tsx
│   ├── LoadingSkeleton.tsx
├── screens/
│   ├── Onboarding/
│   ├── Dashboard/
│   ├── Workout/
│   ├── Diet/
│   ├── Progress/
│   ├── AiCoach/
├── animations/
│   ├── fade.ts
│   ├── bounce.ts
├── hooks/
├── services/
├── styles/
├── utils/
└── App.tsx
```

---

## 🔐 Segurança

- JWT com refresh token
- Input sanitizado (contra XSS e injections)
- Helmet + CORS controlado

---

## 📅 Cronograma (estimado)

| Semana | Entrega |
|--------|---------|
| 1 | Setup + Autenticação |
| 2 | CRUD Treinos + Dieta |
| 3 | Tela Progresso + IMC |
| 4 | Integração IA Hugging Face |
| 5 | Ajustes finais + README

---

## 📄 README

O README conterá:
- Descrição do projeto
- Print das telas
- Stack usada
- Instruções para rodar localmente
- Link do app (em breve)

---

## 🔮 Futuras Melhorias

- Haptics feedback
- Background animado
- Voice to text
- Lottie animations
