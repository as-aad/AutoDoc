import { NextResponse } from 'next/server';
import { UserModel } from '@/models/user.model';
import { initDatabase } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    let user = null;
    if (email) {
      user = await UserModel.findByEmail(email);
    } else if (id) {
      user = await UserModel.findById(id);
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDatabase();
    const body = await req.json();
    const { id, email, ...updates } = body;

    let targetId = id;
    if (!targetId && email) {
      const existing = await UserModel.findByEmail(email);
      if (existing) targetId = existing.id;
    }

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Target user ID or email required' }, { status: 400 });
    }

    const updatedUser = await UserModel.update(targetId, updates);
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Failed to update user profile' }, { status: 400 });
    }

    const { passwordHash, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
