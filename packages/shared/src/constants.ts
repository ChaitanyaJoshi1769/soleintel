// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// Retailers
export const MAJOR_RETAILERS = {
  SHOE_CARNIVAL: {
    id: 'shoe-carnival',
    name: 'Shoe Carnival',
    domain: 'shoecarnival.com',
    category: 'discount' as const,
  },
  NIKE: {
    id: 'nike',
    name: 'Nike',
    domain: 'nike.com',
    category: 'brand' as const,
  },
  ADIDAS: {
    id: 'adidas',
    name: 'Adidas',
    domain: 'adidas.com',
    category: 'brand' as const,
  },
  AMAZON: {
    id: 'amazon',
    name: 'Amazon',
    domain: 'amazon.com',
    category: 'marketplace' as const,
  },
  WALMART: {
    id: 'walmart',
    name: 'Walmart',
    domain: 'walmart.com',
    category: 'marketplace' as const,
  },
  ZAPPOS: {
    id: 'zappos',
    name: 'Zappos',
    domain: 'zappos.com',
    category: 'discount' as const,
  },
  DSW: {
    id: 'dsw',
    name: 'DSW',
    domain: 'dsw.com',
    category: 'specialty' as const,
  },
  FOOT_LOCKER: {
    id: 'foot-locker',
    name: 'Foot Locker',
    domain: 'footlocker.com',
    category: 'specialty' as const,
  },
  TARGET: {
    id: 'target',
    name: 'Target',
    domain: 'target.com',
    category: 'marketplace' as const,
  },
  KOHLS: {
    id: 'kohls',
    name: "Kohl's",
    domain: 'kohls.com',
    category: 'marketplace' as const,
  },
  EBAY: {
    id: 'ebay',
    name: 'eBay',
    domain: 'ebay.com',
    category: 'marketplace' as const,
  },
  GOAT: {
    id: 'goat',
    name: 'GOAT',
    domain: 'goat.com',
    category: 'resale' as const,
  },
  STOCKX: {
    id: 'stockx',
    name: 'StockX',
    domain: 'stockx.com',
    category: 'resale' as const,
  },
} as const;

// Matching Confidence Thresholds
export const MATCH_CONFIDENCE = {
  EXACT: 0.95,
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
};

// Pricing
export const PRICING_CONSTANTS = {
  TYPICAL_RETAIL_MARKUP_MIN: 40,
  TYPICAL_RETAIL_MARKUP_MAX: 50,
  TYPICAL_WHOLESALE_PERCENTAGE: 0.25,
  DROPSHIP_MARKUP_THRESHOLD: 250,
  PRICE_DIFF_THRESHOLD: 0.15, // 15%
};

// Cache Duration (in seconds)
export const CACHE_DURATION = {
  PRODUCT: 3600, // 1 hour
  PRICING: 1800, // 30 minutes
  SEARCH: 600, // 10 minutes
  TRENDING: 3600, // 1 hour
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
};

// Search
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
};

// Recommendations
export const RECOMMENDATIONS = {
  BUY: 'buy' as const,
  WAIT: 'wait' as const,
  OVERPRICED: 'overpriced' as const,
};

// Colors (for UI)
export const COLORS = {
  PRIMARY: '#10a981',
  PRIMARY_DARK: '#059669',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
};

// Status Messages
export const STATUS_MESSAGES = {
  LOADING: 'Loading...',
  ERROR: 'Something went wrong',
  NO_RESULTS: 'No results found',
  SUCCESS: 'Success!',
};

// Feature Flags
export const FEATURES = {
  AI_INSIGHTS: true,
  PRICE_PREDICTIONS: true,
  WATCHLIST: true,
  PRICE_ALERTS: true,
  COUPON_TESTING: true,
  MANUFACTURER_DETECTION: true,
  RESALE_INTELLIGENCE: true,
};

// Storage Keys (for LocalStorage)
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'soleintel:preferences',
  WATCHLIST: 'soleintel:watchlist',
  SEARCH_HISTORY: 'soleintel:search-history',
  CACHE: 'soleintel:cache',
  SESSION: 'soleintel:session',
};

// Log Levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Default Log Level
export const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;

// Manufacturer Sources
export const MANUFACTURER_SOURCES = {
  ALIBABA: 'alibaba',
  ALIEXPRESS: 'aliexpress',
  TEMU: 'temu',
  '1688': '1688',
  FACTORY: 'factory',
  UNKNOWN: 'unknown',
} as const;
