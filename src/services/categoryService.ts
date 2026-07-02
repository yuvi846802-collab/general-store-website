import ApiClient from '@/lib/api';

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
    const res = await ApiClient.get('/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  createCategory: async (category: Omit<Category, 'id' | '_count'>): Promise<Category> => {
    const res = await ApiClient.post('/categories', category);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create category');
    }
    return res.json();
  },

  updateCategory: async (id: string, updates: Partial<Omit<Category, 'id' | '_count'>>): Promise<Category> => {
    const res = await ApiClient.put(`/categories/${id}`, updates);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update category');
    }
    return res.json();
  },

  deleteCategory: async (id: string): Promise<void> => {
    const res = await ApiClient.delete(`/categories/${id}`);
    if (!res.ok) throw new Error('Failed to delete category');
  }
};
