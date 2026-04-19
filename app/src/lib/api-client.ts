/**
 * A centralized fetch wrapper to communicate with the FastAPI backend.
 * Automatically prepends the base URL and handles JSON parsing.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data?.message || `API error: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // For network failures or invalid JSON responses, return a consistent offline response.
    return {
      status: 'error',
      message: error?.message || 'Failed to connect to backend',
      offline: true,
    };
  }
}
