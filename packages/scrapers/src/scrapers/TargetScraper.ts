import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class TargetScraper extends BaseScraper {
  retailer = 'Target';
  productUrlPattern = /target\.com\/p\//;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      // Target often uses React, so we need to wait for content
      await this.page.waitForTimeout(2000);

      const productData = await this.page.evaluate(() => {
        // Title from heading
        const titleEl = document.querySelector('h1');
        const title = titleEl?.textContent?.trim();

        // Brand from breadcrumb or meta info
        const brandEl = document.querySelector('[data-test*="brand"]') || document.querySelector('[class*="Brand"]');
        const brand = brandEl?.textContent?.trim() || '';

        // Price
        const priceEl = document.querySelector('[class*="Price"]') || document.querySelector('[data-test*="price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        // Stock
        const stockEl = document.querySelector('[class*="InStock"]') || document.querySelector('[data-test*="in-stock"]');
        const inStock = stockEl ? !stockEl.textContent?.toLowerCase().includes('out') : true;

        // Image
        const imageEl = document.querySelector('img[alt*="product"], img[class*="ProductImage"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        // Description/details
        const descriptionEl = document.querySelector('[class*="Description"]');
        const description = descriptionEl?.textContent?.trim() || '';

        // Category
        const breadcrumbs = Array.from(document.querySelectorAll('a[class*="breadcrumb"]'));
        const category = breadcrumbs[breadcrumbs.length - 1]?.textContent?.trim() || 'Shoes';

        return { title, brand, price, inStock, imageUrl, description, category };
      });

      if (!productData.title) {
        this.logger.warn('Could not extract product title from Target');
        return null;
      }

      // Extract product ID from URL (after /p/)
      const idMatch = this.page.url().match(/\/p\/([a-zA-Z0-9-]+)/);
      const sku = idMatch?.[1];

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
        sku,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Target product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[class*="ProductCard"], [data-testid="product-card"]'));
        return items.map((item) => {
          const titleEl = item.querySelector('h2') || item.querySelector('[class*="ProductName"]');
          const priceEl = item.querySelector('[class*="Price"]');
          const imageEl = item.querySelector('img');
          const linkEl = item.querySelector('a[href*="/p/"]');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;
          const href = linkEl?.getAttribute('href') || '';

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: (imageEl as HTMLImageElement)?.src,
            url: href ? new URL(href, 'https://target.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Target product list');
      return [];
    }
  }

  async scrapeByCategory(category: string): Promise<ScrapedProduct[]> {
    const url = `https://www.target.com/s?searchTerm=${encodeURIComponent(category)}+shoes`;
    return this.scrapeCategory(url, 3);
  }
}
