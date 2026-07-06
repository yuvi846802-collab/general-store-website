import { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { productService, Product } from '@/services/productService';
import { Loader2, Tag, Percent, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const Footer = lazy(() => import('@/components/Footer'));

export default function Offers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        
        // Filter only products that have a discount or 'sale' tag
        const offerProducts = data.filter(product => {
          const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
          const isSale = product.tag?.toLowerCase() === 'sale' || product.tag?.toLowerCase() === 'offer';
          return hasDiscount || isSale;
        });
        
        setProducts(offerProducts);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        {/* Promotional Banner */}
        <div className="container mx-auto px-4 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-white/30">
                <Percent size={14} /> Limited Time Only
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-tight mb-4 text-white">
                Mega Savings on Daily Essentials
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 font-medium">
                Stock up and save big. Grab these exclusive deals before they are gone!
              </p>
              <Link href="/products">
                <Button variant="secondary" size="lg" className="rounded-full font-bold">
                  Shop All Products <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="relative z-10 flex-shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
              <div className="text-6xl font-black mb-1 text-white">UP TO</div>
              <div className="text-7xl font-black text-yellow-300 drop-shadow-md">50%</div>
              <div className="text-3xl font-black text-white mt-1">OFF</div>
            </div>
          </motion.div>
        </div>

        {/* Offers Grid */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Tag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Today's Best Deals</h2>
              <p className="text-muted-foreground">Handpicked offers just for you</p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Finding the best deals...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-card rounded-3xl border border-border/50">
              <Tag className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No active offers right now</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Check back soon! We update our deals and discounts regularly.
              </p>
              <Link href="/products">
                <Button className="mt-6 rounded-full">Browse All Products</Button>
              </Link>
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
