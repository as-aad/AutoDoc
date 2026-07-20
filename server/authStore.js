const crypto = require('crypto');

function createAuthStore() {
  const users = [];
  const sessions = new Map();

  const createUser = ({ name, email, password, role }) => ({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString()
  });

  const registerUser = ({ name, email, password, role }) => {
    const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email already registered' };
    }

    const normalizedRole = role.toLowerCase();
    if (!['customer', 'mechanic', 'garage_owner'].includes(normalizedRole)) {
      return { success: false, message: 'Invalid role' };
    }

    const user = createUser({ name, email, password, role: normalizedRole });
    users.push(user);
    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  };

  const loginUser = ({ email, password, role }) => {
    const user = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password
    );

    if (!user || user.role !== role.toLowerCase()) {
      return { success: false, message: 'Invalid credentials' };
    }

    const sessionId = crypto.randomUUID();
    const session = { sessionId, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    sessions.set(sessionId, session);

    return { success: true, sessionId, user: session.user };
  };

  const adminLogin = ({ email, password }) => {
    const adminEmail = 'admin@autodoc.com';
    const adminPassword = 'Admin123!';

    if (email.toLowerCase() !== adminEmail || password !== adminPassword) {
      return { success: false, message: 'Invalid admin credentials' };
    }

    const sessionId = crypto.randomUUID();
    const session = {
      sessionId,
      user: { id: 'admin', name: 'Admin', email: adminEmail, role: 'admin' }
    };
    sessions.set(sessionId, session);
    return { success: true, sessionId, user: session.user };
  };

  const getSession = (sessionId) => sessions.get(sessionId) || null;

  return { registerUser, loginUser, adminLogin, getSession };
}

module.exports = { createAuthStore };
