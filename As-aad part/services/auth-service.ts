import { User } from '@/lib/types';
import { UserModel } from '@/models/user.model';
import { initDatabase } from '@/lib/db';

export async function getCurrentUser(email?: string): Promise<User | null> {
  await initDatabase();
  if (!email) return null;
  const u = await UserModel.findByEmail(email);
  if (u) {
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  }
  return null;
}

export async function updateProfile(data: Partial<User> & { email?: string; id?: string }): Promise<User | null> {
  await initDatabase();
  let targetUser = null;
  if (data.id) {
    targetUser = await UserModel.findById(data.id);
  }
  if (!targetUser && data.email) {
    targetUser = await UserModel.findByEmail(data.email);
  }

  if (!targetUser) return null;

  const updated = await UserModel.update(targetUser.id, data);
  if (updated) {
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  return null;
}
