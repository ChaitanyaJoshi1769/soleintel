import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AffiliateDashboardService {
  async getDashboard(userId: string) {
    const affiliate = await prisma.affiliateAccount.findUnique({
      where: { userId },
      include: {
        user: true,
        links: {
          select: {
            id: true,
            clicks: true,
            conversions: true,
            createdAt: true,
            trackingToken: true,
            source: true,
          },
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!affiliate) {
      throw new Error('Affiliate account not found');
    }

    const totalClicks = affiliate.links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = affiliate.links.reduce((sum, link) => sum + link.conversions, 0);
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    const pendingCommissions = affiliate.commissions
      .filter((c) => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      profile: {
        name: affiliate.user.name,
        email: affiliate.user.email,
        status: affiliate.status,
        amazonAssociateId: affiliate.amazonAssociateId,
        paypalEmail: affiliate.paypalEmail,
      },
      stats: {
        totalLinks: affiliate.links.length,
        totalClicks,
        totalConversions,
        conversionRate: conversionRate.toFixed(2),
        totalCommissions: affiliate.totalCommissions.toFixed(2),
        availableBalance: affiliate.availableBalance.toFixed(2),
        paidOutBalance: affiliate.paidOutBalance.toFixed(2),
        lastPayout: affiliate.lastPayout,
        pendingCommissions: pendingCommissions.toFixed(2),
      },
      links: affiliate.links.map((link) => ({
        id: link.id,
        trackingToken: link.trackingToken,
        source: link.source,
        clicks: link.clicks,
        conversions: link.conversions,
        conversionRate: link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0',
        createdAt: link.createdAt,
      })),
      recentCommissions: affiliate.commissions.slice(0, 5).map((c) => ({
        id: c.id,
        amount: c.amount.toFixed(2),
        rate: (c.rate * 100).toFixed(0),
        status: c.status,
        createdAt: c.createdAt,
      })),
    };
  }

  async getLinkPerformance(userId: string, linkId: string) {
    const affiliate = await prisma.affiliateAccount.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error('Affiliate account not found');
    }

    const link = await prisma.affiliateLink.findFirst({
      where: {
        id: linkId,
        affiliateId: affiliate.id,
      },
    });

    if (!link) {
      throw new Error('Link not found');
    }

    // Get hourly performance data (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Note: This is simplified. In production, you'd track granular click/conversion data
    return {
      link: {
        id: link.id,
        trackingToken: link.trackingToken,
        source: link.source,
        createdAt: link.createdAt,
      },
      performance: {
        clicks: link.clicks,
        conversions: link.conversions,
        conversionRate: link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0',
        estimatedEarnings: (link.conversions * 5).toFixed(2), // Rough estimate based on avg conversion value
      },
      timeSeries: [
        // Placeholder for hourly data
        {
          hour: new Date(now.getTime() - 23 * 60 * 60 * 1000),
          clicks: Math.floor(Math.random() * 10),
          conversions: Math.floor(Math.random() * 2),
        },
      ],
    };
  }

  async getAffiliateStats(userId: string, daysBack: number = 30) {
    const affiliate = await prisma.affiliateAccount.findUnique({
      where: { userId },
      include: {
        links: true,
        commissions: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    if (!affiliate) {
      throw new Error('Affiliate account not found');
    }

    const recentClicks = affiliate.links.reduce((sum, link) => sum + link.clicks, 0);
    const recentConversions = affiliate.links.reduce((sum, link) => sum + link.conversions, 0);
    const recentEarnings = affiliate.commissions.reduce((sum, c) => sum + c.amount, 0);

    return {
      period: `Last ${daysBack} days`,
      clicks: recentClicks,
      conversions: recentConversions,
      conversionRate:
        recentClicks > 0 ? ((recentConversions / recentClicks) * 100).toFixed(2) : '0',
      earnings: recentEarnings.toFixed(2),
      averageCommissionRate: (affiliate.user.tier === 'free' ? 5 : affiliate.user.tier === 'pro' ? 10 : 15),
      topLinks: affiliate.links
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 5)
        .map((link) => ({
          trackingToken: link.trackingToken,
          clicks: link.clicks,
          conversions: link.conversions,
        })),
    };
  }

  async getPayoutHistory(userId: string, limit: number = 20) {
    const affiliate = await prisma.affiliateAccount.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      throw new Error('Affiliate account not found');
    }

    // Get transactions related to affiliate payouts
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'affiliate_payout',
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      payouts: transactions.map((t) => ({
        id: t.id,
        amount: t.amount.toFixed(2),
        date: t.createdAt,
        status: t.status,
        description: t.description,
      })),
      totalPaidOut: affiliate.paidOutBalance.toFixed(2),
      availableBalance: affiliate.availableBalance.toFixed(2),
      nextPayoutDate: affiliate.lastPayout
        ? new Date(affiliate.lastPayout.getTime() + 30 * 24 * 60 * 60 * 1000)
        : new Date(),
    };
  }

  async updatePayoutMethod(userId: string, paypalEmail?: string, amazonAssociateId?: string) {
    return await prisma.affiliateAccount.update({
      where: { userId },
      data: {
        paypalEmail,
        amazonAssociateId,
      },
    });
  }
}

export function getAffiliateDashboardService() {
  return new AffiliateDashboardService();
}
