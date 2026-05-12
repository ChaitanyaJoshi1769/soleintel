export interface DetectedProduct {
  title: string;
  brand?: string;
  sku?: string;
  upc?: string;
  mpn?: string;
  price?: number;
  salePrice?: number;
  currency?: string;
  imageUrl?: string;
  description?: string;
  url: string;
  retailer: string;
}

export class ProductDetector {
  static detectFromShoeCarnival(): DetectedProduct | null {
    const product: DetectedProduct = {
      title: '',
      url: window.location.href,
      retailer: 'Shoe Carnival',
    };

    // JSON-LD parsing
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd.textContent || '{}');
        if (data.name) product.title = data.name;
        if (data.sku) product.sku = data.sku;
        if (data.brand) product.brand = data.brand;
        if (data.offers?.[0]) {
          product.price = parseFloat(data.offers[0].price);
          product.currency = data.offers[0].priceCurrency;
        }
        if (data.image) product.imageUrl = data.image;
        if (data.description) product.description = data.description;
      } catch (e) {
        console.error('Failed to parse JSON-LD', e);
      }
    }

    // Fallback to DOM extraction
    if (!product.title) {
      const titleEl = document.querySelector('h1, [class*="product-title"]');
      if (titleEl) product.title = titleEl.textContent?.trim() || '';
    }

    if (!product.price) {
      const priceEl = document.querySelector('[class*="price"], [data-price]');
      if (priceEl) {
        const priceText = priceEl.textContent?.match(/\d+\.?\d*/)?.[0];
        if (priceText) product.price = parseFloat(priceText);
      }
    }

    if (!product.imageUrl) {
      const imgEl = document.querySelector('img[alt*="product"], img[class*="product"]');
      if (imgEl instanceof HTMLImageElement) {
        product.imageUrl = imgEl.src;
      }
    }

    // SKU from URL or page data
    if (!product.sku) {
      const skuMatch = window.location.href.match(/sku[=\/]([a-zA-Z0-9-]+)/i);
      if (skuMatch) product.sku = skuMatch[1];
    }

    return product.title ? product : null;
  }

  static detectFromNike(): DetectedProduct | null {
    const product: DetectedProduct = {
      title: '',
      url: window.location.href,
      retailer: 'Nike',
    };

    // Nike specific selectors
    const titleEl = document.querySelector('h1');
    if (titleEl) product.title = titleEl.textContent?.trim() || '';

    const priceEl = document.querySelector('[data-test="product-price"]');
    if (priceEl) {
      const priceText = priceEl.textContent?.match(/\d+\.?\d*/)?.[0];
      if (priceText) product.price = parseFloat(priceText);
    }

    const imgEl = document.querySelector('[data-test="product-image"] img');
    if (imgEl instanceof HTMLImageElement) {
      product.imageUrl = imgEl.src;
    }

    product.brand = 'Nike';

    return product.title ? product : null;
  }

  static detectFromAmazon(): DetectedProduct | null {
    const product: DetectedProduct = {
      title: '',
      url: window.location.href,
      retailer: 'Amazon',
    };

    // Amazon ASIN
    const asinMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
    if (asinMatch) product.mpn = asinMatch[1];

    const titleEl = document.querySelector('#productTitle');
    if (titleEl) product.title = titleEl.textContent?.trim() || '';

    const priceEl = document.querySelector('.a-price-whole');
    if (priceEl) {
      const priceText = priceEl.textContent?.match(/\d+\.?\d*/)?.[0];
      if (priceText) product.price = parseFloat(priceText);
    }

    const imgEl = document.querySelector('.a-dynamic-image');
    if (imgEl instanceof HTMLImageElement) {
      product.imageUrl = imgEl.src;
    }

    return product.title ? product : null;
  }

  static detectGeneric(): DetectedProduct | null {
    const product: DetectedProduct = {
      title: '',
      url: window.location.href,
      retailer: new URL(window.location.href).hostname,
    };

    // Try JSON-LD first (most reliable)
    const jsonLds = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const jsonLd of jsonLds) {
      try {
        const data = JSON.parse(jsonLd.textContent || '{}');

        if (data['@type'] === 'Product' || data.name) {
          if (data.name) product.title = data.name;
          if (data.sku) product.sku = data.sku;
          if (data.brand?.name) product.brand = data.brand.name;
          if (data.offers?.price) product.price = parseFloat(data.offers.price);
          if (data.image) product.imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;
          if (data.description) product.description = data.description;
          break;
        }
      } catch (e) {
        // Continue to next schema
      }
    }

    // Fallback to OG tags
    if (!product.title) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) product.title = ogTitle.getAttribute('content') || '';
    }

    if (!product.imageUrl) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) product.imageUrl = ogImage.getAttribute('content') || '';
    }

    return product.title ? product : null;
  }

  static detectProduct(): DetectedProduct | null {
    const hostname = window.location.hostname;

    if (hostname.includes('shoecarnival')) {
      return this.detectFromShoeCarnival();
    }
    if (hostname.includes('nike')) {
      return this.detectFromNike();
    }
    if (hostname.includes('amazon')) {
      return this.detectFromAmazon();
    }

    return this.detectGeneric();
  }
}
