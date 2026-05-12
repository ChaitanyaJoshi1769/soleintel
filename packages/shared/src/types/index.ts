import { z } from 'zod';

// Product Types
export const ProductSchema = z.object({
  id: z.string().cuid().optional(),
  sku: z.string().optional(),
  upc: z.string().optional(),
  mpn: z.string().optional(),
  title: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  msrp: z.number().positive().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Retailer Types
export const RetailerSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  domain: z.string().url(),
  logo: z.string().url().optional(),
  category: z.enum(['marketplace', 'brand', 'discount', 'resale']),
  trustScore: z.number().min(0).max(100).default(50),
});

export type Retailer = z.infer<typeof RetailerSchema>;

// Price Listing
export const PriceListingSchema = z.object({
  id: z.string().cuid().optional(),
  productId: z.string(),
  retailerId: z.string(),
  url: z.string().url(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  shipping: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  inStock: z.boolean().default(true),
  lastUpdated: z.date().optional(),
});

export type PriceListing = z.infer<typeof PriceListingSchema>;

// API Response Types
export const ApiResponseSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    success: z.boolean(),
    data: data.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .optional(),
    timestamp: z.date().optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp?: Date;
};

// Pagination
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(20),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodType>(data: T) =>
  ApiResponseSchema(
    z.object({
      items: z.array(data),
      pagination: PaginationSchema,
    }),
  );

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: Pagination;
}>;

// Search Types
export const SearchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  filters: z
    .object({
      brand: z.string().optional(),
      category: z.string().optional(),
      priceMin: z.number().nonnegative().optional(),
      priceMax: z.number().positive().optional(),
      inStock: z.boolean().optional(),
    })
    .optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// Error Types
export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
