import React from 'react';
import { useLocation, useParams } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Package, Truck, Home, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const orderId = params.id || 'ORD-UNKNOWN';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold text-foreground mb-2">Thank You for Your Order!</h1>
        <p className="text-muted-foreground mb-6">Your order has been placed successfully and is being prepared for dispatch.</p>

        <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Order Reference</span>
            <span className="font-mono font-bold text-primary text-sm">{orderId}</span>
          </div>

          <div className="py-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-5 h-5 text-primary shrink-0" />
              <span>Expected Delivery: <strong>Within 24 - 48 Hours</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-primary shrink-0" />
              <span>Status: <strong className="text-amber-500">Pending Confirmation</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setLocation('/')}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>

          <button
            onClick={() => setLocation('/profile')}
            className="w-full sm:w-auto bg-secondary text-secondary-foreground px-8 py-3.5 rounded-xl font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
          >
            View Order History
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
