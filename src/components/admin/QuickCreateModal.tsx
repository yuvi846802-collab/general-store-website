import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { 
  X, Package, Tag, ShoppingCart, Users, Box, Percent, Megaphone, 
  Star, Share2, Image as ImageIcon, FileText, ShieldCheck, 
  UserPlus, UserCog, Bell
} from 'lucide-react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CREATE_ACTIONS = [
  { id: 'product', label: 'New Product', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'category', label: 'New Category', icon: Tag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'order', label: 'New Order', icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'customer', label: 'New Customer', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'inventory', label: 'New Inventory Item', icon: Box, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'coupon', label: 'New Coupon', icon: Percent, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'marketing', label: 'New Campaign', icon: Megaphone, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'review', label: 'New Review', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'social', label: 'New Social Post', icon: Share2, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { id: 'hero', label: 'New Hero Section', icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'about', label: 'New About Content', icon: FileText, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { id: 'feature', label: 'New Why Choose Us', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'user', label: 'New User', icon: UserPlus, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'admin', label: 'New Admin', icon: UserCog, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { id: 'notification', label: 'New Notification', icon: Bell, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function QuickCreateModal({ isOpen, onClose }: QuickCreateModalProps) {
  const [, setLocation] = useLocation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const getActionPath = (id: string) => {
    if (id === 'product') return '/admin/products/new';
    if (id === 'category') return '/admin/categories?new=true';
    return `/admin/create/${id}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Quick Create</h2>
                <p className="text-sm text-muted-foreground mt-1">Select an item to create a new record in the system.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body - Grid of Actions */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {CREATE_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link href={getActionPath(action.id)} key={action.id} onClick={onClose} className="flex flex-col items-center justify-center p-4 gap-3 bg-background border border-border hover:border-primary/50 rounded-xl transition-all shadow-sm hover:shadow-md group text-center cursor-pointer h-full hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]">
                      <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
