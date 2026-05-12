import { FastifyInstance } from 'fastify';
import { getSubscriptionService } from '../services/subscriptionService';
import { getAffiliateService } from '../services/affiliateService';
import Stripe from 'stripe';
import { z } from 'zod';

const subscriptionService = getSubscriptionService();
const affiliateService = getAffiliateService();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

const UpgradeSchema = z.object({
  tierId: z.enum(['pro', 'premium']),
  email: z.string().email(),
});

const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
});

export async function subscriptionRoutes(app: FastifyInstance) {
  app.post('/api/subscriptions/upgrade', async (request, reply) => {
    const { tierId, email } = UpgradeSchema.parse(request.body);
    const userId = (request as any).userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    let subscription;
    if (tierId === 'pro') {
      subscription = await subscriptionService.upgradeToPro(userId, email);
    } else if (tierId === 'premium') {
      subscription = await subscriptionService.upgradeToPremium(userId);
    }

    return {
      success: true,
      subscription,
      message: `Upgraded to ${tierId} tier`,
    };
  });

  app.post('/api/subscriptions/downgrade', async (request, reply) => {
    const userId = (request as any).userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const subscription = await subscriptionService.downgradeToFree(userId);

    return {
      success: true,
      subscription,
      message: 'Downgraded to free tier',
    };
  });

  app.get('/api/subscriptions/current', async (request, reply) => {
    const userId = (request as any).userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const details = await subscriptionService.getSubscriptionDetails(userId);

    return {
      success: true,
      subscription: details,
    };
  });

  app.post('/api/affiliates/join', async (request, reply) => {
    const userId = (request as any).userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const affiliate = await affiliateService.createAffiliateAccount(userId);

    return {
      success: true,
      affiliate,
      message: 'Affiliate account created. Pending approval.',
    };
  });

  app.post('/api/affiliates/links', async (request, reply) => {
    const userId = (request as any).userId;
    const { productId, source } = z
      .object({
        productId: z.string().optional(),
        source: z.string().default('affiliate_link'),
      })
      .parse(request.body);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const affiliateAccount = await affiliateService.createAffiliateAccount(userId);
    const link = await affiliateService.generateAffiliateLink(
      affiliateAccount.id,
      productId,
      source,
    );

    const baseUrl = process.env.API_BASE_URL || 'https://api.soleintel.com';
    const affiliateUrl = `${baseUrl}/affiliate/${link.trackingToken}`;

    return {
      success: true,
      link: {
        ...link,
        affiliateUrl,
      },
    };
  });

  app.get('/api/affiliates/stats', async (request, reply) => {
    const userId = (request as any).userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const affiliateAccount = await affiliateService.createAffiliateAccount(userId);
    const stats = await affiliateService.getAffiliateStats(affiliateAccount.id);

    return {
      success: true,
      stats,
    };
  });

  app.get('/api/affiliates/leaderboard', async (request, reply) => {
    const limit = Math.min(parseInt((request.query as any).limit || '10'), 100);
    const leaderboard = await affiliateService.getAffiliateLeaderboard(limit);

    return {
      success: true,
      leaderboard,
    };
  });

  app.post('/api/webhooks/stripe', async (request, reply) => {
    const sig = request.headers['stripe-signature'];
    if (!sig) {
      throw new Error('Missing stripe signature');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        (request as any).body,
        sig,
        webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${(err as Error).message}`);
    }

    await subscriptionService.handleStripeWebhook(event);

    return { received: true };
  });
}
