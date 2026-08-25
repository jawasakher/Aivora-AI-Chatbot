import { useEffect, useMemo, useRef, useState } from 'react';

const starterSuggestions = [
  'Design a home office setup for productivity and comfort under $500.',
  'How can I level up my web development expertise in 2026?',
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

const normalizeAuth = (value) => {
  if (!value || typeof value !== 'object') return null;

  if (value.token && value.user) return value;

  if (value.username) {
    return {
      token: '',
      user: { username: value.username },
    };
  }

  return null;
};

const parseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: 'Server returned an invalid response.' };
  }
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState('');
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? normalizeAuth(JSON.parse(saved)) : null;
    } catch (error) {
      return null;
    }
  });
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
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

  const authHeaders = () => ({
    Authorization: `Bearer ${auth?.token}`,
  });

  const loadConversations = async () => {
    const response = await fetch('/api/conversations', { headers: authHeaders() });
    const data = await parseJsonSafely(response);
    if (!response.ok) throw new Error(data.error || 'Could not load conversations');
    setConversations(data.conversations || []);
    if (data.conversations?.length && !activeConversationId) {
      await openConversation(data.conversations[0].id);
    }
  };

  const openConversation = async (conversationId) => {
    const response = await fetch(`/api/conversations/${conversationId}`, { headers: authHeaders() });
    const data = await parseJsonSafely(response);
    if (!response.ok) return;
    setActiveConversationId(conversationId);
    setMessages(data.messages?.length ? data.messages : initialMessages);
  };

  const createConversation = async () => {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New conversation' }),
    });
    const data = await parseJsonSafely(response);
    if (!response.ok) return;
    setConversations((prev) => [data.conversation, ...prev]);
    setActiveConversationId(data.conversation.id);
    setMessages(initialMessages);
    setError('');
  };

  const deleteConversation = async (conversationId) => {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) return;
    const remaining = conversations.filter((conversation) => conversation.id !== conversationId);
    setConversations(remaining);
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
      setMessages(initialMessages);
    }
  };

  useEffect(() => {
    if (!auth?.token) return;
    loadConversations().catch((loadError) => setError(loadError.message));
  }, [auth?.token]);

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

      const data = await parseJsonSafely(response);

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
        body: JSON.stringify({ prompt: trimmed, conversationId: activeConversationId }),
      });

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from Gemini');
      }

      const reply = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply || 'No response received.',
      };

      setMessages((prev) => [...prev, reply]);
      if (data.conversationId && data.conversationId !== activeConversationId) {
        setActiveConversationId(data.conversationId);
      }
      await loadConversations();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          text: 'Sorry, I could not connect to an AI provider. Please add GROQ_API_KEY or CEREBRAS_API_KEY in the backend .env file.',
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
          <div className="auth-badge"><span>✦</span> Aivora AI</div>
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
      <div className="app-layout">
        <aside className="conversation-sidebar">
          <div className="sidebar-brand"><span>✦</span> Aivora</div>
          <button type="button" className="new-chat-btn" onClick={createConversation}>
            <span className="material-symbols-rounded">add</span> New conversation
          </button>
          <div className="sidebar-label">Your conversations</div>
          <div className="conversation-list">
            {conversations.length === 0 && <div className="empty-conversations">Your chats will appear here.</div>}
            {conversations.map((conversation) => (
              <div className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`} key={conversation.id}>
                <button type="button" onClick={() => openConversation(conversation.id)}>
                  <span className="material-symbols-rounded">chat_bubble</span>
                  <span>{conversation.title}</span>
                </button>
                <button type="button" className="delete-conversation material-symbols-rounded" onClick={() => deleteConversation(conversation.id)} aria-label="Delete conversation">delete</button>
              </div>
            ))}
          </div>
        </aside>

        <div className="chat-app hero-app">
        <header className="topbar">
          <div className="brand-mark"><span className="brand-spark">✦</span> Aivora <span>INTELLIGENCE STUDIO</span></div>
          <div className="topbar-actions">
            <span className="online-status"><i /> Aivora Core</span>
            <button type="button" className="icon-btn material-symbols-rounded" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))} aria-label="Toggle theme">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="hero-content">
          <div className="bot-orbit" aria-hidden="true">
            <div className="bot-antenna" />
            <div className="bot-head"><div className="bot-screen"><span>⌣</span><span>⌣</span></div></div>
            <div className="bot-neck" />
            <div className="bot-body"><b>A</b></div>
            <div className="bot-arm left" /><div className="bot-arm right" />
          </div>

          <div className="hero-copy">
            <div className="gemini-star">✦</div>
            <h1 className="hero-title">Hello, {auth.user?.username || 'there'}</h1>
            <p className="hero-subtitle">Your ideas, accelerated.</p>
            <div className="mode-chips" role="group" aria-label="Prompt modes">
              {[
                ['💬', 'Chat', 'Ask me anything'],
                ['💡', 'Explain', 'Explain this simply'],
                ['</>', 'Code', 'Help me write code'],
                ['✎', 'Write', 'Help me write'],
              ].map(([icon, label, prompt]) => (
                <button type="button" className={`mode-chip ${label.toLowerCase()}`} key={label} onClick={() => setInput(prompt)}>
                  <strong>{icon}</strong> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-body hero-chat-body">
            <div className="messages">
              {messages.length > 1 && messages.map((message) => (
                <div key={message.id} className={`message-row ${message.role}`}>
                  <div className="message-bubble">{message.text}</div>
                </div>
              ))}
              {isLoading && <div className="message-row assistant"><div className="message-bubble loading">Thinking...</div></div>}
            </div>
            {error && <div className="error-banner">{error}</div>}
          </div>

          <div className="prompt-container hero-prompt-container">
            <form className="hero-prompt" onSubmit={handleSubmit}>
              <span className="prompt-spark">✦</span>
              <input type="text" className="prompt-input" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} required />
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
              <button type="button" className="prompt-tool material-symbols-rounded" onClick={() => fileInputRef.current?.click()} aria-label="Attach file">attach_file</button>
              <button type="submit" className="send-orb material-symbols-rounded" aria-label="Send message">arrow_upward</button>
            </form>
            {attachedFile && <div className="attached-file">📎 {attachedFile}</div>}
          </div>

          <div className="suggestion-strip">
            {suggestionList.slice(0, 3).map((suggestion) => <button type="button" key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</button>)}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
