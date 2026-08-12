import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';
import { compareAcrossRetailers, searchProductAcrossRetailers, getAvailableRetailers } from './services/retailerComparison';
import { getPriceTrackingJob } from './services/priceTrackingJob';
import { getNotificationProcessor } from './services/notificationProcessor';
import { getAIInsightsService } from './services/aiInsightsService';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const prisma = new PrismaClient();

const app = fastify({
  logger,
});

// Register plugins
await app.register(helmet);
await app.register(cors, {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
});
await app.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes
app.get('/api/products/:productId', async (request) => {
  const { productId } = request.params as { productId: string };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: true,
      retailers: {
        include: { retailer: true },
      },
      insights: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
});

// Get product by SKU
app.get('/api/products/sku/:sku', async (request) => {
  const { sku } = request.params as { sku: string };

  const products = await prisma.product.findMany({
    where: { sku },
    include: {
      retailers: {
        include: { retailer: true },
      },
    },
    take: 10,
  });

  return products;
});

// Price comparison endpoint
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

// Manufacturer intelligence
app.get('/api/products/:productId/manufacturers', async (request) => {
  const { productId } = request.params as { productId: string };

  const sources = await prisma.manufacturerSource.findMany({
    where: { productId },
    include: { retailer: true },
    orderBy: { confidenceScore: 'desc' },
  });

  return sources;
});

// Markup analysis
app.get('/api/products/:productId/markup', async (request) => {
  const { productId } = request.params as { productId: string };

  const analysis = await prisma.markupAnalysis.findUnique({
    where: { productId },
  });

  return analysis;
});

// Insights
app.get('/api/products/:productId/insights', async (request) => {
  const { productId } = request.params as { productId: string };

  const insights = await prisma.productInsight.findMany({
    where: { productId },
    orderBy: { confidence: 'desc' },
  });

  return insights;
});

// Generate AI insights for product
app.post('/api/products/:productId/insights/generate', async (request) => {
  const { productId } = request.params as { productId: string };

  try {
    const aiService = getAIInsightsService();
    const insights = await aiService.generateInsights(productId);

    return {
      success: true,
      insights,
      count: insights.length,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err }, 'Failed to generate insights');
    throw new Error('Failed to generate insights');
  }
});

// Get price tracking status
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
  };
});

// Start price tracking job (admin only)
app.post('/api/admin/price-tracking/start', async () => {
  try {
    const job = getPriceTrackingJob();
    await job.start();

    return {
      success: true,
      message: 'Price tracking job started',
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err }, 'Failed to start price tracking');
    throw new Error('Failed to start price tracking');
  }
});

// Process unsent notifications (admin only)
app.post('/api/admin/notifications/process', async () => {
  try {
    const processor = getNotificationProcessor();
    await processor.processUnsentAlerts();
    await processor.sendWatchlistSummaries();

    return {
      success: true,
      message: 'Notifications processed',
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err }, 'Failed to process notifications');
    throw new Error('Failed to process notifications');
  }
});

// Search products
app.get('/api/search', async (request) => {
  const { q } = request.query as { q: string };

  if (!q || q.length < 2) {
    return { results: [] };
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 20,
  });

  return { results: products };
});

// Compare product across retailers
app.post('/api/compare', async (request) => {
  const { productUrl, retailers } = request.body as {
    productUrl: string;
    retailers?: string[];
  };

  if (!productUrl) {
    throw new Error('Product URL is required');
  }

  try {
    const results = await compareAcrossRetailers(productUrl);
    return {
      success: true,
      results,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err }, 'Comparison failed');
    throw new Error('Failed to compare product across retailers');
  }
});

// Search across retailers
app.get('/api/search/retailers', async (request) => {
  const { q, retailers: retailerParam, limit } = request.query as {
    q: string;
    retailers?: string;
    limit?: string;
  };

  if (!q || q.length < 2) {
    return { results: [], message: 'Query must be at least 2 characters' };
  }

  const selectedRetailers = retailerParam ? retailerParam.split(',') : ['amazon', 'walmart', 'nike', 'adidas'];
  const maxResults = limit ? parseInt(limit, 10) : 5;

  try {
    const results = await searchProductAcrossRetailers(q, selectedRetailers as any, maxResults);
    return {
      success: true,
      query: q,
      results,
      count: results.length,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err }, 'Multi-retailer search failed');
    throw new Error('Failed to search across retailers');
  }
});

// Get available retailers
app.get('/api/retailers', async () => {
  return {
    retailers: getAvailableRetailers(),
    count: getAvailableRetailers().length,
  };
});

// Watchlist endpoints
app.post('/api/watchlist', async (request) => {
  const { userId, productId, targetPrice, notifyDropPercent } = request.body as {
    userId: string;
    productId: string;
    targetPrice?: number;
    notifyDropPercent?: number;
  };

  const watchlist = await prisma.watchlist.create({
    data: {
      userId,
      productId,
      targetPrice,
      notifyDropPercent,
    },
  });

  return watchlist;
});

app.get('/api/watchlist/:userId', async (request) => {
  const { userId } = request.params as { userId: string };

  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      watchlist: {
        include: { product: true },
      },
    },
  });

  return watchlist;
});

// Initialize background jobs
let priceTrackingJob: any = null;

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    if (priceTrackingJob) {
      await priceTrackingJob.stop();
    }
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  });
});

// Start server
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port: PORT, host: HOST });
  logger.info(`Server running at http://${HOST}:${PORT}`);

  // Start background jobs
  if (process.env.ENABLE_PRICE_TRACKING !== 'false') {
    priceTrackingJob = getPriceTrackingJob({
      intervalMinutes: parseInt(process.env.PRICE_TRACKING_INTERVAL || '360', 10),
    });
    await priceTrackingJob.start();
  }
} catch (err) {
  logger.error(err);
  process.exit(1);
}
