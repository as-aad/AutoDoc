import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3001/api';

function getTabSessionKey() {
  return `autodoc-session-${window.location.pathname}`;
}

function App() {
  const [mode, setMode] = useState('register');
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('Choose a flow to continue.');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const tabKey = getTabSessionKey();
    const stored = sessionStorage.getItem(tabKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSession(parsed);
    }
  }, []);

  const saveSession = (data) => {
    const tabKey = getTabSessionKey();
    sessionStorage.setItem(tabKey, JSON.stringify(data));
    setSession(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Working...');

    const endpoint = mode === 'register'
      ? `${API_BASE}/auth/register`
      : mode === 'admin'
        ? `${API_BASE}/auth/admin/login`
        : `${API_BASE}/auth/login`;

    const payload = mode === 'register'
      ? { name: form.name, email: form.email, password: form.password, role }
      : mode === 'login'
        ? { email: form.email, password: form.password, role }
        : { email: form.email, password: form.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const raw = await response.text();
      let data = null;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        // not JSON — will use raw text for error messages
      }

      if (!response.ok) {
        const errMsg = (data && data.message) || raw || `Request failed with status ${response.status}`;
        throw new Error(errMsg);
      }

      // successful response — data should be an object
      const user = data && data.user ? data.user : { email: form.email, name: form.name, role };
      const sessionId = data && data.sessionId ? data.sessionId : null;
      saveSession({ user, sessionId, role: user.role });

      setMessage(`Welcome, ${user.name || user.email}!`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const logout = () => {
    const tabKey = getTabSessionKey();
    sessionStorage.removeItem(tabKey);
    setSession(null);
    setMessage('You have logged out from this tab.');
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1>AutoDoc</h1>
        <p>Role-based access and tab-safe authentication.</p>
        <p className="status">{message}</p>

        {!session ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="toggle-row">
              <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>User Login</button>
              <button type="button" className={mode === 'admin' ? 'active' : ''} onClick={() => setMode('admin')}>Admin Login</button>
            </div>

            {mode !== 'admin' && (
              <>
                <label>
                  Name
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" required={mode === 'register'} />
                </label>

                <label>
                  Role
                  <select value={role} onChange={(event) => setRole(event.target.value)}>
                    <option value="customer">Customer</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="garage_owner">Garage Owner</option>
                  </select>
                </label>
              </>
            )}

            <label>
              Email
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>

            <label>
              Password
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </label>

            <button type="submit">{mode === 'register' ? 'Create account' : mode === 'admin' ? 'Admin sign in' : 'Sign in'}</button>
          </form>
        ) : (
          <div className="session-card">
            <h2>Signed in</h2>
            <p><strong>Name:</strong> {session.user.name}</p>
            <p><strong>Role:</strong> {session.user.role}</p>
            <p><strong>Session:</strong> {session.sessionId}</p>
            <button onClick={logout}>Log out from this tab</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
