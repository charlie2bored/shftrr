import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Simple in-memory user store for demo (replace with database later)
const users: any[] = [];

// Password reset tokens store (in production, use Redis or database)
const passwordResetTokens: { [token: string]: { email: string; expires: Date } } = {};

// Debug: Add a test user for immediate testing
users.push({
  id: "test-user-1",
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  image: null,
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
        console.log("🔐 Auth attempt - Raw credentials:", credentials);
        console.log("🔐 Auth attempt - Email:", credentials?.email, "Password exists:", !!credentials?.password);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Email and password are required");
        }

        // Find user in memory store
        const user = users.find(u => u.email === credentials.email);
        console.log("👤 Found user:", user ? "YES" : "NO");

        if (!user) {
          console.log("❌ User not found in store");
          throw new Error("Invalid email or password");
        }

        // Simple password check (in production, use bcrypt)
        if (user.password !== credentials.password) {
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
      // Skip user ID assignment for now - using simplified auth
      return session;
    },
  },
};

// Helper function to add users (for signup)
export function addUser(user: { id: string; name: string; email: string; password: string; image?: string }) {
  console.log("👤 Adding user:", { id: user.id, email: user.email, name: user.name });
  users.push(user);
  console.log("📊 Total users in store:", users.length);
}

// Helper function to find user by email
export function findUserByEmail(email: string) {
  return users.find(u => u.email === email);
}

// Password reset helper functions
export function generatePasswordResetToken(email: string): string {
  // Generate a secure random token (in production, use crypto.randomBytes)
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  passwordResetTokens[token] = { email, expires };

  // Clean up expired tokens
  Object.keys(passwordResetTokens).forEach(key => {
    if (passwordResetTokens[key].expires < new Date()) {
      delete passwordResetTokens[key];
    }
  });

  return token;
}

export function validatePasswordResetToken(token: string): string | null {
  const tokenData = passwordResetTokens[token];

  if (!tokenData) {
    return null;
  }

  if (tokenData.expires < new Date()) {
    delete passwordResetTokens[token];
    return null;
  }

  return tokenData.email;
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const user = users.find(u => u.email === email);
  if (!user) {
    return false;
  }

  user.password = newPassword;
  return true;
}

export function clearExpiredTokens(): void {
  Object.keys(passwordResetTokens).forEach(key => {
    if (passwordResetTokens[key].expires < new Date()) {
      delete passwordResetTokens[key];
    }
  });
}
