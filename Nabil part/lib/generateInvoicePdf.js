import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

export async function generateInvoicePdf({ booking, invoiceNumber, laborCostCents, parts = [], totalCents, warrantyMonths = 0 }) {
  const publicDir = path.join(process.cwd(), 'public', 'uploads', 'invoices');
  fs.mkdirSync(publicDir, { recursive: true });

  const fileName = `${invoiceNumber}.pdf`;
  const filePath = path.join(publicDir, fileName);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header - Garage Details
      doc.fontSize(20).fillColor('#111827').text(booking.garageName || booking.garage?.name || 'AutoDoc Certified Garage', { align: 'left' });
      doc.fontSize(10).fillColor('#6B7280').text('Official Certified Vehicle Repair & Service Center');
      doc.moveDown(0.5);

      // Invoice Header Info - Right Aligned
      doc.fontSize(16).fillColor('#FF5500').text(`INVOICE: ${invoiceNumber}`, { align: 'right' });
      doc.fontSize(10).fillColor('#4B5563').text(`Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'right' });
      doc.moveDown(1.5);

      // Customer & Vehicle Information
      doc.fontSize(12).fillColor('#111827').text(`Bill To: ${booking.customerName || booking.customer?.name || 'Valued Customer'}`);
      doc.fontSize(10).fillColor('#4B5563').text(`Target Vehicle: ${booking.vehicleName || booking.vehicle?.model || 'Vehicle'}`);
      doc.text(`Service Description: ${booking.serviceTitle || booking.serviceType || 'General Repair & Diagnostic'}`);
      doc.moveDown(1.5);

      // Line Items Table Header
      doc.fontSize(12).fillColor('#111827').text('Itemized Repair Cost Breakdown:', { underline: true });
      doc.moveDown(0.5);

      // Labor Cost
      const laborDollars = (laborCostCents / 100).toFixed(2);
      doc.fontSize(10).fillColor('#374151').text(`1. Diagnostic & Labor Services: $${laborDollars}`);

      // Itemized Parts
      if (parts && parts.length > 0) {
        parts.forEach((p, idx) => {
          const costDollars = (Number(p.costCents || 0) / 100).toFixed(2);
          doc.text(`${idx + 2}. Part - ${p.name || 'Replacement Component'}: $${costDollars}`);
        });
      }

      doc.moveDown(1.5);

      // Total Amount
      const totalDollars = (totalCents / 100).toFixed(2);
      doc.fontSize(14).fillColor('#FF5500').text(`Total Amount Due: $${totalDollars}`, { align: 'right' });

      // Warranty Details
      if (warrantyMonths > 0) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + Number(warrantyMonths));
        doc.moveDown(1);
        doc.fontSize(10).fillColor('#059669').text(`Certified Warranty Coverage: ${warrantyMonths} month(s) active until ${expiryDate.toLocaleDateString()}`);
      }

      doc.moveDown(2);
      doc.fontSize(9).fillColor('#9CA3AF').text('Thank you for servicing your vehicle with AutoDoc. Drive safely!', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/invoices/${fileName}`);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}
