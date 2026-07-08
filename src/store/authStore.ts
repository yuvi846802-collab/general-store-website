import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ApiClient from '../lib/api';

import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setAuth: (user, token) => {
        ApiClient.setAccessToken(token);
        set({ user, isAuthenticated: true, error: null });
      },

      logout: async () => {
        try {
          await ApiClient.post('/auth/logout', {});
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          ApiClient.setAccessToken(null);
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // Step 1: Refresh the access token using the httpOnly refresh cookie
          const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.accessToken) {
              ApiClient.setAccessToken(refreshData.accessToken);
            }
          }

          // Step 2: Fetch current user with the new token
          const res = await ApiClient.get('/auth/me');
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user, isAuthenticated: true, error: null });
          } else {
            ApiClient.setAccessToken(null);
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          ApiClient.setAccessToken(null);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: (updatedFields) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedFields } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Only persist user details
    }
  )
);

// Listen for global logout event triggered by API interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().logout();
  });
}
