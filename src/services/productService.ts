import { fetchWithAuth, API_URL, getAuthHeaders } from './api';
export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  tag?: string;
  stock: number;
  status: 'active' | 'draft' | 'hidden';
}



export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetchWithAuth(`${API_URL}/products`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.map((p: any) => ({
      ...p,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : undefined,
      category: typeof p.category === 'object' ? p.category.name : p.category,
      status: p.status || 'active'
    }));
  },

  getProduct: async (id: string): Promise<Product | null> => {
    // Optionally we could fetch single product, but for now we'll fetch all and filter
    // as that matches previous behavior. Better approach would be GET /products/:id
    const products = await productService.getProducts();
    return products.find(p => p.id === id) || null;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const res = await fetchWithAuth(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    return {
      ...data,
      category: typeof data.category === 'object' ? data.category.name : data.category,
      price: data.price.toString(),
      originalPrice: data.originalPrice ? data.originalPrice.toString() : undefined,
      status: data.status || 'active'
    };
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    const data = await res.json();
    return {
      ...data,
      category: typeof data.category === 'object' ? data.category.name : data.category,
      price: data.price.toString(),
      originalPrice: data.originalPrice ? data.originalPrice.toString() : undefined,
      status: data.status || 'active'
    };
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  bulkImport: async (
    productsToImport: any[], 
    onProgress?: (progress: number) => void
  ): Promise<{ imported: number, skipped: number, updated: number, failed: number }> => {
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < productsToImport.length; i++) {
      try {
        await productService.createProduct(productsToImport[i]);
        imported++;
      } catch (e) {
        failed++;
      }
      if (onProgress) {
        onProgress(Math.round(((i + 1) / productsToImport.length) * 100));
      }
    }
    return { imported, skipped: 0, updated: 0, failed };
  }
};
