// src/services/api.ts
// React-Native port — aligned with the web services/api.ts.
// Adds blog category + suggestion endpoints to mirror the web app exactly.

import { storageService } from './storage';
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  DashboardResponse,
  TokenResponse,
} from '../types';

export const API_BASE_URL = 'https://hospitalback-clean-0fre.onrender.com/api';

const S3_BASE = 'https://etha-hospital-clone-app.s3.eu-north-1.amazonaws.com/media/';

// ── Media normaliser (mirrors web utils/mediaUrl.ts) ─────────────────────────
export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === '') return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const clean = url.startsWith('media/') ? url.slice(6) : url;
  return `${S3_BASE}${clean}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiErrorResponse {
  detail?: string;
  error?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
}

interface ListResponse<T> {
  results: T[];
  count?: number;
}

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  post_count: number;
}

export interface BlogSuggestion {
  id: number;
  title: string;
  slug: string;
  category_name: string;
  category_slug: string;
}

export interface NormalizedBlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content?: string;
  featured_image: string | null;   // always normalised to full URL or null
  image_1: string | null;
  image_2: string | null;
  author_name?: string;
  author_role?: string;
  created_at: string;
  published_date?: string;
  published: boolean;
  subheadings?: any[];
  table_of_contents?: any[];
  enable_toc?: boolean;
  category?: BlogCategory | null;
  [key: string]: unknown;
}

// TTLs
const TTL_BLOG       = 5  * 60 * 1000;
const TTL_CATEGORIES = 10 * 60 * 1000;
const TTL_PERSONAL   = 2  * 60 * 1000;
const TTL_LIST       = 3  * 60 * 1000;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** base64 decoder that works in Hermes (no built-in atob). */
function base64Decode(str: string): string {
  const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = s + '='.repeat((4 - (s.length % 4)) % 4);
  let out = '';
  for (let i = 0; i < padded.length; i += 4) {
    const a = TABLE.indexOf(padded[i]);
    const b = TABLE.indexOf(padded[i + 1]);
    const c = TABLE.indexOf(padded[i + 2]);
    const d = TABLE.indexOf(padded[i + 3]);
    out += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== 64 && c !== -1) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== 64 && d !== -1) out += String.fromCharCode(((c & 3) << 6) | d);
  }
  return out;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(base64Decode(parts[1])) as { exp: number };
    return payload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return true;
  }
};

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data !== null && typeof data === 'object' && 'results' in data &&
    Array.isArray((data as ListResponse<T>).results)) {
    return (data as ListResponse<T>).results;
  }
  return [];
}

/**
 * Normalise all image fields in a raw blog-post object so they are
 * either a full https:// URL or null — mirrors normalizeBlogPost() in web api.ts.
 */
function normalizeBlogPost(raw: Record<string, unknown>): NormalizedBlogPost {
  const featured = normalizeMediaUrl(
    (raw.featured_image_url ?? raw.featured_image) as string | null
  );
  const img1 = normalizeMediaUrl(
    (raw.image_1_url ?? raw.image_1) as string | null
  );
  const img2 = normalizeMediaUrl(
    (raw.image_2_url ?? raw.image_2) as string | null
  );

  return {
    ...raw,
    featured_image: featured,
    image_1:        img1,
    image_2:        img2,
    description:    (raw.description ?? raw.short_description ?? raw.excerpt ?? raw.content ?? '') as string,
    subheadings:    Array.isArray(raw.subheadings) ? raw.subheadings : [],
    table_of_contents: (raw.table_of_contents ?? raw.toc ?? raw.toc_items ?? []) as any[],
    category:       raw.category as BlogCategory | null ?? null,
  } as NormalizedBlogPost;
}

// ── Custom error ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  public readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ── Service ───────────────────────────────────────────────────────────────────

class ApiService {
  private cache = new Map<string, CacheEntry>();
  private requestQueue = new Map<string, Promise<unknown>>();

  // ── Low-level request ─────────────────────────────────────────────────────

  private async buildHeaders(includeAuth: boolean, isFormData: boolean): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (includeAuth) {
      const token = await storageService.getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = true,
  ): Promise<T> {
    const url         = `${API_BASE_URL}${endpoint}`;
    const isFormData  = options.body instanceof FormData;
    const headers     = await this.buildHeaders(includeAuth, isFormData);
    const method      = (options.method ?? 'GET').toUpperCase();
    const requestKey  = `${method}:${endpoint}`;

    // Dedup in-flight GET requests
    if (method === 'GET' && this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey) as Promise<T>;
    }

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 30_000);

    const promise = (async (): Promise<T> => {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...((options.headers as Record<string, string>) ?? {}),
          },
          signal: controller.signal,
        });

        if (response.status === 204 || response.headers.get('content-length') === '0') {
          return null as T;
        }

        if (!response.ok) {
          let msg = `Request failed (${response.status})`;
          try {
            const err = (await response.json()) as ApiErrorResponse;
            msg = err.detail ?? err.error ?? err.non_field_errors?.join(', ') ?? JSON.stringify(err);
          } catch { /* ignore */ }
          throw new ApiError(msg, response.status);
        }

        return (await response.json()) as T;
      } finally {
        clearTimeout(timeoutId);
        this.requestQueue.delete(requestKey);
      }
    })();

    if (method === 'GET') this.requestQueue.set(requestKey, promise);
    return promise;
  }

  private async requestWithRefresh<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      return await this.request<T>(endpoint, options);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        try {
          await this.refreshToken();
          return await this.request<T>(endpoint, options);
        } catch {
          await storageService.clearAll();
          throw new ApiError('Session expired. Please login again.');
        }
      }
      throw err;
    }
  }

  private async cachedRequest<T>(endpoint: string, ttl = TTL_LIST): Promise<T> {
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < ttl) return cached.data as T;
    const data = await this.requestWithRefresh<T>(endpoint);
    this.cache.set(endpoint, { data, timestamp: Date.now() });
    return data;
  }

  invalidateCache(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) this.cache.delete(key);
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async refreshToken(): Promise<TokenResponse> {
    const refresh = await storageService.getRefreshToken();
    if (!refresh) throw new ApiError('No refresh token available');

    const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      await storageService.clearAll();
      throw new ApiError('Could not refresh session. Please login again.');
    }

    const data = (await response.json()) as TokenResponse;
    if (data.access)  await storageService.setAccessToken(data.access);
    if (data.refresh) await storageService.setRefreshToken(data.refresh);
    return data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username: data.username, password: data.password }),
    });

    if (!response.ok) {
      let msg = `Login failed (${response.status})`;
      try {
        const err = (await response.json()) as ApiErrorResponse;
        msg = err.detail ?? msg;
      } catch { /* ignore */ }
      throw new ApiError(msg, response.status);
    }

    const result = (await response.json()) as AuthResponse;
    await storageService.setTokens(result.access, result.refresh);
    if (result.user) await storageService.setUserData(result.user);
    return result;
  }

  async register(data: RegisterData): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (!response.ok) {
      const ct = response.headers.get('content-type') ?? '';
      if (ct.includes('application/json')) {
        const err = (await response.json()) as ApiErrorResponse;
        const messages = Object.entries(err)
          .filter(([k]) => k !== 'status')
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
          .join('\n');
        throw new ApiError(messages || `Registration failed (${response.status})`, response.status);
      }
      throw new ApiError(`Registration failed (${response.status})`, response.status);
    }
    return response.json();
  }

  async logout(): Promise<void> {
    const refresh = await storageService.getRefreshToken();
    if (refresh) {
      try {
        await this.request('/users/logout/', {
          method: 'POST',
          body:   JSON.stringify({ refresh }),
        });
      } catch { /* ignore */ }
    }
    await storageService.clearAll();
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  async getDashboard(): Promise<DashboardResponse> {
    return this.cachedRequest<DashboardResponse>('/users/dashboard/', TTL_PERSONAL);
  }

  // ── Appointments ──────────────────────────────────────────────────────────

  async getAppointments(): Promise<unknown[]> {
    return unwrapList(await this.cachedRequest('/hospital/appointments/'));
  }

  async createAppointment(payload: unknown): Promise<unknown> {
    this.invalidateCache('/hospital/appointments/');
    return this.requestWithRefresh('/hospital/appointments/create/', {
      method: 'POST',
      body:   JSON.stringify(payload),
    });
  }

  async getAppointmentDetails(id: number): Promise<unknown> {
    return this.cachedRequest(`/hospital/appointments/${id}/`);
  }

  async refreshAppointments(): Promise<unknown[]> {
    this.invalidateCache('/hospital/appointments/');
    return this.getAppointments();
  }

  // ── Blog categories ───────────────────────────────────────────────────────

  /**
   * GET /hospital/blog/categories/
   * Returns all categories with published post counts.
   * Mirrors web apiService.getBlogCategories().
   */
  async getBlogCategories(): Promise<BlogCategory[]> {
    const data = await this.cachedRequest('/hospital/blog/categories/', TTL_CATEGORIES);
    return unwrapList<BlogCategory>(data);
  }

  // ── Blog search suggestions ───────────────────────────────────────────────

  /**
   * GET /hospital/blog/suggest/?q=<query>[&category=<slug>]
   * Lightweight autocomplete — NOT cached (needs fresh data as user types).
   * Mirrors web apiService.getBlogSuggestions().
   */
  async getBlogSuggestions(query: string, categorySlug?: string): Promise<BlogSuggestion[]> {
    if (!query.trim()) return [];
    const cat = categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : '';
    const data = await this.request(
      `/hospital/blog/suggest/?q=${encodeURIComponent(query)}${cat}`,
      {},
      false,  // public endpoint — no auth needed
    );
    return unwrapList<BlogSuggestion>(data);
  }

  // ── Blog posts ────────────────────────────────────────────────────────────

  /**
   * GET /hospital/blog/[?category=<slug>]
   * Mirrors web apiService.getBlogPosts().
   */
  async getBlogPosts(categorySlug?: string): Promise<NormalizedBlogPost[]> {
    const cat = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : '';
    const cacheKey = `/hospital/blog/${cat}`;
    const data = await this.cachedRequest(cacheKey, TTL_BLOG);
    return unwrapList<Record<string, unknown>>(data).map(normalizeBlogPost);
  }

  /**
   * GET /hospital/blog/<slug>/
   * Mirrors web apiService.getBlogPost().
   */
  async getBlogPost(slug: string): Promise<NormalizedBlogPost> {
    const data = await this.cachedRequest<Record<string, unknown>>(
      `/hospital/blog/${slug}/`,
      TTL_BLOG,
    );
    return normalizeBlogPost(data);
  }

  /**
   * GET /hospital/blog/latest/?limit=N[&category=<slug>]
   * Mirrors web apiService.getLatestBlogPosts().
   */
  async getLatestBlogPosts(limit = 6, categorySlug?: string): Promise<NormalizedBlogPost[]> {
    const cat = categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : '';
    const data = await this.cachedRequest(
      `/hospital/blog/latest/?limit=${limit}${cat}`,
      TTL_BLOG,
    );
    return unwrapList<Record<string, unknown>>(data).map(normalizeBlogPost);
  }

  /**
   * GET /hospital/blog/search/?q=<query>[&category=<slug>]
   * Mirrors web apiService.searchBlogPosts().
   */
  async searchBlogPosts(query: string, categorySlug?: string): Promise<NormalizedBlogPost[]> {
    const cat = categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : '';
    const data = await this.request(
      `/hospital/blog/search/?q=${encodeURIComponent(query)}${cat}`,
      {},
      false,
    );
    return unwrapList<Record<string, unknown>>(data).map(normalizeBlogPost);
  }

  /**
   * GET /hospital/blog/admin/all/
   * Admin only — all posts including drafts.
   */
  async getAllBlogPosts(): Promise<NormalizedBlogPost[]> {
    const data = await this.cachedRequest('/hospital/blog/admin/all/', TTL_BLOG);
    return unwrapList<Record<string, unknown>>(data).map(normalizeBlogPost);
  }
}

export const apiService = new ApiService();
export default ApiService;