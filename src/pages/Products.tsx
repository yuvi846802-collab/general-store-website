import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { productService, Product } from '@/services/productService';
import { categoryService, Category } from '@/services/categoryService';
import { useInventorySocket } from '@/hooks/useInventorySocket';
import { Search, Filter, Loader2, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { lazy, Suspense } from 'react';

const Footer = lazy(() => import('@/components/Footer'));

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(productsData);
        // Sometimes the API returns an object with a data array, sometimes directly the array
        const cats = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any).data || [];
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Real-time updates via Socket.IO
  useInventorySocket(() => {
    productService.getProducts().then(setProducts).catch(console.error);
  });

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory && activeCategory.toLowerCase() !== 'all' 
      ? product.category?.toLowerCase() === activeCategory.toLowerCase() || 
        product.tag?.toLowerCase() === activeCategory.toLowerCase() ||
        // Check if active category matches part of the category name (e.g. "Groceries" matches "Grocery Items")
        (product.category && product.category.toLowerCase().includes(activeCategory.toLowerCase().replace(/ies$/, 'y')))
      : true;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        {/* Header Section */}
        <div className="bg-primary/5 py-12 border-b border-border mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">
              {activeCategory && activeCategory.toLowerCase() !== 'all' 
                ? `${activeCategory} Products` 
                : 'All Products'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our wide range of high-quality products at unbeatable prices.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 hide-scrollbar">
              <Button 
                variant={!activeCategory || activeCategory.toLowerCase() === 'all' ? "default" : "outline"}
                onClick={() => setActiveCategory('all')}
                className="rounded-full whitespace-nowrap"
              >
                All
              </Button>
              {categories.map(category => (
                <Button 
                  key={category.id}
                  variant={activeCategory?.toLowerCase() === category.name.toLowerCase() ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.name)}
                  className="rounded-full whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 rounded-full bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <PackageX className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any products matching your current filters. Try adjusting your search or category.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory(null);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Suspense fallback={<div className="py-10 bg-[#0f172a]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
