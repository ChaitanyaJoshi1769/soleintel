# SOLEINTEL Architecture

## System Overview

SOLEINTEL is a distributed system consisting of three main components:

```
┌─────────────────────┐
│   Chrome Extension  │
│  (React + Manifest  │
│       V3)           │
└──────────┬──────────┘
           │
           │ HTTPS
           │
┌──────────▼──────────┐
│    Fastify API      │
│  (REST Endpoints)   │
└──────────┬──────────┘
           │
      ┌────┴──────┬──────────┬──────────┐
      │            │          │          │
┌─────▼──┐  ┌─────▼──┐  ┌───▼────┐  ┌─▼────┐
│ PostgreSQL│  │ Redis │  │Scrapers│  │ AI   │
│(Products) │  │(Cache)│  │(Data)  │  │(LLM) │
└──────────┘  └──────┘  └────────┘  └──────┘
```

## Component Architecture

### 1. Chrome Extension (`apps/extension/`)

The extension is the user-facing interface that runs in the browser.

**Key Responsibilities:**
- Detect products on retailer pages
- Display pricing comparison UI
- Manage watchlist
- Send price drop alerts
- Cache frequently accessed data

**Core Modules:**
- `contentScript.ts` - Runs in page context, extracts product data
- `serviceWorker.ts` - Background script for API calls and sync
- `Popup.tsx` - Popup UI component
- `ProductDetector.ts` - Product extraction logic
- `useStore` - Zustand state management

**Performance Optimizations:**
- Code splitting with dynamic imports
- Service worker caching strategies
- Lazy-loaded heavy modules
- IndexedDB for large data sets

**Security:**
- Strict CSP headers
- XSS protection
- Minimal permission requests
- Encrypted storage

### 2. Backend API (`apps/api/`)

Fastify server providing REST endpoints for product data, pricing, and intelligence.

**Architecture Pattern: Layered**

```
Routes (Fastify) ↓
Middleware ↓
Controllers ↓
Services ↓
Prisma ORM ↓
PostgreSQL
```

**Key Endpoints:**
- `/api/products/*` - Product CRUD
- `/api/search` - Full-text search
- `/api/pricing/*` - Price comparison
- `/api/watchlist/*` - User watchlists
- `/api/insights/*` - AI recommendations

**Caching Strategy:**
- Redis for hot data (products, prices)
- HTTP caching headers for GET requests
- Background refresh jobs

### 3. Data Layer (`apps/api/prisma/`)

PostgreSQL database with comprehensive schema.

**Key Tables:**
- `Product` - Core product data
- `RetailerListing` - Product listings by retailer
- `PriceHistory` - Historical pricing data
- `ManufacturerSource` - Wholesale sources
- `ProductInsight` - AI-generated insights
- `Watchlist` - User watchlists

**Indexing Strategy:**
- B-tree indexes on frequently queried fields
- Full-text search on title/description
- Composite indexes for common queries

### 4. Scraping Layer (`packages/scrapers/`)

Playwright-based scrapers for collecting product data.

**Architecture:**
```
BaseScraper (abstract) ↓
├── ShoeCarnivalScraper
├── NikeScraper
├── AmazonScraper
└── GenericScraper

↓

Queue System (Bull)

↓

Data Validation (Zod)

↓

API Upload
```

**Scraper Features:**
- Automatic retry with exponential backoff
- Proxy rotation for IP diversity
- User-agent rotation
- JavaScript rendering support
- DOM and JSON-LD extraction

### 5. Matching Engine (`packages/matching-engine/`)

Advanced product matching using multiple strategies.

**Matching Strategy:**

```
Product Input ↓
├── Exact SKU Match (99% confidence)
├── UPC Match (99% confidence)
├── Title Similarity (Fuzzy matching)
├── Brand Verification (10% boost)
├── Color/Size Match (5-10% boost)
└── Semantic Embeddings (OpenAI)
```

**Match Types:**
- `exact` - Multiple identifiers match
- `sku` - SKU/UPC match
- `semantic` - Embedding-based match
- `fuzzy` - String similarity match

