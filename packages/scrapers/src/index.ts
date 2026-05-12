// Base scraper
export { BaseScraper, type ScrapedProduct } from './base/BaseScraper';

// Individual scrapers
export { ShoeCarnivalScraper } from './scrapers/ShoeCarnivalScraper';
export { AmazonScraper } from './scrapers/AmazonScraper';
export { WalmartScraper } from './scrapers/WalmartScraper';
export { NikeScraper } from './scrapers/NikeScraper';
export { AdidasScraper } from './scrapers/AdidasScraper';
export { ZapposScraper } from './scrapers/ZapposScraper';
export { DSWScraper } from './scrapers/DSWScraper';
export { FootLockerScraper } from './scrapers/FootLockerScraper';
export { TargetScraper } from './scrapers/TargetScraper';

// Scraper factory for easy initialization
export const SCRAPER_REGISTRY = {
  'shoe-carnival': () => new (require('./scrapers/ShoeCarnivalScraper').ShoeCarnivalScraper)(),
  amazon: () => new (require('./scrapers/AmazonScraper').AmazonScraper)(),
  walmart: () => new (require('./scrapers/WalmartScraper').WalmartScraper)(),
  nike: () => new (require('./scrapers/NikeScraper').NikeScraper)(),
  adidas: () => new (require('./scrapers/AdidasScraper').AdidasScraper)(),
  zappos: () => new (require('./scrapers/ZapposScraper').ZapposScraper)(),
  dsw: () => new (require('./scrapers/DSWScraper').DSWScraper)(),
  'foot-locker': () => new (require('./scrapers/FootLockerScraper').FootLockerScraper)(),
  target: () => new (require('./scrapers/TargetScraper').TargetScraper)(),
} as const;

export type ScraperKey = keyof typeof SCRAPER_REGISTRY;

export async function getScraper(retailer: ScraperKey): Promise<BaseScraper> {
  const factory = SCRAPER_REGISTRY[retailer];
  if (!factory) {
    throw new Error(`Unknown retailer: ${retailer}`);
  }
  const scraper = factory();
  await scraper.initialize();
  return scraper;
}
