import { PrismaClient } from '@prisma/client';
import pino from 'pino';
import { compareAcrossRetailers } from './retailerComparison';

const logger = pino();
const prisma = new PrismaClient();

export interface PriceTrackingConfig {
  intervalMinutes: number;
  productsPerRun: number;
  batchSize: number;
}

export const DEFAULT_CONFIG: PriceTrackingConfig = {
  intervalMinutes: 360, // 6 hours
  productsPerRun: 100,
  batchSize: 10,
};

export class PriceTrackingJob {
  private config: PriceTrackingConfig;
  private isRunning = false;
  private jobId: string;

  constructor(config: Partial<PriceTrackingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.jobId = `price-tracking-${Date.now()}`;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Price tracking job is already running');
      return;
    }

    this.isRunning = true;
    logger.info(`Starting price tracking job ${this.jobId}`);

    // Run immediately on start
    await this.runTrackingCycle();

    // Schedule recurring runs
    const intervalMs = this.config.intervalMinutes * 60 * 1000;
    setInterval(() => {
      if (this.isRunning) {
        this.runTrackingCycle().catch((err) => {
          logger.error({ err }, 'Price tracking cycle failed');
        });
      }
    }, intervalMs);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    logger.info(`Stopped price tracking job ${this.jobId}`);
  }

  private async runTrackingCycle(): Promise<void> {
    const cycleStartTime = new Date();
    logger.info('Starting price tracking cycle');

    try {
      // Create job record
      const job = await prisma.scraperJob.create({
        data: {
          retailer: 'all',
          status: 'in_progress',
          startedAt: cycleStartTime,
          itemsProcessed: 0,
          itemsFailed: 0,
        },
      });

      // Get products that need price updates (most stale first)
      const productsToTrack = await prisma.product.findMany({
        where: {
          retailers: {
            some: {}, // Has at least one retailer listing
          },
        },
        include: {
          retailers: {
            include: { retailer: true },
          },
          priceHistory: {
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
        take: this.config.productsPerRun,
        orderBy: {
          priceHistory: {
            _count: 'asc',
          },
        },
      });

      logger.info(`Found ${productsToTrack.length} products to track`);

      let processed = 0;
      let failed = 0;

      // Process products in batches
      for (let i = 0; i < productsToTrack.length; i += this.config.batchSize) {
        const batch = productsToTrack.slice(i, i + this.config.batchSize);

        await Promise.all(
          batch.map(async (product) => {
            try {
              await this.trackProductPrices(product);
              processed++;
            } catch (err) {
              logger.error({ err, productId: product.id }, 'Failed to track product');
              failed++;
            }
          })
        );

        // Update job progress
        await prisma.scraperJob.update({
          where: { id: job.id },
          data: {
            itemsProcessed: processed,
            itemsFailed: failed,
          },
        });
      }

      // Mark job as completed
      await prisma.scraperJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          itemsProcessed: processed,
          itemsFailed: failed,
        },
      });

      logger.info(
        `Price tracking cycle completed: ${processed} products tracked, ${failed} failed (${new Date().getTime() - cycleStartTime.getTime()}ms)`
      );
    } catch (err) {
      logger.error({ err }, 'Price tracking cycle failed');
    }
  }

  private async trackProductPrices(product: any): Promise<void> {
    // Get current prices from retailers
    const retailers = product.retailers.map((r: any) => r.retailer);

    // For products in our database, we scrape their known retailer URLs
    for (const listing of product.retailers) {
      try {
        // Get or create retailer listing with latest price
        const currentPrice = listing.price;
        const lastHistory = product.priceHistory[0];
        const priceChanged = !lastHistory || lastHistory.price !== currentPrice;

        // Record price history if price changed or 24 hours have passed
        const lastRecorded = lastHistory?.date
          ? new Date().getTime() - new Date(lastHistory.date).getTime()
          : Infinity;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (priceChanged || lastRecorded > twentyFourHours) {
          await prisma.priceHistory.create({
            data: {
              productId: product.id,
              retailerId: listing.retailerId,
              price: currentPrice,
              date: new Date(),
            },
          });

          // Check if price drop should trigger alerts
          if (priceChanged && lastHistory && lastHistory.price > currentPrice) {
            const priceDropPercent = ((lastHistory.price - currentPrice) / lastHistory.price) * 100;
            await this.checkAndCreateAlerts(product.id, priceDropPercent, currentPrice);
          }
        }
      } catch (err) {
        logger.error({ err, productId: product.id }, 'Error tracking retailer price');
      }
    }
  }

  private async checkAndCreateAlerts(productId: string, priceDropPercent: number, newPrice: number): Promise<void> {
    // Find watchlists that should be alerted
    const watchlists = await prisma.watchlist.findMany({
      where: {
        productId,
        OR: [
          {
            // Price dropped below target
            targetPrice: {
              gte: newPrice,
            },
          },
          {
            // Price dropped by specified percentage
            notifyDropPercent: {
              lte: priceDropPercent,
            },
          },
        ],
      },
    });

    // Create alerts for matching watchlists
    for (const watchlist of watchlists) {
      await prisma.priceAlert.create({
        data: {
          watchlistId: watchlist.id,
          productId,
          oldPrice: 0, // Would be from priceHistory
          newPrice,
          percentChange: priceDropPercent,
          notificationSent: false,
        },
      });
    }
  }
}

// Singleton instance
let jobInstance: PriceTrackingJob | null = null;

export function getPriceTrackingJob(config?: Partial<PriceTrackingConfig>): PriceTrackingJob {
  if (!jobInstance) {
    jobInstance = new PriceTrackingJob(config);
  }
  return jobInstance;
}
