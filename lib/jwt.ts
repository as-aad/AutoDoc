import { SignJWT, jwtVerify } from 'jose';
import { User } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'autodoc_super_secure_jwt_secret_key_2026_x99'
);

export async function signAccessToken(user: User): Promise<string> {
  return await new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // Access token expires in 15 minutes
    .sign(JWT_SECRET);
}

export async function signRefreshToken(user: User): Promise<string> {
  return await new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Refresh token expires in 7 days
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { valid: true, payload };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}
