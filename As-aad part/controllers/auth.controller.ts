import { UserModel } from '@/models/user.model';
import { Role } from '@/lib/types';
import { initDatabase } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

export class AuthController {
  static async login(email: string, password?: string, role?: Role) {
    await initDatabase();
    let user = await UserModel.findByEmail(email);

    // Auto-seed Admin or System Accounts if missing from Database (No demo customer)
    if (!user) {
      if (email.toLowerCase() === 'admin@autodoc.com' || role === 'admin') {
        user = await UserModel.create({
          name: 'System Administrator',
          email: 'admin@autodoc.com',
          role: 'admin',
          password: password || 'admin123',
        });
      } else if (email.toLowerCase() === 'owner@apexmotors.com' || role === 'garage') {
        user = await UserModel.create({
          name: 'Marcus Thorne (Apex Motors)',
          email: 'owner@apexmotors.com',
          role: 'garage',
          password: password || 'password123',
        });
      } else if (email.toLowerCase() === 'jordan@apexmotors.com' || role === 'mechanic') {
        user = await UserModel.create({
          name: 'Jordan Reyes',
          email: 'jordan@apexmotors.com',
          role: 'mechanic',
          password: password || 'password123',
        });
      }
    }

    // Reject if user still does NOT exist in database
    if (!user) {
      return {
        success: false,
        error: 'Account not found. Please register an account first.',
      };
    }

    // Account suspension check! Block login if suspended
    if (user.status === 'suspended') {
      return {
        success: false,
        error: `Account suspended: ${user.suspensionReason || 'Policy violation'}. Contact support.`,
      };
    }

    // Validate password if user set a password in database
    if (user.passwordHash && password && user.passwordHash !== password) {
      return {
        success: false,
        error: 'Invalid password. Please check your password and try again.',
      };
    }

    // Sign 15-min Access Token & 7-day Refresh Token
    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    const { passwordHash, ...safeUser } = user;
    return {
      success: true,
      accessToken,
      refreshToken,
      data: safeUser,
    };
  }

  static async register(data: { name: string; email: string; role: Role; phone?: string; password?: string }) {
    await initDatabase();
    
    const existing = await UserModel.findByEmail(data.email);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const user = await UserModel.create(data);
    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    const { passwordHash, ...safeUser } = user;
    return {
      success: true,
      accessToken,
      refreshToken,
      data: safeUser,
    };
  }

  static async setAccountStatus(id: string, status: 'active' | 'suspended', reason?: string) {
    await initDatabase();
    await UserModel.setStatus(id, status, reason);
    return { success: true };
  }

  static async updateProfile(id: string, updates: any) {
    await initDatabase();
    const updated = await UserModel.update(id, updates);
    if (!updated) return { success: false, error: 'User profile not found' };
    const { passwordHash, ...safeUser } = updated;
    return { success: true, data: safeUser };
  }

  static async getAllUsers() {
    await initDatabase();
    const users = await UserModel.findAll();
    const safeUsers = users.map(({ passwordHash, ...safeUser }) => safeUser);
    return { success: true, data: safeUsers };
  }
}
