import { useState } from "react";
import { Search, RefreshCw, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import { getImageUrl } from "@/lib/utils";

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["adminInventory"],
    queryFn: fetchProducts,
  });

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === "LOW") return matchesSearch && p.stock < 10 && p.stock > 0;
    if (filterType === "OUT") return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Monitor</h1>
          <p className="text-sm text-muted-foreground">Live stock monitoring and inventory tracking across all store categories.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm"
        >
          <RefreshCw size={15} />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Total SKU Count</p>
            <p className="text-2xl font-bold text-foreground mt-1">{products.length}</p>
          </div>
          <Package className="w-8 h-8 text-primary opacity-80" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Low Stock Alert</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{products.filter((p: any) => p.stock < 10 && p.stock > 0).length}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive mt-1">{products.filter((p: any) => p.stock === 0).length}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-destructive opacity-80" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search product stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === "ALL" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setFilterType("LOW")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === "LOW" ? "bg-amber-500 text-white shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType("OUT")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === "OUT" ? "bg-destructive text-white shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              Out of Stock
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Quantity</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground animate-pulse">Loading inventory...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No matching products found.</td></tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={getImageUrl(product.image)} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-secondary" />
                      <span className="font-semibold text-foreground text-sm">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{product.category?.name || "General"}</td>
                    <td className="px-6 py-4 font-medium text-foreground text-sm">₹{product.price}</td>
                    <td className="px-6 py-4 font-mono font-bold text-base text-foreground">{product.stock} units</td>
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">Out of Stock</span>
                      ) : product.stock < 10 ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">Low Stock</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
