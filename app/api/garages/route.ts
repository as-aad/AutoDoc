import { NextResponse } from 'next/server';
import { GarageModel } from '@/models/garage.model';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const garages = await GarageModel.findAll();
    return NextResponse.json({ success: true, data: garages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();
    const newGarage = await GarageModel.create(body);
    return NextResponse.json({ success: true, data: newGarage });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
