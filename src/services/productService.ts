import { productsData } from '@/constants/products';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  tag?: string;
  oldPrice?: string;
  stock: number;
  status: 'active' | 'draft' | 'hidden';
}

// Initialize mock DB from constants if not in local storage
const initializeDB = () => {
  if (!localStorage.getItem('admin_products')) {
    const flatProducts: Product[] = [];
    let idCounter = 1;
    
    Object.entries(productsData).forEach(([category, products]) => {
      products.forEach(p => {
        flatProducts.push({
          id: idCounter.toString(),
          name: p.name,
          category,
          price: p.price,
          image: p.image,
          tag: p.tag,
          stock: Math.floor(Math.random() * 100) + 10,
          status: 'active'
        });
        idCounter++;
      });
    });
    
    localStorage.setItem('admin_products', JSON.stringify(flatProducts));
  }
};

initializeDB();

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 50));
    const data = localStorage.getItem('admin_products');
    return data ? JSON.parse(data) : [];
  },

  getProduct: async (id: string): Promise<Product | null> => {
    const products = await productService.getProducts();
    return products.find(p => p.id === id) || null;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(r => setTimeout(r, 50));
    const products = await productService.getProducts();
    const newProduct = { ...product, id: Date.now().toString() };
    products.push(newProduct);
    localStorage.setItem('admin_products', JSON.stringify(products));
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await new Promise(r => setTimeout(r, 50));
    const products = await productService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    products[index] = { ...products[index], ...updates };
    localStorage.setItem('admin_products', JSON.stringify(products));
    return products[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 50));
    const products = await productService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('admin_products', JSON.stringify(filtered));
  },

  bulkImport: async (
    productsToImport: any[], 
    onProgress?: (progress: number) => void
  ): Promise<{ imported: number, skipped: number, updated: number, failed: number }> => {
    
    // Simulate background job initialization
    await new Promise(r => setTimeout(r, 500));
    
    const existingProducts = await productService.getProducts();
    let imported = 0;
    let skipped = 0;
    let updated = 0;
    let failed = 0;

    const BATCH_SIZE = 50;
    
    for (let i = 0; i < productsToImport.length; i += BATCH_SIZE) {
      const batch = productsToImport.slice(i, i + BATCH_SIZE);
      
      // Simulate chunk processing latency
      await new Promise(r => setTimeout(r, 300));

      batch.forEach(item => {
        try {
          if (!item.name || !item.category || !item.price) {
            failed++;
            return;
          }

          // Check for duplicate by name (acting as SKU/identifier)
          const existingIndex = existingProducts.findIndex(
            p => p.name.toLowerCase() === item.name.toLowerCase() || (p as any).sku === item.sku
          );

          if (existingIndex !== -1) {
            // Found duplicate
            if (item.override) {
              existingProducts[existingIndex] = { ...existingProducts[existingIndex], ...item };
              updated++;
            } else {
              skipped++;
            }
          } else {
            // New product
            existingProducts.unshift({
              ...item,
              id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
              stock: item.stock !== undefined ? Number(item.stock) : 0,
              status: item.status || 'draft'
            } as Product);
            imported++;
          }
        } catch (e) {
          failed++;
        }
      });

      // Update progress
      if (onProgress) {
        const currentProgress = Math.min(100, Math.round(((i + BATCH_SIZE) / productsToImport.length) * 100));
        onProgress(currentProgress);
      }
    }

    // Persist to DB
    localStorage.setItem('admin_products', JSON.stringify(existingProducts));
    
    return { imported, skipped, updated, failed };
  }
};
