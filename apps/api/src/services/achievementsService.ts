/**
 * Achievements Service
 * Handles achievement unlocking and tracking
 */

import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

interface AchievementDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
  threshold?: number;
}

export class AchievementsService {
  private achievements: Map<string, AchievementDefinition> = new Map([
    [
      'first_watchlist',
      {
        type: 'first_watchlist',
        name: '👀 First Watchlist',
        description: 'Created your first watchlist',
        icon: '👀',
      },
    ],
    [
      'deal_spotter',
      {
        type: 'deal_spotter',
        name: '🎯 Deal Spotter',
        description: 'Found a price drop before 100 other users',
        icon: '🎯',
        threshold: 100,
      },
    ],
    [
      'category_expert',
      {
        type: 'category_expert',
        name: '🏆 Category Expert',
        description: 'Track 50+ items in one category',
        icon: '🏆',
        threshold: 50,
      },
    ],
    [
      'price_prophet',
      {
        type: 'price_prophet',
        name: '🔮 Price Prophet',
        description: 'Successfully use price predictions 10 times',
        icon: '🔮',
        threshold: 10,
      },
    ],
    [
      'social_butterfly',
      {
        type: 'social_butterfly',
        name: '🦋 Social Butterfly',
        description: 'Share your watchlist 5+ times',
        icon: '🦋',
        threshold: 5,
      },
    ],
    [
      'affiliate_king',
      {
        type: 'affiliate_king',
        name: '👑 Affiliate King',
        description: 'Earn $100+ in affiliate commissions',
        icon: '👑',
        threshold: 100,
      },
    ],
  ]);

  /**
   * Get all achievements for a user
   */
  async getUserAchievements(userId: string) {
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });

    return achievements.map((achievement) => ({
      id: achievement.id,
      type: achievement.achievementType,
      name: achievement.achievementName,
      description: achievement.description,
      icon: achievement.icon,
      unlockedAt: achievement.unlockedAt,
    }));
  }

  /**
   * Check if user has an achievement
   */
  async hasAchievement(userId: string, achievementType: string): Promise<boolean> {
    const achievement = await prisma.achievement.findUnique({
      where: {
        userId_achievementType: {
          userId,
          achievementType,
        },
      },
    });

    return !!achievement;
  }

  /**
   * Unlock achievement for user
   */
  async unlockAchievement(userId: string, achievementType: string) {
    // Check if already unlocked
    const existing = await this.hasAchievement(userId, achievementType);
    if (existing) {
      return { success: false, message: 'Achievement already unlocked' };
    }

    const definition = this.achievements.get(achievementType);
    if (!definition) {
      throw new AppError('Invalid achievement type', 400);
    }

    const achievement = await prisma.achievement.create({
      data: {
        userId,
        achievementType: definition.type,
        achievementName: definition.name,
        description: definition.description,
        icon: definition.icon,
      },
    });

    return {
      success: true,
      achievement: {
        id: achievement.id,
        type: achievement.achievementType,
        name: achievement.achievementName,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: achievement.unlockedAt,
      },
    };
  }

  /**
   * Trigger achievements based on user actions
   */
  async checkAndUnlockAchievements(userId: string, event: string, data?: any) {
    const achievements = [];

    switch (event) {
      case 'watchlist_created':
        if (!(await this.hasAchievement(userId, 'first_watchlist'))) {
          const result = await this.unlockAchievement(userId, 'first_watchlist');
          if (result.success) achievements.push(result.achievement);
        }
        break;

      case 'price_drop_found':
        // Check if this is one of the first 100 to find this drop
        if (data?.isEarlyFinder && !(await this.hasAchievement(userId, 'deal_spotter'))) {
          const result = await this.unlockAchievement(userId, 'deal_spotter');
          if (result.success) achievements.push(result.achievement);
        }
        break;

      case 'category_expert_check':
        // Check if user has 50+ items in a category
        if (data?.itemCount >= 50 && !(await this.hasAchievement(userId, 'category_expert'))) {
          const result = await this.unlockAchievement(userId, 'category_expert');
          if (result.success) achievements.push(result.achievement);
        }
        break;

      case 'prediction_used':
        // Track prediction usage
        const predictions = await prisma.pricePrediction.count({
          where: { productId: { in: data?.productIds || [] } },
        });

        if (predictions >= 10 && !(await this.hasAchievement(userId, 'price_prophet'))) {
          const result = await this.unlockAchievement(userId, 'price_prophet');
          if (result.success) achievements.push(result.achievement);
        }
        break;

      case 'watchlist_shared':
        // Check if user has shared 5+ times
        const shareCount = await prisma.sharedWatchlist.count({
          where: { ownerUserId: userId },
        });

        if (shareCount >= 5 && !(await this.hasAchievement(userId, 'social_butterfly'))) {
          const result = await this.unlockAchievement(userId, 'social_butterfly');
          if (result.success) achievements.push(result.achievement);
        }
        break;

      case 'affiliate_earnings_check':
        // Check if user has earned $100+ in commissions
        const affiliate = await prisma.affiliateAccount.findUnique({
          where: { userId },
        });

        if (affiliate && affiliate.totalCommissions >= 100 && !(await this.hasAchievement(userId, 'affiliate_king'))) {
          const result = await this.unlockAchievement(userId, 'affiliate_king');
          if (result.success) achievements.push(result.achievement);
        }
        break;
    }

    return achievements;
  }

  /**
   * Get achievement progress for a user
   */
  async getAchievementProgress(userId: string) {
    const unlockedCount = await prisma.achievement.count({
      where: { userId },
    });

    const totalCount = this.achievements.size;

    // Get details on progress toward locked achievements
    const lockedAchievements = [];

    // Check categories tracked
    const categoryCount = await prisma.watchlist.groupBy({
      by: ['userId'],
      where: { userId },
      _count: true,
    });

    const watchlistsPerCategory = await prisma.watchlist.count({
      where: { userId },
    });

    // Check affiliate earnings
    const affiliate = await prisma.affiliateAccount.findUnique({
      where: { userId },
    });

    const affiliateEarnings = affiliate?.totalCommissions || 0;

    // Check shared watchlists
    const shareCount = await prisma.sharedWatchlist.count({
      where: { ownerUserId: userId },
    });

    return {
      unlockedCount,
      totalCount,
      completionPercentage: ((unlockedCount / totalCount) * 100).toFixed(1),
      progress: {
        category_expert: {
          current: watchlistsPerCategory,
          target: 50,
          completed: watchlistsPerCategory >= 50,
        },
        social_butterfly: {
          current: shareCount,
          target: 5,
          completed: shareCount >= 5,
        },
        affiliate_king: {
          current: affiliateEarnings,
          target: 100,
          completed: affiliateEarnings >= 100,
        },
      },
    };
  }

  /**
   * Get leaderboard of achievements
   */
  async getAchievementLeaderboard(limit: number = 20) {
    const leaderboard = await prisma.achievement.groupBy({
      by: ['userId'],
      _count: true,
      orderBy: { _count: { userId: 'desc' } },
      take: limit,
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: leaderboard.map((entry) => entry.userId),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      user: userMap.get(entry.userId),
      achievementCount: entry._count.userId,
    }));
  }
}

export const achievementsService = new AchievementsService();
