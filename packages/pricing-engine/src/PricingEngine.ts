export interface PricingData {
  retailer: string;
  price: number;
  salePrice?: number;
  shipping?: number;
  tax?: number;
  lastUpdated: Date;
}

export interface PriceAnalysis {
  lowestPrice: number;
  lowestRetailer: string;
  averagePrice: number;
  highestPrice: number;
  discount?: number;
  estimatedMarkup: number;
  recommendation: 'buy' | 'wait' | 'overpriced';
  savingsOpportunity: number;
}

export interface HistoricalTrend {
  date: Date;
  price: number;
  retailer?: string;
}

export interface SeasonalPattern {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  averageDiscount: number;
  likelihood: number; // 0-1
}

export class PricingEngine {
  analyzeRetailers(prices: PricingData[]): PriceAnalysis {
    if (prices.length === 0) {
      throw new Error('No pricing data available');
    }

    // Calculate totals (price + shipping + tax)
    const totals = prices.map((p) => ({
      retailer: p.retailer,
      salePrice: p.salePrice || p.price,
      totalPrice: this.calculateTotal(p),
    }));

    // Sort by total price
    totals.sort((a, b) => a.totalPrice - b.totalPrice);

    const lowestTotal = totals[0];
    const highestTotal = totals[totals.length - 1];
    const avgTotal = totals.reduce((sum, t) => sum + t.totalPrice, 0) / totals.length;

    // Calculate metrics
    const maxSavings = highestTotal.totalPrice - lowestTotal.totalPrice;
    const avgDiscount = this.calculateAverageDiscount(prices);
    const markup = this.estimateMarkup(lowestTotal.salePrice, avgTotal);

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      lowestTotal.salePrice,
      avgTotal,
      avgDiscount,
      markup,
    );

    return {
      lowestPrice: lowestTotal.salePrice,
      lowestRetailer: lowestTotal.retailer,
      averagePrice: avgTotal,
      highestPrice: highestTotal.totalPrice,
      discount: avgDiscount,
      estimatedMarkup: markup,
      recommendation,
      savingsOpportunity: maxSavings,
    };
  }

  analyzeTrends(history: HistoricalTrend[]): {
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    volatility: number;
  } {
    if (history.length === 0) {
      throw new Error('No historical data available');
    }

    const prices = history.map((h) => h.price);
    const sorted = [...prices].sort((a, b) => a - b);

    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Calculate trend (simple: compare first 3 to last 3)
    const first3 = prices.slice(0, Math.min(3, prices.length));
    const last3 = prices.slice(Math.max(0, prices.length - 3));
    const firstAvg = first3.reduce((a, b) => a + b, 0) / first3.length;
    const lastAvg = last3.reduce((a, b) => a + b, 0) / last3.length;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    const trendThreshold = average * 0.05; // 5% change

    if (lastAvg < firstAvg - trendThreshold) {
      trend = 'decreasing';
    } else if (lastAvg > firstAvg + trendThreshold) {
      trend = 'increasing';
    }

    // Calculate volatility (coefficient of variation)
    const meanPrice = average;
    const variance =
      prices.reduce((sum, p) => sum + Math.pow(p - meanPrice, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    const volatility = stdDev / meanPrice; // 0-1 scale

    return {
      lowestPrice: lowest,
      highestPrice: highest,
      averagePrice: average,
      trend,
      volatility: Math.min(volatility, 1),
    };
  }

  predictBestTimeToBuy(history: HistoricalTrend[]): {
    bestMonth: number;
    expectedDiscount: number;
    daysUntilSale: number;
  } {
    const trends = this.analyzeHistoricalPatterns(history);

    // Find month with lowest average price
    const bestMonth = Object.entries(trends).reduce((best, [month, data]) =>
      data.avgPrice < trends[Object.keys(trends)[best]].avgPrice ? parseInt(month) : best,
    );

    const currentMonth = new Date().getMonth();
    const daysUntilSale = this.daysUntilMonth(bestMonth, currentMonth);

    const currentAvg = this.getMonthAveragePrice(history, currentMonth);
    const bestAvg = trends[bestMonth].avgPrice;
    const expectedDiscount = ((currentAvg - bestAvg) / currentAvg) * 100;

    return {
      bestMonth,
      expectedDiscount: Math.max(0, expectedDiscount),
      daysUntilSale,
    };
  }

  private calculateTotal(pricing: PricingData): number {
    const basePrice = pricing.salePrice || pricing.price;
    const shipping = pricing.shipping || 0;
    const tax = pricing.tax || 0;
    return basePrice + shipping + tax;
  }

  private calculateAverageDiscount(prices: PricingData[]): number {
    const discounts = prices
      .filter((p) => p.salePrice && p.salePrice < p.price)
      .map((p) => ((p.price - p.salePrice!) / p.price) * 100);

    if (discounts.length === 0) return 0;
    return discounts.reduce((a, b) => a + b, 0) / discounts.length;
  }

  private estimateMarkup(retailPrice: number, wholesalePrice: number): number {
    if (wholesalePrice <= 0) return 0;
    return ((retailPrice - wholesalePrice) / wholesalePrice) * 100;
  }

  private generateRecommendation(
    lowestPrice: number,
    avgPrice: number,
    discount: number,
    markup: number,
  ): 'buy' | 'wait' | 'overpriced' {
    // If price is significantly below average, buy
    if (lowestPrice < avgPrice * 0.85) {
      return 'buy';
    }

    // If good discount expected soon, wait
    if (discount > 20 && markup > 100) {
      return 'wait';
    }

    // If markup is reasonable and discount available, buy
    if (markup < 150 && discount > 10) {
      return 'buy';
    }

    // If markup is excessive, it's overpriced
    if (markup > 300) {
      return 'overpriced';
    }

    // Default: wait for better price
    return 'wait';
  }

  private analyzeHistoricalPatterns(
    history: HistoricalTrend[],
  ): Record<number, { avgPrice: number; count: number }> {
    const patterns: Record<number, { prices: number[]; count: number }> = {};

    for (let i = 0; i < 12; i++) {
      patterns[i] = { prices: [], count: 0 };
    }

    for (const entry of history) {
      const month = entry.date.getMonth();
      patterns[month].prices.push(entry.price);
      patterns[month].count++;
    }

    // Convert to averages
    const result: Record<number, { avgPrice: number; count: number }> = {};
    for (const [month, data] of Object.entries(patterns)) {
      const monthNum = parseInt(month);
      const avgPrice = data.prices.length > 0 ? data.prices.reduce((a, b) => a + b) / data.prices.length : 0;
      result[monthNum] = { avgPrice, count: data.count };
    }

    return result;
  }

  private getMonthAveragePrice(history: HistoricalTrend[], month: number): number {
    const monthEntries = history.filter((h) => h.date.getMonth() === month);
    if (monthEntries.length === 0) return 0;
    return monthEntries.reduce((sum, h) => sum + h.price, 0) / monthEntries.length;
  }

  private daysUntilMonth(targetMonth: number, currentMonth: number): number {
    let daysUntil = 0;

    for (let i = currentMonth; i !== targetMonth; i = (i + 1) % 12) {
      const daysInMonth = new Date(new Date().getFullYear(), i + 1, 0).getDate();
      const currentDate = new Date().getDate();
      if (i === currentMonth) {
        daysUntil += daysInMonth - currentDate;
      } else {
        daysUntil += daysInMonth;
      }
    }

    return Math.max(daysUntil, 0);
  }
}
