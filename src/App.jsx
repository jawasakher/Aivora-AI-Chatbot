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

const demoReplies = {
  default: 'This is a working React chatbot UI. To connect it to a real Gemini API, add your API key and call the Gemini endpoint from your backend or frontend using fetch.',
  coding: 'A clean approach is to break the task into requirements, plan the component structure, and then implement and test each part incrementally.',
  design: 'For a productive home office, focus on ergonomic seating, proper lighting, cable management, and a layout that supports deep work.',
  learning: 'To improve in 2025, combine practical projects, JavaScript/React fundamentals, debugging practice, and a consistent learning schedule.',
  tools: 'Useful tools include Chrome DevTools, ESLint, Prettier, React DevTools, Postman, and browser performance profilers.',
  todo: 'A simple todo component usually includes state for items, input handling, add action, toggle completion, and delete action.',
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const suggestionList = useMemo(() => starterSuggestions, []);

  const getAssistantReply = (prompt) => {
    const normalized = prompt.toLowerCase();

    if (normalized.includes('design') || normalized.includes('office') || normalized.includes('workspace')) {
      return demoReplies.design;
    }
    if (normalized.includes('web development') || normalized.includes('learn') || normalized.includes('2025')) {
      return demoReplies.learning;
    }
    if (normalized.includes('debug') || normalized.includes('javascript') || normalized.includes('tool')) {
      return demoReplies.tools;
    }
    if (normalized.includes('react') || normalized.includes('todo') || normalized.includes('component')) {
      return demoReplies.todo;
    }
    if (normalized.includes('code') || normalized.includes('coding') || normalized.includes('program')) {
      return demoReplies.coding;
    }

    return demoReplies.default;
  };

  const handleSend = (promptText) => {
    const trimmed = (promptText || input).trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAttachedFile('');
    setIsLoading(true);

    window.setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        role: 'assistant',
        text: getAssistantReply(trimmed),
      };

      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 650);
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

  return (
    <div className="app-shell">
      <div className="chat-app">
        <header className="app-header">
          <h1 className="heading">Hello, there</h1>
          <h2 className="sub-heading">How can I help you today?</h2>
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
