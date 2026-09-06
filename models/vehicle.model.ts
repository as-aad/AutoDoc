import { sql } from '@/lib/db';
import { Vehicle, VehicleDocument, MaintenanceRecord, Reminder } from '@/lib/types';

export class VehicleModel {
  static async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    const rows = await sql`SELECT * FROM vehicles WHERE owner_id = ${ownerId} ORDER BY created_at DESC`;
    const result: Vehicle[] = [];

    for (const r of rows) {
      const docs = await sql`SELECT * FROM vehicle_documents WHERE vehicle_id = ${r.id}`;
      const records = await sql`SELECT * FROM maintenance_records WHERE vehicle_id = ${r.id} ORDER BY date DESC`;
      const bookingRows = await sql`
        SELECT * FROM service_bookings 
        WHERE (vehicle_id = ${r.id} OR vehicle_name ILIKE ${'%' + (r.make || '') + '%'})
          AND status IN ('completed', 'customer_approved', 'in_progress', 'accepted', 'closed')
        ORDER BY created_at DESC
      `;

      const formattedDocs: VehicleDocument[] = docs.map((d: any) => ({
        id: d.id,
        type: d.type,
        name: d.name,
        expiryDate: d.expiry_date,
        uploadedAt: d.uploaded_at,
        fileUrl: d.file_url,
      }));

      const formattedRecords: MaintenanceRecord[] = records.map((m: any) => ({
        id: m.id,
        date: m.date,
        type: m.type,
        description: m.description,
        cost: Number(m.cost),
        garageName: m.garage_name,
        mileage: m.mileage,
      }));

      const bookingRecords: MaintenanceRecord[] = (bookingRows || []).map((b: any) => ({
        id: `maint-book-${b.id}`,
        date: b.scheduled_date || (b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        type: b.service_type || b.service_title || 'Vehicle Repair Service',
        description: b.service_description ? `${b.service_description} (Status: ${b.status})` : `Completed ${b.service_type || 'repair'} service at ${b.garage_name || 'Partner Garage'}. Status: ${b.status}`,
        cost: Number(b.price || 0),
        garageName: b.garage_name || 'Certified Garage Partner',
        mileage: r.mileage || 15000,
      }));

      const combinedRecords = [...formattedRecords, ...bookingRecords].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const currentMileage = r.mileage || 15000;

      // Generate dynamic reminders based on document expiries & mileage
      const reminders: Reminder[] = [];
      formattedDocs.forEach((d) => {
        if (d.expiryDate) {
          const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (days <= 30) {
            reminders.push({
              id: `rem-doc-${d.id}`,
              type: d.type === 'insurance' ? 'insurance' : 'inspection',
              title: `${d.name} Renewal Alert`,
              dueDate: d.expiryDate,
              daysUntil: days,
              severity: days <= 15 ? 'urgent' : 'warning',
            });
          }
        }
      });

      const deterministicVin = r.vin || `1HGCR2F83HA${(r.id || '100000').replace(/\D/g, '').padEnd(6, '0').slice(-6)}`;

      result.push({
        id: r.id,
        ownerId: r.owner_id,
        make: r.make,
        model: r.model,
        year: r.year,
        plate: r.plate,
        licensePlate: r.plate,
        color: r.color || 'Black',
        vin: deterministicVin,
        mileage: currentMileage,
        currentMileage,
        imageUrl: r.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        image: r.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        documents: formattedDocs,
        maintenanceHistory: combinedRecords,
        reminders,
      });
    }

    return result;
  }

