/**
 * SOLEINTEL Production API Server
 *
 * Features:
 * - Sentry error tracking
 * - Metrics collection
 * - Production-grade logging
 * - Health checks
 * - Graceful shutdown
 */

import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';
import { initializeSentry, captureException, setContext, flush as sentryFlush } from './monitoring/sentry';
import { getMetricsCollector } from './monitoring/metrics';
import { compareAcrossRetailers, searchProductAcrossRetailers, getAvailableRetailers } from './services/retailerComparison';
import { getPriceTrackingJob } from './services/priceTrackingJob';
import { getNotificationProcessor } from './services/notificationProcessor';
import { getAIInsightsService } from './services/aiInsightsService';
import { subscriptionRoutes } from './routes/subscriptions';

// Initialize Sentry
initializeSentry({
  dsn: process.env.SENTRY_DSN || '',
  environment: process.env.NODE_ENV || 'production',
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  debug: process.env.NODE_ENV !== 'production',
});

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.LOG_LEVEL || 'info',
});

const prisma = new PrismaClient();
const metrics = getMetricsCollector();

const app = fastify({
  logger,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'requestId',
});

// ============================================
// Middleware Setup
// ============================================

await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
});

await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
});

await app.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
  cache: 10000,
});

// Request timing middleware
app.addHook('onRequest', async (request) => {
  (request as any).startTime = Date.now();
  setContext('request', {
    method: request.method,
    url: request.url,
    ip: request.ip,
  });
});

app.addHook('onResponse', async (request, reply) => {
  const responseTime = Date.now() - ((request as any).startTime || 0);
  metrics.recordRequest(reply.statusCode, responseTime);

  logger.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime,
    requestId: request.id,
  }, 'Request completed');
});

// Error handler
app.setErrorHandler(async (error, request, reply) => {
  logger.error({ err: error }, 'Request error');
  captureException(error, {
    method: request.method,
    url: request.url,
    ip: request.ip,
  });

  metrics.recordError(error.constructor.name);

  reply.status(500).send({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    requestId: request.id,
  });
});

// ============================================
// Health & Status Endpoints
// ============================================

app.get('/health', async () => {
  const health = metrics.getHealthStatus();
  return {
    status: health.status,
    healthy: health.healthy,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.VERSION || '1.0.0',
  };
});

app.get('/metrics', async () => {
  return metrics.getMetrics();
});

app.get('/status/database', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', database: 'connected' };
  } catch (err) {
    captureException(err as Error, { component: 'database' });
    return { status: 'unhealthy', database: 'disconnected', error: (err as Error).message };
  }
});

// ============================================
// Core API Routes (from original index.ts)
// ============================================

app.get('/api/products/:productId', async (request) => {
  const { productId } = request.params as { productId: string };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: true,
      retailers: { include: { retailer: true } },
      insights: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
});

app.get('/api/products/sku/:sku', async (request) => {
  const { sku } = request.params as { sku: string };
  return await prisma.product.findMany({
    where: { sku },
    include: { retailers: { include: { retailer: true } } },
    take: 10,
  });
});

app.get('/api/products/:productId/pricing', async (request) => {
  const { productId } = request.params as { productId: string };
  const listings = await prisma.retailerListing.findMany({
    where: { productId },
    include: { retailer: true },
    orderBy: { price: 'asc' },
  });

  const priceHistory = await prisma.priceHistory.findMany({
    where: { productId },
    orderBy: { date: 'desc' },
    take: 30,
  });

  return {
    listings,
    priceHistory,
    lowestPrice: listings[0]?.price,
    highestPrice: listings[listings.length - 1]?.price,
  };
});

app.get('/api/products/:productId/manufacturers', async (request) => {
  const { productId } = request.params as { productId: string };
  return await prisma.manufacturerSource.findMany({
    where: { productId },
    include: { retailer: true },
    orderBy: { confidenceScore: 'desc' },
  });
});

app.get('/api/products/:productId/markup', async (request) => {
  const { productId } = request.params as { productId: string };
  return await prisma.markupAnalysis.findUnique({ where: { productId } });
});

