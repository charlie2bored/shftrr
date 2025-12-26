import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { z } from 'zod';

// Validation schemas
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password", placeholder: "password123" }
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Auth attempt - Email:", credentials?.email);

          // Validate input
          const validatedCredentials = loginSchema.parse(credentials);

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email }
          });

          if (!user) {
            console.log("❌ User not found");
            throw new Error("Invalid email or password");
          }

          // Check if user has a password (OAuth users might not)
          if (!user.password) {
            console.log("❌ User authenticated via OAuth, no password set");
            throw new Error("Please sign in with Google");
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(validatedCredentials.password, user.password);
          if (!isValidPassword) {
            console.log("❌ Password mismatch");
            throw new Error("Invalid email or password");
          }

          console.log("✅ Authentication successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && profile?.email) {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          });

          if (!existingUser) {
            // Create new user for Google OAuth
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || null,
                image: profile.image || null,
                provider: 'google',
              }
            });
            console.log("✅ Created new Google OAuth user:", profile.email);
          }
        }
        return true;
      } catch (error) {
        console.error("❌ Error in signIn callback:", error);
        return false;
      }
    },
  },
};

// Helper function to create users (for signup)
export async function createUser(userData: { name: string; email: string; password: string; image?: string }) {
  try {
    // Validate user data
    const validatedData = userSchema.parse(userData);

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        image: validatedData.image,
        provider: 'credentials',
      }
    });

    console.log("👤 Created user:", { id: user.id, email: user.email, name: user.name });
    return user;
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw error;
  }
}

// Helper function to find user by email
export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email }
    });
  } catch (error) {
    console.error("❌ Error finding user:", error);
    return null;
  }
}

// Password reset helper functions
export async function generatePasswordResetToken(email: string): Promise<string> {
  try {
    // Generate a secure random token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Clean up expired tokens first
    await prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        token,
        email,
        expiresAt,
      }
    });

    return token;
  } catch (error) {
    console.error("❌ Error generating reset token:", error);
    throw new Error("Failed to generate reset token");
  }
}

export async function validatePasswordResetToken(token: string): Promise<string | null> {
  try {
    const tokenData = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!tokenData) {
      return null;
    }

    if (tokenData.expiresAt < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      return null;
    }

    return tokenData.email;
  } catch (error) {
    console.error("❌ Error validating reset token:", error);
    return null;
  }
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const result = await prisma.user.updateMany({
      where: { email },
      data: { password: hashedPassword }
    });

    return result.count > 0;
  } catch (error) {
    console.error("❌ Error updating password:", error);
    return false;
  }
}
