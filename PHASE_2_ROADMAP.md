# Phase 2: Growth & Scale - Feature Roadmap

**Timeline:** 4 weeks (after Chrome Web Store approval)  
**Status:** In Planning  
**Expected Impact:** 3x user growth, 5x engagement, new revenue streams

---

## Overview

Phase 2 expands SOLEINTEL from a single-category shoe tracker into a multi-category price intelligence platform with mobile apps, social features, and predictive intelligence.

**Core Objectives:**
1. **Expand TAM** - From shoes to all retail categories (apparel, electronics, home, sports)
2. **Increase Engagement** - Social features, price predictions, gamification
3. **Reach Mobile Users** - Native iOS/Android apps with push notifications
4. **Unlock New Revenue** - API access, premium insights, B2B partnerships

---

## Feature 1: Multi-Category Support

### Overview
Transform from shoe-specific tracker to universal price tracker supporting 50+ product categories.

### Implementation

**Database Schema Updates:**
```
Add to Product model:
- category (existing, but will support all types)
- subcategory (e.g., shoes → athletic shoes, casual shoes, designer shoes)
- categoryIcon (for UI)
- popularityScore (to highlight trending items)

New CategoryConfig table:
├── id (cuid)
├── name (e.g., "Athletic Shoes", "Running Shoes")
├── slug (url-friendly)
├── icon (emoji or icon name)
├── parentCategory (for nesting)
├── retailers (JSON array of compatible retailers)
├── scrapingRules (JSON rules for parsing)
└── timestamp

New CategoryPreference table:
├── userId (foreign key)
├── categories (JSON array of followed categories)
├── topLevelOnly (boolean - show parent categories only)
```

**API Endpoints:**

1. `GET /api/categories` - List all categories with stats
   ```json
   {
     "categories": [
       {
         "id": "cat_shoes",
         "name": "Shoes",
         "icon": "👟",
         "subcategories": ["Athletic", "Casual", "Designer", "Boots"],
         "productCount": 125000,
         "activeTrackers": 8500,
         "avgPriceDrop": "$24.50"
       },
       {
         "id": "cat_electronics",
         "name": "Electronics",
         "icon": "📱",
         "subcategories": ["Phones", "Laptops", "Headphones", "Tablets"],
         "productCount": 450000,
         "activeTrackers": 2100,
         "avgPriceDrop": "$89.75"
       }
     ]
   }
   ```

2. `GET /api/categories/:categoryId` - Get category details and trending products
   ```json
   {
     "category": {
       "id": "cat_electronics",
       "name": "Electronics",
       "description": "Track prices on phones, laptops, and accessories",
       "trending": [
         {
           "productId": "prod_iphone15",
           "title": "iPhone 15 Pro Max",
           "currentPrice": 1199,
           "previousPrice": 1299,
           "drop": "$100 (7.7%)",
           "watchers": 3421,
           "retailers": ["amazon", "bestbuy", "walmart"],
           "sentiment": "hot_deal"
         }
       ]
     }
   }
   ```

3. `POST /api/categories/subscribe` - User follows a category
   ```json
   {
     "categoryId": "cat_electronics",
     "notifications": true,
     "frequency": "daily"
   }
   ```

4. `GET /api/categories/:categoryId/trending` - Trending products in category
   ```json
   {
     "trendingProducts": [
       {
         "rank": 1,
         "product": {...},
         "priceTrend": "↓ -12.5%",
         "momentum": "fast falling",
         "watchers": 5421
       }
     ]
   }
   ```

**Frontend Updates:**
- Category browse page with grid/list view
- Category filters in search
- "Explore categories" section on dashboard
- Category-specific alerts (price, availability, new products)

