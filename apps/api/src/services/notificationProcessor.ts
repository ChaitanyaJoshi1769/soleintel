import { PrismaClient } from '@prisma/client';
import pino from 'pino';
import { getEmailService } from './emailService';

const logger = pino();
const prisma = new PrismaClient();

export class NotificationProcessor {
  async processUnsentAlerts(): Promise<void> {
    logger.info('Processing unsent price alerts');

    try {
      // Get unsent alerts with related data
      const alerts = await prisma.priceAlert.findMany({
        where: { notificationSent: false },
        include: {
          watchlist: {
            include: {
              product: true,
              user: true, // Assumes user relation exists
            },
          },
        },
        take: 100,
      });

      logger.info(`Found ${alerts.length} unsent alerts to process`);

      const emailService = getEmailService();

      for (const alert of alerts) {
        try {
          // Get product's cheapest retailer listing
          const cheapestListing = await prisma.retailerListing.findFirst({
            where: { productId: alert.productId },
            include: { retailer: true },
            orderBy: { price: 'asc' },
          });

          if (!cheapestListing) {
            logger.warn(`No retailer listings found for product ${alert.productId}`);
            continue;
          }

          // Skip if user email not available
          const userEmail = (alert.watchlist as any).user?.email || (alert.watchlist as any).userEmail;
          if (!userEmail) {
            logger.warn(`No email found for watchlist ${alert.watchlist.id}`);
            continue;
          }

          // Send email alert
          const sent = await emailService.sendPriceDropAlert({
            userEmail,
            productTitle: alert.watchlist.product.title,
            productUrl: cheapestListing.url,
            retailer: cheapestListing.retailer.name,
            oldPrice: alert.oldPrice || cheapestListing.price * 1.1, // Estimate if oldPrice not set
            newPrice: alert.newPrice,
            priceDropPercent: alert.percentChange,
            targetPrice: alert.watchlist.targetPrice || undefined,
          });

          // Mark alert as sent
          if (sent) {
            await prisma.priceAlert.update({
              where: { id: alert.id },
              data: {
                notificationSent: true,
                notificationSentAt: new Date(),
              },
            });
          }
        } catch (err) {
          logger.error({ err, alertId: alert.id }, 'Failed to process alert');
        }
      }

      logger.info('Alert processing completed');
    } catch (err) {
      logger.error({ err }, 'Failed to process unsent alerts');
    }
  }

  async sendWatchlistSummaries(): Promise<void> {
    logger.info('Sending watchlist summaries to users');

    try {
      const emailService = getEmailService();

      // Group watchlists by user
      const watchlists = await prisma.watchlist.findMany({
        include: {
          product: {
            include: {
              priceHistory: {
                orderBy: { date: 'desc' },
                take: 1,
              },
              retailers: {
                include: { retailer: true },
                orderBy: { price: 'asc' },
              },
            },
          },
          user: true,
        },
      });

      const userWatchlists = new Map<string, any[]>();
      for (const wl of watchlists) {
        const userId = (wl as any).userId || (wl as any).user?.id;
        if (!userWatchlists.has(userId)) {
          userWatchlists.set(userId, []);
        }
        userWatchlists.get(userId)!.push(wl);
      }

      // Send summaries to each user
      for (const [userId, userWatchlists_] of userWatchlists) {
        try {
          const user = userWatchlists_[0].user || { email: userId };
          const userEmail = user.email;

          if (!userEmail) {
            logger.warn(`No email found for user ${userId}`);
            continue;
          }

          // Prepare summary data
          const products = userWatchlists_.map((wl) => {
            const product = wl.product;
            const latestPrice = product.retailers[0]?.price || 0;
            const cheapestPrice = Math.min(...product.retailers.map((r: any) => r.price));
            const priceDropPercent = ((latestPrice - cheapestPrice) / latestPrice) * 100;

            return {
              title: product.title,
              currentPrice: latestPrice,
              lowestPrice: cheapestPrice,
              priceDropPercent,
            };
          });

          if (products.length > 0) {
            await emailService.sendWatchlistSummary(userEmail, products);
          }
        } catch (err) {
          logger.error({ err, userId }, 'Failed to send summary');
        }
      }

      logger.info('Watchlist summaries sent');
    } catch (err) {
      logger.error({ err }, 'Failed to send watchlist summaries');
    }
  }
}

// Singleton instance
let processor: NotificationProcessor | null = null;

export function getNotificationProcessor(): NotificationProcessor {
  if (!processor) {
    processor = new NotificationProcessor();
  }
  return processor;
}
