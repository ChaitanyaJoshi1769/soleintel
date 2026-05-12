import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

export class SubscriptionService {
  async initializeFreeTier(userId: string, email: string) {
    const freeTier = await prisma.subscriptionTier.findUnique({
      where: { name: 'free' },
    });

    if (!freeTier) {
      throw new Error('Free tier not configured');
    }

    return await prisma.subscription.create({
      data: {
        userId,
        tier: 'free',
        status: 'active',
        billingEmail: email,
        billingCycle: 'monthly',
      },
    });
  }

  async upgradeToPro(userId: string, email: string) {
    const proTier = await prisma.subscriptionTier.findUnique({
      where: { name: 'pro' },
    });

    if (!proTier) {
      throw new Error('Pro tier not configured');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) throw new Error('User not found');

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    const priceId = proTier.stripePriceId;
    if (!priceId) {
      throw new Error('Pro tier Stripe price not configured');
    }

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const updatedSub = await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        tier: 'pro',
        status: 'active',
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        billingEmail: email,
        billingCycle: 'monthly',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      update: {
        tier: 'pro',
        status: 'active',
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { tier: 'pro' },
    });

    return updatedSub;
  }

  async upgradeToPremium(userId: string) {
    const premiumTier = await prisma.subscriptionTier.findUnique({
      where: { name: 'premium' },
    });

    if (!premiumTier) {
      throw new Error('Premium tier not configured');
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error('User has no active Stripe subscription');
    }

    const priceId = premiumTier.stripePriceId;
    if (!priceId) {
      throw new Error('Premium tier Stripe price not configured');
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{ price: priceId }],
    });

    const updated = await prisma.subscription.update({
      where: { userId },
      data: { tier: 'premium' },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { tier: 'premium' },
    });

    return updated;
  }

  async downgradeToFree(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription?.stripeSubscriptionId) {
      await stripe.subscriptions.del(subscription.stripeSubscriptionId);
    }

    const updated = await prisma.subscription.update({
      where: { userId },
      data: {
        tier: 'free',
        status: 'canceled',
        stripeSubscriptionId: null,
        canceledAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { tier: 'free' },
    });

    return updated;
  }

  async handleStripeWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: subscription.status === 'active' ? 'active' : 'past_due',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: 'canceled',
              stripeSubscriptionId: null,
              canceledAt: new Date(),
            },
          });

          await prisma.user.update({
            where: { id: userId },
            data: { tier: 'free' },
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });

          if (subscription) {
            await prisma.transaction.create({
              data: {
                userId: subscription.userId,
                type: 'subscription',
                amount: invoice.total / 100,
                currency: invoice.currency.toUpperCase(),
                status: 'completed',
                stripeChargeId: invoice.charge as string,
                description: `${subscription.tier.toUpperCase()} subscription payment`,
              },
            });
          }
        }
        break;
      }
    }
  }

  async getSubscriptionDetails(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return null;
    }

    const tier = await prisma.subscriptionTier.findUnique({
      where: { name: subscription.tier },
    });

    return {
      ...subscription,
      tierDetails: tier,
    };
  }

  async initializeDefaultTiers() {
    const tiers = [
      {
        name: 'free',
        displayName: 'Free',
        priceMonthly: 0,
        maxWatchlists: 5,
        maxAlerts: 10,
        pricingHistoryDays: 30,
        affiliateRate: 0.05,
      },
      {
        name: 'pro',
        displayName: 'Pro',
        priceMonthly: 9.99,
        priceYearly: 99.99,
        maxWatchlists: 50,
        maxAlerts: 100,
        pricingHistoryDays: 90,
        affiliateRate: 0.1,
      },
      {
        name: 'premium',
        displayName: 'Premium',
        priceMonthly: 24.99,
        priceYearly: 249.99,
        maxWatchlists: 500,
        maxAlerts: 1000,
        pricingHistoryDays: 365,
        affiliateRate: 0.15,
      },
    ];

    for (const tier of tiers) {
      await prisma.subscriptionTier.upsert({
        where: { name: tier.name },
        create: tier,
        update: tier,
      });
    }
  }
}

export function getSubscriptionService() {
  return new SubscriptionService();
}
