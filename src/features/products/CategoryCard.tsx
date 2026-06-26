import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Category } from '../../types';
import { categoryIcons, categoryStyles } from '../../constants/data';

interface CategoryCardProps {
  category: Category;
  index: number;
  isSelected: boolean;
  onClick: (name: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, isSelected, onClick }) => {
  const style = categoryStyles[category.name] || categoryStyles["Household Essentials"];
  const Icon = categoryIcons[category.name] || categoryIcons["Household Essentials"];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(category.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Select ${category.name} category`}
        aria-pressed={isSelected}
        onClick={() => onClick(category.name)}
        onKeyDown={handleKeyDown}
        className={`relative h-[380px] w-full rounded-[24px] overflow-hidden group cursor-pointer border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      >
        <img 
          src={category.image} 
          alt={`${category.name} representation`} 
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]"
        />
        
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: style.gradient }} 
          aria-hidden="true"
        />
        
        <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start w-full pointer-events-auto">
            <div 
              className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center shadow-md border-[1.5px] border-white/40 ${style.iconBg} bg-opacity-80 backdrop-blur-md transition-transform duration-300 group-hover:scale-105`}
              aria-hidden="true"
            >
              <Icon size={22} className="text-white drop-shadow-sm" strokeWidth={1.5} />
            </div>
            
            <div 
              className={`text-white text-[13px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 ${style.iconBg} bg-opacity-80 backdrop-blur-md`}
              aria-label="Popular category"
            >
              <span className="text-orange-400 text-[15px]" aria-hidden="true">🔥</span> Popular
            </div>
          </div>
          
          <div className="w-full mt-auto pointer-events-auto">
            <h3 className="text-white font-[800] text-[42px] leading-tight mb-1 tracking-tight drop-shadow-lg">{category.name}</h3>
            <p className="text-white/90 text-[20px] leading-snug mb-5 line-clamp-2 drop-shadow-md">{category.description}</p>
            
            <button 
              tabIndex={-1} 
              className={`bg-white hover:bg-gray-50 ${style.textColor} rounded-full py-2 pl-6 pr-2 inline-flex items-center justify-between min-w-[140px] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group/btn focus:outline-none`}
              aria-hidden="true"
            >
              <span className="font-[700] text-[16px] pr-3">Shop Now</span>
              <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${style.iconBg} group-hover/btn:translate-x-1 transition-transform duration-300`}>
                <ChevronRight size={18} strokeWidth={3} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
