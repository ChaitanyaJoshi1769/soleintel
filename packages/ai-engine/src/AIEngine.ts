import { z } from 'zod';
import OpenAI from 'openai';

export interface ProductContext {
  title: string;
  brand: string;
  msrp?: number;
  currentPrice: number;
  avgMarketPrice: number;
  estWholesaleCost?: number;
  priceHistory?: Array<{ date: Date; price: number }>;
  competitors?: Array<{ retailer: string; price: number }>;
  reviewScore?: number;
  monthsSinceRelease?: number;
}

export interface AIInsight {
  type: 'pricing' | 'value' | 'timing' | 'trust' | 'alternative';
  confidence: number;
  message: string;
  recommendation: string;
  reasoning: string;
}

const InsightSchema = z.object({
  type: z.enum(['pricing', 'value', 'timing', 'trust', 'alternative']),
  confidence: z.number().min(0).max(1),
  message: z.string(),
  recommendation: z.string(),
  reasoning: z.string(),
});

export class AIEngine {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async generateInsights(context: ProductContext): Promise<AIInsight[]> {
    const prompt = this.buildPrompt(context);
    const insightCount = 3;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a footwear pricing expert that provides concise, actionable shopping insights.
Return exactly ${insightCount} JSON objects, one per line, following this schema:
{
  "type": "pricing" | "value" | "timing" | "trust" | "alternative",
  "confidence": 0.0-1.0,
  "message": "Short insight message",
  "recommendation": "Specific action to take",
  "reasoning": "Brief explanation"
}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '';
      const insights = this.parseInsights(content);

      return insights.slice(0, insightCount);
    } catch (err) {
      console.error('AI insight generation failed:', err);
      return this.generateFallbackInsights(context);
    }
  }

  async generateProductEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (err) {
      console.error('Embedding generation failed:', err);
      throw err;
    }
  }

  private buildPrompt(context: ProductContext): string {
    const markup = context.estWholesaleCost
      ? ((context.currentPrice - context.estWholesaleCost) / context.estWholesaleCost) * 100
      : null;

    const priceChangePercent = context.priceHistory
      ? ((context.currentPrice - context.priceHistory[0].price) / context.priceHistory[0].price) *
        100
      : null;

    return `
Product: ${context.brand} ${context.title}
Current Price: $${context.currentPrice}
Average Market Price: $${context.avgMarketPrice}
${context.msrp ? `MSRP: $${context.msrp}` : ''}
${context.estWholesaleCost ? `Est. Wholesale Cost: $${context.estWholesaleCost}` : ''}
${markup ? `Est. Markup: ${markup.toFixed(0)}%` : ''}
${context.reviewScore ? `Review Score: ${context.reviewScore}/5` : ''}
${context.monthsSinceRelease ? `Months Since Release: ${context.monthsSinceRelease}` : ''}
${context.competitors ? `Competitors: ${context.competitors.map((c) => `${c.retailer} $${c.price}`).join(', ')}` : ''}
${priceChangePercent ? `Price Change (30d): ${priceChangePercent.toFixed(1)}%` : ''}

Generate 3 insights about whether this is a good buy, what to watch for, and when/where to buy.
`;
  }

  private parseInsights(content: string): AIInsight[] {
    const insights: AIInsight[] = [];
    const lines = content.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        const validated = InsightSchema.parse(json);
        insights.push(validated);
      } catch (err) {
        // Skip malformed lines
        continue;
      }
    }

    return insights;
  }

  private generateFallbackInsights(context: ProductContext): AIInsight[] {
    const insights: AIInsight[] = [];

    // Pricing insight
    const priceDiff = context.currentPrice - context.avgMarketPrice;
    if (priceDiff > context.avgMarketPrice * 0.15) {
      insights.push({
        type: 'pricing',
        confidence: 0.8,
        message: `This price is ${((priceDiff / context.avgMarketPrice) * 100).toFixed(0)}% higher than market average`,
        recommendation: 'Check competitors for better prices',
        reasoning: 'Current retailer has premium pricing',
      });
    } else {
      insights.push({
        type: 'pricing',
        confidence: 0.8,
        message: 'This is competitively priced',
        recommendation: 'Safe to purchase',
        reasoning: 'Price aligns with market',
      });
    }

    // Value insight
    if (context.estWholesaleCost) {
      const markup = ((context.currentPrice - context.estWholesaleCost) / context.estWholesaleCost) *
        100;
      insights.push({
        type: 'value',
        confidence: 0.6,
        message: `Estimated markup is ${markup.toFixed(0)}%`,
        recommendation: markup > 250 ? 'Consider waiting for sale' : 'Fair retail markup',
        reasoning: 'Based on estimated wholesale cost',
      });
    }

    // Timing insight
    if (context.monthsSinceRelease && context.monthsSinceRelease < 2) {
      insights.push({
        type: 'timing',
        confidence: 0.7,
        message: 'New release - price likely to drop',
        recommendation: 'Wait for discount in 2-3 months',
        reasoning: 'Historical pattern for new footwear releases',
      });
    }

    return insights;
  }
}
