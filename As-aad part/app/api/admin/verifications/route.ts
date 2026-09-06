import { NextResponse } from 'next/server';
import { GarageModel } from '@/models/garage.model';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const verifications = await GarageModel.findVerifications();
    return NextResponse.json({ success: true, data: verifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDatabase();
    const { id, status, reason } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Verification ID and status required' }, { status: 400 });
    }
    await GarageModel.updateVerificationStatus(id, status, reason);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
