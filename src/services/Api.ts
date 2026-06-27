// src/services/api.ts
// React-Native port of the web's api.ts.
// Key differences from the web version:
//   • AsyncStorage replaces localStorage
//   • atob() polyfill for JWT decoding (Hermes may not have it)
//   • No DOM-specific features (no window, no FormData quirks)

import { storageService } from './storage';
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  DashboardResponse,
  BlogPost,
  TokenResponse,
} from '../types';

export const API_BASE_URL = 'https://hospitalback-clean-0fre.onrender.com/api';

// ── Internal types ────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Base64 decoder that works in both Hermes (React Native) and V8.
 * Handles URL-safe alphabet (JWT uses - and _ instead of + and /).
 */
function base64Decode(str: string): string {
  const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // Normalise URL-safe alphabet and strip padding
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s + '='.repeat(padLen);

  let out = '';
  for (let i = 0; i < padded.length; i += 4) {
    const a = table.indexOf(padded[i]);
    const b = table.indexOf(padded[i + 1]);
    const c = table.indexOf(padded[i + 2]);
    const d = table.indexOf(padded[i + 3]);
    out += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== -1 && c !== 64) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== -1 && d !== 64) out += String.fromCharCode(((c & 3) << 6) | d);
  }
  return out;
}

/** Returns true if the JWT has expired (or is malformed). */
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(base64Decode(parts[1])) as { exp: number };
    // Treat as expired 30 s before actual expiry to avoid edge cases
    return payload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return true;
  }
};

/** Unwrap a DRF paginated or plain-array response into a plain array. */
function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (
    data !== null &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as ListResponse<T>).results)
  ) {
    return (data as ListResponse<T>).results;
  }
  return [];
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
  // ── Low-level request ──────────────────────────────────────────────────────

  private async buildHeaders(
    includeAuth: boolean,
    isFormData: boolean,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

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
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const headers = await this.buildHeaders(includeAuth, isFormData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...((options.headers as Record<string, string>) ?? {}),
        },
        signal: controller.signal,
      });

      // No-content responses
      if (
        response.status === 204 ||
        response.headers.get('content-length') === '0'
      ) {
        return null as T;
      }

      if (!response.ok) {
        await this.throwApiError(response);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async throwApiError(response: Response): Promise<never> {
    let msg = `Request failed (${response.status})`;
    try {
      const err = (await response.json()) as ApiErrorResponse;
      if (err.detail)              msg = err.detail;
      else if (err.error)          msg = err.error;
      else if (err.non_field_errors?.length) msg = err.non_field_errors.join(', ');
      else                         msg = JSON.stringify(err);
    } catch {
      // response body wasn't JSON; keep generic message
    }
    throw new ApiError(msg, response.status);
  }

  /**
   * Like request(), but automatically retries once after refreshing the
   * access token if a 401 is received.
   */
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
          return await this.request<T>(endpoint, options); // retry
        } catch {
          await storageService.clearAll();
          throw new ApiError('Session expired. Please login again.');
        }
      }
      throw err;
    }
  }

  // ── Auth endpoints ─────────────────────────────────────────────────────────

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
    // Persist tokens + user immediately
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
        // Flatten field-level errors so they're readable in the UI
        const messages = Object.entries(err)
          .filter(([k]) => k !== 'status')
          .map(([k, v]) =>
            `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`,
          )
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
      } catch { /* ignore — wipe local storage regardless */ }
    }
    await storageService.clearAll();
  }

  // ── User / dashboard ───────────────────────────────────────────────────────

  async getDashboard(): Promise<DashboardResponse> {
    return this.requestWithRefresh<DashboardResponse>('/users/dashboard/');
  }

  // ── Blog ──────────────────────────────────────────────────────────────────

  async getBlogPosts(): Promise<BlogPost[]> {
    const data = await this.requestWithRefresh<unknown>('/hospital/blog/');
    return unwrapList<BlogPost>(data);
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.requestWithRefresh<BlogPost>(`/hospital/blog/${slug}/`);
  }

  async getLatestBlogPosts(limit = 6): Promise<BlogPost[]> {
    const data = await this.requestWithRefresh<unknown>(
      `/hospital/blog/latest/?limit=${limit}`,
    );
    return unwrapList<BlogPost>(data);
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const data = await this.requestWithRefresh<unknown>(
      `/hospital/blog/search/?q=${encodeURIComponent(query)}`,
    );
    return unwrapList<BlogPost>(data);
  }

  // ── Appointments ──────────────────────────────────────────────────────────

  async getAppointments(): Promise<unknown[]> {
    const data = await this.requestWithRefresh<unknown>('/hospital/appointments/');
    return unwrapList(data);
  }

  async createAppointment(payload: unknown): Promise<unknown> {
    return this.requestWithRefresh('/hospital/appointments/create/', {
      method: 'POST',
      body:   JSON.stringify(payload),
    });
  }

  async getAppointmentDetails(id: number): Promise<unknown> {
    return this.requestWithRefresh(`/hospital/appointments/${id}/`);
  }
}

export const apiService = new ApiService();
export default ApiService;
