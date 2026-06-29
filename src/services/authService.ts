export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Hardcoded credentials for MVP demo purposes
    if (email === 'admin@hakeemstore.com' && password === 'admin123') {
      const user: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@hakeemstore.com',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
      };
      const token = 'mock-jwt-token-12345';
      
      // Persist to local storage for demo
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  }
};
