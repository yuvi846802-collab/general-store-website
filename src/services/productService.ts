import ApiClient from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  tag?: string;
  sku?: string;
  barcode?: string;
  stock: number;
  status: string;
}

const mapProduct = (p: any): Product => ({
  ...p,
  price: p.price?.toString() ?? '0',
  originalPrice: p.originalPrice ? p.originalPrice.toString() : undefined,
  category: typeof p.category === 'object' ? p.category?.name : p.category,
  status: p.status || 'active',
});

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await ApiClient.get('/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    const data = json.data || json;
    return Array.isArray(data) ? data.map(mapProduct) : [];
  },

  getProduct: async (id: string): Promise<Product | null> => {
    const products = await productService.getProducts();
    return products.find(p => p.id === id) || null;
  },

  createProduct: async (product: Partial<Product> & { [key: string]: any }): Promise<Product> => {
    const res = await ApiClient.post('/products', product);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.details || 'Failed to create product');
    }
    const data = await res.json();
    return mapProduct(data);
  },

  updateProduct: async (id: string, updates: Partial<Product> & { [key: string]: any }): Promise<Product> => {
    const res = await ApiClient.put(`/products/${id}`, updates);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update product');
    }
    const data = await res.json();
    return mapProduct(data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await ApiClient.delete(`/products/${id}`);
    if (!res.ok) throw new Error('Failed to delete product');
  },

  bulkImport: async (
    productsToImport: any[],
    onProgress?: (progress: number) => void
  ): Promise<{ imported: number; skipped: number; updated: number; failed: number }> => {
    let imported = 0;
    let failed = 0;
    for (let i = 0; i < productsToImport.length; i++) {
      try {
        await productService.createProduct(productsToImport[i]);
        imported++;
      } catch {
        failed++;
      }
      if (onProgress) {
        onProgress(Math.round(((i + 1) / productsToImport.length) * 100));
      }
    }
    return { imported, skipped: 0, updated: 0, failed };
  },

  exportProducts: async (): Promise<Blob> => {
    // Fetch all products and build CSV client-side
    const products = await productService.getProducts();
    const headers = ['ID', 'Name', 'Category', 'Price', 'Original Price', 'Stock', 'SKU', 'Barcode', 'Tag', 'Status'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      p.price,
      p.originalPrice || '',
      p.stock,
      p.sku || '',
      p.barcode || '',
      p.tag || '',
      p.status,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  },
};
