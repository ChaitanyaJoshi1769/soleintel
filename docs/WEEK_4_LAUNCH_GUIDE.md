# Week 4: Growth & Monetization Launch Guide

## Overview

Week 4 implements the complete monetization infrastructure for SOLEINTEL:
- Subscription tier system (Free/Pro/Premium)
- Stripe payment processing
- Affiliate program with commission tracking
- Marketing website with pricing page
- Public launch strategy

**Status**: Infrastructure complete and ready for deployment

---

## 1. Database Migrations

Apply the monetization schema:

```bash
cd apps/api
pnpm prisma migrate deploy
```

This creates:
- `User` table (email, tier, subscription)
- `Subscription` table (with Stripe integration)
- `SubscriptionTier` table (pricing tiers)
- `AffiliateAccount` table (affiliate tracking)
- `AffiliateLink` table (affiliate links)
- `AffiliateCommission` table (commission tracking)
- `Transaction` table (payment history)

---

## 2. Environment Variables

Add to `.env.production`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Marketing
NEXT_PUBLIC_API_URL=https://api.soleintel.com

# Feature flags (Week 4)
FEATURE_SUBSCRIPTIONS=true
FEATURE_AFFILIATE_PROGRAM=true
```

---

## 3. Stripe Setup

### Create Stripe Account
1. Go to https://stripe.com
2. Create account
3. Get API keys from Dashboard → API Keys
4. Create webhook endpoint:
   - URL: `https://api.soleintel.com/api/webhooks/stripe`
   - Events: `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`
   - Get webhook secret

### Create Products in Stripe
```bash
# Create Pro tier
stripe products create --name "SOLEINTEL Pro" --type service
# Response: prod_xxxxx

# Create Premium tier
stripe products create --name "SOLEINTEL Premium" --type service

# Create prices
stripe prices create --product=prod_xxxxx --unit-amount=999 --currency=usd --recurring='{"interval":"month"}'
# Response: price_xxxxx (monthly)

stripe prices create --product=prod_xxxxx --unit-amount=9999 --currency=usd --recurring='{"interval":"year"}'
# Response: price_xxxxx (yearly)
```

Then update database:
```sql
UPDATE "SubscriptionTier" SET "stripePriceId"='price_xxxxx' WHERE name='pro';
UPDATE "SubscriptionTier" SET "stripePriceIdYearly"='price_xxxxx' WHERE name='pro';
```

---

## 4. Initialize Subscription Tiers

```bash
# Connect to production database
psql $DATABASE_URL

# Run initialization (via API or manual)
curl -X POST https://api.soleintel.com/api/admin/subscriptions/initialize
```

Or via API call in the startup sequence:

```typescript
import { getSubscriptionService } from './services/subscriptionService';

const subscriptionService = getSubscriptionService();
await subscriptionService.initializeDefaultTiers();
```

---

## 5. Deploy Marketing Website

### Build and Deploy to Vercel

```bash
cd apps/marketing
pnpm build
vercel deploy
```

Or deploy to Railway:

```bash
# Add to railway.json
{
  "services": {
    "marketing": {
      "source": "apps/marketing",
      "buildCommand": "pnpm install && pnpm build",
      "startCommand": "pnpm start",
      "environmentVariables": {
        "NEXT_PUBLIC_API_URL": "https://api.soleintel.com"
      }
    }
  }
}
```

### Domain Setup
- Marketing site: `soleintel.com` → `marketing.railway.app` (CNAME)
- API: `api.soleintel.com` → `api.railway.app` (CNAME)

---

## 6. Deploy Updated API

```bash
# Commit all Week 4 changes
git add -A
git commit -m "Week 4: Add subscription tiers, Stripe integration, affiliate program, and marketing website"
git push origin feat/week-4-monetization

# Merge to main
git checkout main
git merge feat/week-4-monetization
git push origin main

# Railway auto-deploys on push to main
```

---

## 7. Test Subscription Flow

### Create Test User
```bash
curl -X POST https://api.soleintel.com/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@soleintel.com",
    "name": "Test User"
  }'
```

