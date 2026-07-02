import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, Image as ImageIcon, Check } from 'lucide-react';
import { HeroSlide, getAllHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides } from '@/services/heroService';

export default function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<Partial<HeroSlide> | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await getAllHeroSlides();
      setSlides(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSlide) return;

    try {
      if (currentSlide.id) {
        await updateHeroSlide(currentSlide.id, currentSlide);
      } else {
        await createHeroSlide(currentSlide);
      }
      setIsEditing(false);
      setCurrentSlide(null);
      fetchSlides();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        await deleteHeroSlide(id);
        fetchSlides();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[newIndex];
    newSlides[newIndex] = temp;

    // Update orders locally
    const reordered = newSlides.map((slide, i) => ({ ...slide, displayOrder: i }));
    setSlides(reordered);

    // Save to DB
    try {
      await reorderHeroSlides(reordered.map(s => ({ id: s.id, displayOrder: s.displayOrder })));
    } catch (error) {
      console.error(error);
      fetchSlides(); // Revert on error
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      await updateHeroSlide(slide.id, { isActive: !slide.isActive });
      fetchSlides();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Hero Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage homepage hero carousel slides.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => {
              setCurrentSlide({
                image: '/images/hero_background.png',
                heading: '',
                badgeText: '',
                highlightText: '',
                description: '',
                primaryBtnText: 'Shop Now',
                primaryBtnLink: '/products',
                secondaryBtnText: 'Explore',
                secondaryBtnLink: '/about',
                overlayColor: 'dark',
                opacity: 0.5,
                textAlignment: 'left',
                ctaVisible: true,
                isActive: true
              });
              setIsEditing(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={18} /> Add New Slide
          </button>
        )}
      </div>

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h2 className="text-xl font-bold">{currentSlide?.id ? 'Edit Slide' : 'Create New Slide'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground"><X size={20}/></button>
          </div>
          <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-semibold">Image URL (e.g., /images/instagram_groceries.png)</label>
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-muted rounded-xl flex items-center justify-center overflow-hidden border">
                  {currentSlide?.image ? <img src={currentSlide.image} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="text-muted-foreground opacity-50"/>}
                </div>
                <input required type="text" value={currentSlide?.image || ''} onChange={(e) => setCurrentSlide({...currentSlide, image: e.target.value})} className="flex-1 bg-background border border-border rounded-xl px-4 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Badge Text</label>
              <input type="text" value={currentSlide?.badgeText || ''} onChange={(e) => setCurrentSlide({...currentSlide, badgeText: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Heading (Required)</label>
              <input required type="text" value={currentSlide?.heading || ''} onChange={(e) => setCurrentSlide({...currentSlide, heading: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Highlight Text (Colored part of heading)</label>
              <input type="text" value={currentSlide?.highlightText || ''} onChange={(e) => setCurrentSlide({...currentSlide, highlightText: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Description</label>
              <input type="text" value={currentSlide?.description || ''} onChange={(e) => setCurrentSlide({...currentSlide, description: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Primary Button Text</label>
              <input type="text" value={currentSlide?.primaryBtnText || ''} onChange={(e) => setCurrentSlide({...currentSlide, primaryBtnText: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Primary Button Link</label>
              <input type="text" value={currentSlide?.primaryBtnLink || ''} onChange={(e) => setCurrentSlide({...currentSlide, primaryBtnLink: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Secondary Button Text</label>
              <input type="text" value={currentSlide?.secondaryBtnText || ''} onChange={(e) => setCurrentSlide({...currentSlide, secondaryBtnText: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Secondary Button Link</label>
              <input type="text" value={currentSlide?.secondaryBtnLink || ''} onChange={(e) => setCurrentSlide({...currentSlide, secondaryBtnLink: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Overlay Color</label>
              <select value={currentSlide?.overlayColor || 'dark'} onChange={(e) => setCurrentSlide({...currentSlide, overlayColor: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Overlay Opacity ({currentSlide?.opacity})</label>
              <input type="range" min="0" max="1" step="0.1" value={currentSlide?.opacity || 0.5} onChange={(e) => setCurrentSlide({...currentSlide, opacity: parseFloat(e.target.value)})} className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Text Alignment</label>
              <select value={currentSlide?.textAlignment || 'left'} onChange={(e) => setCurrentSlide({...currentSlide, textAlignment: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="flex items-center gap-4 mt-6 md:col-span-2 pt-4 border-t border-border">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                <Save size={18} /> Save Slide
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl font-semibold text-muted-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">Loading slides...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold text-foreground">No slides found</h3>
              <p className="text-muted-foreground">Click "Add New Slide" to create your first hero slide.</p>
            </div>
          ) : (
            slides.map((slide, index) => (
              <motion.div key={slide.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-card rounded-xl p-4 border shadow-sm flex flex-col md:flex-row items-center gap-6 ${!slide.isActive ? 'opacity-60 grayscale' : 'border-border'}`}>
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted relative shrink-0">
                  <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <h3 className="text-white font-bold text-center px-2 text-sm">{slide.heading}</h3>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">{slide.badgeText || 'No Badge'}</span>
                    {!slide.isActive && <span className="text-xs font-bold uppercase text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">Draft</span>}
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">{slide.heading} <span className="text-primary">{slide.highlightText}</span></h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{slide.description}</p>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 border-l border-border pl-6">
                  <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-2 text-muted-foreground hover:bg-accent rounded-lg disabled:opacity-30"><ArrowUp size={18}/></button>
                  <button onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1} className="p-2 text-muted-foreground hover:bg-accent rounded-lg disabled:opacity-30"><ArrowDown size={18}/></button>
                </div>

                <div className="flex flex-wrap md:flex-col items-center justify-end gap-2 shrink-0 min-w-[120px]">
                  <button onClick={() => handleToggleActive(slide)} className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border ${slide.isActive ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}>
                    <Check size={14} /> {slide.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => { setCurrentSlide(slide); setIsEditing(true); }} className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-1">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(slide.id)} className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 flex items-center justify-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
