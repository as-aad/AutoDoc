import { Booking, ServiceBooking, ApiResponse, Quote, BookingStatus } from '@/lib/types';
import { request } from './api-client';

const mockBookings: ServiceBooking[] = [
  {
    id: 'bk-1',
    requestId: 'req-3',
    vehicleId: 'veh-3',
    vehicleName: 'Ford F-150 2023',
    customerId: 'user-1',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (415) 555-0192',
    garageId: 'garage-1',
    garageName: 'Patel Auto Works',
    mechanicName: 'Jordan Reyes',
    serviceTitle: 'Routine 15k mile service',
    serviceType: 'General Inspection',
    serviceDescription: 'Oil change, tire rotation, multi-point inspection',
    category: 'General Inspection',
    price: 120,
    cost: 120,
    status: 'completed',
    scheduledDate: '2026-06-10',
    createdAt: '2026-06-10T11:00:00Z',
    acceptedAt: '2026-06-10T11:30:00Z',
    startedAt: '2026-06-10T13:00:00Z',
    completedAt: '2026-06-10T15:00:00Z',
    beforePhotos: ['https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600'],
    afterPhotos: ['https://images.unsplash.com/photo-1632823471565-1ecdf5c65da7?w=600'],
    timeline: [
      { id: 'tl-1', status: 'pending', label: 'Request Sent', description: 'Service request submitted', timestamp: '2026-06-10T11:00:00Z', completed: true },
      { id: 'tl-2', status: 'accepted', label: 'Quote Accepted', description: 'Patel Auto Works accepted the job', timestamp: '2026-06-10T11:30:00Z', completed: true },
      { id: 'tl-3', status: 'in_progress', label: 'Repair In Progress', description: 'Mechanic Jordan Reyes began work', timestamp: '2026-06-10T13:00:00Z', completed: true },
      { id: 'tl-4', status: 'completed', label: 'Repair Completed', description: 'Service completed and invoice generated', timestamp: '2026-06-10T15:00:00Z', completed: true },
    ],
    invoiceId: 'inv-1',
    hasReview: true,
    warrantyDays: 90,
    warrantyExpiry: '2026-09-08',
  },
  {
    id: 'bk-2',
    requestId: 'req-1',
    vehicleId: 'veh-2',
    vehicleName: 'Honda Civic 2019',
    customerId: 'user-1',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (415) 555-0192',
    garageId: 'garage-1',
    garageName: 'Patel Auto Works',
    mechanicName: 'Jordan Reyes',
    serviceTitle: 'Grinding noise from front brakes',
    serviceType: 'Brake Repair',
    serviceDescription: 'Front brake pad and rotor replacement',
    category: 'Brake Repair',
    price: 320,
    cost: 320,
    status: 'in_progress',
    scheduledDate: '2026-09-02',
    createdAt: '2026-09-01T14:00:00Z',
    acceptedAt: '2026-09-01T15:00:00Z',
    startedAt: '2026-09-02T09:00:00Z',
    beforePhotos: ['https://images.unsplash.com/photo-1486758537021-59fe988c5a8c?w=600'],
    afterPhotos: [],
    timeline: [
      { id: 'tl-5', status: 'pending', label: 'Request Sent', description: 'Service request submitted', timestamp: '2026-09-01T14:00:00Z', completed: true },
      { id: 'tl-6', status: 'accepted', label: 'Quote Accepted', description: 'Quote accepted ($320)', timestamp: '2026-09-01T15:00:00Z', completed: true },
      { id: 'tl-7', status: 'in_progress', label: 'Repair In Progress', description: 'Mechanic Jordan Reyes scanning & repair in progress', timestamp: '2026-09-02T09:00:00Z', completed: true },
      { id: 'tl-8', status: 'completed', label: 'Repair Completed', description: 'Awaiting final quality test', timestamp: '', completed: false },
    ],
    hasReview: false,
    warrantyDays: 365,
  },
];

export const bookingService = {
  list: async (params?: { customerId?: string; garageId?: string; mechanicName?: string }): Promise<ApiResponse<Booking[]>> => {
    return request('/api/bookings', { method: 'GET' }, () => {
      let res = mockBookings;
      if (params?.customerId) res = res.filter((b) => b.customerId === params.customerId);
      if (params?.garageId) res = res.filter((b) => b.garageId === params.garageId);
      if (params?.mechanicName) res = res.filter((b) => b.mechanicName === params.mechanicName);
      return res;
    });
  },

  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    return request(`/api/bookings/${id}`, { method: 'GET' }, () => {
      const bk = mockBookings.find((b) => b.id === id);
      if (!bk) throw new Error('Booking not found');
      return bk;
    });
  },

  create: async (data: Partial<ServiceBooking>): Promise<ApiResponse<Booking>> => {
    return request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }, () => {
      const newBooking: ServiceBooking = {
        id: `bk-${Date.now()}`,
        requestId: data.requestId || `req-${Date.now()}`,
        vehicleId: data.vehicleId || 'veh-1',
        vehicleName: data.vehicleName || 'Vehicle',
        customerId: data.customerId || 'user-1',
        customerName: data.customerName || 'Alex Morgan',
        garageId: data.garageId || 'garage-1',
        garageName: data.garageName || 'Patel Auto Works',
        serviceTitle: data.serviceTitle || data.serviceType || 'Diagnostic Service',
        serviceType: data.serviceType || 'General Repair',
        serviceDescription: data.serviceDescription || 'Full system diagnostic',
        category: data.category || 'General Repair',
        price: data.price || data.cost || 250,
        cost: data.cost || data.price || 250,
        status: 'pending',
        scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        beforePhotos: [],
        afterPhotos: [],
        timeline: [
          { id: `tl-${Date.now()}`, status: 'pending', label: 'Request Sent', description: 'Booking logged into system', timestamp: new Date().toISOString(), completed: true },
        ],
        hasReview: false,
        warrantyDays: 90,
      };
      mockBookings.unshift(newBooking);
      return newBooking;
    });
  },

  submitQuote: async (requestId: string, quote: Partial<Quote>): Promise<ApiResponse<Quote>> => {
    return request(`/api/requests/${requestId}/quotes`, {
      method: 'POST',
      body: JSON.stringify(quote),
    }, () => {
      const createdQuote: Quote = {
        id: `q-${Date.now()}`,
        garageId: quote.garageId || 'garage-1',
        garageName: quote.garageName || 'Patel Auto Works',
        garageRating: 4.8,
        garageReviewCount: 127,
        garageVerified: true,
        price: quote.price || 250,
        eta: quote.eta || 'Same day',
        etaHours: quote.etaHours || 4,
        notes: quote.notes || 'Includes full multi-point diagnostic check.',
        warrantyDays: quote.warrantyDays || 365,
        createdAt: new Date().toISOString(),
      };
      return createdQuote;
    });
  },

  updateStatus: async (bookingId: string, status: BookingStatus): Promise<ApiResponse<Booking>> => {
    return request(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, () => {
      const bk = mockBookings.find((b) => b.id === bookingId);
      if (!bk) throw new Error('Booking not found');
      bk.status = status;
      const now = new Date().toISOString();
      if (status === 'accepted') bk.acceptedAt = now;
      if (status === 'in_progress') bk.startedAt = now;
      if (status === 'completed') bk.completedAt = now;
      if (bk.timeline) {
        const item = bk.timeline.find((t) => t.status === status);
        if (item) {
          item.completed = true;
          item.timestamp = now;
        }
      }
      return bk;
    });
  },
};
