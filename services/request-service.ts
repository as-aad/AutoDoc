import { ServiceRequest, Quote, Booking, BookingStatus, BookingMessage, Role } from '@/lib/types';
import { RequestModel } from '@/models/request.model';
import { BookingModel } from '@/models/booking.model';
import { initDatabase, sql } from '@/lib/db';

export async function getRequests(ownerId: string): Promise<ServiceRequest[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/requests?ownerId=${encodeURIComponent(ownerId)}`, { next: { revalidate: 30 } });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
    } catch (e) {
      console.warn('getRequests client fetch error:', e);
    }
  }
  await initDatabase();
  if (!ownerId) return [];
  return RequestModel.findByOwnerId(ownerId);
}

export async function getRequest(id: string): Promise<ServiceRequest | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/requests/${id}`, { next: { revalidate: 15 } });
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn('getRequest client fetch error:', e);
    }
  }
  await initDatabase();
  return RequestModel.findById(id);
}

export async function createRequest(
  data: Partial<ServiceRequest>
): Promise<ServiceRequest> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success && result.data) return result.data;
  }
  await initDatabase();

  return RequestModel.create({
    vehicleId: data.vehicleId || 'veh-1',
    vehicleName: data.vehicleName || 'Vehicle',
    ownerId: data.ownerId || '',
    ownerName: data.ownerName || 'Customer',
    title: data.title || 'General Maintenance Request',
    description: data.description || '',
    category: data.category || 'General Maintenance',
    photos: data.photos || [],
    location: data.location || 'San Francisco, CA',
    urgency: data.urgency || 'medium',
  });
}

export async function getOpenRequestsNearby(
  _garageId: string
): Promise<ServiceRequest[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/requests', { next: { revalidate: 30 } });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
    } catch (e) {
      console.warn('getOpenRequestsNearby client fetch error:', e);
    }
  }
  await initDatabase();
  return RequestModel.findAll();
}

export async function getBookings(customerId: string): Promise<Booking[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings?customerId=${encodeURIComponent(customerId)}`, { next: { revalidate: 15 } });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
    } catch (e) {
      console.warn('getBookings client fetch error:', e);
    }
  }
  await initDatabase();
  if (!customerId) return [];
  const rows = await BookingModel.findByCustomer(customerId);
  return rows as unknown as Booking[];
}

export async function getBookingsByGarage(
  garageId: string
): Promise<Booking[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings?garageId=${encodeURIComponent(garageId)}`, { next: { revalidate: 15 } });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
    } catch (e) {
      console.warn('getBookingsByGarage client fetch error:', e);
    }
  }
  await initDatabase();
  if (!garageId) return [];
  const rows = await BookingModel.findByGarage(garageId);
  return rows as unknown as Booking[];
}

export async function getBookingsByMechanic(
  mechanicName: string
): Promise<Booking[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings?role=mechanic&userId=${encodeURIComponent(mechanicName)}`, { next: { revalidate: 15 } });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
    } catch (e) {
      console.warn('getBookingsByMechanic client fetch error:', e);
    }
  }
  await initDatabase();
  const all = await BookingModel.findAll();
  return all.filter((b) => b.status !== 'cancelled') as unknown as Booking[];
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings/${id}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) return data.data; // keep no-store — booking detail is real-time
    } catch (e) {
      console.warn('getBooking client fetch error:', e);
    }
  }
  await initDatabase();
  return (await BookingModel.findById(id)) as unknown as Booking;
}

export async function acceptQuote(
  requestId: string,
  quoteId: string
): Promise<Booking> {
  if (typeof window !== 'undefined') {
    const res = await fetch(`/api/requests/${requestId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId }),
    });
    const result = await res.json();
    if (result.success && result.data) return result.data;
    throw new Error(result.error || 'Failed to accept quote');
  }
  await initDatabase();
  const req = await RequestModel.findById(requestId);
  const quote = req?.quotes.find((q) => q.id === quoteId);
  if (!req || !quote) throw new Error('Quote not found');

  if (req.status === 'booked' || req.acceptedQuoteId) {
    throw new Error('This repair request has already been booked with an accepted quote.');
  }

  const created = await BookingModel.create({
    requestId: req.id,
    vehicleId: req.vehicleId,
    vehicleName: req.vehicleName,
    customerId: req.ownerId,
    customerName: req.ownerName,
    garageId: quote.garageId,
    garageName: quote.garageName,
    serviceType: req.category || 'General Repair',
    serviceDescription: req.description,
    price: quote.price,
  });

  // Update request status to booked and store accepted_quote_id
  await sql`UPDATE service_requests SET status = 'booked', accepted_quote_id = ${quoteId} WHERE id = ${req.id}`;

  return created as unknown as Booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking | null> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bookingId, status }),
    });
    const result = await res.json();
    if (result.success && result.data) return result.data;
  }
  await initDatabase();
  return (await BookingModel.updateStatus(bookingId, status)) as unknown as Booking;
}

export async function uploadBeforeAfterPhotos(
  bookingId: string,
  type: 'before' | 'after',
  photos: string[]
): Promise<Booking | null> {
  if (typeof window !== 'undefined') {
    const payload = type === 'before' ? { id: bookingId, beforePhotos: photos } : { id: bookingId, afterPhotos: photos };
    const res = await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success && result.data) return result.data;
  }
  await initDatabase();
  const extra = type === 'before' ? { beforePhotos: photos } : { afterPhotos: photos };
  const current = await BookingModel.findById(bookingId);
  if (!current) return null;
  return (await BookingModel.updateStatus(bookingId, current.status, extra)) as unknown as Booking;
}

export async function getBookingMessages(bookingId: string): Promise<BookingMessage[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, { cache: 'no-store' });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) return result.data; // keep no-store — messages are real-time
    } catch (err) {
      console.error('getBookingMessages fetch error:', err);
    }
  }
  await initDatabase();
  return BookingModel.getMessages(bookingId);
}

export async function sendBookingMessage(
  bookingId: string,
  senderId: string,
  senderName: string,
  senderRole: Role,
  text: string
): Promise<BookingMessage | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, senderName, senderRole, text }),
      });
      const result = await res.json();
      if (result.success && result.data) return result.data;
    } catch (err) {
      console.error('sendBookingMessage error:', err);
    }
  }
  await initDatabase();
  return BookingModel.addMessage(bookingId, senderId, senderName, senderRole, text);
}
