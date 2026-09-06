import Stripe from 'stripe';
import { initDatabase } from '../lib/db';
import { fulfillOrder } from '../models/orderModel';

export class WebhookController {
  static async handleStripeWebhook(rawBody, signature) {
    await initDatabase();

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const apiKey = process.env.STRIPE_SECRET_KEY;

    let event;

    if (webhookSecret && apiKey && signature) {
      try {
        const stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        console.error('Stripe Webhook Signature Verification Failed:', err.message);
        return { success: false, status: 400, error: `Webhook Error: ${err.message}` };
      }
    } else {
      // Fallback: parse rawBody as JSON if signature verification is not configured
      try {
        event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
      } catch (e) {
        return { success: false, status: 400, error: 'Invalid JSON payload' };
      }
    }

    if (!event) {
      return { success: false, status: 400, error: 'No event received' };
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const sessionId = session.id;
      const paymentIntentId = session.payment_intent || `pi_test_${Date.now()}`;

      const fulfilled = await fulfillOrder(sessionId, paymentIntentId);
      return { success: true, status: 200, data: fulfilled };
    }

    return { success: true, status: 200, message: `Unhandled event type ${event.type}` };
  }

  static async fulfillManual(sessionId, paymentIntentId = null) {
    await initDatabase();
    const intentId = paymentIntentId || `pi_sim_${Date.now()}`;
    const order = await fulfillOrder(sessionId, intentId);
    return { success: true, data: order };
  }
}
