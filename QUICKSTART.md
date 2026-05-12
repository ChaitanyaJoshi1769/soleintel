# SOLEINTEL Quick Start Guide

Get up and running in 5 minutes.

## 1️⃣ Prerequisites

- Node.js 20+ 
- pnpm (`npm install -g pnpm@9`)
- Docker Desktop (optional but recommended)

## 2️⃣ Clone & Install

```bash
cd /Users/jay/Shoe\ Carnival

# Install dependencies
pnpm install
```

## 3️⃣ Start Services

```bash
# Start PostgreSQL, Redis, etc.
docker-compose up -d

# Run database setup
pnpm db:push
```

## 4️⃣ Run Development

```bash
# Start all servers (API at :3000, Extension at :5173)
pnpm dev
```

## 5️⃣ Load Extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `apps/extension/dist`
5. Visit any product page!

---

## 📂 File Structure at a Glance

```
apps/
  ├── api/         → Fastify REST API (port 3000)
  ├── extension/   → Chrome extension (Manifest V3)
  └── dashboard/   → Admin dashboard

packages/
  ├── scrapers/           → Web scraping services
  ├── matching-engine/    → Product matching logic
  ├── pricing-engine/     → Price analysis
  ├── ai-engine/         → OpenAI integration
  ├── shared/            → Types & utilities
  └── ui/                → React components
```

## 🎯 Common Commands

```bash
# Development
pnpm dev              # Start all dev servers
pnpm build            # Build everything
pnpm test             # Run tests
pnpm lint             # Check code quality
pnpm format           # Auto-format code

# Database
pnpm db:push          # Sync schema with DB
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio UI

# Specific packages
pnpm build --filter=@soleintel/api
pnpm test --filter=@soleintel/matching-engine
```

## 🔧 Configuration

### `.env.local` (required)

Copy from `.env.example`:

```bash
cp .env.example .env.local
```

Update with your settings:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `OPENAI_API_KEY` - Your API key (optional for basic testing)

## 🧪 Testing Features

```bash
# Test product detection
# 1. Visit https://www.shoecarnival.com/...
# 2. Click extension popup
# 3. Should see product details

# Test API
curl http://localhost:3000/api/health

# Test database
pnpm db:studio
```

## 📚 Read Next

1. **[README.md](README.md)** - Full overview
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - How it all works
3. **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
4. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What was built

## 🆘 Troubleshooting

### Ports already in use
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in .env.local
PORT=3001
```

### Database connection failed
```bash
# Check Docker is running
docker ps

# Restart services
docker-compose restart postgres redis

# Check connection string in .env.local
```

### Extension not loading
```bash
# Rebuild extension
pnpm build --filter=@soleintel/extension

# Then reload in chrome://extensions/
```

## 🚀 Next Steps

- [ ] Load extension in Chrome
- [ ] Visit a product page
- [ ] Click extension to see pricing data
- [ ] Read through the code
- [ ] Run tests: `pnpm test`
- [ ] Try modifying a scraper
- [ ] Check out the API endpoints

## 📖 API Endpoints

```
GET  /health                              # Health check
GET  /api/products/:id                    # Get product
GET  /api/products/sku/:sku              # Search by SKU
GET  /api/products/:id/pricing           # Price comparison
GET  /api/products/:id/manufacturers    # Wholesale sources
GET  /api/products/:id/insights         # AI insights
GET  /api/search?q=query                # Full-text search
```

## 🎓 Code Examples

### Detect a Product (Extension)
```typescript
const product = ProductDetector.detectProduct();
// Returns: { title, sku, price, retailer, ... }
```

### Match Products (Matching Engine)
```typescript
const engine = new MatchingEngine();
const matches = engine.findMatches(productA, [productB, productC]);
// Returns: Array of MatchResult with confidence scores
```

### Analyze Prices (Pricing Engine)
```typescript
const pricing = new PricingEngine();
const analysis = pricing.analyzeRetailers(listings);
// Returns: { lowestPrice, averagePrice, recommendation, ... }
```

### Generate Insights (AI Engine)
```typescript
const ai = new AIEngine(apiKey);
const insights = await ai.generateInsights(context);
// Returns: Array of AI-generated insights
```

## 💡 Pro Tips

- Use `pnpm db:studio` to browse your database graphically
- Press Ctrl+C to stop dev servers, they'll clean up gracefully
- Check `.github/workflows/ci.yml` for automated testing
- Extension builds to `apps/extension/dist` (watch mode works with reload)
- API logs to console with pino (structured logging)

## 🎉 You're Ready!

**Start hacking and build something amazing with SOLEINTEL!**

Questions? Check the docs or open an issue on GitHub.

Happy coding! 🚀
