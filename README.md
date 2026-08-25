# ✨ Aivora AI Chatbot

<div align="center">

<img src="./assets/banner.svg" alt="Aivora AI Chatbot" width="100%"/>

### Your intelligent conversational workspace.

A modern full-stack AI chatbot built with **React, Vite, Express and multiple AI providers**, featuring authentication, persistent conversations, chat history and a responsive user experience.

<br/>

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white"/>

<br/>

<img src="https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/Groq-AI-F55036?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Cerebras-AI-6C63FF?style=for-the-badge"/>
<img src="https://img.shields.io/badge/LowDB-Database-FFB000?style=for-the-badge"/>

<br/><br/>

**React · Vite · Express · JWT · LowDB · Gemini · Groq · Cerebras**

</div>

---

## 🚀 Overview

**Aivora** is a full-stack AI conversational application designed to provide a clean, fast and extensible chat experience.

Instead of being just a simple API demo, Aivora combines a modern frontend with a dedicated backend layer for:

* 🔐 User authentication
* 💬 Persistent conversations
* 🗂️ Conversation history
* 👤 User-specific data
* 🤖 Multiple AI providers
* 🛡️ Protected API routes
* ⚡ Fast React/Vite frontend
* 📱 Responsive interface
* 🚨 Friendly API error handling

The architecture is designed so the application can evolve from a portfolio project into a larger AI SaaS product.

---

## ✨ Features

### 🤖 Multi-Provider AI

Aivora is designed around a provider-based AI architecture.

Currently supported providers include:

* Google Gemini
* Groq
* Cerebras

This makes it possible to expand or switch AI providers without redesigning the entire application.

---

### 🔐 Authentication

Aivora includes a backend authentication system with:

* User registration
* User login
* Password hashing with `bcryptjs`
* JWT authentication
* Protected API routes
* Token expiration

Passwords are never stored as plain text.

---

### 💬 Persistent Conversations

Conversations are stored on the backend and associated with the authenticated user.

Users can:

* Create a new conversation
* Open previous conversations
* Continue existing chats
* Delete conversations
* Keep separate conversation histories

This transforms Aivora from a temporary chatbot into a persistent conversational application.

---

### 🗂️ Chat Sidebar

The sidebar provides a dedicated workspace for conversation history.

```text
┌───────────────────────────┐
│          AIVORA           │
│                           │
│  + New conversation       │
│                           │
│  Today                    │
│  ├─ React architecture    │
│  ├─ Build a portfolio     │
│  └─ Learn Node.js         │
│                           │
│  Previous                 │
│  ├─ AI project            │
│  └─ JavaScript help       │
└───────────────────────────┘
```

---

### 🎨 Modern User Interface

The frontend focuses on:

* Clean visual hierarchy
* Responsive layouts
* Interactive chat experience
* Loading states
* Error states
* Conversation navigation
* User-friendly interactions

---

### 🛡️ Protected Backend

The backend uses JWT-based authentication to protect user-specific resources.

Requests can be authenticated using:

```http
Authorization: Bearer <token>
```

This ensures conversations are accessed through an authenticated user context.

---

## 🧠 Architecture

<img src="./assets/architecture.svg" alt="Aivora Architecture" width="100%"/>

Aivora follows a full-stack architecture:

```text
┌──────────────────────┐
│        User          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     React + Vite     │
│      Frontend        │
└──────────┬───────────┘
           │
           │ HTTP / REST
           ▼
┌──────────────────────┐
│     Express API      │
│      Backend         │
└──────────┬───────────┘
           │
      ┌────┴─────┐
      │          │
      ▼          ▼
┌──────────┐ ┌──────────────┐
│  LowDB   │ │ AI Providers │
│ Database │ │              │
└──────────┘ └──────┬───────┘
                    │
             ┌──────┼──────┐
             ▼      ▼      ▼
          Gemini   Groq  Cerebras
```

---

## 🔄 Application Flow

<img src="./assets/flow.svg" alt="Aivora Application Flow" width="100%"/>

