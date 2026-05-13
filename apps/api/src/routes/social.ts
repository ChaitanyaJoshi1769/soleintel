/**
 * Social Features Routes
 * Endpoints for watchlist sharing, community deals, achievements, referrals, and leaderboards
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticateToken } from '../middleware/auth';
import { watchlistSharingService } from '../services/watchlistSharingService';
import { communityDealsService } from '../services/communityDealsService';
import { achievementsService } from '../services/achievementsService';
import { referralsService } from '../services/referralsService';
import { leaderboardsService } from '../services/leaderboardsService';

export async function socialRoutes(app: FastifyInstance) {
  // ==================== WATCHLIST SHARING ====================

  /**
   * POST /api/social/watchlists/:watchlistId/share
   * Share a watchlist with a public link
   */
  app.post<{ Params: { watchlistId: string }; Body: any }>(
    '/api/social/watchlists/:watchlistId/share',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { watchlistId } = request.params;
      const userId = (request as any).user.id;
      const { permissions, expiresInDays } = request.body || {};

      const result = await watchlistSharingService.shareWatchlist(
        watchlistId,
        userId,
        permissions || ['view'],
        expiresInDays
      );

      reply.code(201).send(result);
    }
  );

  /**
   * GET /api/social/watchlists/share/:shareToken
   * Access a shared watchlist
   */
  app.get<{ Params: { shareToken: string } }>(
    '/api/social/watchlists/share/:shareToken',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { shareToken } = request.params;
      const result = await watchlistSharingService.accessSharedWatchlist(shareToken);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/watchlists/shared
   * Get list of watchlists shared by current user
   */
  app.get(
    '/api/social/watchlists/shared',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const result = await watchlistSharingService.getUserSharedWatchlists(userId);
      reply.send(result);
    }
  );

  /**
   * POST /api/social/watchlists/:watchlistId/revoke/:shareToken
   * Revoke a share link
   */
  app.post<{ Params: { watchlistId: string; shareToken: string } }>(
    '/api/social/watchlists/:watchlistId/revoke/:shareToken',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { shareToken } = request.params;
      const userId = (request as any).user.id;
      const result = await watchlistSharingService.revokeShareLink(shareToken, userId);
      reply.send(result);
    }
  );

  // ==================== COMMUNITY DEALS ====================

  /**
   * POST /api/social/deals
   * Post a new community deal
   */
  app.post<{ Body: any }>(
    '/api/social/deals',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const { productId, dealPrice, originalPrice, retailerId, description } = request.body;

      const result = await communityDealsService.postDeal(
        userId,
        productId,
        dealPrice,
        originalPrice,
        retailerId,
        description
      );

      reply.code(201).send(result);
    }
  );

  /**
   * GET /api/social/deals
   * Get trending community deals
   */
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/api/social/deals',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const offset = parseInt(request.query.offset as string) || 0;

      const result = await communityDealsService.getTrendingDeals(limit, offset);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/deals/recent
   * Get recent community deals
   */
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/api/social/deals/recent',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const offset = parseInt(request.query.offset as string) || 0;

      const result = await communityDealsService.getRecentDeals(limit, offset);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/deals/:dealId
   * Get deal details
   */
  app.get<{ Params: { dealId: string } }>(
    '/api/social/deals/:dealId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { dealId } = request.params;
      const result = await communityDealsService.getDealDetails(dealId);
      reply.send(result);
    }
  );

  /**
   * POST /api/social/deals/:dealId/upvote
   * Upvote a deal
   */
  app.post<{ Params: { dealId: string } }>(
    '/api/social/deals/:dealId/upvote',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { dealId } = request.params;
      const userId = (request as any).user.id;

      const result = await communityDealsService.upvoteDeal(dealId, userId);
      reply.send(result);
    }
  );

  /**
   * POST /api/social/deals/:dealId/downvote
   * Downvote a deal
   */
  app.post<{ Params: { dealId: string } }>(
    '/api/social/deals/:dealId/downvote',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { dealId } = request.params;
      const userId = (request as any).user.id;

      const result = await communityDealsService.downvoteDeal(dealId, userId);
      reply.send(result);
    }
  );

  // ==================== ACHIEVEMENTS ====================

  /**
   * GET /api/social/achievements
   * Get all achievements for current user
   */
  app.get(
    '/api/social/achievements',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const result = await achievementsService.getUserAchievements(userId);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/achievements/progress
   * Get achievement progress
   */
  app.get(
    '/api/social/achievements/progress',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const result = await achievementsService.getAchievementProgress(userId);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/achievements/leaderboard
   * Get achievement leaderboard
   */
  app.get<{ Querystring: { limit?: string } }>(
    '/api/social/achievements/leaderboard',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const result = await achievementsService.getAchievementLeaderboard(limit);
      reply.send(result);
    }
  );

  // ==================== REFERRALS ====================

  /**
   * POST /api/social/referrals/generate
   * Generate referral code for current user
   */
  app.post(
    '/api/social/referrals/generate',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const result = await referralsService.generateReferralCode(userId);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/referrals/stats
   * Get referral stats for current user
   */
  app.get(
    '/api/social/referrals/stats',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const result = await referralsService.getReferralStats(userId);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/referrals/leaderboard
   * Get top referrers
   */
  app.get<{ Querystring: { limit?: string } }>(
    '/api/social/referrals/leaderboard',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const result = await referralsService.getTopReferrers(limit);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/referrals/info
   * Get referral program info
   */
  app.get(
    '/api/social/referrals/info',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await referralsService.getProgramInfo();
      reply.send(result);
    }
  );

  // ==================== LEADERBOARDS ====================

  /**
   * GET /api/social/leaderboards/weekly
   * Get weekly leaderboard
   */
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/api/social/leaderboards/weekly',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const offset = parseInt(request.query.offset as string) || 0;

      const result = await leaderboardsService.getWeeklyLeaderboard(limit, offset);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/leaderboards/monthly
   * Get monthly leaderboard
   */
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/api/social/leaderboards/monthly',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const offset = parseInt(request.query.offset as string) || 0;

      const result = await leaderboardsService.getMonthlyLeaderboard(limit, offset);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/leaderboards/alltime
   * Get all-time leaderboard
   */
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/api/social/leaderboards/alltime',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const limit = parseInt(request.query.limit as string) || 20;
      const offset = parseInt(request.query.offset as string) || 0;

      const result = await leaderboardsService.getAllTimeLeaderboard(limit, offset);
      reply.send(result);
    }
  );

  /**
   * GET /api/social/leaderboards/rank
   * Get current user's rank
   */
  app.get<{ Querystring: { period?: string } }>(
    '/api/social/leaderboards/rank',
    { preHandler: authenticateToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.id;
      const period = (request.query.period as string) || 'weekly';

      const result = await leaderboardsService.getUserRank(userId, period);
      reply.send(result);
    }
  );
}
