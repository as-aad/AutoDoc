import { NextResponse } from 'next/server';
import { OrderController } from '@/controllers/orderController';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const { getOrderByStripeSessionId } = await import('@/models/orderModel');
      const order = await getOrderByStripeSessionId(sessionId);
      return NextResponse.json({ success: true, data: order });
    }

    if (userId) {
      const result = await OrderController.myOrders(userId);
      return NextResponse.json(result);
    }

    const result = await OrderController.allOrders();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;
    const result = await OrderController.updateStatus(orderId, status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