app.get('/api/products/:productId/insights', async (request) => {
  const { productId } = request.params as { productId: string };
  return await prisma.productInsight.findMany({
    where: { productId },
    orderBy: { confidence: 'desc' },
  });
});

app.get('/api/search', async (request) => {
  const { q } = request.query as { q: string };
  if (!q || q.length < 2) return { results: [] };

  return {
    results: await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
    }),
  };
});

// ============================================
// Week 1 & 2 Endpoints
// ============================================

app.post('/api/compare', async (request) => {
  const { productUrl } = request.body as { productUrl: string };
  if (!productUrl) throw new Error('Product URL required');

  const results = await compareAcrossRetailers(productUrl);
  return { success: true, results, timestamp: new Date().toISOString() };
});

app.get('/api/search/retailers', async (request) => {
  const { q, limit } = request.query as { q: string; limit?: string };
  if (!q || q.length < 2) return { results: [] };

  const results = await searchProductAcrossRetailers(q, ['amazon', 'walmart', 'nike', 'adidas'], parseInt(limit || '5', 10));
  return { success: true, query: q, results, count: results.length, timestamp: new Date().toISOString() };
});

app.get('/api/retailers', async () => {
  return { retailers: getAvailableRetailers(), count: getAvailableRetailers().length };
});

app.post('/api/products/:productId/insights/generate', async (request) => {
  const { productId } = request.params as { productId: string };
  const aiService = getAIInsightsService();
  const insights = await aiService.generateInsights(productId);
  return { success: true, insights, count: insights.length, timestamp: new Date().toISOString() };
});

// ============================================
// Subscription & Affiliate Endpoints (Week 4)
// ============================================

await subscriptionRoutes(app);

// ============================================
// Admin Endpoints (Week 2)
// ============================================

app.get('/api/admin/price-tracking/status', async () => {
  const recentJobs = await prisma.scraperJob.findMany({
    where: { retailer: 'all' },
    orderBy: { startedAt: 'desc' },
    take: 5,
  });

  return {
    jobs: recentJobs,
    isRunning: recentJobs[0]?.status === 'in_progress',
    lastRun: recentJobs[0]?.startedAt,
    metrics: metrics.getMetrics().priceTracking,
  };
});

app.post('/api/admin/price-tracking/start', async () => {
  const job = getPriceTrackingJob();
  await job.start();
  return { success: true, message: 'Price tracking started', timestamp: new Date().toISOString() };
});

app.post('/api/admin/notifications/process', async () => {
  const processor = getNotificationProcessor();
  await processor.processUnsentAlerts();
  await processor.sendWatchlistSummaries();
  return { success: true, message: 'Notifications processed', timestamp: new Date().toISOString() };
});

// ============================================
// Background Jobs
// ============================================

let priceTrackingJob: any = null;

if (process.env.ENABLE_PRICE_TRACKING !== 'false') {
  priceTrackingJob = getPriceTrackingJob({
    intervalMinutes: parseInt(process.env.PRICE_TRACKING_INTERVAL || '360', 10),
  });
}

// ============================================
// Graceful Shutdown
// ============================================

const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    try {
      if (priceTrackingJob) await priceTrackingJob.stop();
      await app.close();
      await prisma.$disconnect();
      await sentryFlush(5000);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
    }

    process.exit(0);
  });
});

// ============================================
// Server Startup
// ============================================

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

try {
  if (process.env.ENABLE_PRICE_TRACKING !== 'false') {
    await priceTrackingJob.start();
  }

  await app.listen({ port: PORT, host: HOST });
  logger.info(`✓ Server running at http://${HOST}:${PORT}`);
  logger.info(`✓ Environment: ${process.env.NODE_ENV}`);
  logger.info(`✓ Price tracking: ${process.env.ENABLE_PRICE_TRACKING !== 'false' ? 'enabled' : 'disabled'}`);
  logger.info(`✓ Sentry: ${process.env.SENTRY_DSN ? 'enabled' : 'disabled'}`);
} catch (err) {
  logger.error({ err }, 'Failed to start server');
  await sentryFlush(5000);
  process.exit(1);
}
