import { FastifyInstance } from 'fastify';
import { getAnalyticsService } from '../services/analyticsService';

const analyticsService = getAnalyticsService();

export async function analyticsRoutes(app: FastifyInstance) {
  // Get dashboard metrics
  app.get('/api/analytics/dashboard', async (request, reply) => {
    const days = Math.min(parseInt((request.query as any).days || '30'), 365);
    const metrics = await analyticsService.getDashboardMetrics(days);

    return { success: true, ...metrics };
  });

  // Get conversion funnel
  app.get('/api/analytics/funnel', async (request, reply) => {
    const days = Math.min(parseInt((request.query as any).days || '30'), 365);
    const funnel = await analyticsService.getConversionFunnel(days);

    return { success: true, ...funnel };
  });

  // Get affiliate metrics
  app.get('/api/analytics/affiliate', async (request, reply) => {
    const days = Math.min(parseInt((request.query as any).days || '30'), 365);
    const metrics = await analyticsService.getAffiliateMetrics(days);

    return { success: true, ...metrics };
  });

  // Get top events
  app.get('/api/analytics/events', async (request, reply) => {
    const limit = Math.min(parseInt((request.query as any).limit || '10'), 100);
    const events = await analyticsService.getTopEvents(limit);

    return { success: true, events };
  });

  // Get user retention
  app.get('/api/analytics/retention', async (request, reply) => {
    const daysBack = Math.min(parseInt((request.query as any).days || '7'), 90);
    const retention = await analyticsService.getUserRetention(daysBack);

    return { success: true, ...retention };
  });

  // Track custom event (internal use)
  app.post('/api/analytics/track', async (request, reply) => {
    const { eventName, eventType, properties } = request.body as any;

    if (!eventName || !eventType) {
      throw new Error('eventName and eventType required');
    }

    await analyticsService.trackEvent({
      userId: (request as any).userId,
      eventName,
      eventType,
      properties,
    });

    return { success: true };
  });
}
