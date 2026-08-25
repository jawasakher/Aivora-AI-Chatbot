# 🤖 Gemini AI Chatbot

<div align="center">

<img src="./assets/banner.svg" alt="Gemini AI Chatbot Banner" width="100%"/>

### 🚀 Modern AI Chatbot powered by Google Gemini

A modern, responsive and interactive AI chatbot built with **React + Vite**, designed to provide a clean conversational experience with Google Gemini API.

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini"/>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-project-structure">Structure</a>
</p>

</div>

---

## ✨ Overview

**Gemini AI Chatbot** is a modern AI-powered conversational interface that connects users with Google's Gemini models.

The project focuses on combining:

* 🎨 Clean modern UI
* ⚡ Fast React architecture
* 🤖 AI-powered conversations
* 📱 Responsive design
* 🔐 Environment-based API configuration
* 🛡️ Graceful API error handling
* 🌍 Clear handling of regional/API availability issues

The goal is to create an AI chatbot that feels simple, fast and professional while remaining easy to extend.

---

## 🎯 Why This Project?

AI applications are becoming an essential part of modern web development.

This project demonstrates how to build a complete frontend AI experience while working with:

```text
React
   ↓
User Interface
   ↓
Conversation State
   ↓
Gemini API
   ↓
AI Response
   ↓
Rendered Chat Message
```

It also demonstrates practical handling of situations where the AI provider may be unavailable because of **API restrictions, regional availability or configuration problems**.

---

## 🚀 Features

### 💬 AI Conversation

* Real-time conversational interface
* Send messages to Gemini
* Display AI responses
* Conversation history
* Loading states
* Error states

### 🎨 Modern UI

* Clean interface
* Responsive layout
* Modern typography
* Interactive elements
* Smooth user experience
* Mobile-friendly design

### ⚡ Performance

* Powered by Vite
* Component-based React architecture
* Lightweight frontend
* Fast development environment

### 🛡️ Error Handling

The application is designed to avoid leaving the user with an unclear connection error.

Instead, API failures can be presented with a meaningful message such as:

> Gemini API is currently unavailable in your region or the API configuration is invalid.

This makes the application easier to understand and debug.

### 🔐 Environment Variables

Sensitive API configuration is kept outside the source code using environment variables.

---

## 🧠 Application Architecture

<img src="./assets/architecture.svg" alt="Application Architecture" width="100%"/>

The application follows a simple architecture:

```text
┌─────────────────────┐
│       User          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    React UI         │
│                     │
│ Chat / Input / UI   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Application Logic  │
│                     │
│ State / Requests    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Gemini API       │
│                     │
│   Google Gemini     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    AI Response      │
└─────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| ⚛️ React      | User interface              |
| ⚡ Vite        | Development & build tooling |
| 🟨 JavaScript | Application logic           |
| 🤖 Gemini API | Artificial intelligence     |
| 🎨 CSS        | Styling                     |
| 🔧 Git        | Version control             |
| 🐙 GitHub     | Source code hosting         |

---

## 📸 Screenshots

### 💬 Chat Interface

<img src="./assets/chatbot-1.png" alt="Gemini AI Chatbot" width="100%"/>

### 🤖 AI Conversation

<img src="./assets/chatbot-2.png" alt="AI Conversation" width="100%"/>

> Replace the image filenames above with your actual screenshots if their names are different.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/jawasakher/Gemini-AL-Chatbot.git
```

### 2. Navigate to the project

```bash
cd Gemini-AL-Chatbot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available locally through the URL shown by Vite.

---

## 🔑 Gemini API Configuration

The application requires a Gemini API key.

Your environment file should look like:

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### ⚠️ Important

Never commit your real API key to GitHub.

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
```

---

## 🌍 API Availability & Error Handling

One of the practical challenges when working with AI APIs is that availability can depend on:

* 🌍 Geographic region
* 🔐 API configuration
* 💳 Billing configuration
* 📊 Usage limits
* 🔑 Invalid or expired API keys
* 🚦 Provider-side restrictions

Instead of showing a generic:

```text
Failed to fetch
```

the application should provide a more understandable user-facing error.

Example:

```text
⚠️ Gemini API is currently unavailable.

The service may be unavailable in your region,
or the API configuration may need to be checked.
```

This makes debugging much easier for both developers and users.

---

## 📁 Project Structure

```text
Gemini-AL-Chatbot/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── assets/
│   ├── banner.svg
│   ├── architecture.svg
│   ├── chatbot-1.png
│   └── chatbot-2.png
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

> Update the structure above if your current folders differ.

---

## 🔄 Application Flow

<img src="./assets/flow.svg" alt="Application Flow" width="100%"/>

```text
User opens application
        │
        ▼
   Chat interface
        │
        ▼
 User writes message
        │
        ▼
 Request sent to Gemini
        │
        ├───────────────┐
        │               │
        ▼               ▼
     Success          Error
        │               │
        ▼               ▼
 AI response      Friendly error
        │               │
        └───────┬───────┘
                ▼
          Update the UI
```

---

## 📊 Key Development Concepts

This project demonstrates practical experience with:

### React

* Components
* Props
* State management
* Event handling
* Conditional rendering
* API requests

### JavaScript

* Async / Await
* Promises
* Error handling
* Fetch API
* Array methods
* Modern ES6+ syntax

### API Integration

* REST API communication
* Authentication using API keys
* Request handling
* Response processing
* Error handling

### Frontend Engineering

* Responsive layouts
* Component organization
* UX-focused error states
* Loading states
* Clean UI architecture

---

## 🧪 Development

Run the development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🏗️ Production Build

Before deploying:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

You can then deploy the project using your preferred hosting provider.

---

## 🔮 Roadmap

* [x] Gemini API integration
* [x] Responsive chatbot UI
* [x] AI message rendering
* [x] Error handling
* [x] Environment variables
* [ ] Markdown response rendering
* [ ] Code syntax highlighting
* [ ] Conversation persistence
* [ ] Multiple AI models
* [ ] Dark / Light mode
* [ ] Voice input
* [ ] Voice responses
* [ ] Authentication
* [ ] Chat history
* [ ] Streaming responses
* [ ] Backend API layer

---

## 💡 Future Improvements

The project can be expanded into a complete AI SaaS platform.

Possible improvements include:

```text
Authentication
      ↓
User Dashboard
      ↓
Conversation History
      ↓
Multiple AI Models
      ↓
Usage Analytics
      ↓
Subscription System
      ↓
AI SaaS Platform
```

---

## 🤝 Contributing

Contributions are welcome.

### Fork the project

```bash
git fork
```

### Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

### Commit your changes

```bash
git commit -m "Add amazing feature"
```

### Push the branch

```bash
git push origin feature/amazing-feature
```

Then open a Pull Request.

---

## 📄 License

This project is available for educational and portfolio purposes.

You may modify and improve the project according to your needs.

---

## 👩‍💻 Author

<div align="center">

### Jawa Sakher

**Frontend Developer | React | WordPress**

Building modern, responsive and user-focused web experiences.

<p>
  <a href="https://github.com/jawasakher">
    <img src="https://img.shields.io/badge/GitHub-jawasakher-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
</p>

</div>

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

<div align="center">

### 🤖 Built with React + Gemini

**From UI → API → AI**

</div>
