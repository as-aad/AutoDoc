import { NextResponse } from 'next/server';
import { BookingModel } from '@/models/booking.model';
import { RequestModel } from '@/models/request.model';
import { GarageModel } from '@/models/garage.model';
import { initDatabase, sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();
    const { bookingId, vehicleId, title, description, category, ownerId, ownerName } = body;

    if (!bookingId && !vehicleId) {
      return NextResponse.json({ success: false, error: 'Missing required warranty claim fields' }, { status: 400 });
    }

    let origBooking = null;
    if (bookingId) {
      origBooking = await BookingModel.findById(bookingId);
    }

    // Resolve target garage details dynamically
    let targetGarageId = origBooking?.garageId || 'user-garage-1';
    let targetGarageName = origBooking?.garageName || 'Apex Performance Motors';

    const garageRec = (await GarageModel.findByOwnerId(targetGarageId)) || (await GarageModel.findById(targetGarageId));
    if (garageRec) {
      targetGarageId = garageRec.id;
      targetGarageName = garageRec.name;
    }

    const custId = origBooking?.customerId || ownerId || 'user-customer-1';
    const custName = origBooking?.customerName || ownerName || 'Customer';
    const custPhone = origBooking?.customerPhone || '';
    const vId = origBooking?.vehicleId || vehicleId || 'veh-1';
    const vName = origBooking?.vehicleName || (title ? title.split('-')[0]?.trim() : 'Vehicle');

    const claimTitle = title ? (title.startsWith('[WARRANTY CLAIM]') ? title : `[WARRANTY CLAIM] ${title}`) : '[WARRANTY CLAIM] Warranty Inspection & Repair';

    // 1. Create service request record marked as Warranty Claim
    const claimRequest = await RequestModel.create({
      vehicleId: vId,
      vehicleName: vName,
      ownerId: custId,
      ownerName: custName,
      title: claimTitle,
      description: description || `Warranty claim filed by customer linked to past booking #${bookingId || 'N/A'}.`,
      category: 'Warranty Claim',
      photos: [],
      location: 'San Francisco, CA',
      urgency: 'high',
    });

    // Explicitly update request status to 'booked' so customer side shows Dispatched / Booked instead of open
    await sql`UPDATE service_requests SET status = 'booked' WHERE id = ${claimRequest.id}`;

    // 2. Automatically create an active repair booking directly under the repairing garage's active jobs
    const warrantyBooking = await BookingModel.create({
      requestId: claimRequest.id,
      vehicleId: vId,
      vehicleName: vName,
      customerId: custId,
      customerName: custName,
      customerPhone: custPhone,
      garageId: targetGarageId,
      garageName: targetGarageName,
      serviceType: `[Warranty Repair] ${vName}`,
      serviceDescription: `Customer Warranty Claim (Covered under warranty). Original booking: #${bookingId || 'N/A'}. Details: ${description || 'Inspection & warranty repair request'}`,
      price: 0,
      scheduledDate: new Date().toISOString().split('T')[0],
    });

    // Also sync garage owner ID if different so it matches any query
    if (garageRec?.ownerId && garageRec.ownerId !== targetGarageId) {
      await sql`UPDATE service_bookings SET garage_id = ${garageRec.ownerId} WHERE id = ${warrantyBooking.id}`;
    }

    // Set status to 'accepted' so it displays in Active Repair Jobs tab immediately
    await BookingModel.updateStatus(warrantyBooking.id, 'accepted');

    return NextResponse.json({
      success: true,
      message: 'Warranty claim submitted! Active job created directly for repairing garage.',
      booking: warrantyBooking,
      request: claimRequest,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
