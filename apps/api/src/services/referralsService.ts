/**
 * Referrals Service
 * Handles referral program management and tracking
 */

import prisma from '../config/database';
import { generateSecureToken } from '../utils/security';
import { AppError } from '../middleware/errorHandler';

export class ReferralsService {
  /**
   * Generate a unique referral code for a user
   */
  async generateReferralCode(userId: string) {
    // Check if user already has a referral
    const existing = await prisma.referral.findFirst({
      where: { referrerId: userId },
    });

    if (existing) {
      return {
        referralCode: existing.referralCode,
        referralUrl: `${process.env.FRONTEND_URL}/join?ref=${existing.referralCode}`,
        reward: `$${existing.rewardPerReferral.toFixed(2)} per referral`,
        referralCount: existing.referredUserCount,
        totalEarned: existing.totalEarned.toFixed(2),
      };
    }

    // Generate unique referral code
    let referralCode = '';
    let isUnique = false;

    while (!isUnique) {
      // Format: FIRSTNAME + random string (e.g., "JAY123XYZ")
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      const namePrefix = user?.name?.substring(0, 3).toUpperCase() || 'REF';
      const randomSuffix = (Math.random().toString(36).substring(2, 8)).toUpperCase();
      referralCode = `${namePrefix}${randomSuffix}`;

      const existingCode = await prisma.referral.findUnique({
        where: { referralCode },
      });

      isUnique = !existingCode;
    }

    const referral = await prisma.referral.create({
      data: {
        referrerId: userId,
        referralCode,
        rewardPerReferral: 5.0, // Default $5 per referral
      },
    });

    return {
      referralCode: referral.referralCode,
      referralUrl: `${process.env.FRONTEND_URL}/join?ref=${referral.referralCode}`,
      reward: `$${referral.rewardPerReferral.toFixed(2)} per referral`,
      referralCount: referral.referredUserCount,
      totalEarned: referral.totalEarned.toFixed(2),
    };
  }

  /**
   * Track a successful referral
   */
  async processReferral(referralCode: string, referredUserId: string) {
    const referral = await prisma.referral.findUnique({
      where: { referralCode },
    });

    if (!referral) {
      throw new AppError('Invalid referral code', 400);
    }

    if (!referral.active) {
      throw new AppError('This referral code is no longer active', 400);
    }

    // Check if user was already referred
    const existing = await prisma.referralHistory.findFirst({
      where: { referredUserId },
    });

    if (existing) {
      throw new AppError('User was already referred by someone else', 400);
    }

    // Create referral history record
    const history = await prisma.referralHistory.create({
      data: {
        referralId: referral.id,
        referredUserId,
        rewardAmount: referral.rewardPerReferral,
        rewardStatus: 'pending',
      },
    });

    // Update referral count and earnings
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        referredUserCount: { increment: 1 },
        totalEarned: { increment: referral.rewardPerReferral },
      },
    });

    return {
      success: true,
      message: 'Referral processed successfully',
      reward: referral.rewardPerReferral,
    };
  }

  /**
   * Get referral stats for a user
   */
  async getReferralStats(userId: string) {
    const referral = await prisma.referral.findFirst({
      where: { referrerId: userId },
      include: {
        history: {
          select: {
            id: true,
            referredUserId: true,
            rewardAmount: true,
            rewardStatus: true,
            createdAt: true,
          },
        },
      },
    });

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    return {
      referralCode: referral.referralCode,
      referralUrl: `${process.env.FRONTEND_URL}/join?ref=${referral.referralCode}`,
      totalReferrals: referral.referredUserCount,
      totalEarned: referral.totalEarned.toFixed(2),
      rewardPerReferral: `$${referral.rewardPerReferral.toFixed(2)}`,
      referrals: referral.history.map((h) => ({
        id: h.id,
        userId: h.referredUserId,
        reward: h.rewardAmount.toFixed(2),
        status: h.rewardStatus,
        referredAt: h.createdAt,
      })),
    };
  }

  /**
   * Get referral history for a referred user
   */
  async getReferrerInfo(userId: string) {
    const referralHistory = await prisma.referralHistory.findFirst({
      where: { referredUserId: userId },
      include: {
        referral: {
          select: {
            referrerId: true,
            referralCode: true,
            rewardPerReferral: true,
          },
        },
      },
    });

    if (!referralHistory) {
      return null;
    }

    const referrer = await prisma.user.findUnique({
      where: { id: referralHistory.referral.referrerId },
      select: { id: true, name: true },
    });

    return {
      referrerId: referrer?.id,
      referrerName: referrer?.name,
      referralCode: referralHistory.referral.referralCode,
      rewardReceived: referralHistory.rewardAmount.toFixed(2),
      rewardStatus: referralHistory.rewardStatus,
      referredAt: referralHistory.createdAt,
    };
  }

  /**
   * Complete referral rewards (move from pending to completed)
   */
  async completeReferralReward(referralHistoryId: string) {
    const history = await prisma.referralHistory.findUnique({
      where: { id: referralHistoryId },
    });

    if (!history) {
      throw new AppError('Referral history not found', 404);
    }

    if (history.rewardStatus === 'completed') {
      return { success: true, message: 'Reward already completed' };
    }

    // In production, this would create a transaction or credit to user account
    const updated = await prisma.referralHistory.update({
      where: { id: referralHistoryId },
      data: { rewardStatus: 'completed' },
    });

    return {
      success: true,
      message: 'Referral reward completed',
      reward: updated.rewardAmount.toFixed(2),
    };
  }

  /**
   * Get top referrers leaderboard
   */
  async getTopReferrers(limit: number = 20) {
    const topReferrers = await prisma.referral.findMany({
      take: limit,
      orderBy: { totalEarned: 'desc' },
      include: {
        referrer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return topReferrers.map((ref, index) => ({
      rank: index + 1,
      referrer: ref.referrer,
      referralCode: ref.referralCode,
      totalReferrals: ref.referredUserCount,
      totalEarned: ref.totalEarned.toFixed(2),
      rewardPerReferral: `$${ref.rewardPerReferral.toFixed(2)}`,
    }));
  }

  /**
   * Deactivate a referral code
   */
  async deactivateReferralCode(userId: string) {
    const referral = await prisma.referral.findFirst({
      where: { referrerId: userId },
    });

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    await prisma.referral.update({
      where: { id: referral.id },
      data: { active: false },
    });

    return { success: true, message: 'Referral code deactivated' };
  }

  /**
   * Get referral program info
   */
  async getProgramInfo() {
    return {
      name: 'SOLEINTEL Referral Program',
      description: 'Invite friends and earn rewards for each successful referral',
      rewardPerReferral: '$5 credit',
      bonusMilestones: [
        { referrals: 5, bonus: '$10 bonus credit' },
        { referrals: 10, bonus: '$30 bonus credit' },
        { referrals: 25, bonus: '$100 bonus credit' },
        { referrals: 50, bonus: '$300 bonus credit + premium subscription' },
      ],
      requirements: {
        minimumAccountAge: '1 day',
        validEmail: true,
        phoneVerified: false,
      },
    };
  }
}

export const referralsService = new ReferralsService();
