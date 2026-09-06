import { NextResponse } from 'next/server';
import { verifyToken, signAccessToken, signRefreshToken } from '@/lib/jwt';
import { UserModel } from '@/models/user.model';
import { initDatabase } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ success: false, error: 'Refresh token required' }, { status: 400 });
    }

    const { valid, payload, error } = await verifyToken(refreshToken);

    if (!valid || !payload || payload.type !== 'refresh') {
      return NextResponse.json({ success: false, error: error || 'Invalid refresh token' }, { status: 401 });
    }

    const user = await UserModel.findById(payload.sub as string);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found' }, { status: 404 });
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        {
          success: false,
          error: `Account suspended: ${user.suspensionReason || 'Policy violation'}. Access denied.`,
        },
        { status: 403 }
      );
    }

    const newAccessToken = await signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);

    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: safeUser,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
