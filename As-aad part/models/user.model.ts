import { sql } from '@/lib/db';
import { User, Role } from '@/lib/types';

export interface UserRecord extends User {
  passwordHash?: string;
  suspensionReason?: string;
}

export class UserModel {
  static async findById(id: string): Promise<UserRecord | null> {
    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || undefined,
      role: r.role as Role,
      avatar: r.avatar_url || undefined,
      avatarUrl: r.avatar_url || undefined,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-01-01',
      status: r.status || 'active',
      suspensionReason: r.suspension_reason || undefined,
      location: r.location || 'San Francisco, CA',
      passwordHash: r.password_hash || undefined,
    };
  }

  static async findByEmail(email: string): Promise<UserRecord | null> {
    const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || undefined,
      role: r.role as Role,
      avatar: r.avatar_url || undefined,
      avatarUrl: r.avatar_url || undefined,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-01-01',
      status: r.status || 'active',
      suspensionReason: r.suspension_reason || undefined,
      location: r.location || 'San Francisco, CA',
      passwordHash: r.password_hash || undefined,
    };
  }

  static async create(data: {
    name: string;
    email: string;
    role: Role;
    password?: string;
    phone?: string;
    avatarUrl?: string;
    location?: string;
  }): Promise<UserRecord> {
    const id = `user-${Date.now()}`;
    const avatar = data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
    const loc = data.location || 'San Francisco, CA';

    await sql`
      INSERT INTO users (id, name, email, password_hash, role, phone, avatar_url, location, status)
      VALUES (${id}, ${data.name}, ${data.email}, ${data.password || null}, ${data.role}, ${data.phone || null}, ${avatar}, ${loc}, 'active')
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        avatar_url = EXCLUDED.avatar_url,
        password_hash = EXCLUDED.password_hash;
    `;

    return {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      avatar,
      avatarUrl: avatar,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      location: loc,
      passwordHash: data.password,
    };
  }

  static async setStatus(id: string, status: 'active' | 'suspended', reason?: string): Promise<boolean> {
    await sql`
      UPDATE users
      SET status = ${status}, suspension_reason = ${reason || null}
      WHERE id = ${id};
    `;
    return true;
  }

  static async update(id: string, data: Partial<User>): Promise<UserRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const name = data.name || existing.name;
    const phone = data.phone || existing.phone || null;
    const avatarUrl = data.avatarUrl || data.avatar || existing.avatarUrl || null;
    const location = data.location || existing.location || null;

    await sql`
      UPDATE users
      SET name = ${name}, phone = ${phone}, avatar_url = ${avatarUrl}, location = ${location}
      WHERE id = ${id};
    `;

    return this.findById(id);
  }

  static async findAll(): Promise<UserRecord[]> {
    const rows = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || undefined,
      role: r.role as Role,
      avatar: r.avatar_url || undefined,
      avatarUrl: r.avatar_url || undefined,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-01-01',
      status: r.status || 'active',
      suspensionReason: r.suspension_reason || undefined,
      location: r.location || 'San Francisco, CA',
      passwordHash: r.password_hash || undefined,
    }));
  }
}
