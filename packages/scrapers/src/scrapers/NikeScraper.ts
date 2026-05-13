import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class NikeScraper extends BaseScraper {
  retailer = 'Nike';
  productUrlPattern = /nike\.com\/.*\/p\/[A-Z0-9]+/;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      await this.waitForSelector('[data-test="product-title"]', 5000);

      const productData = await this.page.evaluate(() => {
        // Title
        const titleEl = document.querySelector('[data-test="product-title"]');
        const title = titleEl?.textContent?.trim();

        // Brand is Nike itself
        const brand = 'Nike';

        // Price
        const priceEl = document.querySelector('[data-test="product-price"]') || document.querySelector('span[class*="price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        // Stock status
        const stockEl = document.querySelector('[data-test="product-availability"]') || document.querySelector('span[class*="availability"]');
        const inStock = !stockEl?.textContent?.toLowerCase().includes('out of stock');

        // Main image
        const imageEl = document.querySelector('img[class*="ProductImage"]') || document.querySelector('img[alt*="product"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        // Description from product details
        const descriptionEl = document.querySelector('[data-test="product-description"]');
        const description = descriptionEl?.textContent?.trim() || '';

        // SKU from product details or data attribute
        let sku = '';
        const skuEl = document.querySelector('[data-test="product-sku"]');
        if (skuEl) {
          sku = skuEl.textContent?.match(/[A-Z0-9]{5,}/)?.[0] || '';
        }

        // Extract details like color and size
        const colorEl = document.querySelector('[data-test="selected-color"]');
        const color = colorEl?.textContent?.trim() || '';

        // Category from breadcrumbs
        const breadcrumbs = Array.from(document.querySelectorAll('nav a'));
        const category = breadcrumbs[breadcrumbs.length - 1]?.textContent?.trim() || 'Shoes';

        return {
          title,
          brand,
          price,
          inStock,
          imageUrl,
          description,
          sku,
          category,
        };
      });

      if (!productData.title) {
        this.logger.warn('Could not extract product title from Nike');
        return null;
      }

      // Extract SKU from URL if not found
      const skuMatch = this.page.url().match(/\/p\/([A-Z0-9]+)/);
      const urlSku = skuMatch?.[1];

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
        sku: productData.sku || urlSku,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Nike product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[data-test="product-card"]'));
        return items.map((item) => {
          const titleEl = item.querySelector('[data-test="product-title"]');
          const priceEl = item.querySelector('[data-test="product-price"]');
          const imageEl = item.querySelector('img');
          const linkEl = item.querySelector('a[href*="/t/"]') || item.querySelector('a');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;
          const href = linkEl?.getAttribute('href') || '';

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: (imageEl as HTMLImageElement)?.src,
            url: href ? new URL(href, 'https://nike.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Nike product list');
      return [];
    }
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.nike.com/w/new-mens-shoes-eur-3jsfx';
    return this.scrapeCategory(url, 3);
  }

  async scrapeByGender(gender: 'mens' | 'womens' | 'kids'): Promise<ScrapedProduct[]> {
    const url = `https://www.nike.com/w/${gender}-shoes-eur`;
    return this.scrapeCategory(url, 5);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new NikeScraper();

  try {
    await scraper.initialize();
    const exampleUrl = 'https://www.nike.com/t/revolution-7-mens-running-shoes/ABCD123';
    console.log('Scraping:', exampleUrl);

    const product = await scraper.scrapeProduct(exampleUrl);
    console.log('Product:', product);

    await scraper.close();
  } catch (err) {
    console.error('Scraper error:', err);
    process.exit(1);
  }
}