  static async findById(id: string): Promise<Vehicle | null> {
    const rows = await sql`SELECT * FROM vehicles WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];

    const docs = await sql`SELECT * FROM vehicle_documents WHERE vehicle_id = ${r.id}`;
    const records = await sql`SELECT * FROM maintenance_records WHERE vehicle_id = ${r.id} ORDER BY date DESC`;
    const bookingRows = await sql`
      SELECT * FROM service_bookings 
      WHERE (vehicle_id = ${r.id} OR vehicle_name ILIKE ${'%' + (r.make || '') + '%'})
        AND status IN ('completed', 'customer_approved', 'in_progress', 'accepted', 'closed')
      ORDER BY created_at DESC
    `;

    const formattedDocs: VehicleDocument[] = docs.map((d: any) => ({
      id: d.id,
      type: d.type,
      name: d.name,
      expiryDate: d.expiry_date,
      uploadedAt: d.uploaded_at,
      fileUrl: d.file_url,
    }));

    const formattedRecords: MaintenanceRecord[] = records.map((m: any) => ({
      id: m.id,
      date: m.date,
      type: m.type,
      description: m.description,
      cost: Number(m.cost),
      garageName: m.garage_name,
      mileage: m.mileage,
    }));

    const bookingRecords: MaintenanceRecord[] = (bookingRows || []).map((b: any) => ({
      id: `maint-book-${b.id}`,
      date: b.scheduled_date || (b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      type: b.service_type || b.service_title || 'Vehicle Repair Service',
      description: b.service_description ? `${b.service_description} (Status: ${b.status})` : `Completed ${b.service_type || 'repair'} service at ${b.garage_name || 'Partner Garage'}. Status: ${b.status}`,
      cost: Number(b.price || 0),
      garageName: b.garage_name || 'Certified Garage Partner',
      mileage: r.mileage || 15000,
    }));

    const combinedRecords = [...formattedRecords, ...bookingRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

      const currentMileage = r.mileage || 15000;

      const reminders: Reminder[] = [];
      formattedDocs.forEach((d) => {
        if (d.expiryDate) {
          const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (days <= 30) {
            reminders.push({
              id: `rem-doc-${d.id}`,
              type: d.type === 'insurance' ? 'insurance' : 'inspection',
              title: `${d.name} Renewal Alert`,
              dueDate: d.expiryDate,
              daysUntil: days,
              severity: days <= 15 ? 'urgent' : 'warning',
            });
          }
        }
      });

      const deterministicVin = r.vin || `1HGCR2F83HA${(r.id || '100000').replace(/\D/g, '').padEnd(6, '0').slice(-6)}`;

      return {
        id: r.id,
        ownerId: r.owner_id,
        make: r.make,
        model: r.model,
        year: r.year,
        plate: r.plate,
        licensePlate: r.plate,
        color: r.color || 'Black',
        vin: deterministicVin,
        mileage: currentMileage,
        currentMileage,
        imageUrl: r.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        image: r.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        documents: formattedDocs,
        maintenanceHistory: combinedRecords,
        reminders,
      };
    }

  static async create(data: {
    ownerId: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    color?: string;
    vin?: string;
    mileage?: number;
    imageUrl?: string;
  }): Promise<Vehicle> {
    const id = `veh-${Date.now()}`;
    const color = data.color || 'Black';
    const vin = data.vin || `1HGCR2F83HA${id.replace(/\D/g, '').padEnd(6, '0').slice(-6)}`;
    const mileage = data.mileage || 15000;
    const img = data.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800';

    await sql`
      INSERT INTO vehicles (id, owner_id, make, model, year, plate, color, vin, mileage, image_url)
      VALUES (${id}, ${data.ownerId}, ${data.make}, ${data.model}, ${data.year}, ${data.plate}, ${color}, ${vin}, ${mileage}, ${img});
    `;

    return {
      id,
      ownerId: data.ownerId,
      make: data.make,
      model: data.model,
      year: data.year,
      plate: data.plate,
      licensePlate: data.plate,
      color,
      vin,
      mileage,
      currentMileage: mileage,
      imageUrl: img,
      image: img,
      documents: [],
      maintenanceHistory: [],
      reminders: [],
    };
  }

  static async addDocument(vehicleId: string, doc: Omit<VehicleDocument, 'id'>): Promise<VehicleDocument> {
    const id = `doc-${Date.now()}`;
    await sql`
      INSERT INTO vehicle_documents (id, vehicle_id, type, name, expiry_date, uploaded_at, file_url)
      VALUES (${id}, ${vehicleId}, ${doc.type}, ${doc.name}, ${doc.expiryDate}, ${doc.uploadedAt}, ${doc.fileUrl || null});
    `;
    return { id, ...doc };
  }

  static async addMaintenanceRecord(vehicleId: string, rec: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> {
    const id = `maint-${Date.now()}`;
    await sql`
      INSERT INTO maintenance_records (id, vehicle_id, date, type, description, cost, garage_name, mileage)
      VALUES (${id}, ${vehicleId}, ${rec.date}, ${rec.type}, ${rec.description}, ${rec.cost}, ${rec.garageName}, ${rec.mileage});
    `;
    return { id, ...rec };
  }

  static async delete(id: string): Promise<boolean> {
    await sql`DELETE FROM vehicle_documents WHERE vehicle_id = ${id}`;
    await sql`DELETE FROM maintenance_records WHERE vehicle_id = ${id}`;
    await sql`DELETE FROM vehicles WHERE id = ${id}`;
    return true;
  }
}
