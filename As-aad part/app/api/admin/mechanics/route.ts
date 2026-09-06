import { NextResponse } from 'next/server';
import { MechanicModel } from '@/models/mechanic.model';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const mechanics = await MechanicModel.findAllWithGarageInfo();
    return NextResponse.json({ success: true, data: mechanics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();
    const { mechanicUserId, garageId } = body;

    if (!mechanicUserId || !garageId) {
      return NextResponse.json({ success: false, error: 'mechanicUserId and garageId are required' }, { status: 400 });
    }

    const updated = await MechanicModel.assignGarageByAdmin(mechanicUserId, garageId);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
