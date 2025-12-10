// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/User';
import { cacheService } from './cache.service';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  firm_name: string;
  role?: 'admin' | 'investor' | 'analyst';
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
  private readonly JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';
  private readonly REFRESH_EXPIRE = '7d';
  private readonly TOKEN_BLACKLIST_PREFIX = 'blacklist:';
  private readonly REFRESH_TOKEN_PREFIX = 'refresh:';

  /**
   * Register a new user
   */
  async registerUser(userData: RegisterUserDto): Promise<IUser> {
    const user = new User({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      firm_name: userData.firm_name,
      role: userData.role || 'analyst',
    });

    await user.save();
    return user;
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return (await User.findOne({ email, is_active: true })) as IUser | null;
  }

  /**
   * Find user by email with password field
   */
  async findUserByEmailWithPassword(email: string): Promise<IUser | null> {
    return (await User.findOne({ email, is_active: true }).select(
      '+password'
    )) as IUser | null;
  }

  /**
   * Find user by ID
   */
  async findUserById(userId: string): Promise<IUser | null> {
    return (await User.findById(userId)) as IUser | null;
  }

  /**
   * Find user by ID with password field
   */
  async findUserByIdWithPassword(userId: string): Promise<IUser | null> {
    return (await User.findById(userId).select('+password')) as IUser | null;
  }

  /**
   * Generate access token
   */
  generateAccessToken(userId: string): string {
    return jwt.sign({ userId, type: 'access' }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRE,
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRE,
    });
  }

  /**
   * Generate both access and refresh tokens with expiry
   */
  generateTokens(
    userId: string
  ): {
    access: { token: string; expires: Date };
    refresh: { token: string; expires: Date };
  } {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    const decodedAccess = jwtDecode<{ exp: number }>(accessToken);
    const decodedRefresh = jwtDecode<{ exp: number }>(refreshToken);

    return {
      access: {
        token: accessToken,
        expires: new Date(decodedAccess.exp * 1000), // exp is in seconds, convert to ms
      },
      refresh: {
        token: refreshToken,
        expires: new Date(decodedRefresh.exp * 1000), // exp is in seconds, convert to ms
      },
    };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      if (decoded.type !== 'access') {
        return null;
      }
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.REFRESH_SECRET) as any;
      if (decoded.type !== 'refresh') {
        return null;
      }
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  /**
   * Save refresh token to Redis
   */
  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    const expirySeconds = 7 * 24 * 60 * 60; // 7 days
    await cacheService.set(key, token, expirySeconds);
  }

  /**
   * Get refresh token from Redis
   */
  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    return await cacheService.get(key);
  }

  /**
   * Delete refresh token from Redis
   */
  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    await cacheService.delete(key);
  }

  /**
   * Blacklist a token (for logout)
   */
  async blacklistToken(token: string): Promise<void> {
    const key = `${this.TOKEN_BLACKLIST_PREFIX}${token}`;
    const expirySeconds = 24 * 60 * 60; // 24 hours
    await cacheService.set(key, 'blacklisted', expirySeconds);
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `${this.TOKEN_BLACKLIST_PREFIX}${token}`;
    const value = await cacheService.get(key);
    return value === 'blacklisted';
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: any): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(userId: string): string {
    return jwt.sign({ userId, type: 'password-reset' }, this.JWT_SECRET, { expiresIn: '1h' });
  }

  /**
   * Verify password reset token
   */
  verifyPasswordResetToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      if (decoded.type !== 'password-reset') {
        return null;
      }
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
