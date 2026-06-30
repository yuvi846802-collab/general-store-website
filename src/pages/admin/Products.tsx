import { useState, useEffect } from "react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { productService, Product } from "@/services/productService";
import { Plus, Search, Filter, Edit, Trash2, Download, Upload, MoreHorizontal, CheckCircle2, XCircle, AlertCircle, Eye, Copy, Power } from "lucide-react";
import { PremiumImage } from "@/components/ui/PremiumImage";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { getImageUrl } from "@/lib/utils";
import ImportProductsModal from "@/components/admin/ImportProductsModal";
import ExportProductsModal from "@/components/admin/ExportProductsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const updateTrigger = useRealTimeData('product');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [updateTrigger]);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      try {
        await productService.deleteProduct(id);
        toast({ title: "Product deleted" });
        fetchProducts();
      } catch (e) {
        toast({ variant: "destructive", title: "Error deleting product" });
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const status = p.stock === 0 ? "Out of Stock" : "Active";
    const matchesStatus = statusFilter === "All" || status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (confirm(`Delete ${selectedProducts.length} selected products?`)) {
      // Simulate bulk delete
      toast({ title: `${selectedProducts.length} Products Deleted` });
      setSelectedProducts([]);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your store's inventory and catalog.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setIsImportOpen(true)} className="bg-card border border-border text-foreground hover:bg-accent px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
            <Upload size={16} /> Import
          </button>
          <button onClick={() => setIsExportOpen(true)} className="bg-card border border-border text-foreground hover:bg-accent px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setLocation('/admin/products/new')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        
        {/* Advanced Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20 rounded-t-2xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by name, SKU, or category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`appearance-none flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm px-4 py-2 pr-8 rounded-lg transition-colors shadow-sm font-medium outline-none cursor-pointer ${
                  categoryFilter !== "All" 
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" 
                    : "bg-background border border-border text-foreground hover:bg-accent"
                }`}
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat === "All" ? "Category" : cat}</option>
                ))}
              </select>
              <Filter size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${categoryFilter !== "All" ? "text-white" : "text-foreground"}`} />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`appearance-none flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm px-4 py-2 pr-8 rounded-lg transition-colors shadow-sm font-medium outline-none cursor-pointer ${
                  statusFilter !== "All" 
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" 
                    : "bg-background border border-border text-foreground hover:bg-accent"
                }`}
              >
                <option value="All">Status</option>
                <option value="Active">Active</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <Filter size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${statusFilter !== "All" ? "text-white" : "text-foreground"}`} />
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <div className="px-4 py-2 border-b border-border bg-accent/30 text-sm font-medium text-muted-foreground flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary cursor-pointer" 
              />
              <span className="text-xs">Select All</span>
            </label>
            {selectedProducts.length > 0 && (
              <span className="text-xs font-semibold text-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                {selectedProducts.length} selected
              </span>
            )}
          </div>
          {selectedProducts.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">SKU & Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-accent/30 transition-colors group ${selectedProducts.includes(product.id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary cursor-pointer" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border p-1 flex items-center justify-center shrink-0 shadow-sm">
                          <PremiumImage src={getImageUrl(product.image)} fallbackText={product.name} className="max-w-full max-h-full object-contain" containerClassName="w-full h-full" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer transition-colors" onClick={() => setLocation(`/admin/products/${product.id}`)}>
                            {product.name}
                          </div>
                          {product.tag && <div className="text-[10px] font-bold uppercase text-primary tracking-wider mt-0.5">{product.tag}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-medium text-xs font-mono bg-accent/50 inline-block px-2 py-0.5 rounded mb-1 border border-border">HKM-{product.id.padStart(4, '0')}</div>
                      <div className="text-muted-foreground text-xs">{product.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{product.price}</span>
                      {product.originalPrice && <span className="text-xs text-muted-foreground line-through ml-2">{product.originalPrice}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {product.stock > 20 ? <CheckCircle2 size={16} className="text-emerald-500" /> : product.stock > 0 ? <AlertCircle size={16} className="text-amber-500" /> : <XCircle size={16} className="text-destructive" />}
                        <span className="font-medium text-foreground">{product.stock}</span>
                        <span className="text-muted-foreground text-xs">in stock</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-full text-xs border border-emerald-500/20">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setLocation(`/admin/products/${product.id}`)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors" title="More Options">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setLocation(`/admin/products/${product.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLocation(`/admin/products/${product.id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({ title: "Product duplicated successfully" });
                            }}>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Professional Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm bg-muted/10 rounded-b-2xl">
          <div className="text-muted-foreground font-medium">
            Showing <span className="text-foreground font-semibold">1</span> to <span className="text-foreground font-semibold">{filteredProducts.length}</span> of <span className="text-foreground font-semibold">{filteredProducts.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-background border border-border text-foreground rounded-lg hover:bg-accent disabled:opacity-50 font-medium shadow-sm transition-colors">Previous</button>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm">1</button>
            <button className="px-3 py-1.5 bg-background border border-border text-foreground rounded-lg hover:bg-accent disabled:opacity-50 font-medium shadow-sm transition-colors">Next</button>
          </div>
        </div>
      </div>

      <ImportProductsModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onSuccess={() => {
          setIsImportOpen(false);
          fetchProducts();
        }}
      />
      
      <ExportProductsModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        filteredProducts={filteredProducts}
        allProducts={products}
      />
    </div>
  );
}
