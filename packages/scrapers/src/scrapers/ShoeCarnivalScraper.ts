import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class ShoeCarnivalScraper extends BaseScraper {
  retailer = 'Shoe Carnival';
  productUrlPattern = /shoecarnival\.com\/.*\/p\//;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      // Wait for product data to load
      await this.waitForSelector('[data-product-sku]', 5000);

      // Extract from structured data first (most reliable)
      const jsonLd = await this.page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        for (const script of scripts) {
          try {
            const data = JSON.parse(script.textContent || '{}');
            if (data.name && (data.sku || data.offers)) {
              return data;
            }
          } catch (e) {
            // Continue
          }
        }
        return null;
      });

      if (!jsonLd) {
        this.logger.warn('No JSON-LD found for product');
        return null;
      }

      const product: Partial<ScrapedProduct> = {
        url: this.page.url(),
        retailer: this.retailer,
        title: jsonLd.name,
        sku: jsonLd.sku,
        brand: jsonLd.brand?.name || jsonLd.brand,
        description: jsonLd.description,
        category: jsonLd.category,
      };

      // Extract price
      if (jsonLd.offers && Array.isArray(jsonLd.offers)) {
        const offer = jsonLd.offers[0];
        product.price = parseFloat(offer.price);
        product.currency = offer.priceCurrency;
        product.inStock = offer.availability === 'https://schema.org/InStock';
      }

      // Extract image
      if (jsonLd.image) {
        product.imageUrl = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image;
      }

      // Extract sale price if available
      const salePriceEl = await this.extractText('[data-sale-price]');
      if (salePriceEl) {
        const salePrice = parseFloat(salePriceEl.match(/\d+\.\d+/)?.[0] || '0');
        product.salePrice = salePrice;
      }

      // Extract UPC from product data
      const upcEl = await this.extractAttribute('[data-product-upc]', 'data-product-upc');
      if (upcEl) {
        product.upc = upcEl;
      }

      return product;
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[data-product-card]'));
        return items.map((item) => {
          const titleEl = item.querySelector('[data-product-name]');
          const priceEl = item.querySelector('[data-product-price]');
          const imageEl = item.querySelector('img[data-product-image]');
          const linkEl = item.querySelector('a[href*="/p/"]');

          return {
            title: titleEl?.textContent?.trim(),
            price: parseFloat(priceEl?.textContent?.match(/\d+\.\d+/)?.[0] || '0'),
            imageUrl: imageEl?.getAttribute('src'),
            url: linkEl?.getAttribute('href'),
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract product list');
      return [];
    }
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.shoecarnival.com/mens/shoes';
    return this.scrapeCategory(url, 3);
  }

  async scrapeByBrand(brand: string): Promise<ScrapedProduct[]> {
    const url = `https://www.shoecarnival.com/mens/shoes?brand=${encodeURIComponent(brand)}`;
    return this.scrapeCategory(url, 5);
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new ShoeCarnivalScraper();

  try {
    await scraper.initialize();

    // Example: scrape a product
    const exampleUrl = 'https://www.shoecarnival.com/mens/shoes/p/nike-revolution-7/12345';
    console.log('Scraping:', exampleUrl);

    const product = await scraper.scrapeProduct(exampleUrl);
    console.log('Product:', product);

    await scraper.close();
  } catch (err) {
    console.error('Scraper error:', err);
    process.exit(1);
  }
}
