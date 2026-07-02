import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { PremiumImage } from '@/components/ui/PremiumImage';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSearch, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { CategoryModal } from "./categories/CategoryModal";
import { categoryService, Category } from "@/services/categoryService";
import { getImageUrl } from "@/lib/utils";

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "active" | "inactive";
}

export default function AdminCategories() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const updateTrigger = useRealTimeData('category');
  const searchString = useSearch();
  const [, setLocation] = useLocation();

  // Open modal if ?new=true is in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(searchString);
    if (searchParams.get('new') === 'true') {
      setIsModalOpen(true);
      setLocation('/admin/categories', { replace: true });
    }
  }, [searchString, setLocation]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (e: any) {
      console.error('Failed to load categories:', e);
      toast({ variant: "destructive", title: "Failed to load categories", description: e?.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [updateTrigger]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: "Category deleted", description: `"${name}" has been removed.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Failed to delete", description: e?.message });
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => categoryService.createCategory(data as any),
    onSuccess: (newCat) => {
      // Real-time: add to list immediately without waiting for refetch
      setCategories(prev => [{ ...newCat, _count: { products: 0 } }, ...prev]);
      setIsModalOpen(false);
      toast({
        title: "✅ Category created!",
        description: `"${newCat.name}" has been added to your catalog.`,
      });
    },
    onError: (e: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create category",
        description: e?.message || "Please check your connection and try again.",
      });
    },
  });

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] w-full space-y-6 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product collections and taxonomy.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 border border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>
        <p className="text-sm text-muted-foreground shrink-0">
          {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-40 bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={cat.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-accent/30 relative flex items-center justify-center p-4">
                {cat.image ? (
                  <PremiumImage
                    src={getImageUrl(cat.image)}
                    fallbackText={cat.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                ) : (
                  <Tag size={40} className="text-muted-foreground/30" />
                )}
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-foreground border border-border shadow-sm">
                  {(cat as any)._count?.products ?? 0} Items
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">{cat.name}</h3>
                  <span className="capitalize px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-full text-[10px] border border-emerald-500/20 shrink-0">
                    {cat.status || 'active'}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {cat.description || `All products in the ${cat.name.toLowerCase()} category.`}
                </p>

                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <button
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors border border-transparent hover:border-border"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCategories.length === 0 && (
        <div className="py-20 text-center bg-card border border-border rounded-2xl">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold text-foreground">
            {searchTerm ? "No categories found" : "No categories yet"}
          </h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search." : 'Click "Add Category" to create your first one.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} /> Add Category
            </button>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isSubmitting={createMutation.isPending}
        error={createMutation.error?.message}
      />
    </div>
  );
}
