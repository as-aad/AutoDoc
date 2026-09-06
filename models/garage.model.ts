import { sql } from '@/lib/db';
import { Garage, VerificationItem } from '@/lib/types';

export class GarageModel {
  static async ensureCoverUrlColumn() {
    try {
      await sql`ALTER TABLE garages ADD COLUMN IF NOT EXISTS cover_url TEXT;`;
    } catch (e) {
      console.warn('ensureCoverUrlColumn notice:', e);
    }
  }

  static async getGarageReviewsAndStats(garageId: string, ownerId?: string) {
    try {
      const revRows = await sql`
        SELECT * FROM reviews 
        WHERE garage_id = ${garageId} 
           OR (${ownerId || ''} != '' AND garage_id IN (SELECT id FROM garages WHERE owner_id = ${ownerId}))
        ORDER BY created_at DESC
      `;
      const count = revRows ? revRows.length : 0;
      let avg = 0;
      if (count > 0) {
        const sum = revRows.reduce((acc: number, r: any) => acc + Number(r.garage_rating || 0), 0);
        avg = Math.round((sum / count) * 10) / 10;
      }
      const reviews = (revRows || []).map((r: any) => ({
        id: r.id,
        bookingId: r.booking_id,
        garageId: r.garage_id,
        garageName: r.garage_name || '',
        customerName: r.customer_name || 'Customer',
        garageRating: Number(r.garage_rating || 0),
        mechanicRating: r.mechanic_rating ? Number(r.mechanic_rating) : undefined,
        comment: r.comment || '',
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
      return { rating: avg, reviewCount: count, reviews };
    } catch (e) {
      return { rating: 0, reviewCount: 0, reviews: [] };
    }
  }

  static async findAll(): Promise<Garage[]> {
    await this.ensureCoverUrlColumn();
    let rows = await sql`SELECT * FROM garages ORDER BY rating DESC, review_count DESC`;
    if (!rows || rows.length === 0) {
      await sql`
        INSERT INTO garages (id, owner_id, name, address, phone, email, rating, review_count, verified, specialties)
        VALUES 
          ('gar-1', 'user-garage-1', 'Apex Performance Motors', '1044 Market St, San Francisco, CA', '+1 (415) 555-0100', 'contact@apexmotors.com', 4.9, 34, true, ARRAY['Brakes', 'EV Diagnostics', 'Engine Maintenance']),
          ('gar-2', 'user-garage-2', 'San Francisco Auto Repair', '520 Mission St, San Francisco, CA', '+1 (415) 555-0200', 'service@sfautorepair.com', 4.8, 28, true, ARRAY['Transmission', 'Suspension & Steering', 'Oil & Fluids']),
          ('gar-3', 'user-garage-3', 'Bay Area Precision Tuning', '780 Van Ness Ave, San Francisco, CA', '+1 (415) 555-0300', 'info@bayareatuning.com', 4.95, 42, true, ARRAY['Engine Tuning', 'Electrical & Battery', 'Brakes'])
        ON CONFLICT (id) DO NOTHING;
      `;
      rows = await sql`SELECT * FROM garages ORDER BY rating DESC, review_count DESC`;
    }

    const result: Garage[] = [];
    for (const r of rows) {
      const stats = await this.getGarageReviewsAndStats(r.id, r.owner_id);
      result.push({
        id: r.id,
        name: r.name,
        ownerId: r.owner_id || '',
        address: r.address || '',
        phone: r.phone || '',
        email: r.email || '',
        rating: stats.reviewCount > 0 ? stats.rating : Number(r.rating || 0),
        reviewCount: stats.reviewCount > 0 ? stats.reviewCount : Number(r.review_count || 0),
        verified: r.verified !== false,
        specialties: r.specialties || ['Brakes', 'EV Diagnostics', 'Engine Maintenance'],
        imageUrl: r.image_url || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
        coverUrl: r.cover_url || r.image_url || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
        openRequests: Number(r.open_requests || 0),
        completedJobs: Number(r.completed_jobs || 0),
        yearsActive: Number(r.years_active || 1),
        reviews: stats.reviews,
      });
    }
    return result;
  }

  static async findByOwnerId(ownerId: string): Promise<Garage | null> {
    if (!ownerId) return null;
    await this.ensureCoverUrlColumn();
    const rows = await sql`SELECT * FROM garages WHERE owner_id = ${ownerId} LIMIT 1`;
    if (!rows || rows.length === 0) {
      const userRows = await sql`SELECT name, email, phone, location FROM users WHERE id = ${ownerId} OR email = ${ownerId} LIMIT 1`;
      const u = userRows && userRows.length > 0 ? userRows[0] : null;
      const garageName = u?.name ? `${u.name}'s Auto Repair` : 'Auto Repair Shop';
      const email = u?.email || 'service@autorepair.com';
      const phone = u?.phone || '';
      const address = u?.location || 'San Francisco, CA';

      return this.create({
        name: garageName,
        address,
        phone,
        email,
        specialties: ['Brakes', 'EV Diagnostics', 'Engine Maintenance'],
        ownerId,
      });
    }
    const r = rows[0];
    const stats = await this.getGarageReviewsAndStats(r.id, r.owner_id);

    return {
      id: r.id,
      name: r.name,
      ownerId: r.owner_id,
      address: r.address,
      phone: r.phone,
      email: r.email,
      rating: stats.reviewCount > 0 ? stats.rating : Number(r.rating || 0),
      reviewCount: stats.reviewCount > 0 ? stats.reviewCount : Number(r.review_count || 0),
      verified: r.verified !== false,
      specialties: r.specialties || ['Brakes', 'EV Diagnostics'],
      imageUrl: r.image_url || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
      coverUrl: r.cover_url || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
      openRequests: Number(r.open_requests || 0),
      completedJobs: Number(r.completed_jobs || 0),
      yearsActive: Number(r.years_active || 1),
      reviews: stats.reviews,
    };
  }

  static async findById(id: string): Promise<Garage | null> {
    if (!id) return null;
    await this.ensureCoverUrlColumn();
    const rows = await sql`SELECT * FROM garages WHERE id = ${id} OR owner_id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    const stats = await this.getGarageReviewsAndStats(r.id, r.owner_id);
    return {
      id: r.id,
      name: r.name,
      ownerId: r.owner_id,
      address: r.address,
      phone: r.phone,
      email: r.email,
      rating: stats.reviewCount > 0 ? stats.rating : Number(r.rating || 0),
      reviewCount: stats.reviewCount > 0 ? stats.reviewCount : Number(r.review_count || 0),
      verified: r.verified !== false,
      specialties: r.specialties || ['Brakes', 'EV Diagnostics'],
      imageUrl: r.image_url || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
      coverUrl: r.cover_url || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
      openRequests: Number(r.open_requests || 0),
      completedJobs: Number(r.completed_jobs || 0),
      yearsActive: Number(r.years_active || 1),
      reviews: stats.reviews,
    };
  }

  static async updateByOwnerId(ownerId: string, data: Partial<Garage>): Promise<Garage | null> {
    if (!ownerId) return null;
    await this.ensureCoverUrlColumn();
    const existing = await this.findByOwnerId(ownerId);
    if (!existing) return null;

    const name = data.name !== undefined ? data.name : existing.name;
    const address = data.address !== undefined ? data.address : existing.address;
    const phone = data.phone !== undefined ? data.phone : existing.phone;
    const email = data.email !== undefined ? data.email : existing.email;
    const specialties = data.specialties !== undefined ? data.specialties : existing.specialties;
    const imageUrl = data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl;
    const coverUrl = data.coverUrl !== undefined ? data.coverUrl : existing.coverUrl;

    try {
      await sql`
        UPDATE garages
        SET name = ${name}, address = ${address}, phone = ${phone}, email = ${email},
            specialties = ${specialties}, image_url = ${imageUrl}, cover_url = ${coverUrl}
        WHERE id = ${existing.id};
      `;
    } catch (err) {
      await sql`
        UPDATE garages
        SET name = ${name}, address = ${address}, phone = ${phone}, email = ${email},
            specialties = ${specialties}, image_url = ${imageUrl}
        WHERE id = ${existing.id};
      `;
    }

    return this.findByOwnerId(ownerId);
  }

  static async findTop5ByRating(): Promise<Garage[]> {
    const all = await this.findAll();
    return all.slice(0, 5);
  }

  static async create(data: {
    name: string;
    address: string;
    phone: string;
    email: string;
    specialties: string[];
    ownerId?: string;
  }): Promise<Garage> {
    const id = `gar-${Date.now()}`;
    const ownerId = data.ownerId || 'user-garage-1';
    const imageUrl = 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800';

    await this.ensureCoverUrlColumn();

    try {
      await sql`
        INSERT INTO garages (id, owner_id, name, address, phone, email, rating, review_count, verified, specialties, image_url, cover_url, open_requests, completed_jobs, years_active)
        VALUES (${id}, ${ownerId}, ${data.name}, ${data.address}, ${data.phone}, ${data.email}, 0.0, 0, true, ${data.specialties}, ${imageUrl}, ${imageUrl}, 0, 0, 1)
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (e) {
      await sql`
        INSERT INTO garages (id, owner_id, name, address, phone, email, rating, review_count, verified, specialties, image_url, open_requests, completed_jobs, years_active)
        VALUES (${id}, ${ownerId}, ${data.name}, ${data.address}, ${data.phone}, ${data.email}, 0.0, 0, true, ${data.specialties}, ${imageUrl}, 0, 0, 1)
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return {
      id,
      ownerId,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      rating: 0.0,
      reviewCount: 0,
      verified: true,
      specialties: data.specialties,
      imageUrl,
      coverUrl: imageUrl,
      openRequests: 0,
      completedJobs: 0,
      yearsActive: 1,
      reviews: [],
    };
  }

  static async findVerifications(): Promise<VerificationItem[]> {
    const rows = await sql`SELECT * FROM verifications WHERE status = 'pending' ORDER BY submitted_at DESC`;
    if (!rows || rows.length === 0) {
      return [];
    }
    return rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      name: r.name,
      email: r.email,
      submittedAt: r.submitted_at,
      documents: r.documents || [],
      status: r.status,
      rejectionReason: r.rejection_reason || undefined,
      location: r.location || 'San Francisco, CA',
      specialties: r.specialties || [],
    }));
  }

  static async updateVerificationStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<boolean> {
    await sql`
      UPDATE verifications
      SET status = ${status}, rejection_reason = ${reason || null}
      WHERE id = ${id};
    `;
    return true;
  }
}
