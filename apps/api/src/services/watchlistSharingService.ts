/**
 * Watchlist Sharing Service
 * Handles sharing watchlists with other users and public access
 */

import prisma from '../config/database';
import { generateSecureToken } from '../utils/security';
import { AppError } from '../middleware/errorHandler';

export class WatchlistSharingService {
  /**
   * Create a shareable link for a watchlist
   */
  async shareWatchlist(
    watchlistId: string,
    ownerUserId: string,
    permissions: string[] = ['view'],
    expiresInDays?: number
  ) {
    // Verify watchlist ownership
    const watchlist = await prisma.watchlist.findUnique({
      where: { id: watchlistId },
      include: { user: true }
    });

    if (!watchlist) {
      throw new AppError('Watchlist not found', 404);
    }

    if (watchlist.userId !== ownerUserId) {
      throw new AppError('Unauthorized: You cannot share this watchlist', 403);
    }

    // Generate unique share token
    const shareToken = await generateSecureToken();

    // Calculate expiration date
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create shared watchlist record
    const sharedWatchlist = await prisma.sharedWatchlist.create({
      data: {
        originalWatchlistId: watchlistId,
        ownerUserId,
        shareToken,
        permissions: JSON.stringify(permissions),
        expiresAt,
      },
    });

    return {
      shareToken: sharedWatchlist.shareToken,
      publicUrl: `${process.env.FRONTEND_URL}/watchlists/share/${sharedWatchlist.shareToken}`,
      expiresAt: sharedWatchlist.expiresAt,
      permissions,
    };
  }

  /**
   * Access a shared watchlist by token
   */
  async accessSharedWatchlist(shareToken: string) {
    const sharedWatchlist = await prisma.sharedWatchlist.findUnique({
      where: { shareToken },
      include: {
        watchlist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!sharedWatchlist) {
      throw new AppError('Shared watchlist not found', 404);
    }

    // Check if expired
    if (sharedWatchlist.expiresAt && sharedWatchlist.expiresAt < new Date()) {
      throw new AppError('This shared watchlist has expired', 410);
    }

    // Check permissions
    const permissions = JSON.parse(sharedWatchlist.permissions);

    if (!permissions.includes('view')) {
      throw new AppError('You do not have permission to view this watchlist', 403);
    }

    // Increment view count
    await prisma.sharedWatchlist.update({
      where: { id: sharedWatchlist.id },
      data: {
        viewCount: { increment: 1 },
        lastAccessedAt: new Date(),
      },
    });

    return {
      watchlist: sharedWatchlist.watchlist,
      owner: sharedWatchlist.watchlist.user,
      permissions,
      viewCount: sharedWatchlist.viewCount + 1,
    };
  }

  /**
   * Get list of watchlists shared by a user
   */
  async getUserSharedWatchlists(userId: string) {
    const sharedWatchlists = await prisma.sharedWatchlist.findMany({
      where: { ownerUserId: userId },
      include: {
        watchlist: {
          select: {
            id: true,
            userId: true,
            productId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sharedWatchlists.map((sw) => ({
      id: sw.id,
      watchlistId: sw.originalWatchlistId,
      shareToken: sw.shareToken,
      publicUrl: `${process.env.FRONTEND_URL}/watchlists/share/${sw.shareToken}`,
      permissions: JSON.parse(sw.permissions),
      expiresAt: sw.expiresAt,
      viewCount: sw.viewCount,
      createdAt: sw.createdAt,
    }));
  }

  /**
   * Revoke a share link
   */
  async revokeShareLink(shareToken: string, ownerUserId: string) {
    const sharedWatchlist = await prisma.sharedWatchlist.findUnique({
      where: { shareToken },
    });

    if (!sharedWatchlist) {
      throw new AppError('Share link not found', 404);
    }

    if (sharedWatchlist.ownerUserId !== ownerUserId) {
      throw new AppError('Unauthorized: You cannot revoke this share link', 403);
    }

    await prisma.sharedWatchlist.delete({
      where: { id: sharedWatchlist.id },
    });

    return { success: true, message: 'Share link revoked' };
  }

  /**
   * Update share permissions
   */
  async updateSharePermissions(
    shareToken: string,
    ownerUserId: string,
    newPermissions: string[]
  ) {
    const sharedWatchlist = await prisma.sharedWatchlist.findUnique({
      where: { shareToken },
    });

    if (!sharedWatchlist) {
      throw new AppError('Share link not found', 404);
    }

    if (sharedWatchlist.ownerUserId !== ownerUserId) {
      throw new AppError('Unauthorized: You cannot modify this share link', 403);
    }

    const updated = await prisma.sharedWatchlist.update({
      where: { id: sharedWatchlist.id },
      data: {
        permissions: JSON.stringify(newPermissions),
      },
    });

    return {
      shareToken: updated.shareToken,
      permissions: newPermissions,
    };
  }

  /**
   * Get share statistics for a watchlist
   */
  async getShareStats(watchlistId: string, ownerUserId: string) {
    const watchlist = await prisma.watchlist.findUnique({
      where: { id: watchlistId },
    });

    if (!watchlist) {
      throw new AppError('Watchlist not found', 404);
    }

    if (watchlist.userId !== ownerUserId) {
      throw new AppError('Unauthorized', 403);
    }

    const shares = await prisma.sharedWatchlist.findMany({
      where: { originalWatchlistId: watchlistId },
    });

    const totalViews = shares.reduce((sum, s) => sum + s.viewCount, 0);
    const activeShares = shares.filter(
      (s) => !s.expiresAt || s.expiresAt > new Date()
    ).length;

    return {
      totalShares: shares.length,
      activeShares,
      totalViews,
      shares: shares.map((s) => ({
        id: s.id,
        shareToken: s.shareToken,
        viewCount: s.viewCount,
        lastAccessedAt: s.lastAccessedAt,
        expiresAt: s.expiresAt,
        createdAt: s.createdAt,
      })),
    };
  }
}

export const watchlistSharingService = new WatchlistSharingService();
