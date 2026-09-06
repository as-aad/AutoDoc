import { NextRequest, NextResponse } from 'next/server';
import { MechanicModel } from '@/models/mechanic.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    const body = await req.json();
    const { ownerId } = body;

    if (!ownerId) {
      return NextResponse.json({ success: false, error: 'Missing ownerId parameter' }, { status: 400 });
    }

    const rejected = await MechanicModel.rejectApplication(params.id, ownerId);
    return NextResponse.json({ success: true, data: rejected });
  } catch (err: any) {
    console.error('Error rejecting mechanic application:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to reject mechanic' },
      { status: err.message?.includes('Forbidden') ? 403 : 400 }
    );
  }
}
