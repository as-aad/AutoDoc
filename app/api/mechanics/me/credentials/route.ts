import { NextRequest, NextResponse } from 'next/server';
import { MechanicModel } from '@/models/mechanic.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { userId, credentialUrl } = body;

    if (!userId || !credentialUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or credentialUrl' },
        { status: 400 }
      );
    }

    const mechanic = await MechanicModel.saveCredential(userId, credentialUrl);
    return NextResponse.json({ success: true, data: mechanic });
  } catch (err: any) {
    console.error('Error saving mechanic credential:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload credential' },
      { status: 500 }
    );
  }
}
