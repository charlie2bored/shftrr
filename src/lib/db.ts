/**
 * Database utilities and optimized query functions
 * This file contains reusable database operations with proper indexing and caching
 */

import { prisma } from './prisma';
import type { User, PasswordResetToken } from '@prisma/client';

/**
 * Optimized user queries with proper error handling
 */
export class UserService {
  /**
   * Find user by email with minimal data selection
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      console.log('🔍 DB: Finding user by email:', email);
      return await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          image: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error('❌ DB: Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find user by ID with minimal data selection
   */
  static async findById(id: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'image' | 'provider' | 'createdAt' | 'updatedAt'> | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Create a new user with validation
   */
  static async create(data: {
    email: string;
    name?: string;
    password?: string;
    image?: string;
    provider?: string;
  }): Promise<Pick<User, 'id' | 'email' | 'name' | 'image' | 'provider' | 'createdAt' | 'updatedAt'>> {
    try {
      return await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.password,
          image: data.image,
          provider: data.provider || 'credentials',
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user password securely
   */
  static async updatePassword(email: string, hashedPassword: string): Promise<boolean> {
    try {
      const result = await prisma.user.updateMany({
        where: { email },
        data: { password: hashedPassword, updatedAt: new Date() },
      });
      return result.count > 0;
    } catch (error) {
      console.error('Error updating user password:', error);
      return false;
    }
  }

  /**
   * Check if user exists by email (for validation)
   */
  static async exists(email: string): Promise<boolean> {
    try {
      const count = await prisma.user.count({
        where: { email },
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }
}

/**
 * Optimized password reset token operations
 */
export class PasswordResetService {
  /**
   * Create a new password reset token
   */
  static async create(data: {
    token: string;
    email: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> {
    try {
      // Clean up expired tokens first
      await this.cleanup();

      return await prisma.passwordResetToken.create({
        data,
      });
    } catch (error) {
      console.error('Error creating password reset token:', error);
      throw error;
    }
  }

  /**
   * Find token by token string
   */
  static async findByToken(token: string): Promise<PasswordResetToken | null> {
    try {
      return await prisma.passwordResetToken.findUnique({
        where: { token },
      });
    } catch (error) {
      console.error('Error finding password reset token:', error);
      return null;
    }
  }

  /**
   * Validate token and return email if valid
   */
  static async validateToken(token: string): Promise<string | null> {
    try {
      const tokenData = await this.findByToken(token);

      if (!tokenData) {
        return null;
      }

      if (tokenData.expiresAt < new Date()) {
        // Delete expired token
        await this.delete(token);
        return null;
      }

      return tokenData.email;
    } catch (error) {
      console.error('Error validating password reset token:', error);
      return null;
    }
  }

  /**
   * Delete a specific token
   */
  static async delete(token: string): Promise<void> {
    try {
      await prisma.passwordResetToken.delete({
        where: { token },
      });
    } catch (error) {
      console.error('Error deleting password reset token:', error);
    }
  }

  /**
   * Clean up expired tokens (called automatically on create)
   */
  static async cleanup(): Promise<void> {
    try {
      const result = await prisma.passwordResetToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(`🧹 Cleaned up ${result.count} expired password reset tokens`);
      }
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
    }
  }

  /**
   * Delete all tokens for a specific email
   */
  static async deleteByEmail(email: string): Promise<void> {
    try {
      await prisma.passwordResetToken.deleteMany({
        where: { email },
      });
    } catch (error) {
      console.error('Error deleting tokens by email:', error);
    }
  }
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Simple health check query
    await prisma.$queryRaw`SELECT 1`;

    const latency = Date.now() - startTime;

    return {
      status: 'healthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  userCount: number;
  tokenCount: number;
  dbSize?: string;
}> {
  try {
    const [userCount, tokenCount] = await Promise.all([
      prisma.user.count(),
      prisma.passwordResetToken.count(),
    ]);

    return {
      userCount,
      tokenCount,
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}