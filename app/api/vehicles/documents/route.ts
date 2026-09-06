import { NextResponse } from 'next/server';
import { VehicleController } from '@/controllers/vehicle.controller';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleId, type, name, expiryDate, fileUrl } = body;

    if (!vehicleId || !name || !expiryDate) {
      return NextResponse.json({ success: false, error: 'Missing vehicleId, name, or expiryDate' }, { status: 400 });
    }

    const result = await VehicleController.uploadDocument(vehicleId, {
      type: type || 'insurance',
      name,
      expiryDate,
      fileUrl,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
