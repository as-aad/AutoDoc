import { NextRequest, NextResponse } from 'next/server';
import { MechanicModel } from '@/models/mechanic.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    const garageId = params.id;
    const body = await req.json();
    const { userId, specialization, credentialUrl } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    const application = await MechanicModel.applyToGarage(
      userId,
      garageId,
      specialization,
      credentialUrl
    );

    return NextResponse.json({ success: true, data: application });
  } catch (err: any) {
    console.error('Error applying to garage:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit garage application' },
      { status: 400 }
    );
  }
}