## Data Flow

### Product Detection Flow

```
1. User visits product page
   ↓
2. Content script detects page type
   ↓
3. ProductDetector extracts data
   ├── Try JSON-LD
   ├── Try OG tags
   ├── Fallback to DOM
   └── Validate with Zod
   ↓
4. Send to background script
   ↓
5. Upload to API
   ↓
6. API searches for matches
   ├── Database (exact)
   ├── Scraper queue (missing)
   └── Trigger background scraping
   ↓
7. Return comparisons to popup
```

### Price Comparison Flow

```
1. User opens popup
   ↓
2. Extension requests comparisons
   ↓
3. API queries retailer listings
   ├── Cache hit? Return immediately
   └── Cache miss? Trigger scrape
   ↓
4. Join with retailer info
   ├── Add shipping estimates
   ├── Add tax estimates
   └── Sort by total price
   ↓
5. Return to extension
   ↓
6. UI renders comparison table
```

### AI Insight Generation

```
1. Product saved/updated
   ↓
2. Trigger insight job
   ↓
3. Gather context
   ├── Price history
   ├── Manufacturer sources
   ├── Similar products
   └── Historical patterns
   ↓
4. Call OpenAI API
   ├── Determine if overpriced
   ├── Estimate wait-for-sale probability
   └── Find best retailer
   ↓
5. Store insight in DB
   ↓
6. Display in UI
```

## Scalability Considerations

### Horizontal Scaling
- API: Stateless, scales with load balancer
- Scrapers: Queue-based, adds workers as needed
- Database: Read replicas for scaling reads

### Performance Optimization
- Redis caching layer
- Database query optimization
- Lazy loading in extension
- Image optimization
- API response compression

### Data Growth Strategy
- Time-series partitioning for price history
- Archive old data to cold storage
- Search index optimization

## Security Architecture

### Extension Security
```
┌──────────────────┐
│  Extension Code  │
├──────────────────┤
│  Content Script  │ ← Isolated world
│  ├─ No DOM XSS   │
│  └─ No variable  │
│     pollution    │
├──────────────────┤
│Service Worker    │ ← No content access
│├─ Network calls  │
│├─ Storage        │
│└─ Background ops │
└──────────────────┘
```

### API Security
- HTTPS only
- CORS validation
- Rate limiting (100 req/15min)
- Request validation (Zod)
- SQL injection prevention (Prisma)
- CSRF tokens for mutations

### Data Security
- Encrypted at rest (PG)
- Encrypted in transit (TLS)
- PII encryption layer
- Access logging
- Audit trails

## Development Workflow

### Feature Development
```
1. Create feature branch
   └─ git checkout -b feat/feature-name
   
2. Implement changes
   └─ Add tests first (TDD)
   
3. Run tests & lint
   └─ pnpm test && pnpm lint
   
4. Create PR with description
   └─ Link related issues
   
5. Code review
   └─ Automated checks + manual review
   
6. Merge to main
   └─ Auto-deploy to staging
```

### Deployment Pipeline

```
Commit to main ↓
├─ Run CI/CD
│  ├─ Lint
│  ├─ Type check
│  ├─ Unit tests
│  └─ Build
├─ Deploy to staging
│  └─ Run integration tests
├─ Manual approval
└─ Deploy to production
```

## Monitoring & Observability

### Metrics to Track
- Extension load time
- API response latency
- Database query time
- Cache hit rate
- Error rate
- Scraper success rate

### Logging Strategy
- Structured logging (pino)
- Different log levels
- Correlation IDs
- Error tracking (Sentry)

### Health Checks
- API health endpoint
- Database connectivity
- Redis connectivity
- Scraper job status

## Future Enhancements

### Planned Improvements
- [ ] GraphQL API option
- [ ] Real-time WebSocket updates
- [ ] Machine learning ranking
- [ ] Image-based matching
- [ ] Mobile app
- [ ] Desktop application

### Tech Debt
- [ ] Migrate to Turbopack for faster builds
- [ ] Add E2E tests for extension
- [ ] Optimize database schema
- [ ] Implement API versioning
