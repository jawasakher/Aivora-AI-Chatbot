import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   ENV / API KEYS
========================= */

const configuredKey = (value) => {
  if (!value) return undefined;

  const normalized = value.trim();

  if (
    !normalized ||
    normalized.startsWith('your_') ||
    normalized.includes('change_this') ||
    normalized.includes('ضع_') ||
    normalized.includes('مفتاح_')
  ) {
    return undefined;
  }

  return normalized;
};

const providerKeys = {
  openrouter: configuredKey(process.env.OPENROUTER_API_KEY),
  groq: configuredKey(process.env.GROQ_API_KEY),
  cerebras: configuredKey(process.env.CEREBRAS_API_KEY),
  gemini: configuredKey(process.env.GEMINI_API_KEY),
};

const JWT_SECRET =
  process.env.JWT_SECRET || 'change_this_secret';

/* =========================
   DATABASE
========================= */

const db = new LowSync(
  new JSONFileSync(
    path.join(__dirname, 'database.json')
  ),
  {
    users: [],
    conversations: [],
    messages: [],
  }
);

app.use(cors());
app.use(express.json());

const readDatabase = () => {
  db.read();

  db.data ||= {
    users: [],
    conversations: [],
    messages: [],
  };

  db.data.users ||= [];
  db.data.conversations ||= [];
  db.data.messages ||= [];
};

const writeDatabase = () => {
  db.write();
};

readDatabase();

/* =========================
   AUTH
========================= */

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

/* =========================
   HEALTH
========================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI backend is running',
    providers: {
      openrouter: Boolean(providerKeys.openrouter),
      groq: Boolean(providerKeys.groq),
      cerebras: Boolean(providerKeys.cerebras),
      gemini: Boolean(providerKeys.gemini),
    },
  });
});

/* =========================
   REGISTER
========================= */

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required',
    });
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return res.status(400).json({
      error: 'Username must be at least 3 characters',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters',
    });
  }

  readDatabase();

  const normalizedUsername =
    trimmedUsername.toLowerCase();

  const existing = db.data.users.find(
    (user) =>
      user.username === normalizedUsername
  );

  if (existing) {
    return res.status(409).json({
      error: 'Username already exists',
    });
  }

  const hashedPassword =
    bcrypt.hashSync(password, 10);

  const createdUser = {
    id: db.data.users.length
      ? Math.max(
          ...db.data.users.map(
            (user) => user.id
          )
        ) + 1
      : 1,

    username: normalizedUsername,
    password: hashedPassword,
    created_at: new Date().toISOString(),
  };

  db.data.users.push(createdUser);

  writeDatabase();

  const token = generateToken(createdUser);

  return res.status(201).json({
    token,
    user: {
      id: createdUser.id,
      username: createdUser.username,
    },
  });
});

/* =========================
   LOGIN
========================= */

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required',
    });
  }

  readDatabase();

  const user = db.data.users.find(
    (item) =>
      item.username ===
      username.trim().toLowerCase()
  );

  if (!user) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const matches = bcrypt.compareSync(
    password,
    user.password
  );

  if (!matches) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const token = generateToken(user);

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
});

/* =========================
   CURRENT USER
========================= */

app.get('/api/me', requireAuth, (req, res) => {
  readDatabase();

  const user = db.data.users.find(
    (item) => item.id === req.user.id
  );

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }

  return res.json({
    user: {
      id: user.id,
      username: user.username,
    },
  });
});

/* =========================
   CONVERSATIONS
========================= */

app.get(
  '/api/conversations',
  requireAuth,
  (req, res) => {
    readDatabase();

    const conversations =
      db.data.conversations
        .filter(
          (conversation) =>
            conversation.user_id ===
            req.user.id
        )
        .sort(
          (a, b) =>
            new Date(b.updated_at) -
            new Date(a.updated_at)
        );

    return res.json({
      conversations,
    });
  }
);

