const API_BASE = 'http://localhost:3000/api';

// Listen for tab updates and trigger product analysis
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is a product page
    const isProductPage = isRelevantSite(tab.url);
    if (isProductPage) {
      chrome.tabs.sendMessage(tabId, { type: 'GET_PRODUCT' }).catch(() => {
        // Content script might not be ready yet
      });
    }
  }
});

function isRelevantSite(url: string): boolean {
  const relevantDomains = [
    'shoecarnival.com',
    'nike.com',
    'adidas.com',
    'amazon.com',
    'walmart.com',
    'zappos.com',
    'dsw.com',
    'footlocker.com',
    'target.com',
    'kohls.com',
    'ebay.com',
    'goat.com',
    'stockx.com',
  ];

  return relevantDomains.some((domain) => url.includes(domain));
}

// Handle price comparison requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COMPARE_PRICES') {
    comparePrices(request.product).then(sendResponse).catch((err) => {
      sendResponse({ error: String(err) });
    });
    return true;
  }

  if (request.type === 'SEARCH_PRODUCT') {
    searchProduct(request.query).then(sendResponse).catch((err) => {
      sendResponse({ error: String(err) });
    });
    return true;
  }

  if (request.type === 'ANALYZE_MARKUP') {
    analyzeMarkup(request.product).then(sendResponse).catch((err) => {
      sendResponse({ error: String(err) });
    });
    return true;
  }
});

async function comparePrices(product: any) {
  try {
    // Call backend API to find product and get comparisons
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(product.title)}`);
    const data = await response.json();

    if (data.results.length === 0) {
      return { comparisons: [] };
    }

    const foundProduct = data.results[0];
    const pricingResponse = await fetch(`${API_BASE}/products/${foundProduct.id}/pricing`);
    const pricingData = await pricingResponse.json();

    return {
      productId: foundProduct.id,
      comparisons: pricingData.listings,
      lowestPrice: pricingData.lowestPrice,
      highestPrice: pricingData.highestPrice,
    };
  } catch (err) {
    console.error('Price comparison failed:', err);
    throw err;
  }
}

async function searchProduct(query: string) {
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    return await response.json();
  } catch (err) {
    console.error('Search failed:', err);
    throw err;
  }
}

async function analyzeMarkup(product: any) {
  try {
    // If product is already in system, get markup analysis
    if (product.id) {
      const response = await fetch(`${API_BASE}/products/${product.id}/markup`);
      return await response.json();
    }

    // Otherwise estimate based on visible price
    return {
      msrp: product.msrp,
      averageRetail: product.price,
      estimatedCost: estimateWholesaleCost(product.price),
      estimatedMarkup: calculateMarkup(product.price),
    };
  } catch (err) {
    console.error('Markup analysis failed:', err);
    throw err;
  }
}

function estimateWholesaleCost(retailPrice: number): number {
  // Rough heuristic: typical footwear markup is 40-50% retail cost
  // So wholesale is roughly 20-30% of retail
  return retailPrice * 0.25;
}

function calculateMarkup(retailPrice: number): number {
  const estimatedCost = estimateWholesaleCost(retailPrice);
  return ((retailPrice - estimatedCost) / estimatedCost) * 100;
}

// Periodic sync for price updates (if supported)
if ('periodicSync' in ServiceWorkerRegistration.prototype) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-prices') {
      event.waitUntil(updatePrices());
    }
  });
}

async function updatePrices() {
  // TODO: Update watchlist prices periodically
  console.log('Updating prices...');
}
