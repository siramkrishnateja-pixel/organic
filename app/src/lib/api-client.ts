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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