```text
User
 │
 ▼
Login / Register
 │
 ▼
Authenticated Session
 │
 ▼
Conversation Sidebar
 │
 ├──────────────► Create Chat
 │
 ├──────────────► Open Chat
 │
 └──────────────► Delete Chat
 │
 ▼
Send Message
 │
 ▼
Express Backend
 │
 ▼
Selected AI Provider
 │
 ▼
AI Response
 │
 ▼
Save Message
 │
 ▼
Update React UI
```

---

## 🛠️ Tech Stack

| Technology       | Role                      |
| ---------------- | ------------------------- |
| ⚛️ React 18      | Frontend UI               |
| ⚡ Vite 5         | Frontend tooling          |
| 🟢 Node.js       | Backend runtime           |
| 🚂 Express       | REST API                  |
| 🔐 JWT           | Authentication            |
| 🔒 bcryptjs      | Password hashing          |
| 🗄️ LowDB        | Local JSON database       |
| 🤖 Google Gemini | AI provider               |
| ⚡ Groq           | AI provider               |
| 🧠 Cerebras      | AI provider               |
| 🔗 CORS          | Cross-origin API support  |
| 🌱 dotenv        | Environment configuration |

The current dependency setup confirms these technologies are part of the project.

---

## 📁 Project Structure

```text
Aivora-AI-Chatbot/
│
├── .agents/
│   └── skills/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
│
├── assets/
│   ├── banner.svg
│   ├── architecture.svg
│   └── flow.svg
│
├── .env.example
├── .gitignore
├── database.json
├── index.html
├── package.json
├── package-lock.json
├── server.js
├── vite.config.js
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
CEREBRAS_API_KEY=your_cerebras_api_key

JWT_SECRET=your_secure_jwt_secret

PORT=5000
```

The backend reads provider keys and JWT configuration from environment variables.

### ⚠️ Security

Never commit real API keys or secrets.

Use:

```text
.env
```

locally and keep secrets out of Git.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/jawasakher/Aivora-AI-Chatbot.git
```

### 2. Enter the project

```bash
cd Aivora-AI-Chatbot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env
```

and add your API keys and JWT secret.

### 5. Start the application

```bash
npm run dev
```

The current project is configured to run the Vite frontend and Node backend concurrently with this command.

---

## 🧪 Available Scripts

### Development

```bash
npm run dev
```

Runs frontend and backend together.

### Frontend only

```bash
npm run dev:frontend
```

### Backend only

```bash
npm run dev:backend
```

### Production build

```bash
npm run build
```

### Preview frontend build

```bash
npm run preview
```

### Start backend

```bash
npm start
```

These scripts are defined in the current `package.json`.

---

## 🔌 Backend API

Aivora exposes a REST API through Express.

### Health Check

```http
GET /api/health
```

Returns the backend status and configured AI providers.

---

### Authentication

```http
POST /api/register
```

Register a new user.

```http
POST /api/login
```

Authenticate an existing user.

---

### Conversations

Authenticated users can manage their conversations through protected API routes.

Typical operations include:

```text
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
DELETE /api/conversations/:id
```

---

## 🔐 Authentication Flow

```text
Register
   │
   ▼
Hash Password
   │
   ▼
Store User
   │
   ▼
Login
   │
   ▼
Verify Password
   │
   ▼
Generate JWT
   │
   ▼
Frontend Stores Token
   │
   ▼
Authenticated API Requests
```

JWT middleware verifies the token before allowing access to protected resources.

---

## 💾 Data Persistence

Aivora currently uses **LowDB** with a JSON file for lightweight local persistence.

```text
database.json
      │
      ├── Users
      │
      └── Conversations
              │
              └── Messages
