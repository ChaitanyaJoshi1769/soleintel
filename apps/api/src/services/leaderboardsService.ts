/**
 * Leaderboards Service
 * Handles leaderboard rankings and calculations
 */

import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class LeaderboardsService {
  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(limit: number = 20, offset: number = 0) {
    const leaderboard = await this._getLeaderboard('weekly', limit, offset);
    return {
      period: 'weekly',
      startDate: this._getWeekStart(),
      endDate: new Date(),
      leaderboard,
    };
  }

  /**
   * Get monthly leaderboard
   */
  async getMonthlyLeaderboard(limit: number = 20, offset: number = 0) {
    const leaderboard = await this._getLeaderboard('monthly', limit, offset);
    return {
      period: 'monthly',
      startDate: this._getMonthStart(),
      endDate: new Date(),
      leaderboard,
    };
  }

  /**
   * Get all-time leaderboard
   */
  async getAllTimeLeaderboard(limit: number = 20, offset: number = 0) {
    const leaderboard = await this._getLeaderboard('alltime', limit, offset);
    return {
      period: 'alltime',
      leaderboard,
    };
  }

  /**
   * Get category-specific leaderboard
   */
  async getCategoryLeaderboard(categoryId: string, period: string = 'weekly', limit: number = 20) {
    // Get users tracking in this category with their savings
    const watchlists = await prisma.watchlist.findMany({
      where: {
        product: {
          categoryId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
          },
        },
      },
    });

    // Group by user and calculate savings
    const userStats: Map<string, any> = new Map();

    for (const watchlist of watchlists) {
      const userId = watchlist.userId;
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          user: watchlist.user,
          dealsFound: 0,
          totalSavings: 0,
          avgSavingsPerDeal: 0,
        });
      }

      // Get price drops for this product
      const priceHistory = await prisma.priceHistory.findMany({
        where: { productId: watchlist.product.id },
        orderBy: { date: 'asc' },
        take: 100,
      });

      if (priceHistory.length >= 2) {
        let totalDrop = 0;
        let drops = 0;

        for (let i = 1; i < priceHistory.length; i++) {
          if (priceHistory[i].price < priceHistory[i - 1].price) {
            totalDrop += priceHistory[i - 1].price - priceHistory[i].price;
            drops++;
          }
        }

        const stats = userStats.get(userId)!;
        stats.dealsFound += drops;
        stats.totalSavings += totalDrop;
      }
    }

    // Calculate averages and sort
    const leaderboard = Array.from(userStats.values())
      .map((stat, index) => ({
        rank: index + 1,
        user: stat.user,
        totalSavings: stat.totalSavings.toFixed(2),
        dealsFound: stat.dealsFound,
        avgSavingsPerDeal:
          stat.dealsFound > 0 ? (stat.totalSavings / stat.dealsFound).toFixed(2) : '0.00',
      }))
      .sort((a, b) => parseFloat(b.totalSavings) - parseFloat(a.totalSavings))
      .slice(0, limit);

    return {
      period,
      category: categoryId,
      leaderboard,
    };
  }

  /**
   * Get user's rank in leaderboard
   */
  async getUserRank(userId: string, period: string = 'weekly') {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { period },
      orderBy: { totalSavings: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const userEntry = entries.find((e) => e.userId === userId);

    if (!userEntry) {
      return {
        userId,
        rank: null,
        totalRanked: entries.length,
        message: 'User not in leaderboard yet',
      };
    }

    const rank = entries.findIndex((e) => e.userId === userId) + 1;

    return {
      userId,
      rank,
      totalRanked: entries.length,
      totalSavings: userEntry.totalSavings.toFixed(2),
      dealsFound: userEntry.dealsFound,
      avgSavingsPerDeal: userEntry.avgSavingsPerDeal.toFixed(2),
    };
  }

  /**
   * Update leaderboard entries (called periodically)
   * This should be run as a scheduled task
   */
  async updateLeaderboards() {
    const periods = ['weekly', 'monthly', 'alltime'];

    for (const period of periods) {
      await this._updateLeaderboardForPeriod(period);
    }

    return { success: true, message: 'Leaderboards updated' };
  }

  /**
   * Get leaderboard stats
   */
  async getLeaderboardStats() {
    const weeklyCount = await prisma.leaderboardEntry.count({
      where: { period: 'weekly' },
    });

    const monthlyCount = await prisma.leaderboardEntry.count({
      where: { period: 'monthly' },
    });

    const alltimeCount = await prisma.leaderboardEntry.count({
      where: { period: 'alltime' },
    });

    return {
      weekly: weeklyCount,
      monthly: monthlyCount,
      alltime: alltimeCount,
      lastUpdated: new Date(),
    };
  }

  // ============ PRIVATE METHODS ============

  private async _getLeaderboard(period: string, limit: number, offset: number) {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { period },
      take: limit,
      skip: offset,
      orderBy: { totalSavings: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return entries.map((entry, index) => ({
      rank: offset + index + 1,
      user: entry.user,
      totalSavings: entry.totalSavings.toFixed(2),
      dealsFound: entry.dealsFound,
      avgSavingsPerDeal: entry.avgSavingsPerDeal.toFixed(2),
    }));
  }

  private async _updateLeaderboardForPeriod(period: string) {
    // Get date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'weekly':
        startDate = this._getWeekStart();
        break;
      case 'monthly':
        startDate = this._getMonthStart();
        break;
      case 'alltime':
        startDate = new Date('2024-01-01'); // Start of SOLEINTEL
        break;
      default:
        startDate = new Date();
    }

    // Get all users with their savings in period
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    const leaderboardData = [];

    for (const user of users) {
      const watchlists = await prisma.watchlist.findMany({
        where: { userId: user.id },
        select: { productId: true },
      });

      let totalSavings = 0;
      let dealsFound = 0;

      for (const watchlist of watchlists) {
        const priceHistory = await prisma.priceHistory.findMany({
          where: {
            productId: watchlist.productId,
            date: { gte: startDate },
          },
          orderBy: { date: 'asc' },
        });

        for (let i = 1; i < priceHistory.length; i++) {
          if (priceHistory[i].price < priceHistory[i - 1].price) {
            totalSavings += priceHistory[i - 1].price - priceHistory[i].price;
            dealsFound++;
          }
        }
      }

      if (dealsFound > 0) {
        leaderboardData.push({
          userId: user.id,
          period,
          totalSavings,
          dealsFound,
          avgSavingsPerDeal: totalSavings / dealsFound,
          updatedAt: new Date(),
        });
      }
    }

    // Sort and add ranks
    leaderboardData.sort((a, b) => b.totalSavings - a.totalSavings);

    // Clear old entries and insert new ones
    await prisma.leaderboardEntry.deleteMany({ where: { period } });

    for (let i = 0; i < leaderboardData.length; i++) {
      await prisma.leaderboardEntry.create({
        data: {
          ...leaderboardData[i],
          rank: i + 1,
        },
      });
    }
  }

  private _getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  }

  private _getMonthStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

export const leaderboardsService = new LeaderboardsService();
