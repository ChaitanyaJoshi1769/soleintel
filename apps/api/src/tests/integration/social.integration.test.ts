/**
 * Integration Tests for Social Features
 * Tests the complete flow: watchlist sharing → community deals → achievements → referrals → leaderboards
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../../config/database';
import { watchlistSharingService } from '../../services/watchlistSharingService';
import { communityDealsService } from '../../services/communityDealsService';
import { achievementsService } from '../../services/achievementsService';
import { referralsService } from '../../services/referralsService';
import { leaderboardsService } from '../../services/leaderboardsService';

describe('Social Features Integration Tests', () => {
  let testUserId: string;
  let testUser2Id: string;
  let testWatchlistId: string;
  let testProductId: string;
  let testShareToken: string;
  let testDealId: string;
  let testReferralCode: string;

  beforeAll(async () => {
    // Create test users
    const user1 = await prisma.user.create({
      data: {
        email: `test-social-${Date.now()}@example.com`,
        name: 'Test User 1',
        passwordHash: 'hashed_password',
      },
    });
    testUserId = user1.id;

    const user2 = await prisma.user.create({
      data: {
        email: `test-social-2-${Date.now()}@example.com`,
        name: 'Test User 2',
        passwordHash: 'hashed_password',
      },
    });
    testUser2Id = user2.id;

    // Create test product
    const product = await prisma.product.create({
      data: {
        title: 'Test Shoe for Social Features',
        brand: 'Nike',
        category: 'Shoes',
      },
    });
    testProductId = product.id;

    // Create test watchlist
    const watchlist = await prisma.watchlist.create({
      data: {
        userId: testUserId,
        productId: testProductId,
        targetPrice: 100.0,
      },
    });
    testWatchlistId = watchlist.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, testUser2Id] } },
    });
    await prisma.product.deleteMany({
      where: { id: testProductId },
    });
  });

  describe('Watchlist Sharing Flow', () => {
    it('should create a shareable watchlist link', async () => {
      const result = await watchlistSharingService.shareWatchlist(
        testWatchlistId,
        testUserId,
        ['view'],
        7
      );

      expect(result).toHaveProperty('shareToken');
      expect(result).toHaveProperty('publicUrl');
      expect(result.permissions).toContain('view');
      expect(result.expiresAt).toBeDefined();

      testShareToken = result.shareToken;
    });

    it('should access shared watchlist with valid token', async () => {
      const result = await watchlistSharingService.accessSharedWatchlist(testShareToken);

      expect(result.watchlist).toBeDefined();
      expect(result.owner).toBeDefined();
      expect(result.permissions).toContain('view');
      expect(result.viewCount).toBeGreaterThan(0);
    });

    it('should increment view count on access', async () => {
      const result1 = await watchlistSharingService.accessSharedWatchlist(testShareToken);
      const initialCount = result1.viewCount;

      const result2 = await watchlistSharingService.accessSharedWatchlist(testShareToken);
      expect(result2.viewCount).toBe(initialCount + 1);
    });

    it('should list user shared watchlists', async () => {
      const result = await watchlistSharingService.getUserSharedWatchlists(testUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('shareToken');
      expect(result[0]).toHaveProperty('viewCount');
    });

    it('should revoke share link', async () => {
      const result = await watchlistSharingService.revokeShareLink(testShareToken, testUserId);
      expect(result.success).toBe(true);

      // Verify it's revoked
      const shouldFail = watchlistSharingService.accessSharedWatchlist(testShareToken);
      await expect(shouldFail).rejects.toThrow();
    });
  });

  describe('Community Deals Flow', () => {
    it('should post a new community deal', async () => {
      const result = await communityDealsService.postDeal(
        testUserId,
        testProductId,
        79.99,
        199.99,
        'amazon',
        'Great deal on this shoe!'
      );

      expect(result).toHaveProperty('id');
      expect(result.author.id).toBe(testUserId);
      expect(result.dealPrice).toBe(79.99);
      expect(result.savingsPercentage).toContain('60');

      testDealId = result.id;
    });

    it('should not allow deal price >= original price', async () => {
      const shouldFail = communityDealsService.postDeal(
        testUserId,
        testProductId,
        199.99,
        199.99,
        'amazon',
        'Invalid deal'
      );

      await expect(shouldFail).rejects.toThrow();
    });

    it('should get trending deals', async () => {
      const result = await communityDealsService.getTrendingDeals(10, 0);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('upvotes');
      expect(result[0]).toHaveProperty('score');
    });

    it('should upvote a deal', async () => {
      const result = await communityDealsService.upvoteDeal(testDealId, testUser2Id);

      expect(result.upvotes).toBeGreaterThan(0);
    });

    it('should downvote a deal', async () => {
      const result = await communityDealsService.downvoteDeal(testDealId, testUser2Id);

      expect(result.downvotes).toBeGreaterThan(0);
    });

    it('should calculate deal score correctly', async () => {
      const deal = await communityDealsService.getDealDetails(testDealId);

      expect(deal).toHaveProperty('score');
      // Score = (upvotes * 2) - downvotes - (hoursOld * 0.5)
      expect(typeof deal.score).toBe('number');
    });
  });

  describe('Achievements Flow', () => {
    it('should unlock first_watchlist achievement', async () => {
      const result = await achievementsService.unlockAchievement(testUserId, 'first_watchlist');

      expect(result.success).toBe(true);
      expect(result.achievement.type).toBe('first_watchlist');
      expect(result.achievement.icon).toBe('👀');
    });

    it('should not double-unlock achievement', async () => {
      const result = await achievementsService.unlockAchievement(testUserId, 'first_watchlist');

      expect(result.success).toBe(false);
    });

    it('should get user achievements', async () => {
      const result = await achievementsService.getUserAchievements(testUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('icon');
    });

    it('should get achievement progress', async () => {
      const result = await achievementsService.getAchievementProgress(testUserId);

      expect(result).toHaveProperty('unlockedCount');
      expect(result).toHaveProperty('totalCount');
      expect(result).toHaveProperty('completionPercentage');
      expect(result).toHaveProperty('progress');
    });

    it('should auto-unlock achievement on event', async () => {
      const result = await achievementsService.checkAndUnlockAchievements(
        testUser2Id,
        'watchlist_created'
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe('first_watchlist');
    });
  });

  describe('Referral Program Flow', () => {
    it('should generate referral code for user', async () => {
      const result = await referralsService.generateReferralCode(testUserId);

      expect(result).toHaveProperty('referralCode');
      expect(result).toHaveProperty('referralUrl');
      expect(result.reward).toContain('$5.00');
      expect(result.referralCount).toBe(0);

      testReferralCode = result.referralCode;
    });

    it('should process successful referral', async () => {
      const newUser = await prisma.user.create({
        data: {
          email: `referred-user-${Date.now()}@example.com`,
          name: 'Referred User',
          passwordHash: 'hashed_password',
        },
      });

      const result = await referralsService.processReferral(testReferralCode, newUser.id);

      expect(result.success).toBe(true);
      expect(result.reward).toBe(5.0);

      // Cleanup
      await prisma.user.delete({ where: { id: newUser.id } });
    });

    it('should get referral stats', async () => {
      const result = await referralsService.getReferralStats(testUserId);

      expect(result).toHaveProperty('referralCode');
      expect(result).toHaveProperty('totalReferrals');
      expect(result).toHaveProperty('totalEarned');
    });

    it('should get top referrers leaderboard', async () => {
      const result = await referralsService.getTopReferrers(10);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('rank');
      expect(result[0]).toHaveProperty('totalReferrals');
    });

    it('should get program info', async () => {
      const result = await referralsService.getProgramInfo();

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('rewardPerReferral');
      expect(result).toHaveProperty('bonusMilestones');
    });
  });

  describe('Leaderboards Flow', () => {
    it('should get weekly leaderboard', async () => {
      const result = await leaderboardsService.getWeeklyLeaderboard(10, 0);

      expect(result).toHaveProperty('period');
      expect(result.period).toBe('weekly');
      expect(Array.isArray(result.leaderboard)).toBe(true);
    });

    it('should get monthly leaderboard', async () => {
      const result = await leaderboardsService.getMonthlyLeaderboard(10, 0);

      expect(result.period).toBe('monthly');
      expect(Array.isArray(result.leaderboard)).toBe(true);
    });

    it('should get alltime leaderboard', async () => {
      const result = await leaderboardsService.getAllTimeLeaderboard(10, 0);

      expect(result.period).toBe('alltime');
      expect(Array.isArray(result.leaderboard)).toBe(true);
    });

    it('should get user rank in leaderboard', async () => {
      const result = await leaderboardsService.getUserRank(testUserId, 'weekly');

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('totalRanked');
    });

    it('should get leaderboard stats', async () => {
      const result = await leaderboardsService.getLeaderboardStats();

      expect(result).toHaveProperty('weekly');
      expect(result).toHaveProperty('monthly');
      expect(result).toHaveProperty('alltime');
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full social feature flow', async () => {
      // 1. Create watchlist and share
      const newUser = await prisma.user.create({
        data: {
          email: `journey-user-${Date.now()}@example.com`,
          name: 'Journey User',
          passwordHash: 'hashed_password',
        },
      });

      const watchlist = await prisma.watchlist.create({
        data: {
          userId: newUser.id,
          productId: testProductId,
        },
      });

      const share = await watchlistSharingService.shareWatchlist(
        watchlist.id,
        newUser.id,
        ['view']
      );
      expect(share.shareToken).toBeDefined();

      // 2. Post a community deal
      const deal = await communityDealsService.postDeal(
        newUser.id,
        testProductId,
        89.99,
        189.99,
        'amazon'
      );
      expect(deal.id).toBeDefined();

      // 3. Unlock first achievement
      const achievement = await achievementsService.unlockAchievement(
        newUser.id,
        'first_watchlist'
      );
      expect(achievement.success).toBe(true);

      // 4. Generate referral code
      const referral = await referralsService.generateReferralCode(newUser.id);
      expect(referral.referralCode).toBeDefined();

      // 5. Check leaderboard position
      const rank = await leaderboardsService.getUserRank(newUser.id, 'weekly');
      expect(rank.userId).toBe(newUser.id);

      // Cleanup
      await prisma.user.delete({ where: { id: newUser.id } });
    });
  });
});
