import { sql } from '../lib/db';

/**
 * @param {string|null} [category]
 * @param {string|null} [search]
 */
export async function listActiveProducts(category = null, search = null) {
  let rows;
  const hasCategory = category && category !== 'all' && category !== 'All';
  const hasSearch = search && search.trim() !== '';

  if (hasCategory && hasSearch) {
    const cat = category.toLowerCase();
    const s = `%${search.trim().toLowerCase()}%`;
    rows = await sql`
      SELECT * FROM products
      WHERE is_active = true
        AND LOWER(category) = ${cat}
        AND (LOWER(name) LIKE ${s} OR LOWER(description) LIKE ${s})
      ORDER BY created_at DESC
    `;
  } else if (hasCategory) {
    const cat = category.toLowerCase();
    rows = await sql`
      SELECT * FROM products
      WHERE is_active = true
        AND LOWER(category) = ${cat}
      ORDER BY created_at DESC
    `;
  } else if (hasSearch) {
    const s = `%${search.trim().toLowerCase()}%`;
    rows = await sql`
      SELECT * FROM products
      WHERE is_active = true
        AND (LOWER(name) LIKE ${s} OR LOWER(description) LIKE ${s})
      ORDER BY created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT * FROM products
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
  }

  return (rows || []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    priceCents: Number(r.price_cents),
    category: r.category,
    image: r.image,
    stockQuantity: Number(r.stock_quantity),
    isActive: r.is_active,
    createdAt: r.created_at,
  }));
}

export async function listAllProducts() {
  const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return (rows || []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    priceCents: Number(r.price_cents),
    category: r.category,
    image: r.image,
    stockQuantity: Number(r.stock_quantity),
    isActive: r.is_active,
    createdAt: r.created_at,
  }));
}

export async function getProductById(id) {
  const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    priceCents: Number(r.price_cents),
    category: r.category,
    image: r.image,
    stockQuantity: Number(r.stock_quantity),
    isActive: r.is_active,
    createdAt: r.created_at,
  };
}

export async function createProduct(data) {
  const id = `prod-${Date.now()}`;
  const priceCents = Math.round(Number(data.priceCents || data.price * 100 || 0));
  const stock = Number(data.stockQuantity || 0);
  const image = data.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800';

  await sql`
    INSERT INTO products (id, name, description, price_cents, category, image, stock_quantity, is_active)
    VALUES (${id}, ${data.name}, ${data.description}, ${priceCents}, ${data.category}, ${image}, ${stock}, true);
  `;

  return getProductById(id);
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id);
  if (!existing) return null;

  const name = data.name !== undefined ? data.name : existing.name;
  const description = data.description !== undefined ? data.description : existing.description;
  const priceCents = data.priceCents !== undefined ? Math.round(Number(data.priceCents)) : existing.priceCents;
  const category = data.category !== undefined ? data.category : existing.category;
  const image = data.image !== undefined ? data.image : existing.image;
  const stockQuantity = data.stockQuantity !== undefined ? Number(data.stockQuantity) : existing.stockQuantity;
  const isActive = data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive;

  await sql`
    UPDATE products
    SET name = ${name}, description = ${description}, price_cents = ${priceCents},
        category = ${category}, image = ${image}, stock_quantity = ${stockQuantity}, is_active = ${isActive}
    WHERE id = ${id};
  `;

  return getProductById(id);
}

export async function deleteProduct(id) {
  // Soft delete via isActive: false
  await sql`UPDATE products SET is_active = false WHERE id = ${id}`;
  return true;
}
