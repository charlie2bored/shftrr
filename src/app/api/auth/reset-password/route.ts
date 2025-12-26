import { NextRequest, NextResponse } from "next/server";
import { validatePasswordResetToken, updateUserPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Validate the reset token
    const emailFromToken = await validatePasswordResetToken(token);
    if (!emailFromToken) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Update the user's password
    const success = await updateUserPassword(emailFromToken, newPassword);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    console.log(`✅ Password updated for user: ${emailFromToken}`);

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
