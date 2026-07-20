const test = require('node:test');
const assert = require('node:assert/strict');
const { createAuthStore } = require('../authStore');

test('registers a customer and logs them in', () => {
  const store = createAuthStore();

  const registered = store.registerUser({
    name: 'Ava',
    email: 'ava@example.com',
    password: 'Secret123!',
    role: 'customer'
  });

  assert.equal(registered.success, true);
  assert.equal(registered.user.role, 'customer');

  const session = store.loginUser({
    email: 'ava@example.com',
    password: 'Secret123!',
    role: 'customer'
  });

  assert.equal(session.success, true);
  assert.equal(session.user.role, 'customer');
  assert.ok(session.sessionId);
});

test('allows a separate admin login', () => {
  const store = createAuthStore();

  const session = store.adminLogin({
    email: 'admin@autodoc.com',
    password: 'Admin123!'
  });

  assert.equal(session.success, true);
  assert.equal(session.user.role, 'admin');
});

test('rejects duplicate emails', () => {
  const store = createAuthStore();

  store.registerUser({
    name: 'Nina',
    email: 'nina@example.com',
    password: 'Secret123!',
    role: 'garage_owner'
  });

  const duplicate = store.registerUser({
    name: 'Nina 2',
    email: 'nina@example.com',
    password: 'Secret123!',
    role: 'mechanic'
  });

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.message, 'Email already registered');
});
