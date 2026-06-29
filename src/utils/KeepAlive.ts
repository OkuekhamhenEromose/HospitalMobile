// src/utils/keepAlive.ts

const API_BASE = 'https://hospitalback-clean-0fre.onrender.com';

/**
 * Silently pings the health endpoint when the app launches.
 * This wakes the Render free tier server before the user
 * tries to log in or load blog posts, eliminating the cold-start delay.
 */
export async function warmServer(): Promise<void> {
  try {
    await fetch(`${API_BASE}/health/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    // No need to handle the response — the act of fetching wakes the server
  } catch {
    // Silently ignore — if the server is truly down, login will show its own error
  }
}