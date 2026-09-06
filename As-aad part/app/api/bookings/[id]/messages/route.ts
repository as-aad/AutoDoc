import { NextRequest, NextResponse } from 'next/server';
import { BookingModel } from '@/models/booking.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    const messages = await BookingModel.getMessages(params.id);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Error fetching booking messages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    const body = await req.json();
    const { senderId, senderName, senderRole, text } = body;

    if (!text || !senderName || !senderRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required message fields' },
        { status: 400 }
      );
    }

    const message = await BookingModel.addMessage(
      params.id,
      senderId || 'user-1',
      senderName,
      senderRole,
      text
    );

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error('Error posting booking message:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to post message' },
      { status: 500 }
    );
  }
}