**Scraper Updates:**
- Dynamic scraping rules per category
- Retailer compatibility matrix (some retailers don't sell certain categories)
- New retailer integrations:
  - **Electronics:** BestBuy, Newegg, B&H Photo
  - **Apparel:** Target, H&M, ASOS, Forever21
  - **Home:** Wayfair, IKEA, Bed Bath & Beyond
  - **Sports:** Dick's Sporting Goods, REI, Academy Sports

**Success Metrics:**
- 20+ categories live by week 2
- 50,000+ products across all categories
- 30% of users tracking at least 2 categories
- 25% category cross-sell rate

---

## Feature 2: Mobile App (React Native)

### Overview
Native iOS/Android app with offline support, push notifications, and biometric auth.

### Architecture

**Tech Stack:**
- **Framework:** React Native with Expo
- **State:** Redux Toolkit
- **API Client:** Axios with retry logic
- **Notifications:** Expo Notifications + FCM (Android), APNs (iOS)
- **Auth:** JWT + Biometric (Face ID, Touch ID, Android Biometric)
- **Persistence:** AsyncStorage + SQLite for offline cache

### Project Structure
```
apps/mobile/
├── src/
│   ├── screens/
│   │   ├── Home/
│   │   ├── Search/
│   │   ├── Watchlist/
│   │   ├── Profile/
│   │   ├── Category/
│   │   └── Settings/
│   ├── components/
│   │   ├── PriceCard/
│   │   ├── ProductCard/
│   │   ├── PriceChart/
│   │   └── NotificationBanner/
│   ├── services/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── notifications/
│   │   └── storage/
│   ├── store/ (Redux)
│   │   ├── slices/
│   │   └── middleware/
│   └── App.tsx
├── app.json
├── package.json
└── eas.json (EAS Build config)
```

### Core Features

**1. Authentication**
- Phone number + SMS OTP login (same as web)
- Biometric login (Face ID / Touch ID / Android Biometric)
- Auto-login with stored JWT

**2. Watchlist Management**
- Add products by search or barcode scan
- Set price targets and percentage alerts
- Organize into custom folders
- Bulk actions (delete, enable/disable alerts)

**3. Price Tracking**
- Real-time price chart (7/30/90 day views)
- Retailer comparison
- Price history with trend analysis
- Historical low/high markers

**4. Notifications**
- Push notification on price drop
- Daily summary at preferred time
- Category alerts
- Stock availability notifications

**5. Offline Mode**
- Cache recent products
- View watchlist offline
- Queue actions to sync when online
- Last sync timestamp display

### API Endpoints (Mobile-Specific)

1. `GET /api/mobile/dashboard` - Optimized for mobile (smaller payload)
   ```json
   {
     "watchlistSummary": {
       "total": 15,
       "activeAlerts": 7,
       "potentialSavings": "$342.50",
       "recentDrops": [
         {
           "productId": "prod_123",
           "title": "Nike Air Max",
           "previousPrice": 199.99,
           "currentPrice": 149.99,
           "savings": "$50.00",
           "retailer": "amazon"
         }
       ]
     }
   }
   ```

2. `POST /api/mobile/barcode-scan` - Scan product barcode
   ```json
   {
     "barcode": "5901234123457",
     "retailers": ["amazon", "walmart", "nike"]
   }
   ```

3. `POST /api/mobile/notifications/register` - Register device for push
   ```json
   {
     "expoPushToken": "ExponentPushToken[...]",
     "platform": "ios|android",
     "osVersion": "17.4"
   }
   ```

4. `GET /api/mobile/offline-sync` - Sync offline changes
   ```json
   {
     "localChanges": [
       {
         "type": "watchlist_created",
         "productId": "prod_456"
       }
     ]
   }
   ```

### App Store Submission

**iOS (Apple App Store):**
- Developer account setup ($99/year)
- App review guidelines compliance
- Screenshots for iPhone 15 Pro Max
- Privacy policy and permissions
- Expected review time: 1-3 days

**Android (Google Play):**
- Developer account setup ($25 one-time)
- Content rating questionnaire
- Screenshots for Pixel 6 Pro
- Privacy policy
- Expected review time: Few hours to 24 hours

### Launch Strategy

**Beta Phase (Week 1-2):**
- TestFlight (iOS) and Google Play Beta (Android)
- 500 internal testers
- Feedback collection on UX/performance

**Production Launch (Week 3):**
- App Store + Google Play submission
- Feature parity with web version
- Push notification infrastructure live

**Expected Metrics:**
- 50,000+ iOS downloads in Month 1
- 40,000+ Android downloads in Month 1
- 35% DAU (from app users)
- 25% higher engagement vs web
- 8+ app store rating

---

## Feature 3: Price Prediction Engine

### Overview
ML-powered predictions of when prices will drop, using historical data and market trends.

### How It Works

**Input Data:**
- Historical price data (30+ days per product)
- Seasonal trends (holidays, Black Friday, etc.)
- Competitor pricing patterns
- Stock levels (in-stock, low stock, out-of-stock)
- Product age (newly released, mature, discontinued)

**ML Model:**
- **Type:** Time series forecasting (LSTM or Prophet)
- **Framework:** Python with scikit-learn / PyTorch
- **Training:** Weekly on accumulated data
- **Features:** 50+ features (price velocity, trend, seasonality, etc.)

**Output:**
- **Price Prediction:** "95% chance of $20 drop within 14 days"
- **Wait vs Buy Score:** "Wait score: 85/100 (recommended to wait)"
- **Optimal Buy Window:** "Best time to buy: May 24-28"

### Architecture

**Backend Service (Python Microservice):**
```
services/pricing/
├── models/
│   ├── price_forecaster.py (LSTM model)
│   ├── seasonality_analyzer.py
│   └── trend_detector.py
├── data/
│   ├── feature_engineering.py
│   ├── data_aggregator.py
│   └── training_pipeline.py
├── api/
│   └── prediction_endpoints.py
└── main.py (FastAPI server)
```

### API Endpoints

1. `GET /api/products/:productId/prediction` - Get price prediction
   ```json
   {
     "productId": "prod_123",
     "title": "Nike Air Max 90",
     "currentPrice": 199.99,
     "predictions": {
       "7days": {
         "confidence": 0.87,
         "predictedPrice": 179.99,
         "expectedDrop": "$20 (10%)",
         "probability": "87% likely"
       },
       "14days": {
         "confidence": 0.82,
         "predictedPrice": 169.99,
         "expectedDrop": "$30 (15%)",
         "probability": "82% likely"
       },
       "30days": {
         "confidence": 0.76,
         "predictedPrice": 159.99,
         "expectedDrop": "$40 (20%)",
         "probability": "76% likely"
       }
     },
     "recommendation": {
       "action": "wait",
       "reasoning": "High probability of significant drop in next 7-14 days",
       "optimalBuyWindow": {
         "startDate": "2026-05-24",
         "endDate": "2026-05-28",
         "expectedPrice": 169.99
       }
     }
   }
   ```

2. `GET /api/categories/:categoryId/trending-predictions` - Best deals by category
   ```json
   {
     "deals": [
       {
         "rank": 1,
         "product": {...},
         "currentPrice": 199.99,
         "predictedPrice": 149.99,
         "savingsOpportunity": "$50 (25%)",
         "daysToWait": 7,
         "confidence": "87%"
       }
     ]
   }
   ```

3. `POST /api/predictions/train` - Trigger model retraining (admin)
   ```json
   {
     "status": "training",
     "startTime": "2026-05-13T14:30:00Z",
     "estimatedDuration": "45 minutes",
     "productsIncluded": 125000
   }
   ```

### Database Schema Updates
```
New PricePrediction table:
├── id (cuid)
├── productId (foreign key)
├── predictionDate (when prediction was made)
├── prediction7days (float)
├── prediction14days (float)
├── prediction30days (float)
├── confidence7days (0-1)
├── confidence14days (0-1)
├── confidence30days (0-1)
├── recommendation (wait|buy|monitor)
├── actual7daysPrice (filled after 7 days)
├── actual14daysPrice (filled after 14 days)
├── actual30daysPrice (filled after 30 days)
└── accuracy (calculated post-prediction)

New ModelMetrics table:
├── id (cuid)
├── trainingDate (when model was trained)
├── totalProductsTrained (number)
├── mae (mean absolute error)
├── rmse (root mean squared error)
├── accuracy (% correct predictions)
├── version (model version)
```

### Success Metrics
- 85%+ accuracy on 7-day predictions
- 75%+ accuracy on 14-day predictions
- 40% improvement in optimal buy timing
- 2x higher savings per user with predictions
- Featured in 20% of watchlist notifications

---

## Feature 4: Social Features & Gamification

### Overview
Enable community sharing, leaderboards, and gamification to drive engagement and virality.

### Features

**1. Watchlist Sharing**
- Share public watchlists (read-only)
- Share private watchlists with friends
- Collaborate on shared watchlists (both can add/remove items)
- Watchlist templates (curated by category)

**2. Price Drop Leaderboards**
- **Weekly:** Who found the best deals?
- **Category:** Top deal finders by category
- **Monthly:** Biggest total savings achieved
- **All-time:** Cumulative savings leaderboard

**3. Achievement Badges**
- "First Watchlist" - Create first watchlist
- "Deal Spotter" - Find price drop before 100 other users
- "Category Expert" - Track 50+ items in one category
- "Price Prophet" - Use predictions successfully 10x
- "Social Butterfly" - Share watchlist 5+ times
- "Affiliate King" - $100+ commissions earned

**4. Community Deals Board**
- Users post hot deals they found
- Upvote/downvote system
- Comments and discussion
- "This deal saved me $X" with proof
- Trending deals feed

**5. Referral Program**
- "Invite friends, both get $5 credit"
- Tracking link for each user
- Dashboard showing referrals
- Bonus rewards at milestones (5 referrals = $10, etc.)

### API Endpoints

1. `POST /api/watchlists/:id/share` - Generate share link
   ```json
   {
     "shareToken": "share_abc123xyz",
     "publicUrl": "https://soleintel.com/watchlists/share_abc123xyz",
     "expiresAt": "2026-05-20T14:30:00Z",
     "permissions": ["view", "add_items", "comment"]
   }
   ```

2. `GET /api/community/deals` - Feed of community deals
   ```json
   {
     "deals": [
       {
         "id": "deal_123",
         "author": "jane_doe",
         "product": {...},
         "retailer": "amazon",
         "originalPrice": 199.99,
         "dealPrice": 99.99,
         "savings": "$100 (50%)",
         "upvotes": 342,
         "comments": 28,
         "timestamp": "2026-05-13T10:30:00Z"
       }
     ]
   }
   ```

3. `GET /api/leaderboards/weekly` - Weekly savings leaderboard
   ```json
   {
     "leaderboard": [
       {
         "rank": 1,
         "user": "deal_master",
         "totalSavings": "$1,234.56",
         "dealsFound": 23,
         "avgSavingsPerDeal": "$53.67"
       }
     ]
   }
   ```

4. `GET /api/user/achievements` - User's badges
   ```json
   {
     "achievements": [
       {
         "id": "badge_first_watchlist",
         "name": "First Watchlist",
         "description": "Created your first watchlist",
         "icon": "✓",
         "unlockedAt": "2026-05-01T08:15:00Z"
       },
       {
         "id": "badge_deal_spotter",
         "name": "Deal Spotter",
         "description": "Found a price drop before 100 other users",
         "icon": "🎯",
         "unlockedAt": "2026-05-06T14:22:00Z"
       }
     ]
   }
   ```

5. `POST /api/referrals/generate` - Create referral link
   ```json
   {
     "referralCode": "JAY123",
     "referralUrl": "https://soleintel.com/join?ref=JAY123",
     "reward": "$5 credit",
     "referralCount": 7,
     "totalEarned": "$35"
   }
   ```

### Database Schema Updates
```
New SharedWatchlist table:
├── id (cuid)
├── originalWatchlistId (foreign key)
├── ownerUserId (foreign key)
├── shareToken (unique)
├── permissions (JSON: ["view", "edit", "comment"])
├── expiresAt (optional)
├── viewCount (integer)
├── lastAccessedAt (datetime)

New CommunityDeal table:
├── id (cuid)
├── authorId (foreign key)
├── productId (foreign key)
├── retailerId (foreign key)
├── dealPrice (float)
├── originalPrice (float)
├── upvotes (integer)
├── downvotes (integer)
├── comments (integer)
├── timestamp (datetime)

New Achievement table:
├── id (cuid)
├── userId (foreign key)
├── achievementType (string: "first_watchlist", "deal_spotter", etc.)
├── unlockedAt (datetime)

New Referral table:
├── id (cuid)
├── referrerId (foreign key)
├── referralCode (unique)
├── referredUsers (integer)
├── totalEarned (float)
├── createdAt (datetime)
```

### Success Metrics
- 40% of users sharing watchlists weekly
- 10,000+ community deals posted in Month 1
- 2x higher DAU with social features
- 5% virality coefficient (1 user brings 5 more)
- Top leaderboard users become brand ambassadors

---

## Implementation Timeline

### Week 1: Multi-Category Foundation
**Days 1-3:**
- Database schema updates (categories, preferences)
- Category API endpoints (list, details, trending)
- Scraper rule engine for multiple categories

**Days 4-5:**
- Retailer integrations (electronics, apparel, home)
- Category filtering in search
- Dashboard category widgets

**Testing:**
- Unit tests for category logic
- Integration tests with scrapers
- Load testing with 20+ categories

### Week 2: Mobile App MVP
**Days 1-2:**
- React Native project setup with Expo
- Authentication (JWT + biometric)
- Watchlist screen UI

**Days 3-4:**
- Search and product details screens
- Price chart visualization
- Offline caching with SQLite

**Days 5:**
- Push notification setup (FCM + APNs)
- App icons and branding
- Internal testing build

### Week 3: Predictions & Social
**Days 1-2:**
- Python prediction service setup
- LSTM model training pipeline
- Historical data preprocessing

**Days 3-4:**
- Prediction API integration
- Watchlist sharing infrastructure
- Community deals board API

**Days 5:**
- Leaderboards and achievements
- Referral system implementation
- Testing across features

### Week 4: Launch & Optimization
**Days 1-2:**
- App Store submissions (iOS + Android)
- Marketing assets for app stores
- App preview videos

**Days 3-4:**
- Performance optimization
- Bug fixes from beta testing
- Launch coordination

**Days 5:**
- Public launch announcement
- Social media campaign
- Day-1 metrics monitoring

---

## Technical Requirements

### Infrastructure
- **ML Service:** Dedicated Python service (requires GPU for training)
- **Database:** PostgreSQL extensions for time series (TimescaleDB optional)
- **CDN:** Images cached for 50,000+ products
- **Mobile:** App signing certificates (Apple + Google)
- **Notifications:** FCM + APNs configuration

### Dependencies to Add
```json
{
  "backend": {
    "scikit-learn": "latest",
    "pandas": "latest",
    "numpy": "latest",
    "torch": "latest",
    "fastapi": "latest"
  },
  "mobile": {
    "react-native": "latest",
    "expo": "latest",
    "redux": "latest",
    "axios": "latest",
    "sqlite": "latest"
  }
}
```

### Security Considerations
- API rate limiting for prediction service (ML is CPU-intensive)
- Biometric data never stored (OS handles it)
- Referral link tracking without PII leakage
- Community moderation (filter inappropriate deals/comments)

---

## Success Metrics & KPIs

### Growth Metrics
- **DAU:** 10,000 → 50,000 (+400%)
- **MAU:** 50,000 → 250,000 (+400%)
- **Daily Sessions:** 15,000 → 100,000 (+567%)
- **Avg Session Length:** 3 min → 8 min (+167%)

### Engagement Metrics
- **Multi-category Adoption:** 30% of users track 2+ categories
- **Mobile App DAU:** 20,000 (40% of total DAU)
- **Social Feature Usage:** 40% share watchlists weekly
- **Prediction CTR:** 35% (users act on predictions)

### Monetization Metrics
- **MRR:** $1,000 → $10,000 (+900%)
- **ARPU:** $0.50 → $2.00 (+300%)
- **Paid Conversion:** 5% → 12% (+140%)
- **Lifetime Value:** $12 → $60 (+400%)

### Quality Metrics
- **App Store Rating:** 4.5+ stars
- **Crash Rate:** <0.1%
- **API Latency:** <200ms (p95)
- **Prediction Accuracy:** 85%+ (7-day)

---

## Budget & Resources

### Engineering
- 2 full-stack engineers (features + infra)
- 1 iOS specialist (mobile native)
- 1 ML engineer (prediction model)
- 1 QA engineer (testing)

### Design & Product
- 1 product manager (coordination)
- 1 mobile designer (UX/UI)
- 1 community manager (deals moderation)

### Infrastructure
- GPU instance for ML training: $300-500/month
- Increased database: +$100/month (TimescaleDB)
- App signing certificates: $99 (iOS) + $25 (Android)
- Total infrastructure: ~$600/month

### Third-party Costs
- Firebase (push notifications): +$100/month
- Stripe API: Already included
- Total Phase 2: ~$700/month additional costs

---

## Risk Mitigation

### Technical Risks
- **Risk:** ML model overfitting on historical data
  - **Mitigation:** Separate train/test/validation sets, periodic retraining
  
- **Risk:** Mobile app performance issues
  - **Mitigation:** Beta testing on real devices, performance profiling
  
- **Risk:** Scaling issues with 50,000+ products
  - **Mitigation:** Database indexing, caching layer, query optimization

### Business Risks
- **Risk:** Low adoption of new categories
  - **Mitigation:** Start with high-demand categories (electronics, apparel)
  
- **Risk:** Community moderation burden
  - **Mitigation:** Automated filtering + community votes + flags
  
- **Risk:** App store rejection
  - **Mitigation:** Follow guidelines exactly, test on real devices

---

## Post-Phase 2 Roadmap

### Phase 3: International & B2B (Months 4-6)
- International expansion (EU, Asia, Australia)
- White-label API for retailers
- B2B partnerships (integrate into shopping assistants)

### Phase 4: Advanced Features (Months 7+)
- Email digest customization (daily/weekly/monthly)
- Browser extension improvements (inline price display)
- Marketplace integration (eBay, Mercari, Poshmark)
- Subscription Box tracking (monthly recurring purchases)

---

**Phase 2 is ambitious but achievable with the right team and focus. Each feature builds on the last to create a network effect of engagement and virality.**

Let's build SOLEINTEL into the #1 price intelligence platform. 🚀
