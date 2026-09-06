import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, sql } from '@/lib/db';
import { MechanicModel } from '@/models/mechanic.model';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const garageId = searchParams.get('garageId') || searchParams.get('ownerId') || '';

    if (!garageId) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch mechanics with ACCEPTED application_status for this garage
    const acceptedMechanics = await MechanicModel.findAcceptedByGarage(garageId);

    // Also fetch users with role = 'mechanic'
    const mechanicUsers = await sql`
      SELECT u.id, u.name, u.email, u.phone 
      FROM users u 
      WHERE u.role = 'mechanic' AND u.status = 'active'
    `;

    const mechanicsList: { id: string; userId: string; name: string; specialization: string }[] = [];

    // Add accepted mechanics from mechanics table
    (acceptedMechanics || []).forEach((m) => {
      mechanicsList.push({
        id: m.id,
        userId: m.userId,
        name: m.userName || 'Shop Mechanic',
        specialization: m.specialization || 'General Repair',
      });
    });

    // Add active mechanic users if not already added
    (mechanicUsers || []).forEach((u: any) => {
      if (!mechanicsList.some((m) => m.userId === u.id || m.name === u.name)) {
        mechanicsList.push({
          id: `mech-${u.id}`,
          userId: u.id,
          name: u.name,
          specialization: 'Certified Shop Mechanic',
        });
      }
    });

    return NextResponse.json({ success: true, data: mechanicsList });
  } catch (err: any) {
    console.error('Fetch garage mechanics API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
