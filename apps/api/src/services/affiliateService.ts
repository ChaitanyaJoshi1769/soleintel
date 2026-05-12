import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class AffiliateService {
  async createAffiliateAccount(userId: string) {
    return await prisma.affiliateAccount.create({
      data: {
        userId,
        status: 'pending',
      },
    });
  }

  async approveAffiliate(affiliateId: string, amazonAssociateId?: string, paypalEmail?: string) {
    return await prisma.affiliateAccount.update({
      where: { id: affiliateId },
      data: {
        status: 'approved',
        amazonAssociateId,
        paypalEmail,
      },
    });
  }

  async generateAffiliateLink(affiliateId: string, productId?: string, source: string = 'affiliate_link') {
    const trackingToken = crypto.randomBytes(16).toString('hex');

    return await prisma.affiliateLink.create({
      data: {
        affiliateId,
        productId,
        source,
        trackingToken,
      },
    });
  }

  async trackClick(trackingToken: string) {
    return await prisma.affiliateLink.update({
      where: { trackingToken },
      data: { clicks: { increment: 1 } },
    });
  }

  async trackConversion(trackingToken: string, saleAmount: number) {
    const link = await prisma.affiliateLink.findUnique({
      where: { trackingToken },
      include: { affiliate: { include: { user: true } } },
    });

    if (!link) {
      throw new Error('Affiliate link not found');
    }

    const affiliate = link.affiliate;
    const tier = affiliate.user.tier;

    const commission = await prisma.subscriptionTier.findUnique({
      where: { name: tier },
    });

    const commissionRate = commission?.affiliateRate || 0.05;
    const commissionAmount = saleAmount * commissionRate;

    const affiliateCommission = await prisma.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        amount: commissionAmount,
        rate: commissionRate,
        status: 'pending',
      },
    });

    await prisma.affiliateLink.update({
      where: { trackingToken },
      data: { conversions: { increment: 1 } },
    });

    await prisma.affiliateAccount.update({
      where: { id: affiliate.id },
      data: {
        totalCommissions: { increment: commissionAmount },
        availableBalance: { increment: commissionAmount },
      },
    });

    return affiliateCommission;
  }

  async getAffiliateStats(affiliateId: string) {
    const account = await prisma.affiliateAccount.findUnique({
      where: { id: affiliateId },
      include: {
        links: {
          select: {
            id: true,
            clicks: true,
            conversions: true,
            createdAt: true,
            trackingToken: true,
          },
        },
      },
    });

    if (!account) {
      throw new Error('Affiliate account not found');
    }

    const totalClicks = account.links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = account.links.reduce((sum, link) => sum + link.conversions, 0);

    return {
      affiliateId,
      status: account.status,
      totalLinks: account.links.length,
      totalClicks,
      totalConversions,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      totalCommissions: account.totalCommissions,
      availableBalance: account.availableBalance,
      paidOutBalance: account.paidOutBalance,
      lastPayout: account.lastPayout,
    };
  }

  async processAffiliatePayouts() {
    const affiliates = await prisma.affiliateAccount.findMany({
      where: {
        status: 'approved',
        availableBalance: { gt: 100 },
        paypalEmail: { not: null },
      },
    });

    const payouts = [];

    for (const affiliate of affiliates) {
      if (!affiliate.paypalEmail) continue;

      const transaction = await prisma.transaction.create({
        data: {
          userId: affiliate.userId,
          type: 'affiliate_payout',
          amount: affiliate.availableBalance,
          status: 'completed',
          description: `Affiliate commission payout to ${affiliate.paypalEmail}`,
        },
      });

      await prisma.affiliateAccount.update({
        where: { id: affiliate.id },
        data: {
          paidOutBalance: { increment: affiliate.availableBalance },
          availableBalance: 0,
          lastPayout: new Date(),
        },
      });

      payouts.push({
        affiliateId: affiliate.id,
        amount: affiliate.availableBalance,
        paypalEmail: affiliate.paypalEmail,
        transactionId: transaction.id,
      });
    }

    return payouts;
  }

  async getAffiliateLeaderboard(limit: number = 10) {
    const topAffiliates = await prisma.affiliateAccount.findMany({
      where: { status: 'approved' },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { totalCommissions: 'desc' },
      take: limit,
    });

    return topAffiliates.map((aff) => ({
      name: aff.user.name || aff.user.email,
      totalCommissions: aff.totalCommissions,
      paidOutBalance: aff.paidOutBalance,
      status: aff.status,
    }));
  }
}

export function getAffiliateService() {
  return new AffiliateService();
}
