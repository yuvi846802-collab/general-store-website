import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from "lucide-react";

import { CategoryCard } from "../features/products/CategoryCard";
import { categories } from "../constants/data";
import { productsData } from "../constants/products";

// Use React.memo to prevent unnecessary re-renders
const MemoizedCategoryCard = React.memo(CategoryCard);

export default function ProductCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllItems, setShowAllItems] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use useCallback to maintain function reference
  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategory(prev => {
      if (prev === categoryName) return null;
      setActiveIndex(0);
      setShowAllItems(false); // Reset to carousel view
      return categoryName;
    });
    
    if (selectedCategory !== categoryName) {
      setTimeout(() => {
        document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [selectedCategory]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current && !showAllItems) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 300; // Approx card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  // Memoize the selected products array
  const currentProducts = useMemo(() => {
    return selectedCategory ? productsData[selectedCategory] || [] : [];
  }, [selectedCategory]);

  return (
    <section id="products" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary font-medium text-sm shadow-sm">
              Our Products
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-foreground/80 font-medium text-xl max-w-2xl mx-auto">Explore our wide range of products carefully selected for you and your family.</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, index) => (
            <MemoizedCategoryCard 
              key={cat.id} 
              category={cat} 
              index={index} 
              isSelected={selectedCategory === cat.name} 
              onClick={handleCategoryClick} 
            />
          ))}
        </div>
        
        {/* Expanded Category View */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden w-full"
              id="product-list"
            >
              <div className="bg-[#0B0F19] rounded-[32px] border border-white/5 shadow-2xl relative w-full p-6 md:p-10">
                
                {/* Top Bar: Close Button */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 z-30">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="w-10 h-10 rounded-full bg-[#1A1F2C] hover:bg-[#252B3B] flex items-center justify-center text-white/60 transition-colors shadow-lg"
                    aria-label="Close category view"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-14 md:mt-0 md:ml-16 mb-10 gap-5">
                  <div>
                    <h3 className="text-3xl md:text-[40px] font-bold text-white tracking-tight mb-2 leading-none font-heading">{selectedCategory}</h3>
                    <p className="text-[#8B95A5] text-[15px]">Showing popular items in this category</p>
                  </div>
                  <button 
                    onClick={() => setShowAllItems(!showAllItems)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold transition-colors bg-transparent hover:bg-white/5"
                  >
                    {showAllItems ? <LayoutList size={16} /> : <LayoutGrid size={16} />}
                    {showAllItems ? "View as Carousel" : "View All Items"}
                  </button>
                </div>

                {/* Content Area */}
                <div className="relative group">
                  
                  {/* Conditionally render scroll arrows */}
                  {!showAllItems && (
                    <>
                      {/* Scroll left */}
                      <button 
                        onClick={() => scroll('left')} 
                        className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 z-20 w-12 h-12 bg-[#1A1F2C] hover:bg-[#252B3B] rounded-full flex items-center justify-center text-white/70 hover:text-white shadow-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      {/* Scroll right */}
                      <button 
                        onClick={() => scroll('right')} 
                        className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 z-20 w-12 h-12 bg-[#1A1F2C] hover:bg-[#252B3B] rounded-full flex items-center justify-center text-white/70 hover:text-white shadow-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
                        aria-label="Scroll right"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Container for products (Grid or Carousel) */}
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className={
                      showAllItems 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 px-2 pb-6"
                        : "flex gap-5 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar"
                    }
                    style={showAllItems ? {} : { scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {currentProducts.map((product, idx) => (
                      <div key={idx} className={showAllItems ? "h-full" : "min-w-[280px] snap-start"}>
                        <div className="bg-[#131722] rounded-[24px] overflow-hidden border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col group/card relative shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300">
                          
                          {/* Heart Icon */}
                          <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#131722]/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-[#131722] transition-colors">
                            <Heart size={16} strokeWidth={1.5} />
                          </button>

                          {/* Image */}
                          <div className="h-[210px] w-full overflow-hidden bg-[#0A0D14]">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                              loading="lazy"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            {product.tag && (
                              <div className="inline-flex mb-3">
                                <span className="bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
                                  {product.tag}
                                </span>
                              </div>
                            )}
                            
                            <h4 className="text-white font-bold text-[17px] leading-snug mb-3 flex-1">{product.name}</h4>
                            
                            <div className="text-white font-bold text-[22px] mb-4">
                              {product.price}
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                              <button className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors focus:outline-none">
                                <ShoppingCart size={18} />
                              </button>
                              <button className="flex-1 h-10 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-semibold text-[15px] transition-colors focus:outline-none">
                                Add
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Dots (Only show in carousel mode) */}
                {!showAllItems && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {currentProducts.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex || (activeIndex >= currentProducts.length && i === currentProducts.length - 1) ? 'w-6 bg-[#10b981]' : 'w-2 bg-white/10'}`}
                      />
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}