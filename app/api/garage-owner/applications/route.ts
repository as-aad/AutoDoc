import { NextRequest, NextResponse } from 'next/server';
import { MechanicModel } from '@/models/mechanic.model';
import { GarageModel } from '@/models/garage.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId') || 'user-garage-1';

    const garage = await GarageModel.findByOwnerId(ownerId);
    if (!garage) {
      return NextResponse.json({ success: true, data: [] });
    }

    const applications = await MechanicModel.findPendingByGarageId(garage.id);
    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    console.error('Error fetching garage owner applications:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