app.post(
  '/api/conversations',
  requireAuth,
  (req, res) => {
    const title =
      String(
        req.body.title ||
          'New conversation'
      )
        .trim()
        .slice(0, 80) ||
      'New conversation';

    readDatabase();

    const now =
      new Date().toISOString();

    const conversation = {
      id: db.data.conversations.length
        ? Math.max(
            ...db.data.conversations.map(
              (item) => item.id
            )
          ) + 1
        : 1,

      user_id: req.user.id,
      title,
      created_at: now,
      updated_at: now,
    };

    db.data.conversations.push(
      conversation
    );

    writeDatabase();

    return res.status(201).json({
      conversation,
      messages: [],
    });
  }
);

app.get(
  '/api/conversations/:id',
  requireAuth,
  (req, res) => {
    readDatabase();

    const conversation =
      db.data.conversations.find(
        (item) =>
          item.id ===
            Number(req.params.id) &&
          item.user_id === req.user.id
      );

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    const messages =
      db.data.messages.filter(
        (message) =>
          message.conversation_id ===
          conversation.id
      );

    return res.json({
      conversation,
      messages,
    });
  }
);

app.delete(
  '/api/conversations/:id',
  requireAuth,
  (req, res) => {
    readDatabase();

    const conversationId =
      Number(req.params.id);

    const conversation =
      db.data.conversations.find(
        (item) =>
          item.id === conversationId &&
          item.user_id === req.user.id
      );

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    db.data.conversations =
      db.data.conversations.filter(
        (item) =>
          item.id !== conversationId
      );

    db.data.messages =
      db.data.messages.filter(
        (message) =>
          message.conversation_id !==
          conversationId
      );

    writeDatabase();

    return res.json({
      success: true,
    });
  }
);

/* =========================
   RESPONSE PARSER
========================= */

const readResponse = async (response) => {
  const text = await response.text();

  try {
    return text
      ? JSON.parse(text)
      : {};
  } catch {
    return {};
  }
};

/* =========================
   OPENAI COMPATIBLE PROVIDERS
========================= */

const callCompatibleProvider = async (
  provider,
  prompt,
  apiKey
) => {
  const configs = {
    openrouter: {
      url:
        'https://openrouter.ai/api/v1/chat/completions',

      model:
        process.env.OPENROUTER_MODEL ||
        'openrouter/free',
    },

    groq: {
      url:
        'https://api.groq.com/openai/v1/chat/completions',

      model:
        process.env.GROQ_MODEL ||
        'openai/gpt-oss-120b',
    },

    cerebras: {
      url:
        'https://api.cerebras.ai/v1/chat/completions',

      model:
        process.env.CEREBRAS_MODEL ||
        'gpt-oss-120b',
    },
  };

  const config = configs[provider];

  if (!config) {
    throw new Error(
      `Unsupported provider: ${provider}`
    );
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] =
      'http://localhost:5173';

    headers['X-Title'] =
      'Aivora AI Chatbot';
  }

  const response = await fetch(
    config.url,
    {
      method: 'POST',
      headers,

      body: JSON.stringify({
        model: config.model,

        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],

        temperature: 0.7,
      }),
    }
  );

  const data =
    await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `${provider} request failed (${response.status})`
    );
  }

  return (
    data?.choices?.[0]?.message
      ?.content || ''
  );
};

/* =========================
   GEMINI
========================= */

