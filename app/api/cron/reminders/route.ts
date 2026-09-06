import { NextResponse } from 'next/server';
import { sql, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    
    // Query documents expiring within 15 days or already expired
    const docs = await sql`
      SELECT vd.*, v.make, v.model, v.plate, v.owner_id
      FROM vehicle_documents vd
      JOIN vehicles v ON vd.vehicle_id = v.id;
    `;

    const now = Date.now();
    const alerts: any[] = [];

    for (const d of docs) {
      if (d.expiry_date) {
        const expiryTime = new Date(d.expiry_date).getTime();
        const daysUntil = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

        if (daysUntil <= 15) {
          alerts.push({
            vehicleId: d.vehicle_id,
            vehicle: `${d.make} ${d.model} (${d.plate})`,
            document: d.name,
            type: d.type,
            expiryDate: d.expiry_date,
            daysUntil,
            severity: daysUntil <= 0 ? 'expired' : daysUntil <= 15 ? 'urgent' : 'warning',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      job: 'Automated Daily Document & Maintenance Expiry Check',
      alertsFound: alerts.length,
      alerts,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
