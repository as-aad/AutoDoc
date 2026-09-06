import { NextResponse } from 'next/server';
import { AuthController } from '@/controllers/auth.controller';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await AuthController.login(body.email, body.password, body.role);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
