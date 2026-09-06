import Stripe from 'stripe';
import { initDatabase, sql } from '../lib/db';
import { getCartByUser } from '../models/cartModel';
import { createOrderFromCart, getOrderById } from '../models/orderModel';

export class CheckoutController {
  static async createCheckoutSession(userId, originUrl = 'http://localhost:3000') {
    await initDatabase();

    if (!userId) {
      return { success: false, error: 'User ID is required to checkout' };
    }

    const cart = await getCartByUser(userId);
    if (!cart || cart.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    // 1. Create PENDING Order + OrderItems in DB
    const order = await createOrderFromCart(userId, cart);

    const apiKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = originUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (apiKey && !apiKey.includes('sk_test_placeholder')) {
      try {
        const stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });

        const lineItems = cart.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              description: item.product.description || undefined,
              images: item.product.image ? [item.product.image] : undefined,
            },
            unit_amount: item.product.priceCents,
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: lineItems,
          success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
          client_reference_id: order.id,
          metadata: {
            orderId: order.id,
            userId,
          },
        });

        // Store stripe session ID on order
        await sql`
          UPDATE orders
          SET stripe_checkout_session_id = ${session.id}
          WHERE id = ${order.id}
        `;

        return {
          success: true,
          url: session.url,
          sessionId: session.id,
          orderId: order.id,
        };
      } catch (stripeErr) {
        console.error('Stripe Checkout Error:', stripeErr);
        // Fallback simulation if Stripe fails (e.g. invalid test key)
        return this.simulateCheckout(order, baseUrl);
      }
    } else {
      // Return simulated Stripe checkout URL for test mode without live Stripe key
      return this.simulateCheckout(order, baseUrl);
    }
  }

  static async simulateCheckout(order, baseUrl) {
    const mockSessionId = `cs_test_${order.id}_${Date.now()}`;
    await sql`
      UPDATE orders
      SET stripe_checkout_session_id = ${mockSessionId}
      WHERE id = ${order.id}
    `;

    return {
      success: true,
      url: `${baseUrl}/checkout/success?session_id=${mockSessionId}&mock=true`,
      sessionId: mockSessionId,
      orderId: order.id,
      mock: true,
    };
  }
}
