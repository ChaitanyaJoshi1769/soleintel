import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
  /**
   * Get all root categories with subcategories
   */
  async getAllCategories() {
    return await prisma.productCategory.findMany({
      where: {
        parentCategoryId: null, // Only root categories
      },
      include: {
        subCategories: true,
      },
      orderBy: { productCount: 'desc' },
    });
  }

  /**
   * Get category by slug with trending products
   */
  async getCategoryBySlug(slug: string) {
    const category = await prisma.productCategory.findUnique({
      where: { slug },
      include: {
        subCategories: {
          include: {
            products: {
              take: 10,
              orderBy: { popularityScore: 'desc' },
              include: {
                retailers: { include: { retailer: true } },
              },
            },
          },
        },
        products: {
          take: 20,
          orderBy: { popularityScore: 'desc' },
          include: {
            retailers: { include: { retailer: true } },
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    return {
      ...category,
      stats: {
        productCount: category.productCount,
        activeTrackers: category.activeTrackers,
        avgPriceDrop: category.avgPriceDrop,
      },
    };
  }

  /**
   * Get trending products in a category
   */
  async getTrendingInCategory(categoryId: string, limit: number = 10) {
    const products = await prisma.product.findMany({
      where: { categoryId },
      orderBy: { popularityScore: 'desc' },
      take: limit,
      include: {
        retailers: {
          include: { retailer: true },
          orderBy: { price: 'asc' },
          take: 3, // Top 3 retailers by price
        },
        history: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    return products.map((product) => {
      const lowestRetailer = product.retailers[0];
      const priceHistory = product.history;

      // Calculate trend
      let trend = '→';
      let sentiment = 'fair_price';

      if (priceHistory.length > 1) {
        const oldPrice = priceHistory[priceHistory.length - 1].price;
        const newPrice = priceHistory[0].price;
        const percentChange = ((newPrice - oldPrice) / oldPrice) * 100;

        if (percentChange < -10) {
          trend = '↓ fast falling';
          sentiment = 'hot_deal';
        } else if (percentChange < -3) {
          trend = '↓ falling';
          sentiment = 'good_deal';
        } else if (percentChange > 5) {
          trend = '↑ rising';
          sentiment = 'overpriced';
        }
      }

      return {
        productId: product.id,
        title: product.title,
        brand: product.brand,
        currentPrice: lowestRetailer?.price || 0,
        bestRetailer: lowestRetailer?.retailer.name || 'Unknown',
        trend,
        sentiment,
        watchers: Math.floor(Math.random() * 5000), // Placeholder
        imageUrl: product.imageUrl,
      };
    });
  }

  /**
   * Subscribe user to a category
   */
  async subscribeUserToCategory(userId: string, categoryId: string, alertFrequency = 'daily') {
    return await prisma.userCategoryPreference.upsert({
      where: {
        userId_categoryId: { userId, categoryId },
      },
      update: {
        alertsEnabled: true,
        alertFrequency,
      },
      create: {
        userId,
        categoryId,
        alertsEnabled: true,
        alertFrequency,
      },
    });
  }

  /**
   * Unsubscribe user from a category
   */
  async unsubscribeFromCategory(userId: string, categoryId: string) {
    return await prisma.userCategoryPreference.update({
      where: {
        userId_categoryId: { userId, categoryId },
      },
      data: {
        alertsEnabled: false,
      },
    });
  }

  /**
   * Get user's subscribed categories
   */
  async getUserCategories(userId: string) {
    return await prisma.userCategoryPreference.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  /**
   * Get top trending categories
   */
  async getTrendingCategories(limit: number = 5) {
    return await prisma.productCategory.findMany({
      where: { parentCategoryId: null }, // Root categories only
      orderBy: { activeTrackers: 'desc' },
      take: limit,
      include: {
        products: {
          orderBy: { popularityScore: 'desc' },
          take: 3,
        },
      },
    });
  }

  /**
   * Create a new category
   */
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
  }) {
    return await prisma.productCategory.create({
      data: {
        ...data,
        scrapingRules: {},
        retailerCompatibility: {},
      },
    });
  }

  /**
   * Create a subcategory
   */
  async createSubcategory(
    categoryId: string,
    data: {
      name: string;
      slug: string;
      description?: string;
      icon?: string;
    }
  ) {
    return await prisma.productSubcategory.create({
      data: {
        categoryId,
        ...data,
      },
    });
  }

  /**
   * Update category stats (products, trackers, average price drop)
   */
  async updateCategoryStats(categoryId: string) {
    const [productCount, activeTrackers] = await Promise.all([
      prisma.product.count({ where: { categoryId } }),
      prisma.watchlist.count({
        where: {
          product: { categoryId },
        },
      }),
    ]);

    // Calculate average price drop from price history
    const priceDrops = await prisma.product.findMany({
      where: { categoryId },
      select: {
        id: true,
        retailers: { select: { price: true } },
        history: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    let totalDrop = 0;
    let dropCount = 0;

    for (const product of priceDrops) {
      if (product.history.length > 1) {
        const currentPrice = product.history[0].price;
        const oldPrice = product.history[product.history.length - 1].price;
        const drop = ((oldPrice - currentPrice) / oldPrice) * 100;

        if (drop > 0) {
          totalDrop += drop;
          dropCount++;
        }
      }
    }

    const avgPriceDrop = dropCount > 0 ? totalDrop / dropCount : 0;

    return await prisma.productCategory.update({
      where: { id: categoryId },
      data: {
        productCount,
        activeTrackers,
        avgPriceDrop,
      },
    });
  }

  /**
   * Bulk update product categories based on rules
   */
  async categorizeProducts() {
    // This would be called by a scraper job to assign categories to uncategorized products
    // For now, just return success
    return { success: true, updated: 0 };
  }
}

export function getCategoryService() {
  return new CategoryService();
}
