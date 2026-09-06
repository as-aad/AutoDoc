/**
 * @param {string|null} [category]
 * @param {string|null} [search]
 * @param {boolean} [admin]
 */
export async function getProducts(category = null, search = null, admin = false) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All' && category !== 'all') {
      params.append('category', category);
    }
    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }
    if (admin) {
      params.append('admin', 'true');
    }

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('getProducts error:', err);
    return [];
  }
}

/**
 * @param {string} id
 */
export async function getProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('getProduct error:', err);
    return null;
  }
}

export async function createProduct(data) {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (err) {
    console.error('createProduct error:', err);
    return null;
  }
}

export async function updateProduct(id, data) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (err) {
    console.error('updateProduct error:', err);
    return null;
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.error('deleteProduct error:', err);
    return false;
  }
}
