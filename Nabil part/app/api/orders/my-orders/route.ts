import { NextResponse } from 'next/server';
import { OrderController } from '@/controllers/orderController';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: 'userId parameter required' }, { status: 400 });
    const result = await OrderController.myOrders(userId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
