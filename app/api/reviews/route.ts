import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, sql } from '@/lib/db';
import { GarageModel } from '@/models/garage.model';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const garageId = searchParams.get('garageId');
    const ownerId = searchParams.get('ownerId');

    if (!garageId && !ownerId) {
      return NextResponse.json({ success: false, error: 'garageId or ownerId parameter is required' }, { status: 400 });
    }

    const stats = await GarageModel.getGarageReviewsAndStats(garageId || '', ownerId || '');
    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    console.error('Fetch reviews API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { garageId, bookingId, garageRating, mechanicRating, comment, customerName } = body;

    if (!garageId || !bookingId || !garageRating) {
      return NextResponse.json({ success: false, error: 'Missing required review fields' }, { status: 400 });
    }

    const id = `rev-${Date.now()}`;
    const gRating = Number(garageRating || 5);
    const mRating = mechanicRating ? Number(mechanicRating) : null;
    const custName = customerName || 'Customer';

    // Fetch garage name
    const garageRows = await sql`SELECT name FROM garages WHERE id = ${garageId} LIMIT 1`;
    const gName = garageRows && garageRows.length > 0 ? garageRows[0].name : '';

    await sql`
      INSERT INTO reviews (id, booking_id, garage_id, garage_name, customer_name, garage_rating, mechanic_rating, comment)
      VALUES (${id}, ${bookingId}, ${garageId}, ${gName}, ${custName}, ${gRating}, ${mRating}, ${comment || ''});
    `;

    // Recalculate average rating & review count for the garage in PostgreSQL
    const stats = await GarageModel.getGarageReviewsAndStats(garageId);
    await sql`
      UPDATE garages
      SET rating = ${stats.rating}, review_count = ${stats.reviewCount}
      WHERE id = ${garageId};
    `;

    const review = {
      id,
      bookingId,
      garageId,
      garageName: gName,
      customerName: custName,
      garageRating: gRating,
      mechanicRating: mRating || undefined,
      comment: comment || '',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: review });
  } catch (err: any) {
    console.error('Submit review API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

