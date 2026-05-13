import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsEvent {
  userId?: string;
  eventName: string;
  eventType: 'user' | 'product' | 'conversion' | 'affiliate' | 'system';
  properties?: Record<string, any>;
  timestamp?: Date;
}

export class AnalyticsService {
  async trackEvent(event: AnalyticsEvent) {
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId: event.userId,
          eventName: event.eventName,
          eventType: event.eventType,
          properties: event.properties || {},
          timestamp: event.timestamp || new Date(),
        },
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics failures shouldn't break the app
    }
  }

  async trackUserSignup(userId: string, email: string) {
    await this.trackEvent({
      userId,
      eventName: 'user_signup',
      eventType: 'user',
      properties: { email },
    });
  }

  async trackLogin(userId: string) {
    await this.trackEvent({
      userId,
      eventName: 'user_login',
      eventType: 'user',
    });
  }

  async trackWatchlistCreated(userId: string, productId: string) {
    await this.trackEvent({
      userId,
      eventName: 'watchlist_created',
      eventType: 'product',
      properties: { productId },
    });
  }

  async trackPriceAlertCreated(userId: string, productId: string, targetPrice: number) {
    await this.trackEvent({
      userId,
      eventName: 'price_alert_created',
      eventType: 'product',
      properties: { productId, targetPrice },
    });
  }

  async trackSubscriptionUpgrade(userId: string, tier: string, amount: number) {
    await this.trackEvent({
      userId,
      eventName: 'subscription_upgrade',
      eventType: 'conversion',
      properties: { tier, amount },
    });
  }

  async trackAffiliateSignup(userId: string) {
    await this.trackEvent({
      userId,
      eventName: 'affiliate_signup',
      eventType: 'affiliate',
    });
  }

  async trackAffiliateClick(affiliateId: string, trackingToken: string) {
    await this.trackEvent({
      eventName: 'affiliate_click',
      eventType: 'affiliate',
      properties: { affiliateId, trackingToken },
    });
  }

  async trackAffiliateConversion(affiliateId: string, trackingToken: string, amount: number) {
    await this.trackEvent({
      eventName: 'affiliate_conversion',
      eventType: 'conversion',
      properties: { affiliateId, trackingToken, amount },
    });
  }

  async trackSMSVerification(userId: string) {
    await this.trackEvent({
      userId,
      eventName: 'sms_verified',
      eventType: 'user',
    });
  }

  async trackExtensionInstall(extensionToken: string) {
    await this.trackEvent({
      eventName: 'extension_install',
      eventType: 'system',
      properties: { extensionToken },
    });
  }

  async getDashboardMetrics(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [signups, logins, watchlistsCreated, upgrades, affiliateSignups, conversions] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          eventName: 'user_signup',
          timestamp: { gte: startDate },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          eventName: 'user_login',
          timestamp: { gte: startDate },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          eventName: 'watchlist_created',
          timestamp: { gte: startDate },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          eventName: 'subscription_upgrade',
          timestamp: { gte: startDate },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          eventName: 'affiliate_signup',
          timestamp: { gte: startDate },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          eventName: 'affiliate_conversion',
          timestamp: { gte: startDate },
        },
      }),
    ]);

    const totalUsers = await prisma.user.count();
    const paidUsers = await prisma.subscription.count({
      where: {
        tier: { not: 'free' },
        status: 'active',
      },
    });

    return {
      period: `Last ${days} days`,
      users: {
        total: totalUsers,
        paid: paidUsers,
        freeConversionRate: ((paidUsers / totalUsers) * 100).toFixed(2) + '%',
      },
      activity: {
        signups,
        logins,
        watchlistsCreated,
        conversionRate: ((upgrades / signups) * 100).toFixed(2) + '%',
      },
      affiliate: {
        signups: affiliateSignups,
        conversions,
      },
    };
  }

  async getConversionFunnel(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const signups = await prisma.analyticsEvent.count({
      where: {
        eventName: 'user_signup',
        timestamp: { gte: startDate },
      },
    });

    const logins = await prisma.analyticsEvent.count({
      where: {
        eventName: 'user_login',
        timestamp: { gte: startDate },
      },
    });

    const watchlists = await prisma.analyticsEvent.count({
      where: {
        eventName: 'watchlist_created',
        timestamp: { gte: startDate },
      },
    });

    const alerts = await prisma.analyticsEvent.count({
      where: {
        eventName: 'price_alert_created',
        timestamp: { gte: startDate },
      },
    });

    const upgrades = await prisma.analyticsEvent.count({
      where: {
        eventName: 'subscription_upgrade',
        timestamp: { gte: startDate },
      },
    });

    return {
      funnel: [
        { stage: 'Signup', count: signups, rate: '100%' },
        { stage: 'First Login', count: logins, rate: ((logins / signups) * 100).toFixed(0) + '%' },
        { stage: 'Create Watchlist', count: watchlists, rate: ((watchlists / logins) * 100).toFixed(0) + '%' },
        { stage: 'Create Alert', count: alerts, rate: ((alerts / watchlists) * 100).toFixed(0) + '%' },
        { stage: 'Upgrade to Paid', count: upgrades, rate: ((upgrades / signups) * 100).toFixed(0) + '%' },
      ],
    };
  }

  async getAffiliateMetrics(days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const clicks = await prisma.analyticsEvent.count({
      where: {
        eventName: 'affiliate_click',
        timestamp: { gte: startDate },
      },
    });

    const conversions = await prisma.analyticsEvent.count({
      where: {
        eventName: 'affiliate_conversion',
        timestamp: { gte: startDate },
      },
    });

    const signups = await prisma.analyticsEvent.count({
      where: {
        eventName: 'affiliate_signup',
        timestamp: { gte: startDate },
      },
    });

    return {
      period: `Last ${days} days`,
      metrics: {
        totalClicks: clicks,
        totalConversions: conversions,
        conversionRate: clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) + '%' : '0%',
        newAffiliates: signups,
      },
    };
  }

  async getTopEvents(limit: number = 10) {
    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    return events.map((e) => ({
      event: e.eventName,
      count: e._count.id,
    }));
  }

  async getUserRetention(daysBack: number = 7) {
    const dates = [];
    for (let i = daysBack; i >= 0; i--) {
      dates.push(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
    }

    const dailyLogins = [];
    for (let i = 0; i < dates.length - 1; i++) {
      const dayLogins = await prisma.analyticsEvent.count({
        where: {
          eventName: 'user_login',
          timestamp: {
            gte: dates[i],
            lt: dates[i + 1],
          },
        },
      });
      dailyLogins.push({
        date: dates[i].toISOString().split('T')[0],
        logins: dayLogins,
      });
    }

    return {
      period: `Last ${daysBack} days`,
      dailyLogins,
    };
  }
}

export function getAnalyticsService() {
  return new AnalyticsService();
}
