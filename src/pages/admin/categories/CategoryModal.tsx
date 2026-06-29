import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { CategoryFormData } from "@/services/api";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  featured: z.boolean(),
  showOnHomepage: z.boolean(),
  showInNav: z.boolean(),
  displayOrder: z.coerce.number().min(0).default(0),
  icon: z.string().optional(),
  color: z.string().optional(),
});

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export function CategoryModal({ isOpen, onClose, onSubmit, isSubmitting, error }: CategoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: "active",
      featured: false,
      showOnHomepage: false,
      showInNav: true,
      displayOrder: 0,
    }
  });

  const watchName = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchName, setValue]);

  // Handle Image Uploads (Simulation)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleFormSubmit = (data: z.infer<typeof categorySchema>) => {
    // Combine form data with file previews for simulation
    const fullData: CategoryFormData = {
      ...data,
      image: imagePreview,
      banner: bannerPreview,
    };
    onSubmit(fullData);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setImagePreview(null);
      setBannerPreview(null);
    }
  }, [isOpen, reset]);

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={() => !isSubmitting && onClose()}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal/Drawer Panel */}
        <motion.div 
          initial={{ x: "100%", opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative z-10 w-full sm:w-[600px] h-full sm:h-[95vh] sm:mr-4 sm:rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
            <div>
              <h2 className="text-xl font-bold text-foreground">Add Category</h2>
              <p className="text-sm text-muted-foreground mt-1">Create a new product taxonomy.</p>
            </div>
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="m-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-destructive w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-destructive">Failed to save category</p>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <form id="category-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
              
              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Basic Information</h3>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category Name *</label>
                  <input {...register("name")} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" placeholder="e.g. Snacks & Beverages" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Slug (Auto Generated) *</label>
                  <input {...register("slug")} className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm outline-none font-mono" />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea {...register("description")} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none" placeholder="Brief description of the category..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Parent Category</label>
                    <select {...register("parentCategory")} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary">
                      <option value="">None (Top Level)</option>
                      <option value="groceries">Groceries</option>
                      <option value="electronics">Electronics</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status *</label>
                    <select {...register("status")} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Media Upload */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Media</h3>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-accent/30 transition-colors relative">
                    <input type="file" ref={imageInputRef} onChange={(e) => handleImageChange(e, setImagePreview)} accept="image/png, image/jpeg, image/webp" className="hidden" />
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg" />
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute -top-3 -right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-sm"><X size={14}/></button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                        <div className="p-3 bg-muted rounded-full mb-3"><ImageIcon size={24} className="text-muted-foreground" /></div>
                        <p className="text-sm font-medium">Click or drag image to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SEO */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">SEO Configuration</h3>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Meta Title</label>
                  <input {...register("seoTitle")} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <textarea {...register("seoDescription")} rows={2} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </section>

              {/* Display Options */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Display Options</h3>
                <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Featured Category</p>
                    <p className="text-xs text-muted-foreground">Show in featured sections</p>
                  </div>
                  <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded border-border" />
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Show on Homepage</p>
                  </div>
                  <input type="checkbox" {...register("showOnHomepage")} className="w-4 h-4 rounded border-border" />
                </div>
                <div className="grid gap-2 mt-4">
                  <label className="text-sm font-medium">Display Order</label>
                  <input type="number" {...register("displayOrder")} className="w-full md:w-32 bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </section>

            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-card flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-accent transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> Saving...</>
              ) : (
                <><CheckCircle2 size={18} /> Create Category</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
