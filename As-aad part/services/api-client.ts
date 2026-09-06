import { ApiResponse } from '@/lib/types';

declare const process: { env: Record<string, string | undefined> };

const USE_MOCK = false;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function request<T>(
  endpoint: string,
  options?: RequestInit,
  mockFallback?: () => Promise<T> | T
): Promise<ApiResponse<T>> {
  if (USE_MOCK && mockFallback) {
    // Artificial latency for realism
    await new Promise((r) => setTimeout(r, 250));
    try {
      const data = await mockFallback();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null as any, error: err.message || 'Mock request failed' };
    }
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return {
        success: false,
        data: null as any,
        error: errBody.message || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      data: null as any,
      error: err.message || 'Network error connecting to API',
    };
  }
}
