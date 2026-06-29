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
  }
};
