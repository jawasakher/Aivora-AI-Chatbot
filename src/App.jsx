import { useEffect, useMemo, useRef, useState } from 'react';

const starterSuggestions = [
  'Design a home office setup for productivity and comfort under $500.',
  'How can I level up my web development expertise in 2025?',
  'Suggest some useful tools for debugging JavaScript code.',
  'Create a React JS component for a simple todo list app.',
];

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hello! I can help with coding, design ideas, productivity, and learning plans. Ask me anything.',
  },
];

const AUTH_KEY = 'gemini-chat-auth';

function App() {
  const [theme, setTheme] = useState('dark');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState('');
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [auth]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!auth?.token) return;

      try {
        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!res.ok) {
          setAuth(null);
        }
      } catch (err) {
        setAuth(null);
      }
    };

    fetchCurrentUser();
  }, [auth?.token]);

  const suggestionList = useMemo(() => starterSuggestions, []);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    const username = authForm.username.trim();
    const password = authForm.password.trim();

    if (!username || !password) {
      setAuthError('Username and password are required.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    try {
      const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAuth({ token: data.token, user: data.user });
      setAuthForm({ username: '', password: '' });
      setAuthError('');
    } catch (error) {
      setAuthError(error.message || 'Authentication failed.');
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setAuthError('');
  };

  const handleSend = async (promptText) => {
    const trimmed = (promptText || input).trim();
    if (!trimmed || !auth?.token) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAttachedFile('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from Gemini');
      }

      const reply = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply || 'No response received.',
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          text: 'Sorry, I could not connect to the Gemini API. Please add a valid GEMINI_API_KEY in the backend environment file.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  if (!auth) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-badge">Gemini AI</div>
          <h1>{authMode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p>
            {authMode === 'login'
              ? 'Sign in to continue to your chatbot dashboard.'
              : 'Create a new account to start chatting.'}
          </p>

          <div className="auth-toggle">
            <button
              type="button"
              className={authMode === 'login' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <label>
              Username
              <input
                type="text"
                value={authForm.username}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={authMode === 'login' ? 'Enter password' : 'At least 6 characters'}
              />
            </label>

            {authError && <div className="auth-error">{authError}</div>}

            <button type="submit" className="auth-button">
              {authMode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="chat-app">
        <header className="app-header">
          <div className="header-row">
            <div>
              <h1 className="heading">Hello, {auth.user.username}</h1>
              <h2 className="sub-heading">How can I help you today?</h2>
            </div>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="chat-body">
          <ul className="suggestions">
            {suggestionList.map((suggestion) => (
              <li key={suggestion} className="suggestions-item" onClick={() => handleSuggestionClick(suggestion)}>
                <p className="text">{suggestion}</p>
                <span className="material-symbols-rounded">
                  {suggestion.toLowerCase().includes('design') ? 'draw' : suggestion.toLowerCase().includes('learn') ? 'lightbulb' : suggestion.toLowerCase().includes('debug') ? 'explore' : 'code'}
                </span>
              </li>
            ))}
          </ul>

          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-row ${message.role}`}>
                <div className="message-bubble">{message.text}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message-row assistant">
                <div className="message-bubble loading">Thinking...</div>
              </div>
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>

        <div className="prompt-container">
          <div className="prompt-wrapper">
            <form className="prompt-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="prompt-input"
                placeholder="Ask Gemini"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />

              <div className="prompt-actions">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  className="action-btn material-symbols-rounded"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach file"
                >
                  attach_file
                </button>

                <button
                  type="submit"
                  className="action-btn material-symbols-rounded"
                  id="send-prompt-btn"
                  aria-label="Send message"
                >
                  arrow_upward
                </button>
              </div>
            </form>

            <button
              type="button"
              className="icon-btn material-symbols-rounded"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </button>

            <button
              type="button"
              className="icon-btn material-symbols-rounded"
              onClick={() => setMessages(initialMessages)}
              aria-label="Delete chats"
            >
              delete
            </button>
          </div>

          {attachedFile && <div className="attached-file">📎 {attachedFile}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
