import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino();
const prisma = new PrismaClient();

export interface InsightData {
  productId: string;
  title: string;
  brand: string;
  prices: Array<{ retailer: string; price: number }>;
  priceHistory: Array<{ date: Date; price: number }>;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

export interface GeneratedInsight {
  type: 'pricing' | 'value' | 'timing' | 'trust' | 'alternative';
  message: string;
  confidence: number;
  recommendation: 'buy' | 'wait' | 'skip';
}

export class AIInsightsService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || null;
  }

  async generateInsights(productId: string): Promise<GeneratedInsight[]> {
    try {
      // Get product and pricing data
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          retailers: {
            include: { retailer: true },
            orderBy: { price: 'asc' },
          },
          priceHistory: {
            orderBy: { date: 'desc' },
            take: 30,
          },
          insights: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!product) {
        logger.warn(`Product ${productId} not found`);
        return [];
      }

      const insightData: InsightData = {
        productId,
        title: product.title,
        brand: product.brand || 'Unknown',
        prices: product.retailers.map((r) => ({
          retailer: (r as any).retailer.name,
          price: r.price,
        })),
        priceHistory: product.priceHistory.map((ph) => ({
          date: ph.date,
          price: ph.price,
        })),
        lowestPrice: Math.min(...product.retailers.map((r) => r.price)),
        highestPrice: Math.max(...product.retailers.map((r) => r.price)),
        averagePrice:
          product.retailers.reduce((sum, r) => sum + r.price, 0) / product.retailers.length,
      };

      // Generate heuristic-based insights (no API call)
      const insights = this.generateHeuristicInsights(insightData);

      // Save insights to database
      for (const insight of insights) {
        await prisma.productInsight.create({
          data: {
            productId,
            type: insight.type,
            message: insight.message,
            confidence: insight.confidence,
          },
        });
      }

      return insights;
    } catch (err) {
      logger.error({ err }, `Failed to generate insights for product ${productId}`);
      return [];
    }
  }

  private generateHeuristicInsights(data: InsightData): GeneratedInsight[] {
    const insights: GeneratedInsight[] = [];

    // Pricing insight
    const pricingInsight = this.analyzePricing(data);
    insights.push(pricingInsight);

    // Value insight
    const valueInsight = this.analyzeValue(data);
    insights.push(valueInsight);

    // Timing insight
    const timingInsight = this.analyzeTiming(data);
    insights.push(timingInsight);

    // Trust insight
    const trustInsight = this.analyzeTrust(data);
    insights.push(trustInsight);

    return insights;
  }

  private analyzePricing(data: InsightData): GeneratedInsight {
    const priceRange = data.highestPrice - data.lowestPrice;
    const priceVariation = (priceRange / data.averagePrice) * 100;

    if (priceVariation > 30) {
      return {
        type: 'pricing',
        message: `Significant price variation detected (${priceVariation.toFixed(1)}%). Lowest price: $${data.lowestPrice.toFixed(2)} at ${data.prices[0].retailer}`,
        confidence: 0.95,
        recommendation: 'buy',
      };
    }

    return {
      type: 'pricing',
      message: `Prices are relatively consistent across retailers. Current range: $${data.lowestPrice.toFixed(2)} - $${data.highestPrice.toFixed(2)}`,
      confidence: 0.85,
      recommendation: 'buy',
    };
  }

  private analyzeValue(data: InsightData): GeneratedInsight {
    const priceToValueRatio = data.averagePrice / (data.prices.length || 1);

    // Simple heuristic: if product is available from multiple retailers at competitive prices
    if (data.prices.length >= 5 && priceToValueRatio < 100) {
      return {
        type: 'value',
        message: `Good value: Available from ${data.prices.length} retailers at competitive prices. Average: $${data.averagePrice.toFixed(2)}`,
        confidence: 0.88,
        recommendation: 'buy',
      };
    } else if (data.prices.length < 3) {
      return {
        type: 'value',
        message: 'Limited availability: Only ${data.prices.length} retailer(s) selling this product',
        confidence: 0.75,
        recommendation: 'wait',
      };
    }

    return {
      type: 'value',
      message: `Average price: $${data.averagePrice.toFixed(2)}. Good selection from ${data.prices.length} retailers`,
      confidence: 0.82,
      recommendation: 'buy',
    };
  }

  private analyzeTiming(data: InsightData): GeneratedInsight {
    // Analyze price trends
    if (data.priceHistory.length < 2) {
      return {
        type: 'timing',
        message: 'Insufficient price history to determine trends',
        confidence: 0.5,
        recommendation: 'wait',
      };
    }

    const recentPrices = data.priceHistory.slice(0, 7);
    const olderPrices = data.priceHistory.slice(7, 14);

    if (recentPrices.length > 0 && olderPrices.length > 0) {
      const recentAvg = recentPrices.reduce((sum, p) => sum + p.price, 0) / recentPrices.length;
      const olderAvg = olderPrices.reduce((sum, p) => sum + p.price, 0) / olderPrices.length;

      if (recentAvg < olderAvg * 0.95) {
        const dropPercent = ((olderAvg - recentAvg) / olderAvg) * 100;
        return {
          type: 'timing',
          message: `Price is trending downward (${dropPercent.toFixed(1)}% decrease). Good time to buy`,
          confidence: 0.85,
          recommendation: 'buy',
        };
      } else if (recentAvg > olderAvg * 1.05) {
        const increasePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
        return {
          type: 'timing',
          message: `Price is trending upward (${increasePercent.toFixed(1)}% increase). Consider waiting`,
          confidence: 0.80,
          recommendation: 'wait',
        };
      }
    }

    return {
      type: 'timing',
      message: 'Price stable. No strong upward or downward trend detected',
      confidence: 0.75,
      recommendation: 'buy',
    };
  }

  private analyzeTrust(data: InsightData): GeneratedInsight {
    // Analyze seller diversity and price competitiveness
    const majorRetailers = ['Amazon', 'Walmart', 'Nike', 'Adidas'];
    const sellersMajor = data.prices.filter((p) => majorRetailers.includes(p.retailer)).length;

    if (sellersMajor >= 3) {
      return {
        type: 'trust',
        message: `Available from ${sellersMajor} major retailers. High confidence in authenticity`,
        confidence: 0.95,
        recommendation: 'buy',
      };
    } else if (sellersMajor >= 1) {
      return {
        type: 'trust',
        message: `Sold by major retailer(${sellersMajor === 1 ? '' : 's'}). Trustworthy source(s) available`,
        confidence: 0.88,
        recommendation: 'buy',
      };
    }

    return {
      type: 'trust',
      message: 'Available from specialty/smaller retailers. Verify seller reputation',
      confidence: 0.70,
      recommendation: 'wait',
    };
  }
}

// Singleton instance
let insightsService: AIInsightsService | null = null;

export function getAIInsightsService(apiKey?: string): AIInsightsService {
  if (!insightsService) {
    insightsService = new AIInsightsService(apiKey);
  }
  return insightsService;
}
