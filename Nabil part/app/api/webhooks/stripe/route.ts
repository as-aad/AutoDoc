import { NextResponse } from 'next/server';
import { WebhookController } from '@/controllers/webhookController';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    // Check if this is a manual test fulfillment request (JSON with sessionId)
    if (req.headers.get('content-type')?.includes('application/json')) {
      try {
        const json = JSON.parse(rawBody);
        if (json.action === 'fulfill_manual' && json.sessionId) {
          const res = await WebhookController.fulfillManual(json.sessionId, json.paymentIntentId);
          return NextResponse.json(res);
        }
      } catch (e) {
        // Fall back to standard Stripe webhook processing below
      }
    }

    const result = await WebhookController.handleStripeWebhook(rawBody, signature);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
