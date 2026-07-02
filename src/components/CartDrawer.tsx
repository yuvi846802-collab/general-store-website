import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { Link } from 'wouter';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem } = useCartStore();

  const totalAmount = items.reduce((total, item) => {
    // Assuming price is a string like "₹150.00" or a number
    const priceStr = String(item.product.price).replace(/[^0-9.]/g, '');
    const price = parseFloat(priceStr) || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-[101] flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-primary" size={24} />
                <h2 className="text-xl font-bold font-heading">Your Cart</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <Button onClick={() => setIsOpen(false)} variant="outline" className="mt-4">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl border border-border bg-card shadow-sm relative group">
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                      <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm line-clamp-2 leading-tight">{item.product.name}</h4>
                        <div className="font-bold text-primary mt-1">{item.product.price}</div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-muted rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-background text-muted-foreground hover:text-foreground shadow-sm transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-background text-muted-foreground hover:text-foreground shadow-sm transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Delivery</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                    Checkout Securely
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
