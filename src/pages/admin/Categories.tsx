import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { PremiumImage } from '@/components/ui/PremiumImage';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { CategoryModal } from "./categories/CategoryModal";
import { categoryService, Category } from "@/services/categoryService";
import { getImageUrl } from "@/lib/utils";

// Make sure to match the API CategoryFormData if needed, or simply use any for the add handler for now.
export type CategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
  image?: string | File | null;
  banner?: string | File | null;
};

export default function AdminCategories() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateTrigger = useRealTimeData('category');

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [updateTrigger]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.deleteCategory(id);
        toast({ title: "Category deleted" });
        fetchCategories();
      } catch (e) {
        toast({ variant: "destructive", title: "Failed to delete" });
      }
    }
  };

  const createCategoryMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: (data) => {
      fetchCategories();
      toast({ 
        title: "✅ Category Created Successfully", 
        description: `${data.name} has been added to your catalog.` 
      });
      setIsModalOpen(false);
    }
  });

  const handleAddCategory = (data: CategoryFormData) => {
    createCategoryMutation.mutate(data as any);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

      {/* Advanced Toolbar */}
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
      </div>

      {/* Categories Grid View */}
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
                <PremiumImage src={getImageUrl(cat.image)} fallbackText={cat.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" containerClassName="w-full h-full" />
              ) : (
                <Tag size={40} className="text-muted-foreground/30" />
              )}
              <div className="absolute top-3 right-3 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-foreground border border-border shadow-sm">
                {(cat as any)._count?.products || 0} Items
              </div>
            </div>
            
            {/* Details */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-foreground line-clamp-1">{cat.name}</h3>
                <span className="capitalize px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-full text-[10px] border border-emerald-500/20">
                  {cat.status}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                All products associated with the {cat.name.toLowerCase()} category.
              </p>
              
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors border border-transparent hover:border-border" title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddCategory} 
        isSubmitting={createCategoryMutation.isPending}
        error={createCategoryMutation.error?.message}
      />

      {filteredCategories.length === 0 && (
        <div className="py-20 text-center bg-card border border-border rounded-2xl">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold text-foreground">No categories found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
