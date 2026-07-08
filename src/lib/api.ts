const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private static accessToken: string | null = null;
  private static isRefreshing = false;
  private static refreshSubscribers: ((token: string) => void)[] = [];

  static setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  static getAccessToken() {
    return this.accessToken;
  }

  private static subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private static onRefreshed(token: string) {
    this.refreshSubscribers.map((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private static async handleRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }
    
    // Always include credentials for cookies
    options.credentials = 'include';
    options.headers = headers;

    let response = await fetch(`${API_URL}${url}`, options);

    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
          });
          const data = await res.json();
          if (data.status === 'success' && data.accessToken) {
            this.setAccessToken(data.accessToken);
            this.onRefreshed(data.accessToken);
          } else {
            this.setAccessToken(null);
            // Will trigger logout on frontend
            window.dispatchEvent(new Event('auth:logout'));
            throw new Error('Session expired');
          }
        } catch (error) {
          this.setAccessToken(null);
          window.dispatchEvent(new Event('auth:logout'));
          throw error;
        } finally {
          this.isRefreshing = false;
        }
      }

      // Wait for the token refresh to finish before retrying
      return new Promise((resolve) => {
        this.subscribeTokenRefresh((newToken) => {
          headers.set('Authorization', `Bearer ${newToken}`);
          options.headers = headers;
          resolve(fetch(`${API_URL}${url}`, options));
        });
      });
    }

    return response;
  }

  static async get(url: string, options?: RequestInit) {
    return this.handleRequest(url, { ...options, method: 'GET' });
  }

  static async post(url: string, body: any, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = { ...options?.headers } as Record<string, string>;
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.handleRequest(url, {
      ...options,
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  static async put(url: string, body: any, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = { ...options?.headers } as Record<string, string>;
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.handleRequest(url, {
      ...options,
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  static async delete(url: string, options?: RequestInit) {
    return this.handleRequest(url, { ...options, method: 'DELETE' });
  }

  static async patch(url: string, body?: any, options?: RequestInit) {
    const headers: Record<string, string> = { ...((options?.headers as any) || {}) };
    const isFormData = body instanceof FormData;
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.handleRequest(url, {
      ...options,
      method: 'PATCH',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }
}

export default ApiClient;
