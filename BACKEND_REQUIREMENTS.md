# Requisitos do Backend - AstroBot

Para que o aplicativo AstroBot funcione plenamente, as seguintes rotas e funcionalidades precisam ser implementadas no backend.

## 1. Autenticação (Auth)

O frontend possui formulários de login e cadastro (`LoginView.vue`).

| Método | Rota | Descrição | Corpo da Requisição (JSON) | Resposta Esperada (200 OK) |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Cria uma nova conta de usuário. | `{ "name": "...", "email": "...", "password": "..." }` | `{ "token": "jwt_token", "user": { ... } }` |
| **POST** | `/api/auth/login` | Autentica um usuário existente. | `{ "email": "...", "password": "..." }` | `{ "token": "jwt_token", "user": { ... } }` |
| **POST** | `/api/auth/logout` | Encerra a sessão (opcional, se usar cookies/tokens). | - | `{ "message": "Logged out successfully" }` |
| **GET** | `/api/auth/me` | Obtém dados do usuário atual (para persistência de sessão). | - | `{ "user": { ... } }` |

## 2. Chat e Histórico

Atualmente, o histórico é salvo no `localStorage`. Para persistência entre dispositivos e segurança, deve ser movido para o backend.

| Método | Rota | Descrição | Corpo da Requisição | Resposta Esperada |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/chat/history` | Recupera o histórico de mensagens do usuário logado. | - | `{ "messages": [ { "id": "...", "text": "...", "isUser": true/false, "timestamp": "..." } ] }` |
| **POST** | `/api/chat/message` | Salva uma nova mensagem (usuário ou bot) no histórico. | `{ "text": "...", "isUser": boolean }` | `{ "id": "new_msg_id", "timestamp": "..." }` |
| **DELETE** | `/api/chat/history` | Limpa todo o histórico de conversa do usuário. | - | `{ "message": "History cleared" }` |

## 3. Integração com IA (Opcional / Recomendado)

Atualmente, a chave da API do Gemini (`VITE_GEMINI_API_KEY`) fica exposta no frontend. O ideal é criar uma rota proxy no backend para proteger a chave.

| Método | Rota | Descrição | Corpo da Requisição | Resposta Esperada |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/ai/generate` | Envia o prompt para o Gemini via backend e retorna a resposta. | `{ "message": "...", "history": [...] }` | `{ "response": "..." }` |

## 4. Perfil do Usuário (Opcional - Futuro)

Para funcionalidades como "Meu Mapa" na Home.

| Método | Rota | Descrição | Corpo da Requisição | Resposta Esperada |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/user/profile` | Retorna dados do perfil (data nascc., mapa astral salvo). | - | `{ "birthDate": "...", "birthTime": "...", "birthCity": "..." }` |
| **PUT** | `/api/user/profile` | Atualiza dados do perfil. | `{ "birthDate": "...", ... }` | `{ "message": "Profile updated" }` |
