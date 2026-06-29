import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EntitySchemaConfig, FieldConfig } from '@/constants/schemas';
import { Save, X, RefreshCcw, Loader2, UploadCloud, XCircle, Search, Link2, Bold, Italic, List, SaveAll } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicCreateFormProps {
  config: EntitySchemaConfig;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function DynamicCreateForm({ config, onSubmit, onCancel }: DynamicCreateFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(config.schema)
  });

  const watchAllFields = watch();

  // Prevent accidental navigation if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || tags.length > 0 || imagePreview || gallery.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, tags, imagePreview, gallery]);

  // Auto-generate slug if needed
  useEffect(() => {
    config.fields.forEach(field => {
      if (field.type === 'slug-generator' && field.dependsOn) {
        const dependentValue = watchAllFields[field.dependsOn];
        if (dependentValue && typeof dependentValue === 'string') {
          const generatedSlug = dependentValue
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          setValue(field.name, generatedSlug);
        }
      }
    });
  }, [watchAllFields, config.fields, setValue]);

  const submitHandler = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (imagePreview) data.image = imagePreview;
      if (gallery.length > 0) data.gallery = gallery;
      if (tags.length > 0) data.tags = tags;

      await onSubmit(data);
      toast({ title: "✅ Created Successfully", description: `Your new ${config.id} has been saved.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "❌ Creation Failed", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraftSave = async () => {
    try {
      setIsDrafting(true);
      const data = watchAllFields;
      if (imagePreview) data.image = imagePreview;
      if (gallery.length > 0) data.gallery = gallery;
      if (tags.length > 0) data.tags = tags;

      // In real scenario, we'd have a separate draft API or flag
      localStorage.setItem(`draft_${config.id}`, JSON.stringify(data));
      
      // Simulate delay
      await new Promise(r => setTimeout(r, 600));
      
      toast({ title: "📝 Draft Saved", description: "Your progress has been safely stored locally." });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to save draft" });
    } finally {
      setIsDrafting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isGallery) {
          setGallery(prev => [...prev, reader.result as string]);
        } else {
          setImagePreview(reader.result as string);
          setValue('image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, fieldName: string) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.currentTarget.value.trim().replace(',', '');
      if (value && !tags.includes(value)) {
        const newTags = [...tags, value];
        setTags(newTags);
        setValue(fieldName, newTags);
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string, fieldName: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    setValue(fieldName, newTags);
  };

  const renderField = (field: FieldConfig) => {
    const error = errors[field.name];

    return (
      <div key={field.name} className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {field.label}
          {error && <span className="text-xs text-destructive font-normal">* {error.message as string}</span>}
        </label>
        {field.description && <p className="text-xs text-muted-foreground mb-1">{field.description}</p>}

        {field.type === 'text' && (
          <input
            type="text"
            placeholder={field.placeholder}
            {...register(field.name)}
            className={`w-full px-3 py-2 bg-background border ${error ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:ring-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm`}
          />
        )}

        {field.type === 'number' && (
          <input
            type="number"
            placeholder={field.placeholder}
            {...register(field.name, { valueAsNumber: true })}
            className={`w-full px-3 py-2 bg-background border ${error ? 'border-destructive' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm`}
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            rows={4}
            placeholder={field.placeholder}
            {...register(field.name)}
            className={`w-full px-3 py-2 bg-background border ${error ? 'border-destructive' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm resize-y`}
          />
        )}

        {field.type === 'rich-text' && (
          <div className={`w-full border ${error ? 'border-destructive' : 'border-border'} rounded-lg overflow-hidden bg-background`}>
            <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/20">
              <button type="button" className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"><Bold size={16} /></button>
              <button type="button" className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"><Italic size={16} /></button>
              <button type="button" className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"><List size={16} /></button>
            </div>
            <textarea
              rows={6}
              placeholder={field.placeholder || "Write content here..."}
              {...register(field.name)}
              className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm resize-y"
            />
          </div>
        )}

        {field.type === 'slug-generator' && (
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              readOnly
              {...register(field.name)}
              className={`w-full pl-9 pr-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed`}
            />
          </div>
        )}

        {field.type === 'tags' && (
          <div className={`w-full flex flex-wrap items-center gap-2 px-3 py-2 bg-background border ${error ? 'border-destructive' : 'border-border'} rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all min-h-[42px]`}>
            <AnimatePresence>
              {tags.map(tag => (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  key={tag} 
                  className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag, field.name)} className="hover:text-destructive transition-colors"><X size={12} /></button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              type="text"
              placeholder={tags.length === 0 ? field.placeholder : ''}
              onKeyDown={(e) => handleTagInput(e, field.name)}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm min-w-[120px]"
            />
          </div>
        )}

        {field.type === 'select' && (
          <select
            {...register(field.name)}
            className={`w-full px-3 py-2 bg-background border ${error ? 'border-destructive' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm appearance-none`}
          >
            <option value="">Select {field.label}...</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {field.type === 'switch' && (
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register(field.name)} className="w-5 h-5 accent-primary cursor-pointer" />
            <span className="text-sm text-muted-foreground">Enable</span>
          </div>
        )}

        {field.type === 'image' && (
          <div className="mt-1">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-all">
              {imagePreview ? (
                <div className="w-full h-full relative p-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                    <p className="text-white text-xs font-semibold">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud size={24} />
                  <span className="text-sm">Click to upload primary image</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} />
            </label>
          </div>
        )}

        {field.type === 'gallery' && (
          <div className="mt-1 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <AnimatePresence>
                {gallery.map((img, i) => (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive">
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-all">
                <UploadCloud size={24} className="text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground font-medium">Add Image</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e, true)} />
              </label>
            </div>
          </div>
        )}

        {field.type === 'seo-preview' && (
          <div className="p-4 border border-border rounded-xl bg-background shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Search size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Google Search Preview</span>
            </div>
            <div className="space-y-1">
              <p className="text-[13px] text-green-700 dark:text-green-400 leading-none">
                https://hakeemstore.com/product/{watchAllFields.slug || 'slug'}
              </p>
              <h3 className="text-lg text-blue-600 dark:text-blue-400 font-medium leading-tight truncate">
                {watchAllFields.seoTitle || watchAllFields.name || 'Product Title Placeholder'}
              </h3>
              <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                {watchAllFields.seoDescription || watchAllFields.description || 'This is how your product will appear in search engine results. Write a compelling description to improve click-through rates.'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
        {config.fields.map(field => {
          const isFullWidth = ['textarea', 'rich-text', 'image', 'gallery', 'seo-preview'].includes(field.type);
          return (
            <div key={field.name} className={isFullWidth ? 'md:col-span-2' : ''}>
              {renderField(field)}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => { reset(); setImagePreview(null); setGallery([]); setTags([]); }}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent rounded-lg transition-colors flex items-center gap-2 mr-auto"
          disabled={isSubmitting || isDrafting}
        >
          <RefreshCcw size={16} /> Reset
        </button>

        <button
          type="button"
          onClick={handleDraftSave}
          className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-colors flex items-center gap-2"
          disabled={isSubmitting || isDrafting}
        >
          {isDrafting ? <Loader2 size={16} className="animate-spin" /> : <SaveAll size={16} />}
          Save Draft
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
          disabled={isSubmitting || isDrafting}
        >
          <X size={16} /> Cancel
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || isDrafting}
          className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSubmitting ? 'Saving...' : 'Save & Publish'}
        </motion.button>
      </div>
    </form>
  );
}
