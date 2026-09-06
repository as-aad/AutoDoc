export async function createCheckoutSession(userId) {
  try {
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('createCheckoutSession error:', err);
    return { success: false, error: err.message };
  }
}
