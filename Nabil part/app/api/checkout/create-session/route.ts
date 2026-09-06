import { NextResponse } from 'next/server';
import { CheckoutController } from '@/controllers/checkoutController';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    const urlHeader = req.headers.get('origin') || req.headers.get('referer');
    const origin = urlHeader ? new URL(urlHeader).origin : 'http://localhost:3000';

    const result = await CheckoutController.createCheckoutSession(userId, origin);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
