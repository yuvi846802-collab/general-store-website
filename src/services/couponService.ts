import { eventBus } from '@/lib/eventBus';

export interface Coupon {
  id: string | number;
  code: string;
  discount: string;
  expiry: string;
  usage: string;
  status: 'Active' | 'Expired' | 'Inactive';
  type?: 'percentage' | 'fixed';
  value?: number;
  limit?: string;
}

const STORAGE_KEY = 'admin_coupons_db';

const INITIAL_COUPONS: Coupon[] = [
  { id: 1, code: "WELCOME10", discount: "10% OFF", expiry: "31 Dec 2024", usage: "45 / 100", status: "Active", type: "percentage", value: 10 },
  { id: 2, code: "FESTIVAL50", discount: "₹50 OFF", expiry: "15 Aug 2024", usage: "150 / Unlimited", status: "Active", type: "fixed", value: 50 },
  { id: 3, code: "SUMMER20", discount: "20% OFF", expiry: "01 Jun 2024", usage: "500 / 500", status: "Expired", type: "percentage", value: 20 },
];

export const couponService = {
  getCoupons: (): Coupon[] => {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
        return INITIAL_COUPONS;
      }
      return JSON.parse(dataStr);
    } catch (err) {
      console.error("Error reading coupons from storage", err);
      return INITIAL_COUPONS;
    }
  },

  createCoupon: async (couponData: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expiryDate: string;
    usageLimit: string;
    status: 'Active' | 'Inactive';
  }): Promise<Coupon> => {
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const coupons = couponService.getCoupons();

    // Check duplicate code
    if (coupons.some(c => c.code.toUpperCase() === couponData.code.toUpperCase())) {
      throw new Error(`Coupon code '${couponData.code.toUpperCase()}' already exists.`);
    }

    // Format date nicely if YYYY-MM-DD
    let formattedExpiry = couponData.expiryDate;
    if (couponData.expiryDate.includes('-')) {
      const dateObj = new Date(couponData.expiryDate);
      if (!isNaN(dateObj.getTime())) {
        formattedExpiry = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }

    const formattedDiscount = couponData.discountType === 'percentage'
      ? `${couponData.discountValue}% OFF`
      : `₹${couponData.discountValue} OFF`;

    const formattedLimit = couponData.usageLimit.trim() ? `0 / ${couponData.usageLimit.trim()}` : `0 / Unlimited`;

    const newCoupon: Coupon = {
      id: Date.now(),
      code: couponData.code.toUpperCase(),
      discount: formattedDiscount,
      expiry: formattedExpiry || '31 Dec 2025',
      usage: formattedLimit,
      status: couponData.status,
      type: couponData.discountType,
      value: couponData.discountValue,
    };

    const updated = [newCoupon, ...coupons];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Realtime broadcast
    eventBus.emit('COUPON_UPDATED', newCoupon);
    return newCoupon;
  },

  deleteCoupon: async (id: string | number): Promise<void> => {
    const coupons = couponService.getCoupons();
    const updated = coupons.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    eventBus.emit('COUPON_UPDATED', { id, deleted: true });
  },

  toggleStatus: async (id: string | number): Promise<Coupon | null> => {
    const coupons = couponService.getCoupons();
    const index = coupons.findIndex(c => c.id === id);
    if (index === -1) return null;

    const current = coupons[index];
    const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    coupons[index] = { ...current, status: newStatus };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    eventBus.emit('COUPON_UPDATED', coupons[index]);
    return coupons[index];
  }
};
