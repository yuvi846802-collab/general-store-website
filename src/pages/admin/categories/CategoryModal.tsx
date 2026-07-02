import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Link2, AlignLeft, CheckCircle2, AlertCircle, ImagePlus } from "lucide-react";

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "active" | "inactive";
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
}

const DEFAULT_FORM: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "active",
};

export function CategoryModal({ isOpen, onClose, onSubmit, isSubmitting, error }: CategoryModalProps) {
  const [form, setForm] = useState<CategoryFormValues>(DEFAULT_FORM);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [descCount, setDescCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CategoryFormValues, string>>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(DEFAULT_FORM);
      setImagePreview("");
      setDescCount(0);
      setValidationErrors({});
    }
  }, [isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm(prev => ({ ...prev, name: value, slug }));
    if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: undefined }));
  };

  const handleDescChange = (value: string) => {
    if (value.length > 500) return;
    setForm(prev => ({ ...prev, description: value }));
    setDescCount(value.length);
  };

  // Image: client-side FileReader
  const processFile = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      alert("Please upload a JPG, PNG, WebP, GIF or SVG image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }
    setIsLoadingImage(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      setForm(prev => ({ ...prev, image: base64 }));
      setIsLoadingImage(false);
    };
    reader.onerror = () => setIsLoadingImage(false);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CategoryFormValues, string>> = {};
    if (!form.name.trim()) errs.name = "Category name is required";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      image: form.image,
      status: form.status,
    });
  };

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Full-screen scrollable overlay */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSubmitting && onClose()}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Scrollable Container */}
        <div className="relative min-h-full flex items-center justify-center p-4 sm:p-6 py-10">
          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-[680px] max-h-[88vh] bg-white dark:bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto"
            style={{ boxShadow: '0 25px 60px -10px rgba(0,0,0,0.25)' }}
          >
          {/* Header */}
          <div className="flex items-start justify-between px-8 pt-7 pb-5 shrink-0">
            <div className="flex items-center gap-4">
              {/* Folder Icon in circle */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-foreground leading-tight">Add Category</h2>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">Create a new product collection to organize your items.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-accent text-gray-400 dark:text-muted-foreground transition-colors disabled:opacity-50 shrink-0 ml-3 mt-0.5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Thin divider */}
          <div className="h-px bg-gray-100 dark:bg-border mx-0 shrink-0" />

          {/* Error Banner */}
          {error && (
            <div className="mx-8 mt-5 p-3.5 bg-red-50 dark:bg-destructive/10 border border-red-200 dark:border-destructive/20 rounded-xl flex items-start gap-3 shrink-0">
              <AlertCircle className="text-red-500 dark:text-destructive w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-destructive">{error}</p>
            </div>
          )}

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-foreground flex items-center gap-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Snacks & Beverages"
                  disabled={isSubmitting}
                  className={`w-full pl-11 pr-4 py-3 text-sm border rounded-xl outline-none transition-colors bg-white dark:bg-background
                    ${validationErrors.name
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-gray-200 dark:border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 dark:focus:ring-emerald-900/40'
                    }`}
                />
              </div>
              {validationErrors.name
                ? <p className="text-xs text-red-500">{validationErrors.name}</p>
                : <p className="text-xs text-gray-400 dark:text-muted-foreground">This will be the display name of your category.</p>
              }
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-foreground">
                Slug <span className="text-gray-400 dark:text-muted-foreground text-xs font-normal">(auto-generated)</span>
              </label>
              <div className="relative">
                <Link2 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="e.g. snacks-beverages"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 dark:border-border rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 dark:focus:ring-emerald-900/40 font-mono bg-white dark:bg-background transition-colors"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-muted-foreground">URL-friendly version of the category name. Auto-generated as you type.</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-foreground">Description</label>
              <div className="relative">
                <AlignLeft size={17} className="absolute left-4 top-3.5 text-gray-400" />
                <textarea
                  value={form.description}
                  onChange={(e) => handleDescChange(e.target.value)}
                  rows={4}
                  placeholder="Brief description of this category..."
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 pt-3 pb-8 text-sm border border-gray-200 dark:border-border rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 dark:focus:ring-emerald-900/40 resize-none bg-white dark:bg-background transition-colors"
                />
                <span className="absolute right-3.5 bottom-2.5 text-[11px] text-gray-400">{descCount}/500</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-muted-foreground">Add a short description to help identify this category.</p>
            </div>

            {/* Status */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-800 dark:text-foreground">Status</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Active */}
                <label
                  className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.status === 'active'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                      : 'border-gray-200 dark:border-border bg-white dark:bg-background hover:border-gray-300'
                  }`}
                >
                  <input type="radio" name="cat-status" value="active" checked={form.status === 'active'}
                    onChange={() => setForm(prev => ({ ...prev, status: 'active' }))} className="sr-only" />
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.status === 'active' ? 'border-emerald-500' : 'border-gray-300'
                    }`}>
                      {form.status === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </div>
                    <span className={`text-sm font-semibold ${form.status === 'active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-foreground'}`}>
                      Active
                    </span>
                    {form.status === 'active' && (
                      <span className="ml-auto text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground pl-6.5 leading-relaxed">Category is visible and available for products.</p>
                </label>

                {/* Inactive */}
                <label
                  className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.status === 'inactive'
                      ? 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/30'
                      : 'border-gray-200 dark:border-border bg-white dark:bg-background hover:border-gray-300'
                  }`}
                >
                  <input type="radio" name="cat-status" value="inactive" checked={form.status === 'inactive'}
                    onChange={() => setForm(prev => ({ ...prev, status: 'inactive' }))} className="sr-only" />
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.status === 'inactive' ? 'border-gray-400' : 'border-gray-300'
                    }`}>
                      {form.status === 'inactive' && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-foreground">Inactive</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground pl-6.5 leading-relaxed">Category is hidden and unavailable for products.</p>
                </label>
              </div>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-foreground">Category Image</label>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
              />
              <div
                onClick={() => !isSubmitting && !isLoadingImage && imageInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
                className={`border-2 border-dashed rounded-xl transition-all cursor-pointer min-h-[180px] flex flex-col items-center justify-center text-center p-8
                  ${isDragging ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : imagePreview ? 'border-emerald-300 bg-emerald-50/30 dark:bg-emerald-900/10'
                  : 'border-gray-200 dark:border-border hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-accent/30'}`}
              >
                {isLoadingImage ? (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-9 h-9 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-emerald-600 font-medium">Loading image...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="flex flex-col items-center gap-3.5">
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-32 max-w-full object-contain rounded-lg shadow border border-gray-100" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(""); setForm(prev => ({ ...prev, image: "" })); }}
                        className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">✓ Image ready — click to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
                      style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                      <ImagePlus size={26} className="text-emerald-500" />
                    </div>
                    <p className="text-base font-semibold text-gray-800 dark:text-foreground">
                      Drag & drop your image here
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to{" "}
                      <span className="text-emerald-500 font-semibold underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP, GIF &bull; Max size 10MB</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-border shrink-0" />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-accent transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
              style={{ background: isSubmitting ? '#6ee7b7' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle2 size={17} /> Create Category</>
              )}
            </button>
          </div>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
