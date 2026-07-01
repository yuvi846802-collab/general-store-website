import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Save, UploadCloud, Trash2, X, Plus, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { createProduct, fetchPublicCategories, ProductFormData } from "@/services/api";
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
    isPopular: false,
    image: ""
  });

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
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast({ title: "Validation Error", description: "Name and Price are required.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct(formData);
      toast({ title: "Success", description: "Product created successfully!" });
      setLocation("/admin/products");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save product", variant: "destructive" });
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
    <div className="pb-24">
      {/* Sticky Header */}
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-xl border-b border-border -mx-4 sm:-mx-8 -mt-4 sm:-mt-8 px-4 sm:px-8 py-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLocation("/admin/products")}
            className="p-2 border border-border bg-card hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
              Add New Product
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">Draft</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => setLocation("/admin/products")} className="flex-1 sm:flex-none px-5 py-2.5 bg-card hover:bg-accent border border-border text-foreground font-semibold rounded-xl text-sm transition-colors">
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm shadow-md shadow-primary/20 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> Saving...</>
            ) : (
              <><Save size={16} /> Save Product</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Main Content Form */}
        <div className="w-full lg:flex-1 space-y-8">
          
          {/* General Information */}
          <motion.section id="general" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">General Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Basmati Rice" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <div className="border border-border rounded-xl overflow-hidden bg-background">
                  <div className="bg-muted/30 border-b border-border px-4 py-2 flex gap-2">
                    {/* Mock Rich Text Toolbar */}
                    {['B', 'I', 'U'].map(format => (
                      <button key={format} className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-sm font-bold text-muted-foreground hover:text-foreground">{format}</button>
                    ))}
                  </div>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Describe your product..." className="w-full bg-transparent p-4 text-sm text-foreground focus:outline-none resize-y min-h-[120px]"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
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
                  <input type="text" placeholder="e.g. Bestseller, New" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Pricing & Inventory */}
          <motion.section id="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Regular Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">Compare at Price <Info size={14} className="text-muted-foreground"/></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="0.00" className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">SKU (Stock Keeping Unit)</label>
                <input type="text" placeholder="e.g. GRO-RICE-001" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-sm uppercase" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Barcode (ISBN, UPC, GTIN, etc.)</label>
                <input type="text" placeholder="0123456789012" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary" />
              </div>
            </div>
          </motion.section>

          {/* Media & Images */}
          <motion.section id="media" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">Media</h2>
            <div 
              className="border-2 border-dashed border-border hover:border-primary/50 bg-accent/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group relative"
              onClick={() => imageInputRef.current?.click()}
            >
              <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
              {formData.image ? (
                <div className="relative w-full flex justify-center">
                  <img src={formData.image} alt="Preview" className="h-40 object-contain rounded-lg shadow-sm" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFormData(prev => ({...prev, image: ""})); }} className="absolute -top-3 -right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-sm"><X size={14}/></button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-background rounded-full border border-border flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:border-primary/30 transition-all shadow-sm">
                    <UploadCloud size={28} className="text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">Click to upload or drag and drop</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
            </div>
          </motion.section>

        </div>

        {/* Right Sidebar - Nav & Meta */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-40">
          
          {/* Quick Navigation */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hidden lg:block">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">Form Navigation</h3>
            <div className="flex flex-col gap-1">
              {sections.map(sec => (
                <button 
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === sec.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Visibility */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Visibility</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="radio" name="status" defaultChecked className="mt-0.5 w-4 h-4 text-primary bg-background border-border focus:ring-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Published</p>
                  <p className="text-xs text-muted-foreground">Product is visible on the store.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="radio" name="status" className="mt-0.5 w-4 h-4 text-primary bg-background border-border focus:ring-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Hidden</p>
                  <p className="text-xs text-muted-foreground">Product is hidden from customers.</p>
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
