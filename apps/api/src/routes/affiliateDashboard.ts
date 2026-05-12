import { FastifyInstance } from 'fastify';
import { getAffiliateDashboardService } from '../services/affiliateDashboardService';
import { z } from 'zod';

const dashboardService = getAffiliateDashboardService();

const UpdatePayoutSchema = z.object({
  paypalEmail: z.string().email().optional(),
  amazonAssociateId: z.string().optional(),
});

export async function affiliateDashboardRoutes(app: FastifyInstance) {
  // Get affiliate dashboard
  app.get('/api/affiliates/dashboard', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const dashboard = await dashboardService.getDashboard(userId);

    return { success: true, ...dashboard };
  });

  // Get specific link performance
  app.get('/api/affiliates/links/:linkId/performance', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const { linkId } = request.params as { linkId: string };
    const performance = await dashboardService.getLinkPerformance(userId, linkId);

    return { success: true, ...performance };
  });

  // Get affiliate stats for a period
  app.get('/api/affiliates/stats', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const daysBack = Math.min(
      parseInt((request.query as any).days || '30'),
      365,
    );
    const stats = await dashboardService.getAffiliateStats(userId, daysBack);

    return { success: true, ...stats };
  });

  // Get payout history
  app.get('/api/affiliates/payouts', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const limit = Math.min(parseInt((request.query as any).limit || '20'), 100);
    const history = await dashboardService.getPayoutHistory(userId, limit);

    return { success: true, ...history };
  });

  // Update payout method
  app.patch('/api/affiliates/payout-method', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;
    const { paypalEmail, amazonAssociateId } = UpdatePayoutSchema.parse(request.body);
    const updated = await dashboardService.updatePayoutMethod(
      userId,
      paypalEmail,
      amazonAssociateId,
    );

    return {
      success: true,
      message: 'Payout method updated',
      paypalEmail: updated.paypalEmail,
      amazonAssociateId: updated.amazonAssociateId,
    };
  });

  // Get earnings summary
  app.get('/api/affiliates/earnings', async (request, reply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const userId = (request as any).userId;

    const stats7days = await dashboardService.getAffiliateStats(userId, 7);
    const stats30days = await dashboardService.getAffiliateStats(userId, 30);
    const stats90days = await dashboardService.getAffiliateStats(userId, 90);

    return {
      success: true,
      earnings: {
        last7Days: stats7days.earnings,
        last30Days: stats30days.earnings,
        last90Days: stats90days.earnings,
      },
      conversions: {
        last7Days: stats7days.conversions,
        last30Days: stats30days.conversions,
        last90Days: stats90days.conversions,
      },
      conversionRates: {
        last7Days: stats7days.conversionRate,
        last30Days: stats30days.conversionRate,
        last90Days: stats90days.conversionRate,
      },
    };
  });
}
