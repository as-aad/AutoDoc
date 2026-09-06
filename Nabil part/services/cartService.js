export async function getCart(userId) {
  try {
    if (!userId) return [];
    const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('getCart error:', err);
    return [];
  }
}

export async function addToCart(userId, productId, quantity = 1) {
  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('addToCart error:', err);
    return [];
  }
}

export async function updateCartItemQuantity(id, quantity) {
  try {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('updateCartItemQuantity error:', err);
    return false;
  }
}

export async function removeCartItem(id) {
  try {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('removeCartItem error:', err);
    return false;
  }
}

export async function clearCart(userId) {
  try {
    const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('clearCart error:', err);
    return false;
  }
}
