import { API_URL, fetchWithAuth } from './api';

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  profileImage?: string;
  isVerified?: boolean;
  bio?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  language?: string;
  createdAt?: string;
}

let currentUser: User | null = null;

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for setting the cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      currentUser = data.user;
      return { user: data.user };
    } catch (error: any) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error("Failed to call logout on server", e);
    } finally {
      currentUser = null;
    }
  },

  fetchCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        currentUser = data.user;
        return currentUser;
      }
      return null;
    } catch (e) {
      currentUser = null;
      return null;
    }
  },

  getCurrentUser: (): User | null => {
    return currentUser;
  },

  isAuthenticated: (): boolean => {
    return !!currentUser;
  }
};
