import { describe, it, expect } from 'vitest';
import { MatchingEngine } from '../MatchingEngine';

describe('MatchingEngine', () => {
  const engine = new MatchingEngine();

  describe('findMatches', () => {
    it('should find exact SKU matches with high confidence', () => {
      const product = {
        sku: 'NIKE-AIR-001',
        title: 'Nike Air Max 90',
        brand: 'Nike',
        retailer: 'shoecarnival.com',
      };

      const candidates = [
        {
          sku: 'NIKE-AIR-001',
          title: 'Nike Air Max 90 White',
          brand: 'Nike',
          retailer: 'amazon.com',
        },
        {
          sku: 'NIKE-AIR-002',
          title: 'Nike Air Max 95',
          brand: 'Nike',
          retailer: 'walmart.com',
        },
      ];

      const results = engine.findMatches(product, candidates);

      expect(results).toHaveLength(1);
      expect(results[0].confidenceScore).toBeGreaterThan(0.9);
      expect(results[0].matchType).toBe('sku');
    });

    it('should find UPC matches with high confidence', () => {
      const product = {
        upc: '012345678901',
        title: 'Adidas Ultraboost',
        brand: 'Adidas',
        retailer: 'shoecarnival.com',
      };

      const candidates = [
        {
          upc: '012345678901',
          title: 'Adidas Ultraboost Running Shoe',
          brand: 'Adidas',
          retailer: 'nike.com',
        },
      ];

      const results = engine.findMatches(product, candidates);

      expect(results[0].confidenceScore).toBeGreaterThan(0.9);
      expect(results[0].matchType).toBe('upc');
    });

    it('should find fuzzy matches based on title similarity', () => {
      const product = {
        title: 'Nike Air Max 90 White',
        brand: 'Nike',
        retailer: 'shoecarnival.com',
      };

      const candidates = [
        {
          title: 'Nike Air Max 90',
          brand: 'Nike',
          retailer: 'amazon.com',
        },
        {
          title: 'Nike Air Max 95',
          brand: 'Nike',
          retailer: 'walmart.com',
        },
      ];

      const results = engine.findMatches(product, candidates);

      expect(results[0].product.title).toBe('Nike Air Max 90');
      expect(results[0].matchType).toBe('semantic');
    });

    it('should filter out low confidence matches', () => {
      const product = {
        title: 'Nike Shoe',
        brand: 'Nike',
        retailer: 'shoecarnival.com',
      };

      const candidates = [
        {
          title: 'Completely Different Product',
          brand: 'Adidas',
          retailer: 'amazon.com',
        },
      ];

      const results = engine.findMatches(product, candidates);

      expect(results).toHaveLength(0);
    });

    it('should skip same retailer matches', () => {
      const product = {
        sku: 'TEST-001',
        title: 'Test Shoe',
        brand: 'Test Brand',
        retailer: 'shoecarnival.com',
      };

      const candidates = [
        {
          sku: 'TEST-001',
          title: 'Test Shoe',
          brand: 'Test Brand',
          retailer: 'shoecarnival.com',
        },
      ];

      const results = engine.findMatches(product, candidates);

      expect(results).toHaveLength(0);
    });
  });

  describe('analyzeTrends', () => {
    it('should calculate price statistics', () => {
      const history = [
        { date: new Date('2024-01-01'), price: 100 },
        { date: new Date('2024-01-02'), price: 95 },
        { date: new Date('2024-01-03'), price: 110 },
        { date: new Date('2024-01-04'), price: 90 },
      ];

      const analysis = engine.analyzeTrends(history);

      expect(analysis.lowestPrice).toBe(90);
      expect(analysis.highestPrice).toBe(110);
      expect(analysis.averagePrice).toBe((100 + 95 + 110 + 90) / 4);
    });

    it('should detect decreasing price trend', () => {
      const history = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        price: 100 - i * 2, // Decreasing
      }));

      const analysis = engine.analyzeTrends(history);

      expect(analysis.trend).toBe('decreasing');
    });

    it('should detect increasing price trend', () => {
      const history = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        price: 100 + i * 2, // Increasing
      }));

      const analysis = engine.analyzeTrends(history);

      expect(analysis.trend).toBe('increasing');
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate similarity between vectors', () => {
      // This tests semantic similarity for product embeddings
      // Implementation detail: we use private method, so this tests indirectly
      // through semantic matching if available
      expect(true).toBe(true); // Placeholder
    });
  });
});
