import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.soleintel.com';

interface ApiError {
  message: string;
  code: string;
  status: number;
}

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add token to all requests
    this.api.interceptors.request.use(async (config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, clear it
          this.clearToken();
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  async initialize() {
    // Load token from storage on app start
    this.token = await AsyncStorage.getItem('auth_token');
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private handleError(error: AxiosError): ApiError {
    const message = error.response?.data?.error || error.message || 'Unknown error';
    const status = error.response?.status || 0;
    const code = error.code || 'UNKNOWN_ERROR';

    return {
      message: String(message),
      code,
      status,
    };
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const response = await this.api.post('/api/auth/register', { email, password, name });
    const { token, user } = response.data;
    await this.setToken(token);
    return { token, user };
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    await this.setToken(token);
    return { token, user };
  }

  async loginWithBiometric(email: string) {
    const response = await this.api.post('/api/auth/login', { email, useBiometric: true });
    const { token, user } = response.data;
    await this.setToken(token);
    return { token, user };
  }

  async getCurrentUser() {
    const response = await this.api.get('/api/auth/me');
    return response.data.user;
  }

  async updateProfile(data: { name?: string; phoneNumber?: string }) {
    const response = await this.api.patch('/api/auth/profile', data);
    return response.data.user;
  }

  // Watchlist endpoints
  async getWatchlist() {
    const response = await this.api.get('/api/watchlists');
    return response.data.watchlists;
  }

  async addToWatchlist(productId: string, targetPrice?: number) {
    const response = await this.api.post('/api/watchlists', { productId, targetPrice });
    return response.data;
  }

  async removeFromWatchlist(watchlistId: string) {
    await this.api.delete(`/api/watchlists/${watchlistId}`);
  }

  // Search & Products
  async searchProducts(query: string) {
    const response = await this.api.get('/api/search', { params: { q: query } });
    return response.data.results;
  }

  async getProduct(productId: string) {
    const response = await this.api.get(`/api/products/${productId}`);
    return response.data;
  }

  async getProductPricing(productId: string) {
    const response = await this.api.get(`/api/products/${productId}/pricing`);
    return response.data;
  }

  // Categories (Phase 2)
  async getCategories() {
    const response = await this.api.get('/api/categories');
    return response.data.categories;
  }

  async getCategory(slug: string) {
    const response = await this.api.get(`/api/categories/${slug}`);
    return response.data.category;
  }

  async getTrendingInCategory(categoryId: string, limit: number = 10) {
    const response = await this.api.get(`/api/categories/${categoryId}/trending`, {
      params: { limit },
    });
    return response.data.trending;
  }

  async subscribeToCategory(categoryId: string, frequency: string = 'daily') {
    const response = await this.api.post(`/api/categories/${categoryId}/subscribe`, { frequency });
    return response.data;
  }

  async getUserCategories() {
    const response = await this.api.get('/api/user/categories');
    return response.data.categories;
  }

  // Barcode scanning
  async searchByBarcode(barcode: string) {
    const response = await this.api.post('/api/mobile/barcode-scan', { barcode });
    return response.data;
  }

  // Notifications
  async registerPushToken(token: string, platform: 'ios' | 'android') {
    const response = await this.api.post('/api/mobile/notifications/register', {
      expoPushToken: token,
      platform,
    });
    return response.data;
  }

  // Analytics
  async getDashboard() {
    const response = await this.api.get('/api/mobile/dashboard');
    return response.data;
  }
}

export const apiClient = new ApiClient();
