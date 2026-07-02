import React, { useState } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/utils';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: 'Bareilly',
    pincode: '243001',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to your cart before proceeding to checkout.',
        variant: 'destructive',
      });
      return;
    }

    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out your full name, phone number, and delivery address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        shippingAddress: `${shippingDetails.fullName}, ${shippingDetails.phone}, ${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pincode}. Notes: ${shippingDetails.notes}`,
        paymentMethod,
      };

      if (isAuthenticated && token) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || errData.message || 'Failed to place order');
        }

        const data = await response.json();
        clearCart();
        toast({
          title: 'Order Placed Successfully! 🎉',
          description: `Your order #${data.order.id.slice(0, 8)} has been confirmed.`,
        });
        setLocation(`/order-success/${data.order.id}`);
      } else {
        // Guest simulated order placement
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const fakeId = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        clearCart();
        toast({
          title: 'Order Placed Successfully! 🎉',
          description: `Thank you for shopping at Hakeem Store. Order ID: ${fakeId}`,
        });
        setLocation(`/order-success/${fakeId}`);
      }
    } catch (error: any) {
      toast({
        title: 'Checkout Error',
        description: error.message || 'Something went wrong while processing your order.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-secondary/60 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">You need to add products to your shopping bag before you can checkout.</p>
          <button
            onClick={() => setLocation('/')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <button
          onClick={() => setLocation('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 mb-6">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                Delivery Details
              </h2>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={shippingDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Complete Delivery Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    placeholder="House No., Street Name, Landmark"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">City / Town</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingDetails.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Delivery Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={shippingDetails.notes}
                    onChange={handleInputChange}
                    placeholder="E.g., Call upon arrival, leave at door"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 mb-6">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'COD' ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <Banknote className={`w-6 h-6 mb-2 ${paymentMethod === 'COD' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-semibold text-sm">Cash on Delivery</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Pay at your doorstep</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'UPI' ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <ShieldCheck className={`w-6 h-6 mb-2 ${paymentMethod === 'UPI' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-semibold text-sm">UPI Instant Pay</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">GPay, PhonePe, Paytm</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'CARD' ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'CARD' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-semibold text-sm">Cards / Netbanking</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-secondary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-foreground">{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-border">
                  <span>Grand Total</span>
                  <span className="text-primary text-xl">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Place Order Securely (₹{totalAmount.toFixed(2)})
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted & 100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
