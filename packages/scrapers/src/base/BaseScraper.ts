import { chromium, Browser, Page } from 'playwright';
import pino from 'pino';
import { z } from 'zod';

export const ScrapedProductSchema = z.object({
  title: z.string(),
  sku: z.string().optional(),
  upc: z.string().optional(),
  mpn: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().optional(),
  salePrice: z.number().optional(),
  currency: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
  url: z.string(),
  retailer: z.string(),
  category: z.string().optional(),
  variants: z.array(z.record(z.any())).optional(),
});

export type ScrapedProduct = z.infer<typeof ScrapedProductSchema>;

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected page: Page | null = null;
  protected logger = pino();

  abstract retailer: string;
  abstract productUrlPattern: RegExp;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
    });
    this.logger.info(`${this.retailer} scraper initialized`);
  }

  async close(): Promise<void> {
    await this.browser?.close();
    this.logger.info(`${this.retailer} scraper closed`);
  }

  async scrapeProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      if (!this.productUrlPattern.test(url)) {
        throw new Error(`Invalid ${this.retailer} product URL`);
      }

      this.page = await this.browser!.newPage();
      await this.page.goto(url, { waitUntil: 'networkidle' });

      const product = await this.extractProduct();
      return product ? ScrapedProductSchema.parse(product) : null;
    } catch (err) {
      this.logger.error({ err }, `Failed to scrape ${url}`);
      return null;
    } finally {
      await this.page?.close();
      this.page = null;
    }
  }

  async scrapeCategory(categoryUrl: string, maxPages: number = 5): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];
    let currentPage = 1;

    try {
      while (currentPage <= maxPages) {
        this.page = await this.browser!.newPage();
        const paginatedUrl = this.getPaginatedUrl(categoryUrl, currentPage);
        await this.page.goto(paginatedUrl, { waitUntil: 'networkidle' });

        const pageProducts = await this.extractProductList();
        if (pageProducts.length === 0) break;

        products.push(...pageProducts.map((p) => ScrapedProductSchema.parse(p)));
        currentPage++;

        await this.page.close();
        this.page = null;
      }
    } catch (err) {
      this.logger.error({ err }, `Failed to scrape category ${categoryUrl}`);
    } finally {
      await this.page?.close();
      this.page = null;
    }

    return products;
  }

  protected abstract extractProduct(): Promise<Partial<ScrapedProduct> | null>;

  protected abstract extractProductList(): Promise<Partial<ScrapedProduct>[]>;

  protected getPaginatedUrl(baseUrl: string, page: number): string {
    const url = new URL(baseUrl);
    url.searchParams.set('page', page.toString());
    return url.toString();
  }

  protected async waitForSelector(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page!.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  protected async extractText(selector: string): Promise<string | null> {
    try {
      return await this.page!.textContent(selector);
    } catch {
      return null;
    }
  }

  protected async extractAttribute(selector: string, attr: string): Promise<string | null> {
    try {
      return await this.page!.getAttribute(selector, attr);
    } catch {
      return null;
    }
  }
}
