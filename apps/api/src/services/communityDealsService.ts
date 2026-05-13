/**
 * Community Deals Service
 * Handles creation, voting, and discovery of community-posted deals
 */

import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class CommunityDealsService {
  /**
   * Post a new community deal
   */
  async postDeal(
    userId: string,
    productId: string,
    dealPrice: number,
    originalPrice: number,
    retailerId?: string,
    description?: string
  ) {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Validate deal (deal price should be less than original)
    if (dealPrice >= originalPrice) {
      throw new AppError('Deal price must be less than original price', 400);
    }

    const savingsPercentage = ((originalPrice - dealPrice) / originalPrice) * 100;

    const deal = await prisma.communityDeal.create({
      data: {
        authorId: userId,
        productId,
        dealPrice,
        originalPrice,
        retailerId,
        description,
        savingsPercentage,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            brand: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      id: deal.id,
      author: deal.author,
      product: deal.product,
      dealPrice: deal.dealPrice,
      originalPrice: deal.originalPrice,
      savingsPercentage: deal.savingsPercentage.toFixed(1),
      description: deal.description,
      upvotes: deal.upvotes,
      downvotes: deal.downvotes,
      createdAt: deal.createdAt,
    };
  }

  /**
   * Get trending community deals
   */
  async getTrendingDeals(limit: number = 20, offset: number = 0) {
    const deals = await prisma.communityDeal.findMany({
      take: limit,
      skip: offset,
      orderBy: [
        { featured: 'desc' },
        { upvotes: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            brand: true,
            imageUrl: true,
          },
        },
      },
    });

    return deals.map((deal) => this._formatDeal(deal));
  }

  /**
   * Get recent deals
   */
  async getRecentDeals(limit: number = 20, offset: number = 0) {
    const deals = await prisma.communityDeal.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            brand: true,
            imageUrl: true,
          },
        },
      },
    });

    return deals.map((deal) => this._formatDeal(deal));
  }

  /**
   * Get deals by category
   */
  async getDealsByCategory(categoryId: string, limit: number = 20, offset: number = 0) {
    const deals = await prisma.communityDeal.findMany({
      take: limit,
      skip: offset,
      where: {
        product: {
          categoryId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            brand: true,
            imageUrl: true,
            categoryId: true,
          },
        },
      },
    });

    return deals.map((deal) => this._formatDeal(deal));
  }

  /**
   * Upvote a deal
   */
  async upvoteDeal(dealId: string, userId: string) {
    const deal = await prisma.communityDeal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      throw new AppError('Deal not found', 404);
    }

    // In production, we would track votes per user to prevent double voting
    // For now, just increment upvotes
    const updated = await prisma.communityDeal.update({
      where: { id: dealId },
      data: {
        upvotes: { increment: 1 },
      },
    });

    return {
      dealId: updated.id,
      upvotes: updated.upvotes,
      downvotes: updated.downvotes,
    };
  }

  /**
   * Downvote a deal
   */
  async downvoteDeal(dealId: string, userId: string) {
    const deal = await prisma.communityDeal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      throw new AppError('Deal not found', 404);
    }

    const updated = await prisma.communityDeal.update({
      where: { id: dealId },
      data: {
        downvotes: { increment: 1 },
      },
    });

    return {
      dealId: updated.id,
      upvotes: updated.upvotes,
      downvotes: updated.downvotes,
    };
  }

  /**
   * Get deal details
   */
  async getDealDetails(dealId: string) {
    const deal = await prisma.communityDeal.findUnique({
      where: { id: dealId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            brand: true,
            description: true,
            imageUrl: true,
            categoryId: true,
          },
        },
      },
    });

    if (!deal) {
      throw new AppError('Deal not found', 404);
    }

    return this._formatDeal(deal);
  }

  /**
   * Get deals posted by a user
   */
  async getUserDeals(userId: string, limit: number = 20) {
    const deals = await prisma.communityDeal.findMany({
      where: { authorId: userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            brand: true,
            imageUrl: true,
          },
        },
      },
    });

    return deals.map((deal) => this._formatDeal(deal));
  }

  /**
   * Delete a deal (only by author or admin)
   */
  async deleteDeal(dealId: string, userId: string, isAdmin: boolean = false) {
    const deal = await prisma.communityDeal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      throw new AppError('Deal not found', 404);
    }

    if (deal.authorId !== userId && !isAdmin) {
      throw new AppError('Unauthorized: You can only delete your own deals', 403);
    }

    await prisma.communityDeal.delete({
      where: { id: dealId },
    });

    return { success: true, message: 'Deal deleted' };
  }

  /**
   * Calculate deal score for ranking
   * Score = (upvotes * 2) - downvotes + (hoursOld * -0.5)
   */
  private calculateDealScore(deal: any): number {
    const upvoteScore = deal.upvotes * 2;
    const downvoteScore = deal.downvotes;
    const now = new Date();
    const hoursOld = (now.getTime() - deal.createdAt.getTime()) / (1000 * 60 * 60);
    const ageScore = hoursOld * -0.5;

    return upvoteScore - downvoteScore + ageScore;
  }

  /**
   * Format deal for response
   */
  private _formatDeal(deal: any) {
    return {
      id: deal.id,
      author: deal.author,
      product: deal.product,
      dealPrice: deal.dealPrice,
      originalPrice: deal.originalPrice,
      savingsAmount: (deal.originalPrice - deal.dealPrice).toFixed(2),
      savingsPercentage: deal.savingsPercentage.toFixed(1),
      description: deal.description,
      upvotes: deal.upvotes,
      downvotes: deal.downvotes,
      commentCount: deal.commentCount,
      featured: deal.featured,
      score: this.calculateDealScore(deal),
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
    };
  }
}

export const communityDealsService = new CommunityDealsService();
