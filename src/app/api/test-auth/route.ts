import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🧪 Testing auth API - Email:', email);

    // Find user
    const user = await UserService.findByEmail(email);

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.password) {
      console.log('❌ No password set');
      return NextResponse.json({ error: 'No password set' }, { status: 400 });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('🔍 Password valid:', isValid);

    if (isValid) {
      return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

  } catch (error) {
    console.error('❌ Test auth error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
