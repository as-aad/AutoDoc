import { NextResponse } from 'next/server';
import { acceptQuote } from '@/services/request-service';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const booking = await acceptQuote(params.id, body.quoteId);
    return NextResponse.json({ success: true, data: booking });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
