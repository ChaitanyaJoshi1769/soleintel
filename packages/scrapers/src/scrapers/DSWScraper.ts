import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class DSWScraper extends BaseScraper {
  retailer = 'DSW';
  productUrlPattern = /dsw\.com\/.*\/product\//;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      await this.waitForSelector('h1', 5000);

      const productData = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl?.textContent?.trim();

        const brandEl = document.querySelector('[class*="Brand"]') || document.querySelector('[data-test="product-brand"]');
        const brand = brandEl?.textContent?.trim() || '';

        const priceEl = document.querySelector('[class*="Price"]') || document.querySelector('span[class*="price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        const stockEl = document.querySelector('[class*="InStock"]') || document.querySelector('[class*="availability"]');
        const inStock = stockEl ? !stockEl.textContent?.toLowerCase().includes('out') : true;

        const imageEl = document.querySelector('img[alt*="product"], img[class*="ProductImage"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        const descriptionEl = document.querySelector('[class*="Description"]');
        const description = descriptionEl?.textContent?.trim() || '';

        const breadcrumbs = Array.from(document.querySelectorAll('a[class*="breadcrumb"]'));
        const category = breadcrumbs[breadcrumbs.length - 1]?.textContent?.trim() || 'Shoes';

        return { title, brand, price, inStock, imageUrl, description, category };
      });

      if (!productData.title) {
        this.logger.warn('Could not extract product title from DSW');
        return null;
      }

      const skuMatch = this.page.url().match(/product\/([0-9]+)/);
      const sku = skuMatch?.[1];

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
        sku,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract DSW product');
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
            url: href ? new URL(href, 'https://dsw.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract DSW product list');
      return [];
    }
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.dsw.com/en/us/category/mens-shoes/80000001';
    return this.scrapeCategory(url, 3);
  }
}
