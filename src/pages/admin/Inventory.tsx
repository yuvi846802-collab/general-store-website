import { useState, useCallback, useEffect } from "react";
import { Search, RefreshCw, AlertTriangle, Package, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, refreshInventory } from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { useInventorySocket } from "@/hooks/useInventorySocket";
import { toast } from "sonner";

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [refreshState, setRefreshState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const queryClient = useQueryClient();

  // Socket.IO real-time updates
  useInventorySocket(useCallback(() => {
    // When a socket event is received, invalidate query silently to update in background
    queryClient.invalidateQueries({ queryKey: ["adminInventory"] });
  }, [queryClient]));

  const { data: products = [], isLoading: isFetchingProducts, isError } = useQuery({
    queryKey: ["adminInventory"],
    queryFn: fetchProducts,
    // Real-time interval is removed because we use Socket.IO now
  });

  const refreshMutation = useMutation({
    mutationFn: refreshInventory,
    onMutate: () => {
      setRefreshState('loading');
    },
    onSuccess: (data) => {
      setRefreshState('success');
      // Update cache instantly with fresh products from our dedicated API
      if (data?.data?.products) {
        queryClient.setQueryData(["adminInventory"], data.data.products);
      }
      toast.success("Inventory Updated Successfully", {
        icon: <CheckCircle className="text-emerald-500" size={18} />
      });
      setTimeout(() => setRefreshState('idle'), 2000);
    },
    onError: (error: any) => {
      setRefreshState('error');
      toast.error(error.message || "Failed to refresh inventory. Please try again.", {
        icon: <XCircle className="text-destructive" size={18} />,
        action: {
          label: 'Retry',
          onClick: () => refreshMutation.mutate()
        }
      });
      setTimeout(() => setRefreshState('idle'), 3000);
    }
  });

  const handleRefresh = () => {
    if (refreshState === 'loading') return; // Prevent spam clicks
    refreshMutation.mutate();
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === "LOW") return matchesSearch && p.stock < 10 && p.stock > 0;
    if (filterType === "OUT") return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  // Calculate stats manually to always sync with frontend state (can also use data.stats)
  const totalCount = products.length;
  const lowStockCount = products.filter((p: any) => p.stock < 10 && p.stock > 0).length;
  const outOfStockCount = products.filter((p: any) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Monitor</h1>
          <p className="text-sm text-muted-foreground">Live stock monitoring and inventory tracking across all store categories.</p>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshState === 'loading'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
            refreshState === 'loading' ? 'bg-secondary text-secondary-foreground opacity-70 cursor-not-allowed' :
            refreshState === 'success' ? 'bg-emerald-500 text-white' :
            refreshState === 'error' ? 'bg-destructive text-white' :
            'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {refreshState === 'loading' ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : refreshState === 'success' ? (
            <>
              <CheckCircle size={16} />
              <span>Updated</span>
            </>
          ) : refreshState === 'error' ? (
            <>
              <AlertTriangle size={16} />
              <span>Failed</span>
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              <span>Refresh Stock</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
          </div>
          <Package className="w-8 h-8 text-primary opacity-80" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Low Stock Alert</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{lowStockCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive mt-1">{outOfStockCount}</p>
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
              All Items ({totalCount})
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

        {refreshState === 'loading' && (
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-full"></div>
          </div>
        )}

        <div className="overflow-x-auto relative">
          <table className={`w-full text-left border-collapse transition-opacity duration-300 ${refreshState === 'loading' ? 'opacity-50' : 'opacity-100'}`}>
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
              {isFetchingProducts && !products.length ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="w-32 h-6 bg-secondary animate-pulse rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-24 h-6 bg-secondary animate-pulse rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-16 h-6 bg-secondary animate-pulse rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-16 h-6 bg-secondary animate-pulse rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-20 h-6 bg-secondary animate-pulse rounded"></div></td>
                  </tr>
                ))
              ) : isError ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-destructive">Failed to load inventory. Please try again.</td></tr>
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
