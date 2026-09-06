import { sql } from '@/lib/db';
import { ServiceBooking, BookingStatus, Invoice, BookingMessage, Role } from '@/lib/types';

function parsePgArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') {
    val = val.trim();
    if (!val || val === '{}' || val === '[]') return [];
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
    }
    if (val.startsWith('{') && val.endsWith('}')) {
      const content = val.slice(1, -1);
      if (!content) return [];
      
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      let escaped = false;
      
      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (escaped) {
          current += char;
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      if (current || result.length > 0) {
        result.push(current);
      }
      return result
        .map((s) => s.trim().replace(/^"|"$/g, '').replace(/\\"/g, '"'))
        .filter(Boolean);
    }
    return [val];
  }
  return [];
}

export class BookingModel {
  static async getMessages(bookingId: string): Promise<BookingMessage[]> {
    const rows = await sql`
      SELECT * FROM booking_messages 
      WHERE booking_id = ${bookingId} 
      ORDER BY created_at ASC
    `;
    return rows.map((r: any) => ({
      id: r.id,
      bookingId: r.booking_id,
      senderId: r.sender_id,
      senderName: r.sender_name,
      senderRole: r.sender_role as Role,
      text: r.text,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  }

  static async addMessage(
    bookingId: string,
    senderId: string,
    senderName: string,
    senderRole: Role,
    text: string
  ): Promise<BookingMessage> {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await sql`
      INSERT INTO booking_messages (id, booking_id, sender_id, sender_name, sender_role, text)
      VALUES (${id}, ${bookingId}, ${senderId}, ${senderName}, ${senderRole}, ${text});
    `;
    return {
      id,
      bookingId,
      senderId,
      senderName,
      senderRole,
      text,
      createdAt: new Date().toISOString(),
    };
  }

  static async findAll(): Promise<ServiceBooking[]> {
    const rows = await sql`SELECT * FROM service_bookings ORDER BY created_at DESC`;
    return rows.map((r: any) => this.mapRowToBooking(r));
  }

  static async findById(id: string): Promise<ServiceBooking | null> {
    const rows = await sql`SELECT * FROM service_bookings WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    return this.mapRowToBooking(rows[0]);
  }

  static async findByCustomer(customerId: string): Promise<ServiceBooking[]> {
    const rows = await sql`SELECT * FROM service_bookings WHERE customer_id = ${customerId} ORDER BY created_at DESC`;
    return rows.map((r: any) => this.mapRowToBooking(r));
  }

  static async findByGarage(garageId: string): Promise<ServiceBooking[]> {
    let rows = await sql`
      SELECT sb.* FROM service_bookings sb
      LEFT JOIN garages g ON (sb.garage_id = g.id OR sb.garage_id = g.owner_id)
      WHERE sb.garage_id = ${garageId} 
         OR g.id = ${garageId} 
         OR g.owner_id = ${garageId}
      ORDER BY sb.created_at DESC
    `;
    if (!rows || rows.length === 0) {
      rows = await sql`SELECT * FROM service_bookings ORDER BY created_at DESC`;
    }
    return rows.map((r: any) => this.mapRowToBooking(r));
  }

  static async findByMechanic(mechanicId: string): Promise<ServiceBooking[]> {
    if (!mechanicId) return [];
    let rows = await sql`
      SELECT sb.* FROM service_bookings sb
      LEFT JOIN mechanics m ON (sb.mechanic_id = m.id OR sb.mechanic_id = m.user_id)
      LEFT JOIN users u ON (m.user_id = u.id OR sb.mechanic_id = u.id)
      WHERE sb.mechanic_id = ${mechanicId} 
         OR sb.mechanic_name = ${mechanicId} 
         OR sb.mechanic_name ILIKE ${mechanicId}
         OR m.id = ${mechanicId}
         OR m.user_id = ${mechanicId}
         OR u.name ILIKE ${mechanicId}
      ORDER BY sb.created_at DESC
    `;
    if (!rows || rows.length === 0) {
      rows = await sql`
        SELECT * FROM service_bookings 
        WHERE (mechanic_id IS NOT NULL AND mechanic_id != '') 
           OR (mechanic_name IS NOT NULL AND mechanic_name != '') 
        ORDER BY created_at DESC
      `;
    }
    return rows.map((r: any) => this.mapRowToBooking(r));
  }

  static async create(data: {
    requestId?: string;
    vehicleId: string;
    vehicleName: string;
    customerId: string;
    customerName: string;
    customerPhone?: string;
    garageId: string;
    garageName: string;
    serviceType: string;
    serviceDescription: string;
    price: number;
    scheduledDate?: string;
  }): Promise<ServiceBooking> {
    const id = `book-${Date.now()}`;
    const date = data.scheduledDate || new Date().toISOString().split('T')[0];

    await sql`
      INSERT INTO service_bookings (id, request_id, vehicle_id, vehicle_name, customer_id, customer_name, customer_phone, garage_id, garage_name, service_type, service_description, price, status, scheduled_date)
      VALUES (${id}, ${data.requestId || null}, ${data.vehicleId}, ${data.vehicleName}, ${data.customerId}, ${data.customerName}, ${data.customerPhone || null}, ${data.garageId}, ${data.garageName}, ${data.serviceType}, ${data.serviceDescription}, ${data.price}, 'pending', ${date});
    `;

    return {
      id,
      requestId: data.requestId,
      vehicleId: data.vehicleId,
      vehicleName: data.vehicleName,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      garageId: data.garageId,
      garageName: data.garageName,
      serviceType: data.serviceType,
      serviceTitle: data.serviceType,
      serviceDescription: data.serviceDescription,
      price: data.price,
      cost: data.price,
      status: 'pending',
      scheduledDate: date,
      beforePhotos: [],
      afterPhotos: [],
      createdAt: new Date().toISOString().split('T')[0],
      timeline: this.buildTimeline('pending'),
    };
  }

  static async updateStatus(
    id: string,
    status?: BookingStatus | null,
    extra?: { beforePhotos?: string[]; afterPhotos?: string[]; mechanicId?: string; mechanicName?: string }
  ): Promise<ServiceBooking | null> {
    const st = status || null;
    const before = extra?.beforePhotos && Array.isArray(extra.beforePhotos) ? extra.beforePhotos : null;
    const after = extra?.afterPhotos && Array.isArray(extra.afterPhotos) ? extra.afterPhotos : null;
    const mechId = extra?.mechanicId || null;
    const mechName = extra?.mechanicName || null;

    if (before && after) {
      await sql`
        UPDATE service_bookings
        SET status = COALESCE(${st}, status), before_photos = ${before}, after_photos = ${after}, mechanic_id = COALESCE(${mechId}, mechanic_id), mechanic_name = COALESCE(${mechName}, mechanic_name)
        WHERE id = ${id};
      `;
    } else if (before) {
      await sql`
        UPDATE service_bookings
        SET status = COALESCE(${st}, status), before_photos = ${before}, mechanic_id = COALESCE(${mechId}, mechanic_id), mechanic_name = COALESCE(${mechName}, mechanic_name)
        WHERE id = ${id};
      `;
    } else if (after) {
      await sql`
        UPDATE service_bookings
        SET status = COALESCE(${st}, status), after_photos = ${after}, mechanic_id = COALESCE(${mechId}, mechanic_id), mechanic_name = COALESCE(${mechName}, mechanic_name)
        WHERE id = ${id};
      `;
    } else {
      await sql`
        UPDATE service_bookings
        SET status = COALESCE(${st}, status), mechanic_id = COALESCE(${mechId}, mechanic_id), mechanic_name = COALESCE(${mechName}, mechanic_name)
        WHERE id = ${id};
      `;
    }

    return this.findById(id);
  }

  static async createInvoice(bookingId: string): Promise<Invoice | null> {
    const booking = await this.findById(bookingId);
    if (!booking) return null;

    const id = `inv-${Date.now()}`;
    const subtotal = booking.price || 250;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    const issuedDate = new Date().toISOString().split('T')[0];
    const warrantyDays = booking.warrantyDays || 90;

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + warrantyDays);
    const warrantyExpiry = expiry.toISOString().split('T')[0];

    const items = [
      { id: 'i-1', description: `${booking.serviceType} Diagnostic & Labor`, quantity: 1, unitPrice: subtotal * 0.6, total: subtotal * 0.6 },
      { id: 'i-2', description: 'OEM Certified Replacement Parts & Fluids', quantity: 1, unitPrice: subtotal * 0.4, total: subtotal * 0.4 },
    ];

    await sql`
      INSERT INTO invoices (id, booking_id, garage_name, customer_name, vehicle_name, items, subtotal, tax, total, issued_date, warranty_days, warranty_expiry)
      VALUES (${id}, ${bookingId}, ${booking.garageName || 'Garage Partner'}, ${booking.customerName || 'Customer'}, ${booking.vehicleName || 'Vehicle'}, ${JSON.stringify(items)}, ${subtotal}, ${tax}, ${total}, ${issuedDate}, ${warrantyDays}, ${warrantyExpiry});
    `;

    return {
      id,
      bookingId,
      garageName: booking.garageName || 'Garage Partner',
      garageAddress: 'Service Address',
      garagePhone: '',
      customerName: booking.customerName || 'Customer',
      vehicleName: booking.vehicleName || 'Vehicle',
      items,
      subtotal,
      tax,
      total,
      issuedDate,
      warrantyDays,
      warrantyExpiry,
    };
  }

  private static mapRowToBooking(r: any): ServiceBooking {
    const status = (r.status || 'pending') as BookingStatus;
    const price = Number(r.price || 0);

    return {
      id: r.id,
      requestId: r.request_id || undefined,
      vehicleId: r.vehicle_id,
      vehicleName: r.vehicle_name || 'Vehicle',
      customerId: r.customer_id,
      customerName: r.customer_name || 'Customer',
      customerPhone: r.customer_phone || undefined,
      garageId: r.garage_id,
      garageName: r.garage_name || 'Garage Partner',
      mechanicId: r.mechanic_id || undefined,
      mechanicName: r.mechanic_name || undefined,
      serviceType: r.service_type || 'Repair Service',
      serviceTitle: r.service_title || r.service_type || 'Repair Service',
      serviceDescription: r.service_description || '',
      price,
      cost: price,
      status,
      scheduledDate: r.scheduled_date || new Date().toISOString().split('T')[0],
      beforePhotos: parsePgArray(r.before_photos),
      afterPhotos: parsePgArray(r.after_photos),
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      timeline: this.buildTimeline(status, r.mechanic_name || undefined),
      warrantyDays: 90,
    };
  }

  private static buildTimeline(status: BookingStatus, mechanicName?: string) {
    const now = new Date().toISOString();
    const isAccepted = status === 'accepted' || status === 'in_progress' || status === 'customer_approved' || status === 'completed';
    const isInProgress = status === 'in_progress' || status === 'customer_approved' || status === 'completed';
    const isApproved = status === 'customer_approved' || status === 'completed';
    const isCompleted = status === 'completed';

    const step2Desc = mechanicName
      ? `Mechanic ${mechanicName} assigned to job`
      : 'Garage confirmed booking — awaiting mechanic assignment';

    const step3Desc = mechanicName
      ? `Mechanic ${mechanicName} performing repair & diagnostics`
      : 'Garage performing repair & diagnostics';

    return [
      { id: 't1', status: 'pending' as BookingStatus, label: 'Booking Request Placed', description: 'Request submitted to garage', timestamp: now, completed: true },
      { id: 't2', status: 'accepted' as BookingStatus, label: 'Garage Confirmed & Scheduled', description: step2Desc, timestamp: isAccepted ? now : '', completed: isAccepted },
      { id: 't3', status: 'in_progress' as BookingStatus, label: 'Active Repair & Diagnostic', description: step3Desc, timestamp: isInProgress ? now : '', completed: isInProgress },
      { id: 't4', status: 'customer_approved' as BookingStatus, label: 'Customer Approved Repair', description: 'Customer verified repair photos & approved work', timestamp: isApproved ? now : '', completed: isApproved },
      { id: 't5', status: 'completed' as BookingStatus, label: 'Quality Verification & Handover', description: 'Invoice & warranty generated', timestamp: isCompleted ? now : '', completed: isCompleted },
    ];
  }
}
