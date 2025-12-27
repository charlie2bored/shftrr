import { NextRequest, NextResponse } from "next/server";
import { generatePasswordResetToken, findUserByEmail } from "@/lib/auth";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists (but don't reveal this information for security)
    const user = await findUserByEmail(email);
    if (!user) {
      // Return success message anyway to prevent email enumeration
      return NextResponse.json({
        message: 'If an account with this email exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = await generatePasswordResetToken(email);

    // Create reset URL
    const resetUrl = `${env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    // In development, log the reset link. In production, send email
    console.log('🔐 Password Reset Link Generated');
    console.log('📧 Email:', email);
    console.log('🔗 Reset URL:', resetUrl);
    console.log('⏰ Expires in 15 minutes');

    // Simulate email sending (in production, integrate with email service)
    console.log(`📧 Password reset email would be sent to ${email}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);

    return NextResponse.json({
      message: 'If an account with this email exists, a reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
