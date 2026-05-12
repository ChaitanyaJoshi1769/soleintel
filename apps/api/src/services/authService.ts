import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthService {
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  async register(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = this.hashPassword(password);
    const extensionToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        extensionToken,
        tier: 'free',
      },
    });

    // Initialize free subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'free',
        status: 'active',
        billingEmail: email,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    if (!this.verifyPassword(password, user.passwordHash)) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      token,
      extensionToken: user.extensionToken,
      subscription: user.subscription,
    };
  }

  async loginWithExtensionToken(extensionToken: string) {
    const user = await prisma.user.findUnique({
      where: { extensionToken },
      include: { subscription: true },
    });

    if (!user) {
      throw new Error('Invalid extension token');
    }

    const token = this.generateToken(user.id, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
      token,
      subscription: user.subscription,
    };
  }

  generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email, iat: Date.now() },
      JWT_SECRET,
      { expiresIn: '30d' },
    );
  }

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return { userId: decoded.userId, email: decoded.email };
    } catch {
      return null;
    }
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      include: { subscription: true },
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new Error('User not found');
    }

    if (!this.verifyPassword(oldPassword, user.passwordHash)) {
      throw new Error('Incorrect current password');
    }

    const newHash = this.hashPassword(newPassword);
    return await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }

  async refreshToken(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return this.generateToken(user.id, user.email);
  }

  async regenerateExtensionToken(userId: string) {
    const newToken = crypto.randomBytes(32).toString('hex');
    return await prisma.user.update({
      where: { id: userId },
      data: { extensionToken: newToken },
    });
  }
}

export function getAuthService() {
  return new AuthService();
}
