import { useState, useEffect } from "react";
import { Plus, Search, Tag, MoreHorizontal, Trash2, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { couponService, Coupon } from "@/services/couponService";
import CouponModal from "@/components/admin/CouponModal";
import { eventBus } from "@/lib/eventBus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchCoupons = () => {
    const data = couponService.getCoupons();
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();

    const handleUpdate = () => {
      fetchCoupons();
    };

    eventBus.on('COUPON_UPDATED', handleUpdate);
    return () => {
      eventBus.off('COUPON_UPDATED', handleUpdate);
    };
  }, []);

  const handleDelete = async (id: string | number, code: string) => {
    if (confirm(`Are you sure you want to delete coupon '${code}'?`)) {
      await couponService.deleteCoupon(id);
      toast({ title: "Coupon Deleted", description: `Coupon ${code} has been removed.` });
      fetchCoupons();
    }
  };

  const handleToggleStatus = async (id: string | number, code: string) => {
    const updated = await couponService.toggleStatus(id);
    if (updated) {
      toast({
        title: "Status Updated",
        description: `Coupon ${code} is now ${updated.status}.`,
      });
      fetchCoupons();
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `Coupon code '${code}' copied to clipboard.` });
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.discount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] w-full space-y-6 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Discount Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage promotional codes and discounts in real-time.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-lg flex flex-col flex-1 w-full min-h-[75vh] overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between gap-4 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search coupon codes or discount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-background px-3.5 py-2 rounded-xl border border-border shadow-2xs hidden sm:inline-block">
            {filteredCoupons.length} {filteredCoupons.length === 1 ? 'Coupon' : 'Coupons'}
          </span>
        </div>

        <div className="overflow-x-auto flex-1 w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Usage Limits</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No coupons found. Click <span className="font-bold text-primary">Create Coupon</span> to add one.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={coupon.id} 
                    className="hover:bg-accent/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Tag size={16} className="text-primary shrink-0" />
                        <span 
                          onClick={() => handleCopyCode(coupon.code)}
                          className="font-mono font-bold text-foreground text-base tracking-wider bg-accent/60 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-border cursor-pointer flex items-center gap-1.5 transition-colors group/code"
                          title="Click to copy code"
                        >
                          {coupon.code}
                          <Copy size={12} className="opacity-0 group-hover/code:opacity-100 text-muted-foreground transition-opacity" />
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-base">{coupon.discount}</td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{coupon.expiry}</td>
                    <td className="px-6 py-4 text-foreground font-medium">{coupon.usage}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                        coupon.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : coupon.status === 'Expired'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${coupon.status === 'Active' ? 'bg-emerald-500' : coupon.status === 'Expired' ? 'bg-destructive' : 'bg-amber-500'}`} />
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-border">
                          <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleCopyCode(coupon.code)} className="cursor-pointer gap-2 font-medium">
                            <Copy size={14} /> Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(coupon.id, coupon.code)} className="cursor-pointer gap-2 font-medium">
                            {coupon.status === 'Active' ? <AlertCircle size={14} className="text-amber-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
                            {coupon.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(coupon.id, coupon.code)} className="cursor-pointer gap-2 font-medium text-destructive focus:text-destructive">
                            <Trash2 size={14} /> Delete Coupon
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          toast({ title: "Coupon Created!", description: "New promo code is now active and ready." });
          fetchCoupons();
        }}
      />
    </div>
  );
}
