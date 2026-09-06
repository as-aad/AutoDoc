import { sql } from '../lib/db';
import { clearCart } from './cartModel';

export async function createOrderFromCart(userId, cartItems, stripeCheckoutSessionId = null) {
  if (!userId || !cartItems || cartItems.length === 0) {
    throw new Error('User ID and non-empty cart items required');
  }

  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let totalCents = 0;

  for (const item of cartItems) {
    const priceCents = item.product?.priceCents || item.priceCents || 0;
    const qty = Number(item.quantity || 1);
    totalCents += priceCents * qty;
  }

  await sql`
    INSERT INTO orders (id, user_id, status, total_cents, stripe_checkout_session_id, created_at, updated_at)
    VALUES (${orderId}, ${userId}, 'PENDING', ${totalCents}, ${stripeCheckoutSessionId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  for (const item of cartItems) {
    const itemId = `orditem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const productId = item.productId || item.product?.id;
    const qty = Number(item.quantity || 1);
    const priceCents = item.product?.priceCents || item.priceCents || 0;

    await sql`
      INSERT INTO order_items (id, order_id, product_id, quantity, price_cents_at_purchase)
      VALUES (${itemId}, ${orderId}, ${productId}, ${qty}, ${priceCents})
    `;
  }

  return getOrderById(orderId);
}

export async function getOrderById(orderId) {
  const rows = await sql`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = ${orderId} LIMIT 1
  `;
  if (!rows || rows.length === 0) return null;
  const o = rows[0];

  const itemRows = await sql`
    SELECT oi.*, p.name as product_name, p.image as product_image, p.category as product_category
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${o.id}
  `;

  const items = itemRows.map((i) => ({
    id: i.id,
    orderId: i.order_id,
    productId: i.product_id,
    productName: i.product_name,
    productImage: i.product_image,
    productCategory: i.product_category,
    quantity: Number(i.quantity),
    priceCentsAtPurchase: Number(i.price_cents_at_purchase),
  }));

  return {
    id: o.id,
    userId: o.user_id,
    userName: o.user_name || 'Customer',
    userEmail: o.user_email || '',
    status: o.status,
    totalCents: Number(o.total_cents),
    stripeCheckoutSessionId: o.stripe_checkout_session_id,
    stripePaymentIntentId: o.stripe_payment_intent_id,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items,
  };
}

export async function getOrdersByUser(userId) {
  if (!userId) return [];
  const rows = await sql`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.user_id = ${userId}
    ORDER BY o.created_at DESC
  `;

  const orders = [];
  for (const o of rows) {
    const itemRows = await sql`
      SELECT oi.*, p.name as product_name, p.image as product_image, p.category as product_category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${o.id}
    `;

    orders.push({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name || 'Customer',
      userEmail: o.user_email || '',
      status: o.status,
      totalCents: Number(o.total_cents),
      stripeCheckoutSessionId: o.stripe_checkout_session_id,
      stripePaymentIntentId: o.stripe_payment_intent_id,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: itemRows.map((i) => ({
        id: i.id,
        orderId: i.order_id,
        productId: i.product_id,
        productName: i.product_name,
        productImage: i.product_image,
        productCategory: i.product_category,
        quantity: Number(i.quantity),
        priceCentsAtPurchase: Number(i.price_cents_at_purchase),
      })),
    });
  }

  return orders;
}

export async function getAllOrders() {
  const rows = await sql`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  const orders = [];
  for (const o of rows) {
    const itemRows = await sql`
      SELECT oi.*, p.name as product_name, p.image as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${o.id}
    `;

    orders.push({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name || 'Customer',
      userEmail: o.user_email || '',
      status: o.status,
      totalCents: Number(o.total_cents),
      stripeCheckoutSessionId: o.stripe_checkout_session_id,
      stripePaymentIntentId: o.stripe_payment_intent_id,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: itemRows.map((i) => ({
        id: i.id,
        orderId: i.order_id,
        productId: i.product_id,
        productName: i.product_name,
        productImage: i.product_image,
        quantity: Number(i.quantity),
        priceCentsAtPurchase: Number(i.price_cents_at_purchase),
      })),
    });
  }

  return orders;
}

export async function updateOrderStatus(orderId, status, stripePaymentIntentId = null) {
  if (stripePaymentIntentId) {
    await sql`
      UPDATE orders
      SET status = ${status}, stripe_payment_intent_id = ${stripePaymentIntentId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;
  } else {
    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;
  }
  return getOrderById(orderId);
}

export async function getOrderByStripeSessionId(sessionId) {
  if (!sessionId) return null;
  const rows = await sql`
    SELECT id FROM orders WHERE stripe_checkout_session_id = ${sessionId} LIMIT 1
  `;
  if (!rows || rows.length === 0) return null;
  return getOrderById(rows[0].id);
}

export async function fulfillOrder(sessionId, paymentIntentId = null) {
  const order = await getOrderByStripeSessionId(sessionId);
  if (!order) return null;

  // Idempotency check: If order is already PAID, return order without re-decrementing stock!
  if (order.status === 'PAID') {
    return order;
  }

  // Update order status to PAID
  await updateOrderStatus(order.id, 'PAID', paymentIntentId);

  // Decrement stockQuantity for each product (exactly once)
  for (const item of order.items) {
    await sql`
      UPDATE products
      SET stock_quantity = GREATEST(0, stock_quantity - ${item.quantity})
      WHERE id = ${item.productId}
    `;
  }

  // Clear user cart
  if (order.userId) {
    await clearCart(order.userId);
  }

  return getOrderById(order.id);
}
