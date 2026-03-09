import { API_CONFIG } from '../constants/config';
import { storageService } from './Storage';
import type { LoginData, RegisterData, AuthResponse, BlogPost } from '../types';

const { BASE_URL, TIMEOUT, TTL } = API_CONFIG;

const normalizeMediaUrl = (url: string | null | undefined): string | null => {
  if (!url || url.trim() === '') return null;
  return url;
};

const normalizeBlogPost = (post: any): BlogPost => {
  const rawSubs = post.subheadings ?? post.sub_headings;
  const subheadings = Array.isArray(rawSubs)
    ? rawSubs.map((s: any, i: number) => ({
        id: s.id ?? i + 1,
        title: s.title ?? `Section ${i + 1}`,
        level: s.level ?? 2,
        description: s.description ?? '',
        full_content: s.full_content ?? s.description ?? '',
      }))
    : [];

  return {
    ...post,
    featured_image: normalizeMediaUrl(post.featured_image_url ?? post.featured_image),
    image_1: normalizeMediaUrl(post.image_1_url ?? post.image_1),
    image_2: normalizeMediaUrl(post.image_2_url ?? post.image_2),
    description:
      post.description ?? post.short_description ?? post.excerpt ?? post.content ?? '',
    subheadings,
    table_of_contents:
      post.table_of_contents ?? post.toc ?? post.toc_items ?? post.contents ?? [],
  };
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return true;
  }
};

const unwrapList = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as any).results))
    return (data as any).results;
  return [];
};

class ApiService {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private requestQueue = new Map<string, Promise<unknown>>();

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = await storageService.getAccessToken();
    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData))
      headers['Content-Type'] = 'application/json';
    if (token)
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    Object.assign(headers, options.headers);

    const method = (options.method ?? 'GET').toUpperCase();
    const requestKey = `${method}:${endpoint}`;

    if (method === 'GET' && this.requestQueue.has(requestKey))
      return this.requestQueue.get(requestKey) as Promise<T>;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const promise = (async (): Promise<T> => {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.status === 401) {
          await this.clearStorage();
          throw new Error('Authentication expired. Please login again.');
        }

        if (!response.ok) {
          let msg = `API error: ${response.status}`;
          try {
            const err = await response.json();
            if (err.detail === 'Given token not valid for any token type') {
              await this.clearStorage();
              msg = 'Session expired. Please login again.';
            } else if (err.detail) msg = err.detail;
            else if (err.error) msg = err.error;
            else if (err.non_field_errors) msg = err.non_field_errors.join(', ');
            else msg = JSON.stringify(err);
          } catch {}
          throw new Error(msg);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0')
          return null as T;

        return response.json() as Promise<T>;
      } finally {
        clearTimeout(timeoutId);
        this.requestQueue.delete(requestKey);
      }
    })();

    if (method === 'GET') this.requestQueue.set(requestKey, promise);
    return promise;
  }

  private async requestWithRetry<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    retried = false
  ): Promise<T> {
    try {
      return await this.request<T>(endpoint, options);
    } catch (err: any) {
      if (
        !retried &&
        (err.message.includes('Authentication expired') ||
          err.message.includes('Session expired'))
      ) {
        try {
          await this.refreshToken();
          return await this.requestWithRetry<T>(endpoint, options, true);
        } catch {
          await this.clearStorage();
          throw new Error('Session expired. Please login again.');
        }
      }
      throw err;
    }
  }

  private async cachedRequest<T = unknown>(
    endpoint: string,
    ttl = TTL.LIST
  ): Promise<T> {
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < ttl) return cached.data as T;

    const data = await this.requestWithRetry<T>(endpoint);
    this.cache.set(endpoint, { data, timestamp: Date.now() });
    return data;
  }

  invalidateCache(prefix: string) {
    for (const key of this.cache.keys())
      if (key.startsWith(prefix)) this.cache.delete(key);
  }

  private async clearStorage() {
    await storageService.clearAuth();
    this.cache.clear();
  }

  async refreshToken(): Promise<{ access: string; refresh: string }> {
    const refresh = await storageService.getRefreshToken();
    if (!refresh) throw new Error('No refresh token available');

    const res = await fetch(`${BASE_URL}/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      await this.clearStorage();
      throw new Error('Failed to refresh token');
    }

    const data = await res.json();
    if (data.access) await storageService.setAccessToken(data.access);
    if (data.refresh) await storageService.setRefreshToken(data.refresh);
    return data;
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginData.username,
        password: loginData.password,
      }),
    });

    if (!res.ok) {
      let msg = `Login failed (${res.status})`;
      try {
        msg = (await res.json()).detail ?? msg;
      } catch {}
      throw new Error(msg);
    }

    const data = await res.json();
    await storageService.setAccessToken(data.access);
    if (data.refresh) await storageService.setRefreshToken(data.refresh);
    if (data.user) await storageService.setUserData(data.user);
    return data as AuthResponse;
  }

  async register(registerData: RegisterData): Promise<unknown> {
    return this.request('/users/register/', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async logout(): Promise<void> {
    const refresh = await storageService.getRefreshToken();
    if (refresh) {
      try {
        await this.request('/users/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        });
      } catch {}
    }
    await this.clearStorage();
  }

  async getDashboard(): Promise<unknown> {
    return this.cachedRequest('/users/dashboard/', TTL.PERSONAL);
  }

  async getAppointments(): Promise<unknown[]> {
    return unwrapList(await this.cachedRequest('/hospital/appointments/'));
  }

  async createAppointment(data: unknown): Promise<unknown> {
    this.invalidateCache('/hospital/appointments/');
    return this.request('/hospital/appointments/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    const data = await this.cachedRequest('/hospital/blog/', TTL.BLOG);
    return unwrapList(data).map(normalizeBlogPost);
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    const data = await this.cachedRequest(`/hospital/blog/${slug}/`, TTL.BLOG);
    return normalizeBlogPost(data);
  }

  async getLatestBlogPosts(limit = 6): Promise<BlogPost[]> {
    const data = await this.cachedRequest(
      `/hospital/blog/latest/?limit=${limit}`,
      TTL.BLOG
    );
    return unwrapList(data).map(normalizeBlogPost);
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const data = await this.request(
      `/hospital/blog/search/?q=${encodeURIComponent(query)}`
    );
    return unwrapList(data).map(normalizeBlogPost);
  }
}

export const apiService = new ApiService();
export default apiService;