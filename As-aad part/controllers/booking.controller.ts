import { BookingModel } from '@/models/booking.model';
import { BookingStatus } from '@/lib/types';
import { initDatabase } from '@/lib/db';

export class BookingController {
  static async getAllBookings() {
    await initDatabase();
    const bookings = await BookingModel.findAll();
    return { success: true, data: bookings };
  }

  static async getBookingById(id: string) {
    await initDatabase();
    const booking = await BookingModel.findById(id);
    if (!booking) return { success: false, error: 'Booking not found' };
    return { success: true, data: booking };
  }

  static async getBookingsForUser(role: string, userId: string) {
    await initDatabase();
    if (role === 'customer') {
      const bookings = await BookingModel.findByCustomer(userId);
      return { success: true, data: bookings };
    } else if (role === 'garage') {
      const bookings = await BookingModel.findByGarage(userId);
      return { success: true, data: bookings };
    } else if (role === 'mechanic') {
      const bookings = await BookingModel.findByMechanic(userId);
      return { success: true, data: bookings };
    }
    const bookings = await BookingModel.findAll();
    return { success: true, data: bookings };
  }

  static async createBooking(data: {
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
  }) {
    await initDatabase();
    const newBooking = await BookingModel.create(data);
    return { success: true, data: newBooking };
  }

  static async updateStatus(
    id: string,
    status?: BookingStatus,
    extra?: { beforePhotos?: string[]; afterPhotos?: string[]; mechanicId?: string; mechanicName?: string }
  ) {
    await initDatabase();

    if (status === 'completed') {
      const existing = await BookingModel.findById(id);
      if (existing && existing.status !== 'customer_approved' && existing.status !== 'completed') {
        return {
          success: false,
          error: 'Customer approval is required before marking job complete and issuing invoice. The customer must inspect and approve the repair work first.',
        };
      }
    }

    const updated = await BookingModel.updateStatus(id, status, extra);
    return { success: true, data: updated };
  }

  static async generateInvoice(bookingId: string) {
    await initDatabase();
    const invoice = await BookingModel.createInvoice(bookingId);
    if (!invoice) return { success: false, error: 'Failed to generate invoice' };
    return { success: true, data: invoice };
  }
}
