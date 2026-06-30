import { getAuthHeaders } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
  _count?: {
    products: number;
  };
}

const API_URL = 'http://localhost:5000/api';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/categories`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  createCategory: async (category: Omit<Category, 'id' | '_count'>): Promise<Category> => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  deleteCategory: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
  }
};
