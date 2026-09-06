import { NextRequest, NextResponse } from 'next/server';
import { MechanicModel } from '@/models/mechanic.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    const mechanic = await MechanicModel.findByUserId(userId);
    return NextResponse.json({ success: true, data: mechanic });
  } catch (err: any) {
    console.error('Error fetching mechanic profile:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { action, userId, credentialUrl, garageId, specialization } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    if (action === 'upload_credential') {
      if (!credentialUrl) {
        return NextResponse.json({ success: false, error: 'Credential URL is required' }, { status: 400 });
      }
      const mechanic = await MechanicModel.saveCredential(userId, credentialUrl);
      return NextResponse.json({ success: true, data: mechanic });
    }

    if (action === 'apply_garage') {
      if (!garageId) {
        return NextResponse.json({ success: false, error: 'Garage selection is required' }, { status: 400 });
      }
      const mechanic = await MechanicModel.applyToGarage(userId, garageId, specialization, credentialUrl);
      return NextResponse.json({ success: true, data: mechanic });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error handling mechanic profile action:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