```

This setup keeps the project simple during development while leaving room for a future migration to a production database such as PostgreSQL or MongoDB.

---

## 📸 Screenshots

### 🏠 Aivora Interface

<img src="./assets/aivora-home.jpg" alt="Aivora AI Chatbot interface" width="100%"/>

### 💬 Conversation Workspace

<img src="./assets/aivora-chat.jpg" alt="Aivora conversation interface" width="100%"/>

### 🗂️ Chat History

<img src="./assets/aivora-sidebar.jpg" alt="Aivora conversation sidebar" width="100%"/>

> Replace the filenames above with the actual screenshots you want to showcase.

---

## 🚨 Error Handling

Aivora is designed to provide meaningful feedback when an AI provider cannot process a request.

Possible causes include:

* Invalid API key
* Missing environment variable
* Provider availability
* Usage limits
* Network problems
* Provider-side errors

Instead of exposing an unclear technical failure, the frontend can present a user-friendly error state.

---

## 🌍 Multi-Provider Strategy

One of Aivora's strongest architectural decisions is separating the product identity from the AI provider.

```text
                    ┌─────────────┐
                    │   Aivora    │
                    │   Chat UI   │
                    └──────┬──────┘
                           │
                    Provider Layer
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
         Gemini           Groq        Cerebras
```

This means **Aivora remains the product**, while Gemini, Groq and Cerebras are infrastructure providers.

That makes the application easier to evolve into a multi-model AI platform.

---

## 📈 What This Project Demonstrates

### Frontend

* React component architecture
* State management
* API integration
* Responsive UI
* Chat interface design
* Loading and error states
* Conversation navigation

### Backend

* Node.js
* Express REST APIs
* Authentication
* JWT
* Password hashing
* Protected routes
* Database persistence
* AI provider integration

### Software Engineering

* Environment configuration
* Separation of frontend/backend responsibilities
* API-driven architecture
* User-scoped resources
* Extensible provider architecture

---

## 🗺️ Roadmap

### ✅ Completed

* [x] React + Vite frontend
* [x] Express backend
* [x] AI integration
* [x] User registration
* [x] User login
* [x] JWT authentication
* [x] Password hashing
* [x] Persistent conversations
* [x] Conversation sidebar
* [x] Create conversation
* [x] Open conversation
* [x] Delete conversation
* [x] Multi-provider architecture
* [x] API health endpoint

### 🚧 Planned

* [ ] Streaming AI responses
* [ ] Markdown rendering
* [ ] Code syntax highlighting
* [ ] Message regeneration
* [ ] Rename conversations
* [ ] Search conversations
* [ ] Dark / Light theme
* [ ] Voice input
* [ ] Voice output
* [ ] File uploads
* [ ] Image understanding
* [ ] Advanced model selection
* [ ] Production database
* [ ] Usage analytics
* [ ] Rate limiting
* [ ] Deployment pipeline

---

## 🚀 Future Vision

Aivora can evolve into a complete AI SaaS platform:

```text
                    AIVORA
                      │
          ┌───────────┴───────────┐
          │                       │
      AI Chat                 AI Tools
          │                       │
          ▼                       ▼
   Multiple Models          File Analysis
          │                  Web Search
          │                  Voice AI
          ▼                       │
   User Dashboard ◄───────────────┘
          │
          ▼
    Usage Analytics
          │
          ▼
   Subscription System
          │
          ▼
      AI SaaS 🚀
```

---

## 🤝 Contributing

Contributions, ideas and improvements are welcome.

```bash
git checkout -b feature/your-feature
```

```bash
git add .
```

```bash
git commit -m "feat: add your feature"
```

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

This project is intended primarily as a portfolio and learning project.

If you plan to reuse the code commercially, review and define an explicit license for the repository.

---

## 👩‍💻 Author

<div align="center">

### Jawa Sakher

**Frontend Developer | React | WordPress**

Building modern, responsive and user-focused web experiences.

<br/>

<a href="https://github.com/jawasakher">
<img src="https://img.shields.io/badge/GitHub-jawasakher-181717?style=for-the-badge&logo=github"/>
</a>

</div>

---

## ⭐ Support

If you like **Aivora**, consider giving the repository a ⭐.

<div align="center">

### Built with Jawa using React, Node.js & AI

**Aivora — Conversations, reimagined.**

</div>

