import { levenshteinDistance, normalizeString } from './utils';

export interface Product {
  id?: string;
  sku?: string;
  upc?: string;
  mpn?: string;
  title: string;
  brand?: string;
  color?: string;
  size?: string;
  retailer: string;
  price?: number;
}

export interface MatchResult {
  product: Product;
  confidenceScore: number; // 0-1
  matchType: 'exact' | 'sku' | 'upc' | 'semantic' | 'fuzzy';
  details: {
    skuMatch?: boolean;
    upcMatch?: boolean;
    titleSimilarity?: number;
    brandMatch?: boolean;
    colorMatch?: boolean;
  };
}

export class MatchingEngine {
  private embeddings: Map<string, number[]> = new Map();

  async findMatches(product: Product, candidates: Product[]): Promise<MatchResult[]> {
    const results: MatchResult[] = [];

    for (const candidate of candidates) {
      if (candidate.retailer === product.retailer) {
        continue; // Skip same retailer
      }

      const result = this.scoreMatch(product, candidate);
      if (result.confidenceScore > 0.6) {
        results.push(result);
      }
    }

    return results.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  private scoreMatch(product: Product, candidate: Product): MatchResult {
    let score = 0;
    const details: MatchResult['details'] = {};

    // Exact SKU match (highest confidence)
    if (product.sku && candidate.sku && product.sku === candidate.sku) {
      score += 0.95;
      details.skuMatch = true;
    }

    // UPC match
    if (product.upc && candidate.upc && product.upc === candidate.upc) {
      score += 0.95;
      details.upcMatch = true;
    }

    // Title similarity (normalized)
    const titleSim = this.compareTitles(product.title, candidate.title);
    score += titleSim * 0.4;
    details.titleSimilarity = titleSim;

    // Brand match
    if (product.brand && candidate.brand && product.brand.toLowerCase() === candidate.brand.toLowerCase()) {
      score += 0.15;
      details.brandMatch = true;
    }

    // Color match (if specified)
    if (product.color && candidate.color && product.color.toLowerCase() === candidate.color.toLowerCase()) {
      score += 0.1;
      details.colorMatch = true;
    }

    const matchType = this.determineMatchType(details);

    return {
      product: candidate,
      confidenceScore: Math.min(score, 1),
      matchType,
      details,
    };
  }

  private compareTitles(title1: string, title2: string): number {
    const normalized1 = normalizeString(title1);
    const normalized2 = normalizeString(title2);

    // Exact match after normalization
    if (normalized1 === normalized2) {
      return 1;
    }

    // Substring match (one title contains the other's key parts)
    const parts1 = normalized1.split(' ');
    const parts2 = normalized2.split(' ');

    const commonParts = parts1.filter((part) => parts2.includes(part)).length;
    const maxParts = Math.max(parts1.length, parts2.length);

    if (maxParts === 0) return 0;
    const substringScore = commonParts / maxParts;

    // Levenshtein distance for fuzzy matching
    const maxLen = Math.max(normalized1.length, normalized2.length);
    const distance = levenshteinDistance(normalized1, normalized2);
    const fuzzyScore = 1 - distance / maxLen;

    // Weighted average
    return Math.max(substringScore, fuzzyScore);
  }

  private determineMatchType(
    details: MatchResult['details'],
  ): 'exact' | 'sku' | 'upc' | 'semantic' | 'fuzzy' {
    if (details.skuMatch) return 'sku';
    if (details.upcMatch) return 'upc';
    if ((details.titleSimilarity || 0) > 0.9 && details.brandMatch) return 'exact';
    if ((details.titleSimilarity || 0) > 0.75) return 'semantic';
    return 'fuzzy';
  }

  // Vector-based semantic matching (requires embeddings)
  async findSemanticMatches(
    productEmbedding: number[],
    candidates: Array<{ product: Product; embedding: number[] }>,
    threshold: number = 0.7,
  ): Promise<MatchResult[]> {
    const results: MatchResult[] = [];

    for (const { product, embedding } of candidates) {
      const similarity = this.cosineSimilarity(productEmbedding, embedding);

      if (similarity >= threshold) {
        results.push({
          product,
          confidenceScore: similarity,
          matchType: 'semantic',
          details: {
            titleSimilarity: similarity,
          },
        });
      }
    }

    return results.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }

    const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }
}
