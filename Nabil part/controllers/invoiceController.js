import { BookingModel } from '../models/booking.model.ts';
import { createInvoice, getInvoiceByBookingId, generateInvoiceNumber } from '../models/invoiceModel.js';
import { generateInvoicePdf } from '../lib/generateInvoicePdf.js';

export async function generateInvoice(req, res) {
  try {
    const bookingId = req.params?.id || req.query?.id || (req.nextUrl ? req.nextUrl.pathname.split('/')[3] : null);
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      const errRes = { success: false, message: 'Booking not found' };
      return res && res.status ? res.status(404).json(errRes) : errRes;
    }

    if (booking.status !== 'completed' && booking.status !== 'COMPLETED' && booking.status !== 'customer_approved') {
      const errRes = { success: false, message: 'Booking must be completed before invoicing' };
      return res && res.status ? res.status(400).json(errRes) : errRes;
    }

    // Check if invoice already exists for this booking
    const existing = await getInvoiceByBookingId(booking.id);
    if (existing) {
      const errRes = {
        success: false,
        message: 'Invoice already generated for this booking',
        invoice: existing,
        data: existing,
      };
      return res && res.status ? res.status(400).json(errRes) : errRes;
    }

    const body = req.body || (typeof req.json === 'function' ? await req.json() : {});
    
    // Parse labor cost in cents
    let laborCostCents = 0;
    if (body.laborCostCents !== undefined && body.laborCostCents !== null) {
      laborCostCents = Number(body.laborCostCents);
    } else if (body.laborCost !== undefined && body.laborCost !== null) {
      laborCostCents = Math.round(Number(body.laborCost) * 100);
    } else {
      laborCostCents = Math.round(Number(booking.price || booking.cost || 250) * 100);
    }

    const parts = Array.isArray(body.parts) ? body.parts : [];
    const partsCostCents = parts.reduce((sum, p) => sum + Number(p.costCents || Math.round((p.cost || 0) * 100) || 0), 0);
    const totalCents = laborCostCents + partsCostCents;

    const warrantyMonths = Number(body.warrantyMonths || body.warrantyDays ? Math.round((body.warrantyDays || 90) / 30) : 0);

    const invoiceNumber = await generateInvoiceNumber();

    const pdfUrl = await generateInvoicePdf({
      booking,
      invoiceNumber,
      laborCostCents,
      parts,
      totalCents,
      warrantyMonths,
    });

    const warrantyExpiresAt = warrantyMonths > 0
      ? new Date(Date.now() + warrantyMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

    const issuedByUserId = (req.user && req.user.id) || booking.garageId || 'user-garage-1';

    const invoice = await createInvoice({
      bookingId: booking.id,
      invoiceNumber,
      laborCostCents,
      partsCostJson: JSON.stringify(parts),
      totalCents,
      warrantyMonths,
      warrantyExpiresAt,
      pdfUrl,
      issuedByUserId,
    });

    // Also update booking status to completed if needed
    if (booking.status !== 'completed') {
      await BookingModel.updateStatus(booking.id, 'completed');
    }

    const result = { success: true, data: invoice };
    return res && res.status ? res.status(201).json(result) : result;
  } catch (err) {
    console.error('generateInvoice error:', err);
    const errRes = { success: false, message: err.message || 'Failed to generate invoice' };
    return res && res.status ? res.status(500).json(errRes) : errRes;
  }
}

export async function downloadInvoice(req, res) {
  try {
    const bookingId = req.params?.id || req.query?.id || (req.nextUrl ? req.nextUrl.pathname.split('/')[3] : null);
    const invoice = await getInvoiceByBookingId(bookingId);

    if (!invoice) {
      const errRes = { success: false, message: 'No invoice yet' };
      return res && res.status ? res.status(404).json(errRes) : errRes;
    }

    const result = { success: true, data: invoice };
    return res && res.status ? res.status(200).json(result) : result;
  } catch (err) {
    console.error('downloadInvoice error:', err);
    const errRes = { success: false, message: err.message };
    return res && res.status ? res.status(500).json(errRes) : errRes;
  }
}
