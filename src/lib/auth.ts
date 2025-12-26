import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Simple in-memory user store for demo (replace with database later)
const users: any[] = [];

// Debug: Add a test user for immediate testing
users.push({
  id: "test-user-1",
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  image: null,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Auth attempt:", { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        // Find user in memory store
        const user = users.find(u => u.email === credentials.email);
        console.log("👤 Found user:", user ? "YES" : "NO");

        if (!user) {
          console.log("❌ User not found in store");
          return null;
        }

        // Simple password check (in production, use bcrypt)
        if (user.password !== credentials.password) {
          console.log("❌ Password mismatch");
          return null;
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
