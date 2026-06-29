import { useState } from "react";
import { Plus, Search, Tag, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminCoupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const mockCoupons = [
    { id: 1, code: "WELCOME10", discount: "10% OFF", expiry: "31 Dec 2024", usage: "45 / 100", status: "Active" },
    { id: 2, code: "FESTIVAL50", discount: "₹50 OFF", expiry: "15 Aug 2024", usage: "150 / Unlimited", status: "Active" },
    { id: 3, code: "SUMMER20", discount: "20% OFF", expiry: "01 Jun 2024", usage: "500 / 500", status: "Expired" },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Discount Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage promotional codes and discounts.</p>
        </div>
        <button 
          onClick={() => toast({ title: "Create Coupon", description: "Opening coupon creation form..." })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-border bg-muted/20 rounded-t-2xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search coupon codes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {mockCoupons.map((coupon, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={coupon.id} 
                  className="hover:bg-accent/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-primary" />
                      <span className="font-mono font-bold text-foreground text-base tracking-wider bg-accent/50 px-2 py-0.5 rounded-md border border-border">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{coupon.discount}</td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{coupon.expiry}</td>
                  <td className="px-6 py-4 text-foreground">{coupon.usage}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      coupon.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toast({ title: "Edit Coupon", description: `Editing settings for ${coupon.code}` })}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
