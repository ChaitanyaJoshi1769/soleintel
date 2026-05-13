import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class ZapposScraper extends BaseScraper {
  retailer = 'Zappos';
  productUrlPattern = /zappos\.com\/.*\/product\//;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      // Zappos may require JSON-LD, look for structured data
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

      // Fallback to DOM if JSON-LD not found
      const productData = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1') || document.querySelector('[class*="ProductName"]');
        const title = titleEl?.textContent?.trim();

        // Brand
        const brandEl = document.querySelector('[class*="Brand"]');
        const brand = brandEl?.textContent?.trim() || '';

        // Price
        const priceEl = document.querySelector('[class*="Price"]') || document.querySelector('span[class*="price"]');
        const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
        const price = priceText ? parseFloat(priceText) : 0;

        // Stock status
        const stockEl = document.querySelector('[class*="InStock"]') || document.querySelector('[class*="availability"]');
        const inStock = stockEl ? !stockEl.textContent?.toLowerCase().includes('out') : true;

        // Main image
        const imageEl = document.querySelector('img[class*="ProductImage"]') || document.querySelector('img[alt*="product"]');
        const imageUrl = (imageEl as HTMLImageElement)?.src || '';

        // Description
        const descriptionEl = document.querySelector('[class*="ProductDescription"]') || document.querySelector('[class*="description"]');
        const description = descriptionEl?.textContent?.trim() || '';

        // Product code from details
        let sku = '';
        const codeEl = document.querySelector('[class*="ProductCode"]');
        if (codeEl) {
          const match = codeEl.textContent?.match(/[A-Z0-9]{5,}/);
          if (match) sku = match[0];
        }

        // Category from breadcrumbs
        const breadcrumbs = Array.from(document.querySelectorAll('a[class*="breadcrumb"]'));
        const category = breadcrumbs[breadcrumbs.length - 1]?.textContent?.trim() || 'Shoes';

        // Color and size information
        const colorEl = document.querySelector('[class*="color-selector"]');
        const color = colorEl?.getAttribute('aria-label') || '';

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

      if (jsonLd && jsonLd.name) {
        return {
          url: this.page.url(),
          retailer: this.retailer,
          title: jsonLd.name,
          brand: jsonLd.brand?.name || jsonLd.brand || productData.brand,
          price: jsonLd.offers?.[0]?.price || productData.price,
          inStock: jsonLd.offers?.[0]?.availability === 'https://schema.org/InStock' || productData.inStock,
          imageUrl: Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image || productData.imageUrl,
          sku: jsonLd.sku || productData.sku,
          upc: jsonLd.gtin13 || jsonLd.gtin || '',
          description: jsonLd.description || productData.description,
          category: productData.category,
        };
      }

      if (!productData.title) {
        this.logger.warn('Could not extract product title from Zappos');
        return null;
      }

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Zappos product');
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
          const linkEl = item.querySelector('a[href*="/product/"]');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;
          const href = linkEl?.getAttribute('href') || '';

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: (imageEl as HTMLImageElement)?.src,
            url: href ? new URL(href, 'https://zappos.com').toString() : '',
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Zappos product list');
      return [];
    }
  }

  async scrapeNewArrivals(): Promise<ScrapedProduct[]> {
    const url = 'https://www.zappos.com/shoes?sort=newest';
    return this.scrapeCategory(url, 3);
  }

  async scrapeByBrand(brand: string): Promise<ScrapedProduct[]> {
    const url = `https://www.zappos.com/shoes?brand=${encodeURIComponent(brand)}`;
    return this.scrapeCategory(url, 5);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new ZapposScraper();

  try {
    await scraper.initialize();
    const exampleUrl = 'https://www.zappos.com/product/123456789/color/123456';
    console.log('Scraping:', exampleUrl);

    const product = await scraper.scrapeProduct(exampleUrl);
    console.log('Product:', product);

    await scraper.close();
  } catch (err) {
    console.error('Scraper error:', err);
    process.exit(1);
  }
}
