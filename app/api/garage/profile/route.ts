import { NextResponse } from 'next/server';
import { GarageModel } from '@/models/garage.model';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('ownerId') || 'user-garage-1';
    const garage = await GarageModel.findByOwnerId(ownerId);
    return NextResponse.json({ success: true, data: garage });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ownerId, name, address, phone, email, specialties, imageUrl, coverUrl } = body;
    const targetOwnerId = ownerId || 'user-garage-1';

    const updated = await GarageModel.updateByOwnerId(targetOwnerId, {
      name,
      address,
      phone,
      email,
      specialties,
      imageUrl,
      coverUrl,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
