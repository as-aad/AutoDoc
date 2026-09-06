import { NextResponse } from 'next/server';
import { AuthController } from '@/controllers/auth.controller';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, status, reason } = body;
    if (!userId || !status) {
      return NextResponse.json({ success: false, error: 'Missing userId or status' }, { status: 400 });
    }
    const result = await AuthController.setAccountStatus(userId, status, reason);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
