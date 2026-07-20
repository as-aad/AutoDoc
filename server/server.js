const express = require('express');
const cors = require('cors');
const { createAuthStore } = require('./authStore');

const app = express();
const PORT = 3001;
const authStore = createAuthStore();

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Node.js server!' });
});

app.post('/api/auth/register', (req, res) => {
  const result = authStore.registerUser(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
});

app.post('/api/auth/login', (req, res) => {
  const result = authStore.loginUser(req.body);
  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

app.post('/api/auth/admin/login', (req, res) => {
  const result = authStore.adminLogin(req.body);
  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

app.get('/api/auth/session', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(401).json({ success: false, message: 'Missing session id' });
  }

  const session = authStore.getSession(sessionId);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Invalid session' });
  }

  res.json({ success: true, session });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
