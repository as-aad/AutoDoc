import { generateInvoice, downloadInvoice } from '../controllers/invoiceController.js';

export function setupInvoiceRoutes(app) {
  if (app && typeof app.post === 'function') {
    app.post('/api/bookings/:id/invoice', generateInvoice);
    app.get('/api/bookings/:id/invoice', downloadInvoice);
  }
}

export { generateInvoice, downloadInvoice };
