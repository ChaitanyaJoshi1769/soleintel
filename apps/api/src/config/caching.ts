/**
 * Caching Layer
 * In-memory caching with TTL support for frequently accessed data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timer | null = null;

  constructor() {
    // Start cleanup process every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache with TTL
   */
  set<T>(key: string, data: T, ttlMinutes: number = 15): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let deleted = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      console.log(`[Cache] Cleaned up ${deleted} expired entries`);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      memory: Math.round((JSON.stringify([...this.cache]).length / 1024) * 100) / 100, // KB
    };
  }

  /**
   * Destroy cache manager
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Cache key constants
export const CACHE_KEYS = {
  // Leaderboards (1 hour cache)
  LEADERBOARD_WEEKLY: 'leaderboard:weekly',
  LEADERBOARD_MONTHLY: 'leaderboard:monthly',
  LEADERBOARD_ALLTIME: 'leaderboard:alltime',
  LEADERBOARD_CATEGORY: (categoryId: string) => `leaderboard:category:${categoryId}`,

  // Community deals (15 min cache)
  COMMUNITY_DEALS_TRENDING: 'community:deals:trending',
  COMMUNITY_DEALS_RECENT: 'community:deals:recent',
  COMMUNITY_DEAL_DETAIL: (dealId: string) => `community:deal:${dealId}`,

  // Achievements (30 min cache)
  ACHIEVEMENTS_LEADERBOARD: 'achievements:leaderboard',

  // Categories (1 hour cache)
  CATEGORIES_LIST: 'categories:list',
  CATEGORY_TRENDING: (categoryId: string) => `category:${categoryId}:trending`,

  // Products (30 min cache)
  PRODUCT_TRENDING: 'products:trending',

  // Predictions (6 hour cache - stable model predictions)
  PREDICTIONS_DASHBOARD: (userId: string) => `predictions:dashboard:${userId}`,
  MODEL_METRICS: 'ml:model:metrics',
};

// Cache TTL constants
export const CACHE_TTL = {
  SHORT: 5, // 5 minutes
  MEDIUM: 15, // 15 minutes
  LONG: 60, // 1 hour
  VERY_LONG: 360, // 6 hours
};
