import { NextResponse } from 'next/server';
import { BookingController } from '@/controllers/booking.controller';
import { BookingModel } from '@/models/booking.model';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const garageId = searchParams.get('garageId');
    const customerId = searchParams.get('customerId');
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    await initDatabase();

    if (garageId) {
      const bookings = await BookingModel.findByGarage(garageId);
      return NextResponse.json({ success: true, data: bookings });
    }

    if (customerId) {
      const bookings = await BookingModel.findByCustomer(customerId);
      return NextResponse.json({ success: true, data: bookings });
    }

    if (role && userId) {
      const result = await BookingController.getBookingsForUser(role, userId);
      return NextResponse.json(result);
    }

    const result = await BookingController.getAllBookings();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await BookingController.createBooking(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();
    const { id, status, mechanicName, mechanicId, beforePhotos, afterPhotos } = body;

    let finalMechanicId = mechanicId;
    let finalMechanicName = mechanicName;

    if (mechanicId || mechanicName) {
      const { MechanicModel } = await import('@/models/mechanic.model');
      let mech = mechanicId ? await MechanicModel.findById(mechanicId) : null;
      if (!mech && mechanicName) {
        const allMech = await MechanicModel.findAcceptedByGarage('');
        mech = allMech.find((m) => m.userName === mechanicName || m.userId === mechanicId) || null;
      }

      if (mech) {
        finalMechanicId = mech.userId || mech.id || mechanicId;
        finalMechanicName = mech.userName || mechanicName;

        if (mech.applicationStatus !== 'ACCEPTED') {
          return NextResponse.json(
            {
              success: false,
              error: `Cannot assign mechanic "${finalMechanicName}": Mechanic application status is ${mech.applicationStatus}. Only ACCEPTED mechanics verified by this garage can be assigned.`,
            },
            { status: 400 }
          );
        }
      }
    }

    const result = await BookingController.updateStatus(id, status, {
      beforePhotos,
      afterPhotos,
      mechanicId: finalMechanicId,
      mechanicName: finalMechanicName,
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
