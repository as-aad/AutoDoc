import { NextResponse } from 'next/server';
import { OrderController } from '@/controllers/orderController';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await OrderController.getOne(params.id);
    if (!result.success) return NextResponse.json(result, { status: 404 });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
