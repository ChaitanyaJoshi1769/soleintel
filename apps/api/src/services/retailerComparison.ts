import { SCRAPER_REGISTRY, BaseScraper, type ScraperKey } from '@soleintel/scrapers';
import pino from 'pino';

const logger = pino();

export interface ComparisonResult {
  productUrl: string;
  retailer: string;
  title?: string;
  price?: number;
  inStock: boolean;
  scrapedAt: string;
  source: 'scraper' | 'database';
}

export async function compareAcrossRetailers(productUrl: string): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = [];
  const detectedRetailer = detectRetailer(productUrl);

  // Try to detect retailer from URL and scrape original
  if (detectedRetailer) {
    try {
      const scraper = SCRAPER_REGISTRY[detectedRetailer]();
      await scraper.initialize();

      const product = await scraper.scrapeProduct(productUrl);
      if (product) {
        results.push({
          productUrl,
          retailer: scraper.retailer,
          title: product.title,
          price: product.price,
          inStock: product.inStock ?? true,
          scrapedAt: new Date().toISOString(),
          source: 'scraper',
        });
      }

      await scraper.close();
    } catch (err) {
      logger.error({ err }, `Failed to scrape ${detectedRetailer}`);
    }
  }

  return results;
}

export async function searchProductAcrossRetailers(
  query: string,
  retailers: ScraperKey[] = ['amazon', 'walmart', 'nike', 'adidas'],
  maxResults: number = 5
): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = [];
  const searchPromises: Promise<void>[] = [];

  for (const retailer of retailers) {
    const promise = (async () => {
      try {
        const scraper = SCRAPER_REGISTRY[retailer]();
        await scraper.initialize();

        let searchUrl = '';
        switch (retailer) {
          case 'amazon':
            searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}+shoes`;
            break;
          case 'walmart':
            searchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(query)}+shoes`;
            break;
          case 'nike':
            searchUrl = `https://www.nike.com/w/search/${encodeURIComponent(query)}`;
            break;
          case 'adidas':
            searchUrl = `https://www.adidas.com/us/search?q=${encodeURIComponent(query)}`;
            break;
          default:
            return;
        }

        const products = await scraper.scrapeCategory(searchUrl, 1);
        for (const product of products.slice(0, maxResults)) {
          results.push({
            productUrl: product.url || '',
            retailer: scraper.retailer,
            title: product.title,
            price: product.price,
            inStock: product.inStock ?? true,
            scrapedAt: new Date().toISOString(),
            source: 'scraper',
          });
        }

        await scraper.close();
      } catch (err) {
        logger.error({ err }, `Failed to search ${retailer} for "${query}"`);
      }
    })();

    searchPromises.push(promise);
  }

  await Promise.all(searchPromises);
  return results.sort((a, b) => (a.price || 0) - (b.price || 0));
}

function detectRetailer(url: string): ScraperKey | null {
  const hostname = new URL(url).hostname.toLowerCase();

  if (hostname.includes('amazon')) return 'amazon';
  if (hostname.includes('walmart')) return 'walmart';
  if (hostname.includes('nike')) return 'nike';
  if (hostname.includes('adidas')) return 'adidas';
  if (hostname.includes('zappos')) return 'zappos';
  if (hostname.includes('dsw')) return 'dsw';
  if (hostname.includes('footlocker')) return 'foot-locker';
  if (hostname.includes('target')) return 'target';
  if (hostname.includes('shoecarnival')) return 'shoe-carnival';

  return null;
}

export function getAvailableRetailers(): ScraperKey[] {
  return ['amazon', 'walmart', 'nike', 'adidas', 'zappos', 'dsw', 'foot-locker', 'target', 'shoe-carnival'];
}