### Upgrade to Pro
```bash
curl -X POST https://api.soleintel.com/api/subscriptions/upgrade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tierId": "pro",
    "email": "test@soleintel.com"
  }'
```

### Verify Stripe Webhook
```bash
stripe listen --forward-to https://api.soleintel.com/api/webhooks/stripe
```

---

## 8. Affiliate Program Setup

### Generate Affiliate Link
```bash
curl -X POST https://api.soleintel.com/api/affiliates/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "source": "affiliate_link"
  }'

# Response: { "affiliateUrl": "https://api.soleintel.com/affiliate/abc123def456" }
```

### Track Conversions
```bash
curl -X POST https://api.soleintel.com/api/affiliates/track-conversion \
  -H "Content-Type: application/json" \
  -d '{
    "trackingToken": "abc123def456",
    "saleAmount": 99.99
  }'
```

### View Leaderboard
```bash
curl https://api.soleintel.com/api/affiliates/leaderboard?limit=10
```

---

## 9. Public Launch Timeline

### Week 4 - Day 1-2: Infrastructure
- ✅ Deploy production API with subscriptions
- ✅ Deploy marketing website
- ✅ Verify Stripe webhooks
- ✅ Test affiliate tracking

### Week 4 - Day 3-4: Pre-Launch
- ✅ Invite beta users to try Pro/Premium
- ✅ Collect feedback
- ✅ Fix critical issues
- ✅ Set up social media accounts

### Week 4 - Day 5: ProductHunt Launch
```
- Post to ProductHunt
- Respond to comments within 2 hours
- Target: Top 5 in Product category
- Goal: 500+ upvotes
```

### Week 4 - Day 6-7: Social Campaigns
```
Reddit communities:
  - r/deals
  - r/frugal
  - r/Sneakers
  - r/PickAFit

Twitter threads:
  - "How I save $200/year on shoes"
  - "10 retailers ranked by price"
  - "Price tracking automation"

Email campaign:
  - Beta users: Invite to paid tiers
  - Affiliates: "Earn $X in commissions"
```

---

## 10. Launch Checklist

**Infrastructure**
- [ ] Database migrations applied
- [ ] Stripe account created and configured
- [ ] API updated with subscription endpoints
- [ ] Webhook endpoint verified
- [ ] Marketing website deployed
- [ ] SSL certificates configured
- [ ] All env vars set

**Testing**
- [ ] Free tier signup works
- [ ] Pro tier upgrade works with Stripe
- [ ] Affiliate links generate correctly
- [ ] Affiliate commission tracking works
- [ ] Stripe webhook received and processed
- [ ] Email notifications for new subscribers
- [ ] Affiliate payouts calculated correctly

**Marketing**
- [ ] ProductHunt listing created
- [ ] Twitter account ready
- [ ] Reddit posts scheduled
- [ ] Email templates prepared
- [ ] Pricing page live
- [ ] Landing page updated

**Monitoring**
- [ ] Sentry monitoring active
- [ ] Error alerts configured
- [ ] Payment monitoring in place
- [ ] Affiliate tracking verified
- [ ] Database backups configured

---

## 11. Key Metrics to Track

```
Weekly Reports:
- New signups (Free, Pro, Premium)
- Conversion rate (Free → Paid)
- MRR (Monthly Recurring Revenue)
- Affiliate referrals
- Churn rate
- Customer acquisition cost
```

---

## 12. Post-Launch Growth

**Month 1:**
- 100+ paid subscribers
- $1,000+ MRR
- 50+ active affiliates
- 1,000+ Chrome extension downloads

**Month 2:**
- 500+ paid subscribers
- $5,000+ MRR
- 200+ active affiliates
- 5,000+ extension downloads

**Month 3:**
- 1,000+ paid subscribers
- $10,000+ MRR
- 500+ active affiliates
- 10,000+ extension downloads

---

## Support & Resources

- Stripe Docs: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- ProductHunt Guide: https://help.producthunt.com/
- Reddit Marketing: https://reddit.com/r/marketing

---

**Next Steps**:
1. Deploy all Week 4 infrastructure
2. Test complete subscription flow
3. Launch ProductHunt campaign
4. Monitor metrics daily
5. Iterate based on user feedback

Generated: May 12, 2026
