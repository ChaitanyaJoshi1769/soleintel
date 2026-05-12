import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class WalmartScraper extends BaseScraper {
  retailer = 'Walmart';
  productUrlPattern = /walmart\.com\/ip\//;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      await this.waitForSelector('[data-testid="product-title"]', 5000);

      const productData = await this.page.evaluate(() => {
        // Title
        const titleEl = document.querySelector('[data-testid="product-title"]');
        const title = titleEl?.textContent?.trim();

        // Brand
        const brandEl = document.querySelector('[data-testid="product-brand"]') || document.querySelector('[class*="Brand"]');
        const brand = brandEl?.textContent?.trim();

        // Price
        const priceEl = document.querySelector('[data-testid="product-price"]') || document.querySelector('span[class*="Price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        // Check stock status
        const stockEl = document.querySelector('[data-testid="product-availability"]');
        const inStock = !stockEl?.textContent?.toLowerCase().includes('out of stock');

        // Main image
        const imageEl = document.querySelector('img[alt="Product Image"]') || document.querySelector('img[class*="ProductImage"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        // Description from details section
        const descriptionEls = Array.from(document.querySelectorAll('[data-testid="product-description"] li'));
        const description = descriptionEls
          .map((el) => el.textContent?.trim())
          .filter(Boolean)
          .slice(0, 3)
          .join('; ');

        // UPC and other identifiers from specifications
        let upc = '';
        const specEls = Array.from(document.querySelectorAll('[class*="Specification"]'));
        specEls.forEach((spec) => {
          const text = spec.textContent?.toLowerCase() || '';
          if (text.includes('upc')) {
            const match = text.match(/:\s*([A-Z0-9]{10,})/);
            if (match) upc = match[1];
          }
        });

        // Category from breadcrumbs
        const breadcrumbs = Array.from(document.querySelectorAll('a[class*="Breadcrumb"]'));
        const category = breadcrumbs[breadcrumbs.length - 1]?.textContent?.trim() || '';

        return {
          title,
          brand,
          price,
          inStock,
          imageUrl,
          upc,
          category,
          description,
        };
      });

      if (!productData.title) {
        this.logger.warn('Could not extract product title from Walmart');
        return null;
      }

      // Extract Walmart ID from URL
      const idMatch = this.page.url().match(/\/ip\/([0-9]+)/);
      const walmartId = idMatch?.[1];

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
        sku: walmartId,
        mpn: productData.upc || walmartId,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Walmart product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[data-testid="product-list-item"]'));
        return items.map((item) => {
          const titleEl = item.querySelector('[data-testid="product-title"]');
          const priceEl = item.querySelector('[data-testid="product-price"]');
          const imageEl = item.querySelector('img');
          const linkEl = item.querySelector('a[href*="/ip/"]');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;
          const href = linkEl?.getAttribute('href') || '';

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: (imageEl as HTMLImageElement)?.src,
            url: href ? new URL(href, 'https://walmart.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Walmart product list');
      return [];
    }
  }

  async scrapeByCategory(category: string): Promise<ScrapedProduct[]> {
    const url = `https://www.walmart.com/search?q=${encodeURIComponent(category)}+shoes`;
    return this.scrapeCategory(url, 3);
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.walmart.com/cp/shoes/1041048';
    return this.scrapeCategory(url, 3);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new WalmartScraper();

  try {
    await scraper.initialize();
    const exampleUrl = 'https://www.walmart.com/ip/123456789';
    console.log('Scraping:', exampleUrl);

    const product = await scraper.scrapeProduct(exampleUrl);
    console.log('Product:', product);

    await scraper.close();
  } catch (err) {
    console.error('Scraper error:', err);
    process.exit(1);
  }
}
