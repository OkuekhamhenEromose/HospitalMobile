// src/services/storage.ts
// Replaces the web's localStorage calls with React Native AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const KEYS = {
  ACCESS_TOKEN:  'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA:     'user_data',
} as const;

class StorageService {
  // ── Tokens ──────────────────────────────────────────────────────────────────

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);
  }

  /** Atomically persist both tokens in one multiSet call. */
  async setTokens(access: string, refresh: string): Promise<void> {
    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN,  access],
      [KEYS.REFRESH_TOKEN, refresh],
    ]);
  }

  // ── User data ────────────────────────────────────────────────────────────────

  async getUserData(): Promise<User | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.USER_DATA);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  async setUserData(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
  }

  // ── Wipe ─────────────────────────────────────────────────────────────────────

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.USER_DATA,
    ]);
  }
}

export const storageService = new StorageService();
