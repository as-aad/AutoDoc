(async ()=>{
  try {
    const payload = { name: 'Nahiyan', email: 'ahmednahiyan2003@gmail.com', password: 'password123', role: 'garage_owner' };
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('HEADERS', Object.fromEntries(res.headers.entries()));
    console.log('BODY:\n', text);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
