import { sql, initDatabase } from '../lib/db/index.ts';
import { BookingModel } from './booking.model.ts';

export async function createInvoice(data) {
  await initDatabase();
  const id = data.id || `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const expiresAt = data.warrantyExpiresAt ? new Date(data.warrantyExpiresAt).toISOString() : null;

  const rows = await sql`
    INSERT INTO invoices (
      id, booking_id, invoice_number, labor_cost_cents, parts_cost_json, 
      total_cents, warranty_months, warranty_expires_at, pdf_url, issued_by_user_id
    ) VALUES (
      ${id}, ${data.bookingId}, ${data.invoiceNumber}, ${data.laborCostCents || 0}, 
      ${data.partsCostJson || '[]'}, ${data.totalCents || 0}, ${data.warrantyMonths || 0}, 
      ${expiresAt}, ${data.pdfUrl || null}, ${data.issuedByUserId || 'system'}
    )
    RETURNING *;
  `;

  return rows[0] ? await mapRowToInvoice(rows[0]) : null;
}

export async function getInvoiceByBookingId(bookingId) {
  await initDatabase();
  const rows = await sql`
    SELECT * FROM invoices WHERE booking_id = ${bookingId} OR id = ${bookingId} OR invoice_number = ${bookingId} LIMIT 1;
  `;

  if (rows && rows.length > 0) {
    return await mapRowToInvoice(rows[0]);
  }

  // Fallback: If no invoice row exists in database yet, check if booking exists
  try {
    const booking = await BookingModel.findById(bookingId);
    if (booking) {
      const subtotalDollar = Number(booking.price || booking.cost || 250);
      const taxDollar = Math.round(subtotalDollar * 0.08 * 100) / 100;
      const totalDollar = subtotalDollar + taxDollar;
      const warrantyDaysNum = booking.warrantyDays || 90;

      const expDate = new Date();
      expDate.setDate(expDate.getDate() + warrantyDaysNum);

      return {
        id: `inv-${booking.id}`,
        bookingId: booking.id,
        invoiceNumber: `INV-2026-${String(booking.id).slice(-5)}`,
        laborCostCents: Math.round(subtotalDollar * 100),
        partsCostJson: '[]',
        parts: [],
        totalCents: Math.round(totalDollar * 100),
        warrantyMonths: Math.round(warrantyDaysNum / 30),
        warrantyExpiresAt: expDate.toISOString(),
        pdfUrl: `/uploads/invoices/inv-${booking.id}.pdf`,
        issuedByUserId: booking.garageId || 'system',
        issuedAt: new Date().toISOString(),
        garageName: booking.garageName || 'Apex Performance Motors',
        garageAddress: '100 Auto Plaza Way, San Francisco, CA',
        garagePhone: '+1 (415) 555-0100',
        customerName: booking.customerName || 'Customer',
        vehicleName: booking.vehicleName || 'Vehicle',
        items: [
          { id: 'i-1', description: `${booking.serviceType || 'Repair Service'} Diagnostic & Labor`, quantity: 1, unitPrice: subtotalDollar * 0.6, total: subtotalDollar * 0.6 },
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
  } catch (e) {
    console.error('Fallback invoice mapping error:', e);
  }

  return null;
}

export async function generateInvoiceNumber() {
  await initDatabase();
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}-`;

  const rows = await sql`
    SELECT invoice_number FROM invoices 
    WHERE invoice_number LIKE ${prefix + '%'}
    ORDER BY invoice_number DESC 
    LIMIT 1;
  `;

  let nextSeq = 1;
  if (rows && rows.length > 0 && rows[0].invoice_number) {
    const parts = rows[0].invoice_number.split('-');
    const lastSeqStr = parts[parts.length - 1];
    const lastSeq = parseInt(lastSeqStr, 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }

  const seqPadded = String(nextSeq).padStart(5, '0');
  return `${prefix}${seqPadded}`;
}

async function mapRowToInvoice(r) {
  let parts = [];
  try {
    parts = typeof r.parts_cost_json === 'string' ? JSON.parse(r.parts_cost_json || '[]') : (r.parts_cost_json || []);
  } catch (err) {
    parts = [];
  }

  let booking = null;
  if (r.booking_id) {
    try {
      booking = await BookingModel.findById(r.booking_id);
    } catch (e) {}
  }

  const laborCents = Number(r.labor_cost_cents || 0);
  const totalCents = Number(r.total_cents || 0);

  const subtotalDollar = totalCents > 0 ? (totalCents / 100) : (Number(r.subtotal || 0) || (booking?.price || 250));
  const taxDollar = Math.round(subtotalDollar * 0.08 * 100) / 100;
  const totalDollar = subtotalDollar + taxDollar;

  const laborItem = {
    id: 'item-labor',
    description: booking?.serviceType ? `${booking.serviceType} Diagnostic & Labor` : 'Repair Labor & Diagnostic',
    quantity: 1,
    unitPrice: laborCents > 0 ? (laborCents / 100) : (subtotalDollar * 0.6),
    total: laborCents > 0 ? (laborCents / 100) : (subtotalDollar * 0.6),
  };

  const partsItems = parts.map((p, idx) => ({
    id: `item-part-${idx}`,
    description: p.name || 'Replacement Component',
    quantity: 1,
    unitPrice: Number(p.costCents || 0) > 0 ? Number(p.costCents) / 100 : Number(p.cost || 0),
    total: Number(p.costCents || 0) > 0 ? Number(p.costCents) / 100 : Number(p.cost || 0),
  }));

  const items = partsItems.length > 0 ? [laborItem, ...partsItems] : [
    laborItem,
    { id: 'item-parts-gen', description: 'OEM Certified Replacement Parts & Fluids', quantity: 1, unitPrice: subtotalDollar * 0.4, total: subtotalDollar * 0.4 },
  ];

  const warrantyMonthsNum = Number(r.warranty_months || 0);
  const warrantyDaysNum = Number(r.warranty_days || (warrantyMonthsNum > 0 ? warrantyMonthsNum * 30 : 90));

  const issuedDateStr = r.issued_date || (r.issued_at ? new Date(r.issued_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

  let expiryStr = r.warranty_expiry || '';
  if (!expiryStr && r.warranty_expires_at) {
    expiryStr = new Date(r.warranty_expires_at).toISOString().split('T')[0];
  } else if (!expiryStr) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + warrantyDaysNum);
    expiryStr = expDate.toISOString().split('T')[0];
  }

  return {
    id: r.id,
    bookingId: r.booking_id,
    invoiceNumber: r.invoice_number || `INV-2026-${String(r.id).slice(-5)}`,
    laborCostCents: laborCents,
    partsCostJson: r.parts_cost_json || '[]',
    parts,
    totalCents,
    warrantyMonths: warrantyMonthsNum,
    warrantyExpiresAt: r.warranty_expires_at ? new Date(r.warranty_expires_at).toISOString() : null,
    pdfUrl: r.pdf_url || `/uploads/invoices/${r.invoice_number || r.id}.pdf`,
    issuedByUserId: r.issued_by_user_id || 'system',
    issuedAt: r.issued_at ? new Date(r.issued_at).toISOString() : new Date().toISOString(),

    // UI properties
    garageName: r.garage_name || booking?.garageName || 'Apex Performance Motors',
    garageAddress: '100 Auto Plaza Way, San Francisco, CA',
    garagePhone: '+1 (415) 555-0100',
    customerName: r.customer_name || booking?.customerName || 'Customer',
    vehicleName: r.vehicle_name || booking?.vehicleName || 'Vehicle',
    items,
    subtotal: subtotalDollar,
    tax: taxDollar,
    total: totalDollar,
    issuedDate: issuedDateStr,
    warrantyDays: warrantyDaysNum,
    warrantyExpiry: expiryStr,
  };
}
