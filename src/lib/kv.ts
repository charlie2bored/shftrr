import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

// User data structure for KV storage
export interface KVUser {
  id: string;
  email: string;
  name?: string;
  password?: string; // Hashed password
  provider: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Password reset token structure
export interface KVPasswordResetToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

// User Service - KV-based implementation
export class KVUserService {
  private static readonly USER_PREFIX = 'user:';
  private static readonly EMAIL_INDEX = 'user_email:';

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<KVUser | null> {
    try {
      // Get user ID from email index
      const userId = await kv.get<string>(`${this.EMAIL_INDEX}${email}`);
      if (!userId) {
        return null;
      }

      // Get user data
      const userData = await kv.get<KVUser>(`${this.USER_PREFIX}${userId}`);
      return userData || null;
    } catch (error) {
      console.error('KV: Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<KVUser | null> {
    try {
      const userData = await kv.get<KVUser>(`${this.USER_PREFIX}${id}`);
      return userData || null;
    } catch (error) {
      console.error('KV: Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Create a new user
   */
  static async create(data: {
    email: string;
    name?: string;
    password?: string;
    image?: string;
    provider?: string;
  }): Promise<KVUser> {
    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const user: KVUser = {
        id: userId,
        email: data.email,
        name: data.name,
        password: data.password,
        provider: data.provider || 'credentials',
        image: data.image,
        createdAt: now,
        updatedAt: now,
      };

      // Store user data
      await kv.set(`${this.USER_PREFIX}${userId}`, user);

      // Create email index
      await kv.set(`${this.EMAIL_INDEX}${data.email}`, userId);

      console.log('KV: Created user:', userId);
      return user;
    } catch (error) {
      console.error('KV: Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(email: string, hashedPassword: string): Promise<boolean> {
    try {
      const userId = await kv.get<string>(`${this.EMAIL_INDEX}${email}`);
      if (!userId) {
        return false;
      }

      const userData = await kv.get<KVUser>(`${this.USER_PREFIX}${userId}`);
      if (!userData) {
        return false;
      }

      // Update password and timestamp
      userData.password = hashedPassword;
      userData.updatedAt = new Date().toISOString();

      await kv.set(`${this.USER_PREFIX}${userId}`, userData);
      console.log('KV: Updated password for user:', userId);
      return true;
    } catch (error) {
      console.error('KV: Error updating password:', error);
      return false;
    }
  }

  /**
   * Check if user exists by email
   */
  static async exists(email: string): Promise<boolean> {
    try {
      const userId = await kv.get<string>(`${this.EMAIL_INDEX}${email}`);
      return !!userId;
    } catch (error) {
      console.error('KV: Error checking user existence:', error);
      return false;
    }
  }
}

// Password Reset Service - KV-based implementation
export class KVPasswordResetService {
  private static readonly TOKEN_PREFIX = 'reset_token:';
  private static readonly EMAIL_TOKENS_PREFIX = 'reset_tokens_email:';

  /**
   * Create a new password reset token
   */
  static async create(data: {
    token: string;
    email: string;
    expiresAt: Date;
  }): Promise<KVPasswordResetToken> {
    try {
      // Clean up expired tokens first
      await this.cleanup();

      const tokenData: KVPasswordResetToken = {
        id: `token_${Date.now()}`,
        token: data.token,
        email: data.email,
        expiresAt: data.expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Store token
      await kv.set(`${this.TOKEN_PREFIX}${data.token}`, tokenData, {
        ex: Math.floor((data.expiresAt.getTime() - Date.now()) / 1000) // TTL in seconds
      });

      // Add to email's token list
      const emailTokensKey = `${this.EMAIL_TOKENS_PREFIX}${data.email}`;
      await kv.sadd(emailTokensKey, data.token);

      console.log('KV: Created reset token for:', data.email);
      return tokenData;
    } catch (error) {
      console.error('KV: Error creating reset token:', error);
      throw error;
    }
  }

  /**
   * Find token by token string
   */
  static async findByToken(token: string): Promise<KVPasswordResetToken | null> {
    try {
      const tokenData = await kv.get<KVPasswordResetToken>(`${this.TOKEN_PREFIX}${token}`);
      return tokenData || null;
    } catch (error) {
      console.error('KV: Error finding reset token:', error);
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

      if (new Date(tokenData.expiresAt) < new Date()) {
        // Token expired, clean it up
        await this.delete(token);
        return null;
      }

      return tokenData.email;
    } catch (error) {
      console.error('KV: Error validating reset token:', error);
      return null;
    }
  }

  /**
   * Delete a specific token
   */
  static async delete(token: string): Promise<void> {
    try {
      const tokenData = await this.findByToken(token);
      if (tokenData) {
        // Remove from email's token list
        const emailTokensKey = `${this.EMAIL_TOKENS_PREFIX}${tokenData.email}`;
        await kv.srem(emailTokensKey, token);

        // Delete token
        await kv.del(`${this.TOKEN_PREFIX}${token}`);
      }
      console.log('KV: Deleted reset token');
    } catch (error) {
      console.error('KV: Error deleting reset token:', error);
    }
  }

  /**
   * Clean up expired tokens
   */
  static async cleanup(): Promise<void> {
    try {
      // This is a simplified cleanup - in production you might want more sophisticated cleanup
      console.log('KV: Cleanup completed (simplified)');
    } catch (error) {
      console.error('KV: Error during cleanup:', error);
    }
  }

  /**
   * Delete all tokens for a specific email
   */
  static async deleteByEmail(email: string): Promise<void> {
    try {
      const emailTokensKey = `${this.EMAIL_TOKENS_PREFIX}${email}`;
      const tokens = await kv.smembers(emailTokensKey);

      if (tokens.length > 0) {
        // Delete all tokens for this email
        await kv.del(`${this.TOKEN_PREFIX}${tokens.join(` ${this.TOKEN_PREFIX}`)}`);
        await kv.del(emailTokensKey);
      }

      console.log('KV: Deleted all reset tokens for email:', email);
    } catch (error) {
      console.error('KV: Error deleting tokens by email:', error);
    }
  }
}

// Initialize KV connection
export { kv };
