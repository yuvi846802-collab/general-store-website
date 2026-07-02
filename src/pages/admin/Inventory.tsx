import { useState } from "react";
import { Search, AlertCircle, ArrowUp, ArrowDown, Package, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const mockInventory = Array.from({ length: 15 }).map((_, i) => ({
    id: `INV-00${i + 1}`,
    name: `Grocery Product ${i + 1}`,
    sku: `SKU-${Math.floor(Math.random() * 10000)}`,
    stock: Math.floor(Math.random() * 150),
    reorderLevel: 20,
  }));

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] w-full space-y-6 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">Monitor stock levels and manage reorders in real-time.</p>
        </div>
        <button 
          onClick={() => toast({ title: "Inventory Saved", description: "All stock levels have been updated." })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 border border-primary/20"><Package size={24}/></div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Total Products</p>
              <h4 className="text-2xl font-bold text-foreground">1,245</h4>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center shrink-0 border border-destructive/20"><AlertCircle size={24}/></div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Low Stock</p>
              <h4 className="text-2xl font-bold text-foreground">12</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-lg flex flex-col flex-1 w-full min-h-[55vh] overflow-hidden">
        <div className="p-5 border-b border-border flex items-center bg-muted/20 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by product or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1 w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockInventory.map((item, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id} 
                  className="hover:bg-accent/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">{item.sku}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{item.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      item.stock < item.reorderLevel 
                        ? 'bg-destructive/10 text-destructive border-destructive/20' 
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    }`}>
                      {item.stock < item.reorderLevel ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toast({ title: "Stock Decreased", description: `${item.name} stock reduced by 1.` })}
                        className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-accent hover:text-foreground text-muted-foreground transition-colors shadow-sm"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <input type="number" defaultValue={item.stock} className="w-16 bg-background border border-border rounded-lg text-center py-1.5 text-sm font-semibold focus:outline-none focus:border-primary shadow-sm" />
                      <button 
                        onClick={() => toast({ title: "Stock Increased", description: `${item.name} stock increased by 1.` })}
                        className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-accent hover:text-foreground text-muted-foreground transition-colors shadow-sm"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </div>
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
