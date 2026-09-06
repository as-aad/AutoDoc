export async function getMyOrders(userId) {
  try {
    if (!userId) return [];
    const res = await fetch(`/api/orders/my-orders?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('getMyOrders error:', err);
    return [];
  }
}

export async function getAllOrders() {
  try {
    const res = await fetch('/api/orders');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('getAllOrders error:', err);
    return [];
  }
}

export async function getOrderBySessionId(sessionId) {
  try {
    const res = await fetch(`/api/orders?sessionId=${encodeURIComponent(sessionId)}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('getOrderBySessionId error:', err);
    return null;
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return null;
  }
}

export async function fulfillManualOrder(sessionId, paymentIntentId = null) {
  try {
    const res = await fetch('/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'fulfill_manual', sessionId, paymentIntentId }),
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('fulfillManualOrder error:', err);
    return null;
  }
}
