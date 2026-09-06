import { sql } from '../lib/db';
import { getProductById } from './productModel';

export async function getCartByUser(userId) {
  if (!userId) return [];
  const rows = await sql`
    SELECT c.id, c.user_id, c.product_id, c.quantity, c.created_at,
           p.name as product_name, p.description as product_description,
           p.price_cents as product_price_cents, p.category as product_category,
           p.image as product_image, p.stock_quantity as product_stock_quantity,
           p.is_active as product_is_active
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ${userId} AND p.is_active = true
    ORDER BY c.created_at DESC
  `;

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    productId: r.product_id,
    quantity: Number(r.quantity),
    createdAt: r.created_at,
    product: {
      id: r.product_id,
      name: r.product_name,
      description: r.product_description,
      priceCents: Number(r.product_price_cents),
      category: r.product_category,
      image: r.product_image,
      stockQuantity: Number(r.product_stock_quantity),
      isActive: r.product_is_active,
    },
  }));
}

export async function addToCart(userId, productId, quantity = 1) {
  if (!userId || !productId) throw new Error('userId and productId are required');
  const qty = Math.max(1, Number(quantity) || 1);

  // Check if item already exists in cart for this user (upsert)
  const existing = await sql`
    SELECT * FROM cart_items WHERE user_id = ${userId} AND product_id = ${productId} LIMIT 1
  `;

  if (existing && existing.length > 0) {
    const item = existing[0];
    const newQty = Number(item.quantity) + qty;
    await sql`
      UPDATE cart_items SET quantity = ${newQty} WHERE id = ${item.id}
    `;
  } else {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await sql`
      INSERT INTO cart_items (id, user_id, product_id, quantity)
      VALUES (${id}, ${userId}, ${productId}, ${qty})
    `;
  }

  return getCartByUser(userId);
}

export async function updateCartItemQuantity(id, quantity) {
  const qty = Number(quantity);
  if (qty <= 0) {
    await sql`DELETE FROM cart_items WHERE id = ${id}`;
  } else {
    await sql`UPDATE cart_items SET quantity = ${qty} WHERE id = ${id}`;
  }
  return true;
}

export async function removeCartItem(id) {
  await sql`DELETE FROM cart_items WHERE id = ${id}`;
  return true;
}

export async function clearCart(userId) {
  if (!userId) return true;
  await sql`DELETE FROM cart_items WHERE user_id = ${userId}`;
  return true;
}
