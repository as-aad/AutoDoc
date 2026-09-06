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

    const accepted = await MechanicModel.acceptApplication(params.id, ownerId);
    return NextResponse.json({ success: true, data: accepted });
  } catch (err: any) {
    console.error('Error accepting mechanic application:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to accept mechanic' },
      { status: err.message?.includes('Forbidden') ? 403 : 400 }
    );
  }
}
