import { getAuthHeaders, fetchWithAuth, API_URL } from './api';

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



export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await fetchWithAuth(`${API_URL}/categories`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  createCategory: async (category: Omit<Category, 'id' | '_count'>): Promise<Category> => {
    const res = await fetchWithAuth(`${API_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    const res = await fetchWithAuth(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  deleteCategory: async (id: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete category');
  }
};
