import { Garage, Review, Invoice } from '@/lib/types';
import { GarageModel } from '@/models/garage.model';
import { initDatabase, sql } from '@/lib/db';

export async function getGarage(id: string): Promise<Garage | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/garages`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const match = data.data.find((g: Garage) => g.id === id);
        if (match) return match;
      }
    } catch (e) {
      console.warn('getGarage API fetch error:', e);
    }
  }
  await initDatabase();
  const rows = await sql`SELECT owner_id FROM garages WHERE id = ${id} LIMIT 1`;
  if (rows && rows.length > 0) {
    return GarageModel.findByOwnerId(rows[0].owner_id);
  }
  return GarageModel.findByOwnerId(id);
}

export async function getGarageByOwner(ownerId: string): Promise<Garage | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/garage/profile?ownerId=${encodeURIComponent(ownerId)}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('getGarageByOwner API fetch error:', e);
    }
  }
  await initDatabase();
  return GarageModel.findByOwnerId(ownerId);
}

export async function updateGarageProfile(data: Partial<Garage> & { ownerId?: string }): Promise<Garage | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/garage/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.data) return result.data;
    } catch (e) {
      console.error('updateGarageProfile API error:', e);
    }
  }
  await initDatabase();
  const targetId = data.ownerId || 'user-garage-1';
  return GarageModel.updateByOwnerId(targetId, data);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings/${id}/invoice`, { cache: 'no-store' });
      const result = await res.json();
      if (result.success && result.data) return result.data;
    } catch (e) {
      console.warn('getInvoice fetch error:', e);
    }
  }
  await initDatabase();
  const rows = await sql`SELECT * FROM invoices WHERE id = ${id} OR booking_id = ${id} LIMIT 1`;
  if (!rows || rows.length === 0) {
    const bookingRows = await sql`SELECT * FROM service_bookings WHERE id = ${id} LIMIT 1`;
    if (bookingRows && bookingRows.length > 0) {
      const bk = bookingRows[0];
      const subtotalDollar = Number(bk.price || 250);
      const taxDollar = Math.round(subtotalDollar * 0.08 * 100) / 100;
      const totalDollar = subtotalDollar + taxDollar;
      const warrantyDaysNum = 90;
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + warrantyDaysNum);

      return {
        id: `inv-${bk.id}`,
        bookingId: bk.id,
        invoiceNumber: `INV-2026-${String(bk.id).slice(-5)}`,
        laborCostCents: Math.round(subtotalDollar * 100),
        partsCostJson: '[]',
        totalCents: Math.round(totalDollar * 100),
        warrantyMonths: 3,
        pdfUrl: `/uploads/invoices/inv-${bk.id}.pdf`,
        issuedByUserId: bk.garage_id || 'system',
        issuedAt: new Date().toISOString(),
        garageName: bk.garage_name || 'Apex Performance Motors',
        garageAddress: '100 Auto Plaza Way, San Francisco, CA',
        garagePhone: '+1 (415) 555-0100',
        customerName: bk.customer_name || 'Customer',
        vehicleName: bk.vehicle_name || 'Vehicle',
        items: [
          { id: 'i-1', description: `${bk.service_type || 'Repair Job'} Diagnostic & Labor`, quantity: 1, unitPrice: subtotalDollar * 0.6, total: subtotalDollar * 0.6 },
          { id: 'i-2', description: 'OEM Certified Replacement Parts & Fluids', quantity: 1, unitPrice: subtotalDollar * 0.4, total: subtotalDollar * 0.4 },
        ],
        subtotal: subtotalDollar,
        tax: taxDollar,
        total: totalDollar,
        issuedDate: new Date().toISOString().split('T')[0],
        warrantyDays: warrantyDaysNum,
        warrantyExpiry: expDate.toISOString().split('T')[0],
      };
    }
    return null;
  }
  const r = rows[0];
  const subtotalDollar = Number(r.subtotal || 0) || (Number(r.total_cents || 0) > 0 ? Number(r.total_cents) / 100 : 250);
  const taxDollar = Number(r.tax || 0) || Math.round(subtotalDollar * 0.08 * 100) / 100;
  const totalDollar = Number(r.total || 0) || (subtotalDollar + taxDollar);

  let rawItems = [];
  try {
    rawItems = typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []);
  } catch (e) {
    rawItems = [];
  }

  if (!rawItems || rawItems.length === 0) {
    rawItems = [
      { id: 'i-1', description: 'Diagnostic & Repair Labor', quantity: 1, unitPrice: subtotalDollar * 0.6, total: subtotalDollar * 0.6 },
      { id: 'i-2', description: 'OEM Replacement Parts & Consumables', quantity: 1, unitPrice: subtotalDollar * 0.4, total: subtotalDollar * 0.4 },
    ];
  }

  return {
    id: r.id,
    bookingId: r.booking_id,
    invoiceNumber: r.invoice_number || `INV-2026-${String(r.id).slice(-5)}`,
    laborCostCents: Number(r.labor_cost_cents || Math.round(subtotalDollar * 100)),
    partsCostJson: r.parts_cost_json || '[]',
    totalCents: Number(r.total_cents || Math.round(totalDollar * 100)),
    warrantyMonths: Number(r.warranty_months || 3),
    pdfUrl: r.pdf_url || `/uploads/invoices/${r.invoice_number || r.id}.pdf`,
    issuedByUserId: r.issued_by_user_id || 'system',
    issuedAt: r.issued_at || new Date().toISOString(),
    garageName: r.garage_name || 'Apex Performance Motors',
    garageAddress: '100 Auto Plaza Way, San Francisco, CA',
    garagePhone: '+1 (415) 555-0100',
    customerName: r.customer_name || 'Customer',
    vehicleName: r.vehicle_name || 'Vehicle',
    items: rawItems,
    subtotal: subtotalDollar,
    tax: taxDollar,
    total: totalDollar,
    issuedDate: r.issued_date || (r.issued_at ? new Date(r.issued_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    warrantyDays: Number(r.warranty_days || 90),
    warrantyExpiry: r.warranty_expiry || '',
  };
}

export async function getInvoiceByBooking(bookingId: string): Promise<Invoice | null> {
  return getInvoice(bookingId);
}

export async function submitReview(
  garageId: string,
  bookingId: string,
  garageRating: number,
  mechanicRating: number | undefined,
  comment: string,
  customerName: string
): Promise<Review> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId, bookingId, garageRating, mechanicRating, comment, customerName }),
      });
      const result = await res.json();
      if (result.success && result.data) return result.data;
    } catch (e) {
      console.error('submitReview fetch error:', e);
    }
  }
  await initDatabase();
  const id = `rev-${Date.now()}`;
  await sql`
    INSERT INTO reviews (id, booking_id, garage_id, garage_name, customer_name, garage_rating, mechanic_rating, comment)
    VALUES (${id}, ${bookingId}, ${garageId}, '', ${customerName}, ${garageRating}, ${mechanicRating || null}, ${comment});
  `;
  const stats = await GarageModel.getGarageReviewsAndStats(garageId);
  await sql`
    UPDATE garages
    SET rating = ${stats.rating}, review_count = ${stats.reviewCount}
    WHERE id = ${garageId};
  `;
  return {
    id,
    bookingId,
    garageId,
    garageName: '',
    customerName,
    garageRating,
    mechanicRating,
    comment,
    createdAt: new Date().toISOString(),
  };
}

export async function getGarageReviews(garageId: string): Promise<{ rating: number; reviewCount: number; reviews: Review[] }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/reviews?garageId=${encodeURIComponent(garageId)}`, { cache: 'no-store' });
      const result = await res.json();
      if (result.success && result.data) return result.data;
    } catch (e) {
      console.warn('getGarageReviews fetch error:', e);
    }
  }
  await initDatabase();
  return GarageModel.getGarageReviewsAndStats(garageId);
}

