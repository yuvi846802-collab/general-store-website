import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Save, X, ImagePlus, Tag, Link2, AlignLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { categoryService } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { eventBus } from "@/lib/eventBus";

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "active" | "inactive";
}

const DEFAULT_FORM: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "active",
};

export default function AdminCategoryEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CategoryFormValues>(DEFAULT_FORM);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CategoryFormValues, string>>>({});
  const [descCount, setDescCount] = useState(0);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData(prev => ({ ...prev, name: value, slug }));
    if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: undefined }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 500) return;
    setFormData(prev => ({ ...prev, description: value }));
    setDescCount(value.length);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      toast({ title: "Image ready", description: "Image loaded successfully. Save to confirm." });
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
      toast({ title: "Failed to read image", variant: "destructive" });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CategoryFormValues, string>> = {};
    if (!formData.name.trim()) errs.name = "Category name is required";
    else if (formData.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!formData.slug.trim()) errs.slug = "Slug is required";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast({ title: "Validation Error", description: "Please check the highlighted fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await categoryService.createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        image: formData.image,
        status: formData.status,
      } as any);
      
      eventBus.emit('ENTITY_CREATED', { entity: 'category' });

      toast({ title: "✅ Category saved!", description: `"${formData.name}" has been added to your catalog.` });
      setLocation("/admin/categories");
    } catch (error: any) {
      console.error('Save category error:', error);
      toast({
        title: "Failed to save category",
        description: error?.message || "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "general", label: "General Information" },
    { id: "media", label: "Media & Images" },
    { id: "visibility", label: "Visibility" },
  ];

  return (
    <div className="pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 mb-6">
        <div className="absolute top-0 bottom-0 -left-[100vw] -right-[100vw] bg-background border-b border-border shadow-[0_4px_20px_rgba(15,23,42,.06)] pointer-events-none" />
        
        <div className="relative h-auto sm:h-[72px] min-h-[72px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation("/admin/categories")}
              className="w-10 h-10 flex items-center justify-center border border-border bg-card hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h1 className="text-[28px] font-bold text-foreground leading-none">Add New Category</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 w-fit">Draft</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setLocation("/admin/categories")} className="flex-1 sm:flex-none h-10 px-5 bg-card hover:bg-accent border border-border text-foreground font-semibold rounded-[14px] text-sm transition-colors">
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
                <><Save size={16} /> Save Category</>
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
                <label className="block text-sm font-semibold text-foreground mb-2">Category Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Tag size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" name="name" value={formData.name} onChange={handleNameChange} placeholder="e.g. Snacks & Beverages" className={`w-full h-14 bg-background border ${validationErrors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} rounded-[14px] pl-11 pr-4 text-base placeholder:text-[15px] focus:outline-none focus:ring-1 transition-all`} />
                </div>
                {validationErrors.name && <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Slug <span className="text-muted-foreground text-xs font-normal">(auto-generated)</span></label>
                <div className="relative">
                  <Link2 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" name="slug" value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} placeholder="e.g. snacks-beverages" className={`w-full h-14 bg-background border ${validationErrors.slug ? 'border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} rounded-[14px] pl-11 pr-4 text-base placeholder:text-[15px] font-mono focus:outline-none focus:ring-1 transition-all`} />
                </div>
                {validationErrors.slug && <p className="text-xs text-destructive mt-1">{validationErrors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <div className="relative">
                  <AlignLeft size={17} className="absolute left-4 top-4 text-muted-foreground" />
                  <textarea name="description" value={formData.description} onChange={handleDescChange} rows={4} placeholder="Brief description of this category..." className="w-full bg-background border border-border rounded-[14px] pl-11 pr-4 py-3 text-base placeholder:text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" />
                  <span className="absolute right-3.5 bottom-2.5 text-[11px] text-muted-foreground">{descCount}/500</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Media & Images */}
          <motion.section id="media" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-background border border-border rounded-[20px] p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h2 className="text-[22px] font-bold text-foreground mb-6">Media</h2>
            <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" />
            
            <div onClick={() => !isSubmitting && !isUploadingImage && imageInputRef.current?.click()} className={`w-full h-48 border-2 border-dashed ${formData.image ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-accent/50'} rounded-[16px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group`}>
              {isUploadingImage ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-muted-foreground font-medium">Processing...</p>
                </div>
              ) : formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <div className="bg-background border border-border p-3 rounded-full mb-2 shadow-sm"><ImagePlus size={24} className="text-primary" /></div>
                    <p className="text-sm font-bold text-foreground">Click to replace image</p>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: "" })); }} className="absolute top-4 right-4 w-8 h-8 bg-background border border-border text-foreground hover:bg-destructive hover:text-destructive-foreground rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4"><ImagePlus size={28} className="text-primary" /></div>
                  <p className="font-semibold text-foreground text-base mb-1">Upload category image</p>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                </div>
              )}
            </div>
          </motion.section>

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
          <div className="bg-background border border-border rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] sticky top-[100px]">
            <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-1">Form Navigation</h3>
            <div className="flex flex-col gap-1">
              {sections.map(section => (
                <button key={section.id} onClick={() => { setActiveSection(section.id); document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className={`px-4 py-2.5 rounded-[12px] text-left text-sm font-semibold transition-all ${activeSection === section.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <motion.section id="visibility" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-background border border-border rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-foreground mb-4">Visibility</h3>
            <div className="space-y-4">
              <label className="flex gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="radio" name="status" value="active" checked={formData.status === "active"} onChange={() => setFormData(prev => ({ ...prev, status: "active" }))} className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border-2 transition-colors ${formData.status === "active" ? 'border-primary' : 'border-muted-foreground group-hover:border-primary/50'}`}></div>
                  {formData.status === "active" && <div className="absolute w-2.5 h-2.5 rounded-full bg-primary"></div>}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-[15px]">Active</div>
                  <div className="text-sm text-muted-foreground leading-snug mt-0.5">Category is visible and available for products.</div>
                </div>
              </label>
              
              <label className="flex gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="radio" name="status" value="inactive" checked={formData.status === "inactive"} onChange={() => setFormData(prev => ({ ...prev, status: "inactive" }))} className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border-2 transition-colors ${formData.status === "inactive" ? 'border-primary' : 'border-muted-foreground group-hover:border-primary/50'}`}></div>
                  {formData.status === "inactive" && <div className="absolute w-2.5 h-2.5 rounded-full bg-primary"></div>}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-[15px]">Inactive</div>
                  <div className="text-sm text-muted-foreground leading-snug mt-0.5">Category is hidden and unavailable for products.</div>
                </div>
              </label>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
