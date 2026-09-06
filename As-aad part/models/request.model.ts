import { sql } from '@/lib/db';
import { ServiceRequest, Quote, RequestStatus } from '@/lib/types';
import { GarageModel } from '@/models/garage.model';

async function mapQuote(q: any): Promise<Quote> {
  const stats = await GarageModel.getGarageReviewsAndStats(q.garage_id);
  return {
    id: q.id,
    garageId: q.garage_id,
    garageName: q.garage_name || 'Garage Partner',
    garageRating: stats.reviewCount > 0 ? stats.rating : 0,
    garageReviewCount: stats.reviewCount,
    garageVerified: q.garage_verified !== undefined ? Boolean(q.garage_verified) : true,
    price: Number(q.price || 0),
    eta: q.eta || '1-2 Days',
    etaHours: Number(q.eta_hours || 4),
    notes: q.notes || 'Full diagnostic and service warranty included.',
    warrantyDays: Number(q.warranty_days || 90),
    createdAt: q.created_at ? new Date(q.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export class RequestModel {
  static async findAll(): Promise<ServiceRequest[]> {
    const rows = await sql`SELECT * FROM service_requests ORDER BY created_at DESC`;
    const result: ServiceRequest[] = [];

    for (const r of rows) {
      const qRows = await sql`SELECT * FROM quotes WHERE request_id = ${r.id} ORDER BY created_at DESC`;
      const quotes: Quote[] = await Promise.all(qRows.map(mapQuote));

      result.push({
        id: r.id,
        vehicleId: r.vehicle_id,
        vehicleName: r.vehicle_name || '',
        ownerId: r.owner_id,
        ownerName: r.owner_name || '',
        title: r.title,
        description: r.description,
        category: r.category || 'General Service',
        photos: r.photos || [],
        location: r.location || 'San Francisco, CA',
        status: r.status as RequestStatus,
        quotes,
        createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-09-01',
        urgency: r.urgency || 'medium',
        acceptedQuoteId: r.accepted_quote_id || undefined,
      });
    }

    return result;
  }

  static async findByOwnerId(ownerId: string): Promise<ServiceRequest[]> {
    let rows = await sql`SELECT * FROM service_requests WHERE owner_id = ${ownerId} ORDER BY created_at DESC`;
    if (!rows || rows.length === 0) {
      rows = await sql`SELECT * FROM service_requests ORDER BY created_at DESC`;
    }
    const result: ServiceRequest[] = [];

    for (const r of rows) {
      const qRows = await sql`SELECT * FROM quotes WHERE request_id = ${r.id} ORDER BY created_at DESC`;
      const quotes: Quote[] = await Promise.all(qRows.map(mapQuote));

      result.push({
        id: r.id,
        vehicleId: r.vehicle_id,
        vehicleName: r.vehicle_name || '',
        ownerId: r.owner_id,
        ownerName: r.owner_name || '',
        title: r.title,
        description: r.description,
        category: r.category || 'General Service',
        photos: r.photos || [],
        location: r.location || 'San Francisco, CA',
        status: r.status as RequestStatus,
        quotes,
        createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-09-01',
        urgency: r.urgency || 'medium',
        acceptedQuoteId: r.accepted_quote_id || undefined,
      });
    }

    return result;
  }

  static async findById(id: string): Promise<ServiceRequest | null> {
    let rows = await sql`SELECT * FROM service_requests WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) {
      rows = await sql`SELECT * FROM service_requests WHERE LOWER(id) = LOWER(${id}) LIMIT 1`;
    }
    if (!rows || rows.length === 0) return null;
    const r = rows[0];

    const qRows = await sql`SELECT * FROM quotes WHERE request_id = ${r.id} OR request_id = ${id} ORDER BY created_at DESC`;
    const quotes: Quote[] = await Promise.all(qRows.map(mapQuote));

    return {
      id: r.id,
      vehicleId: r.vehicle_id,
      vehicleName: r.vehicle_name || '',
      ownerId: r.owner_id,
      ownerName: r.owner_name || '',
      title: r.title,
      description: r.description,
      category: r.category || 'General Service',
      photos: r.photos || [],
      location: r.location || 'San Francisco, CA',
      status: r.status as RequestStatus,
      quotes,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-09-01',
      urgency: r.urgency || 'medium',
      acceptedQuoteId: r.accepted_quote_id || undefined,
    };
  }

  static async create(data: {
    vehicleId: string;
    vehicleName: string;
    ownerId: string;
    ownerName: string;
    title: string;
    description: string;
    category?: string;
    photos?: string[];
    location?: string;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<ServiceRequest> {
    const id = `req-${Date.now()}`;
    const category = data.category || 'General Repair';
    const photos = data.photos || [];
    const location = data.location || 'San Francisco, CA';
    const urgency = data.urgency || 'medium';

    await sql`
      INSERT INTO service_requests (id, vehicle_id, vehicle_name, owner_id, owner_name, title, description, category, photos, location, status, urgency)
      VALUES (${id}, ${data.vehicleId}, ${data.vehicleName}, ${data.ownerId}, ${data.ownerName}, ${data.title}, ${data.description}, ${category}, ${photos}, ${location}, 'open', ${urgency});
    `;

    return {
      id,
      vehicleId: data.vehicleId,
      vehicleName: data.vehicleName,
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      title: data.title,
      description: data.description,
      category,
      photos,
      location,
      status: 'open',
      quotes: [],
      createdAt: new Date().toISOString().split('T')[0],
      urgency,
    };
  }

  static async addQuote(data: {
    requestId: string;
    garageId: string;
    garageName: string;
    price: number;
    eta: string;
    notes?: string;
    warrantyDays?: number;
  }): Promise<Quote> {
    const req = await this.findById(data.requestId);
    if (req && (req.category === 'Warranty Claim' || req.title?.includes('[WARRANTY CLAIM]'))) {
      throw new Error('Warranty claims are pre-assigned under active warranty coverage and do not accept quotations.');
    }

    const id = `quote-${Date.now()}`;
    const warranty = data.warrantyDays || 90;
    const notes = data.notes || 'Full diagnostic and genuine OEM parts warranty included.';
    const stats = await GarageModel.getGarageReviewsAndStats(data.garageId);

    await sql`
      INSERT INTO quotes (id, request_id, garage_id, garage_name, garage_rating, garage_review_count, garage_verified, price, eta, notes, warranty_days)
      VALUES (${id}, ${data.requestId}, ${data.garageId}, ${data.garageName}, ${stats.rating}, ${stats.reviewCount}, true, ${data.price}, ${data.eta}, ${notes}, ${warranty});
    `;

    await sql`
      UPDATE service_requests SET status = 'quoted' WHERE id = ${data.requestId};
    `;

    return {
      id,
      garageId: data.garageId,
      garageName: data.garageName,
      garageRating: stats.reviewCount > 0 ? stats.rating : 0,
      garageReviewCount: stats.reviewCount,
      garageVerified: true,
      price: data.price,
      eta: data.eta,
      etaHours: 4,
      notes,
      warrantyDays: warranty,
      createdAt: new Date().toISOString().split('T')[0],
    };
  }
}
