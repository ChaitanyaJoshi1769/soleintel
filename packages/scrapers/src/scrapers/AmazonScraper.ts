import { BaseScraper, ScrapedProduct } from '../base/BaseScraper';

export class AmazonScraper extends BaseScraper {
  retailer = 'Amazon';
  productUrlPattern = /amazon\.com\/.*\/dp\/[A-Z0-9]{10}/;

  protected async extractProduct(): Promise<Partial<ScrapedProduct> | null> {
    if (!this.page) return null;

    try {
      await this.waitForSelector('#productTitle', 5000);

      // Extract ASIN from URL
      const url = this.page.url();
      const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
      const asin = asinMatch?.[1];

      // Extract product data
      const productData = await this.page.evaluate(() => {
        const title = document.getElementById('productTitle')?.textContent?.trim();
        const brand = document.getElementById('bylineInfo')?.textContent?.trim() || '';

        // Price extraction
        const priceSpans = Array.from(document.querySelectorAll('span.a-price-whole'));
        let price = 0;
        if (priceSpans.length > 0) {
          const priceText = priceSpans[0].textContent?.match(/[\d.]+/)?.[0];
          price = priceText ? parseFloat(priceText) : 0;
        }

        // Check stock status
        const stockText = document.getElementById('availability')?.textContent?.toLowerCase() || '';
        const inStock = !stockText.includes('out of stock');

        // Extract main image
        const imageUrl = (document.querySelector('img.a-dynamic-image') as HTMLImageElement)?.src || '';

        // Extract UPC/ASIN from product details
        const detailBullets = Array.from(document.querySelectorAll('ul.a-unordered-list.a-vertical.a-spacing-mini li'));
        let upc = '';
        detailBullets.forEach((bullet) => {
          const text = bullet.textContent?.toLowerCase() || '';
          if (text.includes('asin') || text.includes('upc')) {
            const match = text.match(/:\s*([A-Z0-9]{10,})/);
            if (match) upc = match[1];
          }
        });

        // Category from breadcrumbs
        const breadcrumbs = Array.from(document.querySelectorAll('a.a-link-normal.s-navigation-item'));
        const category = breadcrumbs[breadcrumbs.length - 1]?.textContent?.trim() || '';

        // Description from first few bullet points
        const featureBullets = Array.from(document.querySelectorAll('div#feature-bullets ul li span'));
        const description = featureBullets
          .slice(0, 3)
          .map((el) => el.textContent?.trim())
          .filter(Boolean)
          .join('; ');

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
        this.logger.warn('Could not extract product title from Amazon');
        return null;
      }

      return {
        ...productData,
        url: this.page.url(),
        retailer: this.retailer,
        sku: asin,
        mpn: asin,
      };
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Amazon product');
      return null;
    }
  }

  protected async extractProductList(): Promise<Partial<ScrapedProduct>[]> {
    if (!this.page) return [];

    try {
      const products = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'));
        return items.map((item) => {
          const titleEl = item.querySelector('h2 a span');
          const priceEl = item.querySelector('span.a-price-whole');
          const imageEl = item.querySelector('img');
          const linkEl = item.querySelector('h2 a');

          const priceText = priceEl?.textContent?.match(/[\d.]+/)?.[0];
          const price = priceText ? parseFloat(priceText) : 0;

          const href = linkEl?.getAttribute('href') || '';
          const asin = href.match(/\/dp\/([A-Z0-9]{10})/)?.[1];

          return {
            title: titleEl?.textContent?.trim(),
            price,
            imageUrl: imageEl?.getAttribute('src'),
            url: href ? new URL(href, 'https://amazon.com').toString() : '',
            sku: asin,
          };
        });
      });

      return products.filter((p) => p.title && p.url);
    } catch (err) {
      this.logger.error({ err }, 'Failed to extract Amazon product list');
      return [];
    }
  }

  async scrapeByCategory(category: string): Promise<ScrapedProduct[]> {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(category)}+shoes`;
    return this.scrapeCategory(url, 3);
  }

  async scrapeByBrand(brand: string): Promise<ScrapedProduct[]> {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(brand)}+shoes`;
    return this.scrapeCategory(url, 5);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new AmazonScraper();

  try {
    await scraper.initialize();
    const exampleUrl = 'https://www.amazon.com/dp/B0CJG8KGXL';
    console.log('Scraping:', exampleUrl);

    const product = await scraper.scrapeProduct(exampleUrl);
    console.log('Product:', product);

    await scraper.close();
  } catch (err) {
    console.error('Scraper error:', err);
    process.exit(1);
  }
}
