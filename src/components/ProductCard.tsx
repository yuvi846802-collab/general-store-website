import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { Product } from '@/services/productService';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    // Cast to any to bypass strict type matching if Product from productService and types differ slightly
    addItem(product as any);
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.tag && (
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm capitalize">
            {product.tag}
          </span>
        )}
      </div>
      
      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100">
        <Heart size={16} />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center p-4">
        <img 
          src={getImageUrl(product.image) || '/placeholder.png'} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.png';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">
          {product.category || 'Category'}
        </div>
        
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors flex-1">
          {product.name}
        </h3>
        
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
          <div>
            <div className="text-lg sm:text-xl font-bold font-heading text-primary leading-none">
              ₹{product.price}
            </div>
            {hasDiscount && (
              <div className="text-sm text-muted-foreground line-through mt-1">
                ₹{product.originalPrice}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="icon"
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
