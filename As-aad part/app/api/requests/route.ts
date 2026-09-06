import { NextResponse } from 'next/server';
import { RequestController } from '@/controllers/request.controller';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const result = await RequestController.getAllRequests();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'quote') {
      const result = await RequestController.submitQuote(body);
      return NextResponse.json(result);
    }
    const result = await RequestController.createRequest(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
