import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Save, UploadCloud, Trash2, X, Plus, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCategories, ProductFormData } from "@/services/api";
import { productService } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";

export default function AdminProductEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "", // Will be set automatically when categories load
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    barcode: "",
    tag: "",
    status: "active",
    isPopular: false,
    image: ""
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch real categories
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['public-categories'],
    queryFn: fetchPublicCategories,
    refetchInterval: 2000
  });

  // Automatically set first category as default if none selected
  useEffect(() => {
    if (formData.category === "" && dbCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: dbCategories[0].name }));
    }
  }, [dbCategories, formData.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a JPG, PNG, WebP, GIF or SVG image.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, image: base64 }));
      setIsUploadingImage(false);
      toast({ title: "Image ready", description: "Image loaded successfully. Save the product to confirm." });
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
      toast({ title: "Failed to read image", variant: "destructive" });
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name?.toString().trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }
    if (!formData.price?.toString().trim() || isNaN(Number(formData.price))) {
      toast({ title: "Valid price is required", variant: "destructive" });
      return;
    }
    if (!formData.category?.toString().trim()) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description || '',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        stock: formData.stock ? Number(formData.stock) : 0,
        sku: (formData as any).sku || undefined,
        barcode: (formData as any).barcode || undefined,
        tag: (formData as any).tag || undefined,
        status: (formData as any).status || 'active',
        isPopular: (formData as any).isPopular || false,
        image: formData.image || undefined,
      };

      await productService.createProduct(payload as any);

      // Real-time: emit event so Products list refreshes instantly
      import('@/lib/eventBus').then(({ eventBus }) => {
        eventBus.emit('ENTITY_CREATED', { entity: 'product' });
      }).catch(() => {});

      toast({ title: "✅ Product saved!", description: `"${formData.name}" has been added to your store.` });
      setLocation("/admin/products");
    } catch (error: any) {
      console.error('Save product error:', error);
      toast({
        title: "Failed to save product",
        description: error?.message || "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "general", label: "General Information" },
    { id: "pricing", label: "Pricing & Inventory" },
    { id: "media", label: "Media & Images" },
    { id: "seo", label: "SEO Settings" },
    { id: "variants", label: "Variants" },
  ];

  return (
    <div className="pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 mb-6">
        {/* Full Bleed Background */}
        <div className="absolute top-0 bottom-0 -left-[100vw] -right-[100vw] bg-background border-b border-border shadow-[0_4px_20px_rgba(15,23,42,.06)] pointer-events-none" />
        
        {/* Header Content */}
        <div className="relative h-auto sm:h-[72px] min-h-[72px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation("/admin/products")}
              className="w-10 h-10 flex items-center justify-center border border-border bg-card hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h1 className="text-[28px] font-bold text-foreground leading-none">Add New Product</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 w-fit">Draft</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setLocation("/admin/products")} className="flex-1 sm:flex-none h-10 px-5 bg-card hover:bg-accent border border-border text-foreground font-semibold rounded-[14px] text-sm transition-colors">
              Discard
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none h-10 px-5 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[14px] text-sm shadow-md shadow-primary/20 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> Saving...</>
              ) : (
                <><Save size={16} /> Save Product</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Content Form */}
        <div className="w-full lg:flex-1 space-y-6">
          
          {/* General Information */}
          <motion.section id="general" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-background border border-border rounded-[20px] p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h2 className="text-[22px] font-bold text-foreground mb-6">General Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Basmati Rice" className="w-full h-14 bg-background border border-border rounded-[14px] px-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <div className="border border-border rounded-[14px] overflow-hidden bg-background">
                  <div className="bg-muted/30 border-b border-border px-4 py-2 flex gap-2">
                    {/* Mock Rich Text Toolbar */}
                    {['B', 'I', 'U'].map(format => (
                      <button type="button" key={format} className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-sm font-bold text-muted-foreground hover:text-foreground">{format}</button>
                    ))}
                  </div>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your product..." className="w-full bg-transparent p-4 text-base placeholder:text-[15px] text-foreground focus:outline-none resize-y min-h-[180px]"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full h-14 bg-background border border-border rounded-[14px] px-4 text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    {dbCategories.length === 0 ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      dbCategories.map((cat: any) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Tag / Badge</label>
                  <input type="text" name="tag" value={(formData as any).tag} onChange={handleChange} placeholder="e.g. Bestseller, New" className="w-full h-14 bg-background border border-border rounded-[14px] px-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Pricing & Inventory */}
          <motion.section id="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-background border border-border rounded-[20px] p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h2 className="text-[22px] font-bold text-foreground mb-6">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Regular Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full h-14 bg-background border border-border rounded-[14px] pl-8 pr-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">Compare at Price <Info size={14} className="text-muted-foreground"/></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="0.00" className="w-full h-14 bg-background border border-border rounded-[14px] pl-8 pr-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">SKU (Stock Keeping Unit)</label>
                <input type="text" name="sku" value={(formData as any).sku} onChange={handleChange} placeholder="e.g. GRO-RICE-001" className="w-full h-14 bg-background border border-border rounded-[14px] px-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary font-mono uppercase" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Barcode (ISBN, UPC, GTIN, etc.)</label>
                <input type="text" name="barcode" value={(formData as any).barcode} onChange={handleChange} placeholder="0123456789012" className="w-full h-14 bg-background border border-border rounded-[14px] px-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary font-mono" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="w-full h-14 bg-background border border-border rounded-[14px] px-4 text-base placeholder:text-[15px] focus:outline-none focus:border-primary" />
              </div>
            </div>
          </motion.section>

          {/* Media & Images */}
          <motion.section id="media" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-background border border-border rounded-[20px] p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h2 className="text-[22px] font-bold text-foreground mb-6">Media</h2>

            {/* Hidden file input */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
            />

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-[20px] transition-all cursor-pointer group relative min-h-[220px] flex flex-col items-center justify-center text-center p-8 ${
                isUploadingImage
                  ? 'border-primary/60 bg-primary/5 cursor-wait'
                  : formData.image
                  ? 'border-emerald-400/60 bg-emerald-50/30 dark:bg-emerald-900/10'
                  : 'border-border hover:border-primary/50 bg-accent/20 hover:bg-primary/5'
              }`}
              onClick={() => !isUploadingImage && imageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                const file = e.dataTransfer.files?.[0];
                if (file && imageInputRef.current) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  imageInputRef.current.files = dt.files;
                  imageInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
            >
              {isUploadingImage ? (
                <>
                  <div className="w-16 h-16 bg-background rounded-full border border-primary/30 flex items-center justify-center mb-4 shadow-md">
                    <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-base font-semibold text-primary">Loading image...</p>
                  <p className="text-sm text-muted-foreground mt-1">Please wait</p>
                </>
              ) : formData.image ? (
                <div className="relative w-full flex flex-col items-center gap-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-44 max-w-full object-contain rounded-xl shadow-md border border-border"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: '' })); if(imageInputRef.current) imageInputRef.current.value=''; }}
                      className="absolute -top-3 -right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Image ready — click to change
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-background rounded-full border border-border flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:border-primary/30 transition-all shadow-sm">
                    <UploadCloud size={28} className="text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">Click to upload or drag and drop</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">SVG, PNG, JPG, WebP or GIF · max 10MB</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Recommended: 800×400px or square</p>
                </>
              )}
            </div>
          </motion.section>

        </div>

        {/* Right Sidebar - Nav & Meta */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-[88px]">
          
          {/* Quick Navigation */}
          <div className="bg-background border border-border rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hidden lg:block">
            <h3 className="text-[14px] font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-2">Form Navigation</h3>
            <div className="flex flex-col gap-2">
              {sections.map(sec => (
                <button 
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`text-left px-4 py-3 rounded-[14px] text-sm font-medium transition-colors ${
                    activeSection === sec.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Visibility */}
          <div className="bg-background border border-border rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-[22px] font-bold text-foreground mb-6">Visibility</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="radio" name="status" value="active" checked={(formData as any).status === 'active'} onChange={handleChange} className="mt-1 w-5 h-5 text-primary bg-background border-border focus:ring-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Published</p>
                  <p className="text-[14px] text-muted-foreground mt-1">Product is visible on the store.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="radio" name="status" value="hidden" checked={(formData as any).status === 'hidden'} onChange={handleChange} className="mt-1 w-5 h-5 text-primary bg-background border-border focus:ring-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Hidden</p>
                  <p className="text-[14px] text-muted-foreground mt-1">Product is hidden from customers.</p>
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
