import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import { env } from './env';
import { schemas } from './validations';
import { UserService, PasswordResetService } from './db';

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Re-export validation schemas for backward compatibility
export const userSchema = schemas.user.register;
export const loginSchema = schemas.user.login;

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
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
          console.log("🔐 Auth attempt - Raw credentials:", credentials);
          console.log("🔐 Auth attempt - Email:", credentials?.email);
          console.log("🔐 Auth attempt - Password length:", credentials?.password?.length);

          // Validate input
          const validatedCredentials = loginSchema.parse(credentials);
          console.log("✅ Credentials validated for email:", validatedCredentials.email);

          // Find user in database
          const user = await UserService.findByEmail(validatedCredentials.email);
          console.log("🔍 User lookup result:", !!user);

          if (!user) {
            console.log("❌ User not found");
            throw new Error("Invalid email or password");
          }

          // Check if user has a password (OAuth users might not)
          if (!user.password) {
            console.log("❌ User authenticated via OAuth, no password set");
            throw new Error("Please sign in with Google");
          }

          console.log("🔑 Password hash exists, attempting comparison...");
          // Verify password
          const isValidPassword = await bcrypt.compare(validatedCredentials.password, user.password);
          console.log("🔍 Password verification result:", isValidPassword);

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
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && profile?.email) {
          // Dynamic import to avoid build-time issues
          const { prisma } = await import('./prisma');

          // Check if user exists
          const existingUser = await UserService.findByEmail(profile.email);

          if (!existingUser) {
            // Create new user for Google OAuth
            await UserService.create({
              email: profile.email,
              name: profile.name || undefined,
              image: profile.image || undefined,
              provider: 'google',
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

    // Check if user already exists
    const existingUser = await UserService.exists(validatedData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await UserService.create({
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword,
      image: validatedData.image,
      provider: 'credentials',
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
    return await UserService.findByEmail(email);
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

    // Create new token (cleanup happens automatically in the service)
    await PasswordResetService.create({
      token,
      email,
      expiresAt,
    });

    return token;
  } catch (error) {
    console.error("❌ Error generating reset token:", error);
    throw new Error("Failed to generate reset token");
  }
}

export async function validatePasswordResetToken(token: string): Promise<string | null> {
  try {
    return await PasswordResetService.validateToken(token);
  } catch (error) {
    console.error("❌ Error validating reset token:", error);
    return null;
  }
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return await UserService.updatePassword(email, hashedPassword);
  } catch (error) {
    console.error("❌ Error updating password:", error);
    return false;
  }
}
