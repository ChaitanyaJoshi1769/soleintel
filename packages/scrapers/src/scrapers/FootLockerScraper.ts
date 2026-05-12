import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class FootLockerScraper extends BaseScraper {
  retailer = 'Foot Locker';
  productUrlPattern = /footlocker\.com\/.*\/product\//;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      await this.waitForSelector('h1', 5000);

      const productData = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl?.textContent?.trim();

        const brandEl = document.querySelector('[class*="Brand"]') || document.querySelector('[data-test*="brand"]');
        const brand = brandEl?.textContent?.trim() || '';

        const priceEl = document.querySelector('[class*="Price"]') || document.querySelector('[data-test*="price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        const stockEl = document.querySelector('[class*="Stock"]') || document.querySelector('[class*="availability"]');
        const inStock = stockEl ? !stockEl.textContent?.toLowerCase().includes('out') : true;

        const imageEl = document.querySelector('img[alt*="product"], img[class*="ProductImage"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        const descriptionEl = document.querySelector('[class*="Description"]');
        const description = descriptionEl?.textContent?.trim() || '';

        const styleIdEl = document.querySelector('[class*="StyleId"], [data-test*="style"]');
        let sku = styleIdEl?.textContent?.match(/[A-Z0-9]{5,}/)?.[0] || '';

        return { title, brand, price, inStock, imageUrl, description, sku };
      });

      if (!productData.title) {
        this.logger.warn('Could not extract product title from Foot Locker');
        return null;
      }

      const skuMatch = this.page.url().match(/product\/([0-9a-zA-Z-]+)/);
      const urlSku = skuMatch?.[1];

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
        sku: productData.sku || urlSku,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Foot Locker product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[class*="ProductCard"], [data-testid="product-card"]'));
        return items.map((item) => {
          const titleEl = item.querySelector('h2');
          const priceEl = item.querySelector('[class*="Price"]');
          const imageEl = item.querySelector('img');
          const linkEl = item.querySelector('a[href*="/product/"]');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;
          const href = linkEl?.getAttribute('href') || '';

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: (imageEl as HTMLImageElement)?.src,
            url: href ? new URL(href, 'https://footlocker.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Foot Locker product list');
      return [];
    }
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.footlocker.com/en/category/mens-shoes';
    return this.scrapeCategory(url, 3);
  }
}
