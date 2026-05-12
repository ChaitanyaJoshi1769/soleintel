import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class AdidasScraper extends BaseScraper {
  retailer = 'Adidas';
  productUrlPattern = /adidas\.com\/.*\/p\/[A-Z0-9]+/;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      await this.waitForSelector('h1', 5000);

      const productData = await this.page.evaluate(() => {
        // Title from h1
        const titleEl = document.querySelector('h1');
        const title = titleEl?.textContent?.trim();

        // Brand is Adidas
        const brand = 'Adidas';

        // Price
        const priceEl = document.querySelector('[data-testid="product-price"]') || document.querySelector('span[class*="price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        // Stock status
        const stockEl = document.querySelector('[data-testid="availability"]');
        const inStock = !stockEl?.textContent?.toLowerCase().includes('out of stock');

        // Main image
        const imageEl = document.querySelector('img[class*="ProductImage"]') || document.querySelector('img[alt*="product"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        // Description
        const descriptionEl = document.querySelector('[data-testid="product-description"]');
        const description = descriptionEl?.textContent?.trim() || '';

        // Product code/SKU
        let sku = '';
        const detailElements = Array.from(document.querySelectorAll('[class*="ProductDetail"]'));
        detailElements.forEach((el) => {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('product code') || text.includes('style id')) {
            const match = text.match(/:\s*([A-Z0-9]{5,})/);
            if (match) sku = match[1];
          }
        });

        // Color options
        const colorEl = document.querySelector('[data-testid="color-selector"]');
        const color = colorEl?.getAttribute('aria-label') || '';

        // Gender category
        const genderEl = Array.from(document.querySelectorAll('a[href*="/men"], a[href*="/women"], a[href*="/kids"]'))[0];
        const category = genderEl?.textContent?.trim() || 'Shoes';

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
        this.logger.warn('Could not extract product title from Adidas');
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
      this.logger.error({ err }, 'Failed to extract Adidas product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[data-testid="product-card"]'));
        return items.map((item) => {
          const titleEl = item.querySelector('h2');
          const priceEl = item.querySelector('[data-testid="product-price"]');
          const imageEl = item.querySelector('img');
          const linkEl = item.querySelector('a[href*="/p/"]');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;
          const href = linkEl?.getAttribute('href') || '';

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: (imageEl as HTMLImageElement)?.src,
            url: href ? new URL(href, 'https://adidas.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Adidas product list');
      return [];
    }
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.adidas.com/us/men-shoes?sort=new';
    return this.scrapeCategory(url, 3);
  }

  async scrapeByGender(gender: 'men' | 'women' | 'kids'): Promise<ScrapedProduct[]> {
    const url = `https://www.adidas.com/us/${gender}-shoes`;
    return this.scrapeCategory(url, 5);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new AdidasScraper();

  try {
    await scraper.initialize();
    const exampleUrl = 'https://www.adidas.com/us/ultraboost-22-shoes/GZ8053.html';
    console.log('Scraping:', exampleUrl);

    const product = await scraper.scrapeProduct(exampleUrl);
    console.log('Product:', product);

    await scraper.close();
  } catch (err) {
    console.error('Scraper error:', err);
    process.exit(1);
  }
}
