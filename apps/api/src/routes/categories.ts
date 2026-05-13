import { FastifyInstance } from 'fastify';
import { getCategoryService } from '../services/categoryService';

const categoryService = getCategoryService();

export async function categoryRoutes(app: FastifyInstance) {
  /**
   * GET /api/categories
   * Get all categories with stats
   */
  app.get('/api/categories', async (request, reply) => {
    try {
      const categories = await categoryService.getAllCategories();
      return { success: true, categories };
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${(error as Error).message}`);
    }
  });

  /**
   * GET /api/categories/:slug
   * Get category by slug with products
   */
  app.get('/api/categories/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    try {
      const category = await categoryService.getCategoryBySlug(slug);

      if (!category) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return { success: true, category };
    } catch (error) {
      throw new Error(`Failed to fetch category: ${(error as Error).message}`);
    }
  });

  /**
   * GET /api/categories/:categoryId/trending
   * Get trending products in category
   */
  app.get('/api/categories/:categoryId/trending', async (request, reply) => {
    const { categoryId } = request.params as { categoryId: string };
    const limit = Math.min(parseInt((request.query as any).limit || '10'), 50);

    try {
      const trending = await categoryService.getTrendingInCategory(categoryId, limit);

      if (trending.length === 0) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return { success: true, trending, count: trending.length };
    } catch (error) {
      throw new Error(`Failed to fetch trending products: ${(error as Error).message}`);
    }
  });

  /**
   * GET /api/categories/trending
   * Get top trending categories
   */
  app.get('/api/categories-trending', async (request, reply) => {
    const limit = Math.min(parseInt((request.query as any).limit || '5'), 10);

    try {
      const trendingCategories = await categoryService.getTrendingCategories(limit);
      return { success: true, trendingCategories };
    } catch (error) {
      throw new Error(`Failed to fetch trending categories: ${(error as Error).message}`);
    }
  });

  /**
   * POST /api/categories/:categoryId/subscribe
   * Subscribe user to category alerts
   */
  app.post<{ Params: { categoryId: string }; Body: { frequency?: string } }>(
    '/api/categories/:categoryId/subscribe',
    async (request, reply) => {
      const { categoryId } = request.params;
      const userId = (request as any).userId;
      const { frequency } = request.body || {};

      if (!userId) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      try {
        await categoryService.subscribeUserToCategory(userId, categoryId, frequency || 'daily');
        return {
          success: true,
          message: `Subscribed to category alerts (${frequency || 'daily'} frequency)`,
        };
      } catch (error) {
        throw new Error(`Failed to subscribe to category: ${(error as Error).message}`);
      }
    }
  );

  /**
   * POST /api/categories/:categoryId/unsubscribe
   * Unsubscribe user from category alerts
   */
  app.post<{ Params: { categoryId: string } }>(
    '/api/categories/:categoryId/unsubscribe',
    async (request, reply) => {
      const { categoryId } = request.params;
      const userId = (request as any).userId;

      if (!userId) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      try {
        await categoryService.unsubscribeFromCategory(userId, categoryId);
        return { success: true, message: 'Unsubscribed from category' };
      } catch (error) {
        throw new Error(`Failed to unsubscribe from category: ${(error as Error).message}`);
      }
    }
  );

  /**
   * GET /api/user/categories
   * Get user's subscribed categories
   */
  app.get('/api/user/categories', async (request, reply) => {
    const userId = (request as any).userId;

    if (!userId) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    try {
      const categories = await categoryService.getUserCategories(userId);
      return { success: true, categories };
    } catch (error) {
      throw new Error(`Failed to fetch user categories: ${(error as Error).message}`);
    }
  });
}
