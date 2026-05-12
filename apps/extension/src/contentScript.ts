import { ProductDetector } from './services/productDetector';

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PRODUCT') {
    try {
      const product = ProductDetector.detectProduct();
      sendResponse({ success: true, product });
    } catch (err) {
      console.error('Product detection failed:', err);
      sendResponse({ success: false, error: String(err) });
    }
  }

  if (request.type === 'EXTRACT_PRODUCT_DATA') {
    // More detailed extraction if needed
    try {
      const allProducts = detectAllProducts();
      sendResponse({ success: true, products: allProducts });
    } catch (err) {
      sendResponse({ success: false, error: String(err) });
    }
  }

  return true; // Keep the message channel open for async response
});

function detectAllProducts() {
  const products = [];
  const product = ProductDetector.detectProduct();
  if (product) {
    products.push(product);
  }
  return products;
}

// Auto-detect and store product on page load
window.addEventListener('load', () => {
  const product = ProductDetector.detectProduct();
  if (product) {
    chrome.storage.local.set({ currentProduct: product });
  }
});

// Listen for page navigation changes
window.addEventListener('hashchange', () => {
  const product = ProductDetector.detectProduct();
  if (product) {
    chrome.storage.local.set({ currentProduct: product });
  }
});
