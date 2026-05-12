import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AmazonScraper } from '../scrapers/AmazonScraper';
import { WalmartScraper } from '../scrapers/WalmartScraper';
import { NikeScraper } from '../scrapers/NikeScraper';
import { AdidasScraper } from '../scrapers/AdidasScraper';
import { ZapposScraper } from '../scrapers/ZapposScraper';
import { DSWScraper } from '../scrapers/DSWScraper';
import { FootLockerScraper } from '../scrapers/FootLockerScraper';
import { TargetScraper } from '../scrapers/TargetScraper';
import { ShoeCarnivalScraper } from '../scrapers/ShoeCarnivalScraper';

describe('Retailer Scrapers', () => {
  let scrapers: any[] = [];

  beforeAll(async () => {
    const scraperInstances = [
      new AmazonScraper(),
      new WalmartScraper(),
      new NikeScraper(),
      new AdidasScraper(),
      new ZapposScraper(),
      new DSWScraper(),
      new FootLockerScraper(),
      new TargetScraper(),
      new ShoeCarnivalScraper(),
    ];

    for (const scraper of scraperInstances) {
      await scraper.initialize();
      scrapers.push(scraper);
    }
  });

  afterAll(async () => {
    for (const scraper of scrapers) {
      await scraper.close();
    }
  });

  describe('AmazonScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new AmazonScraper();
      expect(scraper.retailer).toBe('Amazon');
    });

    it('should match Amazon product URLs', async () => {
      const scraper = new AmazonScraper();
      await scraper.initialize();
      const validUrl = 'https://amazon.com/dp/B0CJG8KGXL';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });

    it('should reject non-Amazon URLs', async () => {
      const scraper = new AmazonScraper();
      await scraper.initialize();
      const invalidUrl = 'https://nike.com/product/123';
      expect(scraper.productUrlPattern.test(invalidUrl)).toBe(false);
      await scraper.close();
    });
  });

  describe('WalmartScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new WalmartScraper();
      expect(scraper.retailer).toBe('Walmart');
    });

    it('should match Walmart product URLs', async () => {
      const scraper = new WalmartScraper();
      await scraper.initialize();
      const validUrl = 'https://walmart.com/ip/123456789';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('NikeScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new NikeScraper();
      expect(scraper.retailer).toBe('Nike');
    });

    it('should match Nike product URLs', async () => {
      const scraper = new NikeScraper();
      await scraper.initialize();
      const validUrl = 'https://nike.com/t/revolution-7-mens-running-shoes/ABC123';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('AdidasScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new AdidasScraper();
      expect(scraper.retailer).toBe('Adidas');
    });

    it('should match Adidas product URLs', async () => {
      const scraper = new AdidasScraper();
      await scraper.initialize();
      const validUrl = 'https://adidas.com/us/ultraboost-22-shoes/GZ8053.html';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('ZapposScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new ZapposScraper();
      expect(scraper.retailer).toBe('Zappos');
    });

    it('should match Zappos product URLs', async () => {
      const scraper = new ZapposScraper();
      await scraper.initialize();
      const validUrl = 'https://zappos.com/product/123456789/color/123456';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('DSWScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new DSWScraper();
      expect(scraper.retailer).toBe('DSW');
    });

    it('should match DSW product URLs', async () => {
      const scraper = new DSWScraper();
      await scraper.initialize();
      const validUrl = 'https://dsw.com/en/us/product/123456789';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('FootLockerScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new FootLockerScraper();
      expect(scraper.retailer).toBe('Foot Locker');
    });

    it('should match Foot Locker product URLs', async () => {
      const scraper = new FootLockerScraper();
      await scraper.initialize();
      const validUrl = 'https://footlocker.com/en/product/123456';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('TargetScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new TargetScraper();
      expect(scraper.retailer).toBe('Target');
    });

    it('should match Target product URLs', async () => {
      const scraper = new TargetScraper();
      await scraper.initialize();
      const validUrl = 'https://target.com/p/some-product/12345';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });

  describe('ShoeCarnivalScraper', () => {
    it('should have correct retailer name', () => {
      const scraper = new ShoeCarnivalScraper();
      expect(scraper.retailer).toBe('Shoe Carnival');
    });

    it('should match Shoe Carnival product URLs', async () => {
      const scraper = new ShoeCarnivalScraper();
      await scraper.initialize();
      const validUrl = 'https://shoecarnival.com/mens/shoes/p/nike-revolution-7/12345';
      expect(scraper.productUrlPattern.test(validUrl)).toBe(true);
      await scraper.close();
    });
  });
});
