import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, Tag, Calendar, Users, AlertCircle, CheckCircle2, DollarSign, Sparkles, Info, Ticket, Pause } from 'lucide-react';
import { couponService } from '@/services/couponService';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CouponModal({ isOpen, onClose, onSuccess }: CouponModalProps) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('10');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('100');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Please enter a coupon code.');
      return;
    }
    if (trimmedCode.length < 3) {
      setError('Coupon code must be at least 3 characters.');
      return;
    }
    const numValue = parseFloat(discountValue);
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid discount value greater than 0.');
      return;
    }
    if (discountType === 'percentage' && numValue > 100) {
      setError('Percentage discount cannot exceed 100%.');
      return;
    }
    if (!expiryDate) {
      setError('Please select an expiry date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await couponService.createCoupon({
        code: trimmedCode,
        discountType,
        discountValue: numValue,
        expiryDate,
        usageLimit,
        status
      });

      // Reset fields
      setCode('');
      setDiscountValue('10');
      setExpiryDate('');
      setUsageLimit('100');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateRandom = () => {
    const prefixes = ['WELCOME', 'SUMMER', 'FESTIVAL', 'SAVE', 'MEGA', 'SPECIAL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(Math.random() * 80 + 10);
    setCode(`${prefix}${num}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSubmitting && onClose()}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Scrollable Wrapper that never cuts off top or bottom */}
        <div className="relative min-h-full flex items-center justify-center p-4 sm:p-6 md:py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-4xl max-h-[88vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-8 sm:px-10 py-5 border-b border-border bg-muted/20 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-500/20 shadow-xs">
                  <Percent size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">Create New Coupon</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Set promo codes, discount rates, and usage limits.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2.5 border border-border rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 sm:p-8 sm:px-10 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-2xl flex items-center gap-3 font-medium">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Coupon Code & Generator */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Coupon Code <span className="text-destructive">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Tag size={18} className="absolute left-4 text-muted-foreground pointer-events-none -rotate-45" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      maxLength={20}
                      required
                      className="w-full pl-12 pr-36 py-3 bg-background border border-border rounded-2xl text-base font-mono font-bold tracking-wider uppercase text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateRandom}
                      className="absolute right-2 text-sm font-bold px-3.5 py-1.5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Sparkles size={15} className="text-emerald-500" /> Generate
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Unique code customers will use at checkout.</p>
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Discount Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                          discountType === 'percentage'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'bg-background border-border text-muted-foreground hover:border-emerald-500/50 hover:text-foreground'
                        }`}
                      >
                        <Percent size={16} /> Percentage
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                          discountType === 'fixed'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'bg-background border-border text-muted-foreground hover:border-emerald-500/50 hover:text-foreground'
                        }`}
                      >
                        <span className="font-sans text-base">₹</span> Fixed Amount
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Discount Value <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="10"
                        min="1"
                        max={discountType === 'percentage' ? '100' : '100000'}
                        required
                        className="w-full pl-4 pr-16 py-3 bg-background border border-border rounded-2xl text-base font-bold text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                      />
                      <div className="absolute right-2.5 px-3 py-1 bg-muted/70 rounded-xl font-bold text-muted-foreground text-sm">
                        {discountType === 'percentage' ? '%' : '₹'}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {discountType === 'percentage' ? 'Enter a value between 1 and 100.' : 'Enter fixed discount amount in INR.'}
                    </p>
                  </div>
                </div>

                {/* Expiry Date & Usage Limit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Expiry Date <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Calendar size={18} className="absolute left-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl text-sm font-medium text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Coupon will expire on this date.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Usage Limit
                    </label>
                    <div className="relative flex items-center">
                      <Users size={18} className="absolute left-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        placeholder="100"
                        className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl text-sm font-medium text-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Maximum number of times this coupon can be used.</p>
                  </div>
                </div>

                {/* Initial Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Initial Status
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setStatus('Active')}
                      className={`p-4 border rounded-2xl flex items-start gap-3.5 transition-all cursor-pointer ${
                        status === 'Active'
                          ? 'border-emerald-500 bg-emerald-500/5 text-foreground ring-1 ring-emerald-500/50 shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${status === 'Active' ? 'border-emerald-500' : 'border-muted-foreground'}`}>
                          {status === 'Active' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 size={16} />
                          </div>
                          <span className={`text-sm font-bold ${status === 'Active' ? 'text-foreground' : 'text-muted-foreground'}`}>Active</span>
                          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          Coupon is live and ready to be used by customers.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setStatus('Inactive')}
                      className={`p-4 border rounded-2xl flex items-start gap-3.5 transition-all cursor-pointer ${
                        status === 'Inactive'
                          ? 'border-amber-500 bg-amber-500/5 text-foreground ring-1 ring-amber-500/50 shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:border-amber-500/40'
                      }`}
                    >
                      <div className="pt-0.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${status === 'Inactive' ? 'border-amber-500' : 'border-muted-foreground'}`}>
                          {status === 'Inactive' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            <Pause size={16} />
                          </div>
                          <span className={`text-sm font-bold ${status === 'Inactive' ? 'text-foreground' : 'text-muted-foreground'}`}>Inactive</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          Coupon is hidden and cannot be used.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note Banner */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 text-sm text-foreground">
                  <Info size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-emerald-600 dark:text-emerald-400">Note:</strong> Customers can only use <strong className="text-emerald-600 dark:text-emerald-400 underline decoration-2">one</strong> coupon per order.
                  </span>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="px-8 sm:px-10 py-4 bg-muted/20 border-t border-border flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-accent text-foreground text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <Ticket size={16} /> {isSubmitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
