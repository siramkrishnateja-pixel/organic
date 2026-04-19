import { fetchFromAPI } from './api-client';

// Session management utilities
export class SessionManager {
  private static readonly TOKEN_KEY = 'organic_session_token';
  private static readonly USER_KEY = 'organic_user_data';

  static setSession(token: string, userData: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  }

  static getSession() {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (!token || !userData) return null;

    try {
      return {
        token,
        user: JSON.parse(userData)
      };
    } catch {
      this.clearSession();
      return null;
    }
  }

  static clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static isAuthenticated(): boolean {
    const session = this.getSession();
    return !!session?.token && !!session?.user;
  }

  static getUserRole(): string | null {
    const session = this.getSession();
    return session?.user?.role || null;
  }

  static isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  static async validateSession(): Promise<boolean> {
    try {
      const session = this.getSession();
      if (!session) return false;

      // Call backend to validate session
      const response = await fetchFromAPI('/supabase/auth/validate-session', {
        method: 'POST',
        body: JSON.stringify({ token: session.token })
      });

      if (response.status === 'success') return true;
      
      // For demo mode: allow locally-generated tokens (format: token-<id>-<timestamp>)
      if (session.token.startsWith('token-')) {
        return true;
      }
      
      return false;
    } catch (error) {
      // For demo tokens or local tokens, allow access even if validation endpoint is unavailable
      const session = this.getSession();
      if (session?.token?.startsWith('token-')) {
        return true;
      }
      this.clearSession();
      return false;
    }
  }
}

// Enhanced API client with session management
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  const session = SessionManager.getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  try {
    return await fetchFromAPI(endpoint, {
      ...options,
      headers,
    });
  } catch (error: any) {
    if (error?.message?.includes('401')) {
      SessionManager.clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    throw error;
  }
};