const callGemini = async (
  prompt,
  apiKey
) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        contents: [
          {
            role: 'user',

            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const data =
    await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Gemini request failed (${response.status})`
    );
  }

  return (
    data?.candidates?.[0]?.content
      ?.parts
      ?.map((part) => part.text)
      .join('') || ''
  );
};

/* =========================
   CHAT
========================= */

app.post(
  '/api/chat',
  requireAuth,
  async (req, res) => {
    const {
      prompt,
      conversationId,
    } = req.body;

    if (
      !prompt ||
      !prompt.trim()
    ) {
      return res.status(400).json({
        error: 'Prompt is required',
      });
    }

    readDatabase();

    let conversation =
      db.data.conversations.find(
        (item) =>
          item.id ===
            Number(conversationId) &&
          item.user_id === req.user.id
      );

    if (!conversation) {
      const now =
        new Date().toISOString();

      conversation = {
        id: db.data.conversations.length
          ? Math.max(
              ...db.data.conversations.map(
                (item) => item.id
              )
            ) + 1
          : 1,

        user_id: req.user.id,

        title: prompt
          .trim()
          .slice(0, 54),

        created_at: now,
        updated_at: now,
      };

      db.data.conversations.push(
        conversation
      );
    }

    const userMessage = {
      id: db.data.messages.length
        ? Math.max(
            ...db.data.messages.map(
              (item) => item.id
            )
          ) + 1
        : 1,

      conversation_id:
        conversation.id,

      role: 'user',

      text: prompt.trim(),

      created_at:
        new Date().toISOString(),
    };

    db.data.messages.push(
      userMessage
    );

    conversation.updated_at =
      userMessage.created_at;

    writeDatabase();

    /* =========================
       PROVIDER PRIORITY
       OpenRouter → Groq → Cerebras → Gemini
    ========================= */

    const providers = [
      [
        'openrouter',
        providerKeys.openrouter,
      ],

      [
        'groq',
        providerKeys.groq,
      ],

      [
        'cerebras',
        providerKeys.cerebras,
      ],

      [
        'gemini',
        providerKeys.gemini,
      ],
    ].filter(
      ([, key]) => Boolean(key)
    );

    if (!providers.length) {
      return res.status(500).json({
        error:
          'No AI provider is configured. Check your .env file.',
      });
    }

    const failures = [];

    for (
      const [provider, apiKey]
      of providers
    ) {
      try {
        console.log(
          `Trying AI provider: ${provider}`
        );

        const reply =
          provider === 'gemini'
            ? await callGemini(
                prompt.trim(),
                apiKey
              )
            : await callCompatibleProvider(
                provider,
                prompt.trim(),
                apiKey
              );

        if (!reply) {
          failures.push(
            `${provider}: empty response`
          );

          continue;
        }

        /* SAVE ASSISTANT MESSAGE */

        readDatabase();

        conversation =
          db.data.conversations.find(
            (item) =>
              item.id ===
              conversation.id
          );

        const assistantMessage = {
          id: db.data.messages.length
            ? Math.max(
                ...db.data.messages.map(
                  (item) => item.id
                )
              ) + 1
            : 1,

          conversation_id:
            conversation.id,

          role: 'assistant',

          text: reply,

          created_at:
            new Date().toISOString(),
        };

        db.data.messages.push(
          assistantMessage
        );

        conversation.updated_at =
          assistantMessage.created_at;

        writeDatabase();

        /* =========================
           STREAM RESPONSE
        ========================= */

        res.status(200);

        res.setHeader(
          'Content-Type',
          'application/x-ndjson; charset=utf-8'
        );

        res.setHeader(
          'Cache-Control',
          'no-cache'
        );

        res.setHeader(
          'Connection',
          'keep-alive'
        );

        const chunkSize = 32;

        for (
          let index = 0;
          index < reply.length;
          index += chunkSize
        ) {
          res.write(
            `${JSON.stringify({
              type: 'chunk',
              text: reply.slice(
                index,
                index + chunkSize
              ),
            })}\n`
          );

          await new Promise(
            (resolve) =>
              setTimeout(resolve, 18)
          );
        }

        res.write(
          `${JSON.stringify({
            type: 'done',
            provider,
            conversationId:
              conversation.id,
          })}\n`
        );

        return res.end();

      } catch (error) {
        failures.push(
          `${provider}: ${error.message}`
        );

        console.error(
          `${provider} API error:`,
          error.message
        );
      }
    }

    return res.status(502).json({
      error:
        `All configured AI providers failed. ${failures.join(
          ' | '
        )}`,
    });
  }
);

/* =========================
   START SERVER
========================= */

app.listen(
  PORT,
  () => {
    console.log(
      `Backend running on http://localhost:${PORT}`
    );

    console.log(
      'Configured AI providers:',
      Object.entries(providerKeys)
        .filter(([, key]) => key)
        .map(([name]) => name)
        .join(', ') ||
        'none'
    );
  }
);
