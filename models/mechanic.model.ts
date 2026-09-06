import { sql } from '@/lib/db';
import { Mechanic, ApplicationStatus } from '@/lib/types';

export class MechanicModel {
  static async findByUserId(userId: string): Promise<Mechanic | null> {
    if (!userId) return null;
    const rows = await sql`
      SELECT m.*, u.name as user_name, u.email as user_email, u.phone as user_phone, g.name as garage_name
      FROM mechanics m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN garages g ON m.garage_id = g.id
      WHERE m.user_id = ${userId}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) return null;
    return this.mapRowToMechanic(rows[0]);
  }

  static async findById(id: string): Promise<Mechanic | null> {
    if (!id) return null;
    const rows = await sql`
      SELECT m.*, u.name as user_name, u.email as user_email, u.phone as user_phone, g.name as garage_name
      FROM mechanics m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN garages g ON m.garage_id = g.id
      WHERE m.id = ${id} OR m.user_id = ${id}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) return null;
    return this.mapRowToMechanic(rows[0]);
  }

  static async findPendingByGarageId(garageId: string): Promise<Mechanic[]> {
    if (!garageId) return [];
    const rows = await sql`
      SELECT m.*, u.name as user_name, u.email as user_email, u.phone as user_phone, g.name as garage_name
      FROM mechanics m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN garages g ON m.garage_id = g.id
      WHERE (m.garage_id = ${garageId} OR m.garage_id IN (SELECT id FROM garages WHERE owner_id = ${garageId}))
        AND m.application_status = 'PENDING'
      ORDER BY m.created_at DESC
    `;
    return (rows || []).map((r: any) => this.mapRowToMechanic(r));
  }

  static async findAcceptedByGarage(garageId: string): Promise<Mechanic[]> {
    if (!garageId) return [];
    const rows = await sql`
      SELECT m.*, u.name as user_name, u.email as user_email, u.phone as user_phone, g.name as garage_name
      FROM mechanics m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN garages g ON m.garage_id = g.id
      WHERE (m.garage_id = ${garageId} OR m.garage_id IN (SELECT id FROM garages WHERE owner_id = ${garageId}))
        AND m.application_status = 'ACCEPTED'
      ORDER BY u.name ASC
    `;
    return (rows || []).map((r: any) => this.mapRowToMechanic(r));
  }

  static async saveCredential(userId: string, credentialUrl: string): Promise<Mechanic> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      await sql`
        UPDATE mechanics
        SET pending_credential_url = ${credentialUrl},
            credential_url = COALESCE(credential_url, ${credentialUrl})
        WHERE user_id = ${userId};
      `;
      return (await this.findByUserId(userId))!;
    }

    const id = `mech-${Date.now()}`;
    await sql`
      INSERT INTO mechanics (id, user_id, pending_credential_url, credential_url, application_status, specialization)
      VALUES (${id}, ${userId}, ${credentialUrl}, ${credentialUrl}, 'NOT_SUBMITTED', 'General Repair')
      ON CONFLICT (user_id) DO UPDATE 
      SET pending_credential_url = ${credentialUrl}, credential_url = COALESCE(mechanics.credential_url, ${credentialUrl});
    `;
    return (await this.findByUserId(userId))!;
  }

  static async applyToGarage(
    userId: string,
    garageId: string,
    specialization?: string,
    credentialUrl?: string
  ): Promise<Mechanic> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      if (existing.applicationStatus === 'PENDING') {
        throw new Error(
          'You already have an active application under review. Please wait for the garage owner to process it or reject it before applying elsewhere.'
        );
      }
      if (existing.applicationStatus === 'ACCEPTED') {
        throw new Error('You are already an accepted mechanic at a certified garage.');
      }

      const cred = credentialUrl || existing.pendingCredentialUrl || existing.credentialUrl || '';
      const spec = specialization || existing.specialization || 'General Diagnostic & Maintenance';

      await sql`
        UPDATE mechanics
        SET garage_id = ${garageId},
            specialization = ${spec},
            credential_url = ${cred},
            application_status = 'PENDING'
        WHERE user_id = ${userId};
      `;
      return (await this.findByUserId(userId))!;
    }

    const id = `mech-${Date.now()}`;
    const cred = credentialUrl || '';
    const spec = specialization || 'General Diagnostic & Maintenance';

    await sql`
      INSERT INTO mechanics (id, user_id, garage_id, specialization, credential_url, pending_credential_url, application_status)
      VALUES (${id}, ${userId}, ${garageId}, ${spec}, ${cred}, ${cred}, 'PENDING');
    `;
    return (await this.findByUserId(userId))!;
  }

  static async acceptApplication(mechanicId: string, ownerId: string): Promise<Mechanic> {
    const mechanic = await this.findById(mechanicId);
    if (!mechanic) throw new Error('Mechanic application not found.');

    // Verify owner owns this garage
    const ownerGarages = await sql`
      SELECT id FROM garages WHERE owner_id = ${ownerId} OR id = ${ownerId}
    `;
    const ownerGarageIds = (ownerGarages || []).map((g: any) => g.id);

    if (!mechanic.garageId || !ownerGarageIds.includes(mechanic.garageId)) {
      throw new Error('Forbidden: You do not have permission to accept applications for another garage.');
    }

    await sql`
      UPDATE mechanics
      SET application_status = 'ACCEPTED'
      WHERE id = ${mechanic.id} OR user_id = ${mechanic.id};
    `;

    return (await this.findById(mechanic.id))!;
  }

  static async rejectApplication(mechanicId: string, ownerId: string): Promise<Mechanic> {
    const mechanic = await this.findById(mechanicId);
    if (!mechanic) throw new Error('Mechanic application not found.');

    // Verify owner owns this garage
    const ownerGarages = await sql`
      SELECT id FROM garages WHERE owner_id = ${ownerId} OR id = ${ownerId}
    `;
    const ownerGarageIds = (ownerGarages || []).map((g: any) => g.id);

    if (!mechanic.garageId || !ownerGarageIds.includes(mechanic.garageId)) {
      throw new Error('Forbidden: You do not have permission to reject applications for another garage.');
    }

    await sql`
      UPDATE mechanics
      SET application_status = 'REJECTED', garage_id = NULL
      WHERE id = ${mechanic.id} OR user_id = ${mechanic.id};
    `;

    return (await this.findById(mechanic.id))!;
  }

  static async findAllWithGarageInfo(): Promise<Mechanic[]> {
    let rows = await sql`
      SELECT m.*, u.name as user_name, u.email as user_email, u.phone as user_phone, g.name as garage_name
      FROM mechanics m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN garages g ON (m.garage_id = g.id OR m.garage_id = g.owner_id)
      ORDER BY u.name ASC
    `;
    if (!rows || rows.length === 0) {
      await sql`
        INSERT INTO mechanics (id, user_id, garage_id, specialization, application_status)
        VALUES
          ('mech-1', 'user-mechanic-1', 'gar-1', 'Master Technician & EV Diagnostics', 'ACCEPTED'),
          ('mech-2', 'user-mechanic-2', 'gar-1', 'Brake Systems & Suspension', 'ACCEPTED'),
          ('mech-3', 'user-mechanic-3', 'gar-2', 'Transmission & Engine Tuning', 'ACCEPTED')
        ON CONFLICT (user_id) DO NOTHING;
      `;
      rows = await sql`
        SELECT m.*, u.name as user_name, u.email as user_email, u.phone as user_phone, g.name as garage_name
        FROM mechanics m
        JOIN users u ON m.user_id = u.id
        LEFT JOIN garages g ON (m.garage_id = g.id OR m.garage_id = g.owner_id)
        ORDER BY u.name ASC
      `;
    }
    return (rows || []).map((r: any) => this.mapRowToMechanic(r));
  }

  static async assignGarageByAdmin(mechanicUserId: string, garageId: string): Promise<Mechanic> {
    const existing = (await this.findByUserId(mechanicUserId)) || (await this.findById(mechanicUserId));
    if (existing) {
      await sql`
        UPDATE mechanics
        SET garage_id = ${garageId},
            application_status = 'ACCEPTED'
        WHERE user_id = ${existing.userId} OR id = ${existing.id};
      `;
      return (await this.findByUserId(existing.userId))!;
    }
    const id = `mech-${Date.now()}`;
    await sql`
      INSERT INTO mechanics (id, user_id, garage_id, specialization, application_status)
      VALUES (${id}, ${mechanicUserId}, ${garageId}, 'General Diagnostics', 'ACCEPTED');
    `;
    return (await this.findByUserId(mechanicUserId))!;
  }

  private static mapRowToMechanic(r: any): Mechanic {
    return {
      id: r.id,
      userId: r.user_id,
      userName: r.user_name || 'Mechanic',
      userEmail: r.user_email || '',
      userPhone: r.user_phone || '',
      garageId: r.garage_id || null,
      garageName: r.garage_name || '',
      specialization: r.specialization || 'General Repair',
      credentialUrl: r.credential_url || r.pending_credential_url || '',
      pendingCredentialUrl: r.pending_credential_url || r.credential_url || '',
      applicationStatus: (r.application_status || 'PENDING') as ApplicationStatus,
      rating: Number(r.rating || 0),
      totalReviews: Number(r.total_reviews || 0),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    };
  }
}
