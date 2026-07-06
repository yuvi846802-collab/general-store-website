import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Info,
  ShieldCheck,
  BarChart3,
  Hash,
  Phone,
  LayoutTemplate,
  FolderOpen,
  Settings,
  UserCircle,
  Store,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Megaphone,
  Percent,
  Warehouse
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const [location, setLocation] = useLocation();

  const menuGroups = [
    {
      title: "Main",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: Package, label: "Products", path: "/admin/products" },
        { icon: Tags, label: "Categories", path: "/admin/categories" },
        { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
        { icon: Users, label: "Customers", path: "/admin/customers" },
        { icon: Warehouse, label: "Inventory", path: "/admin/inventory" },
      ]
    },
    {
      title: "Growth",
      items: [
        { icon: TrendingUp, label: "Analytics", path: "/admin/analytics" },
        { icon: Megaphone, label: "Marketing", path: "/admin/marketing" },
        { icon: MessageSquare, label: "Reviews", path: "/admin/reviews" },
      ]
    },
    {
      title: "Content",
      items: [
        { icon: Hash, label: "Social Media", path: "/admin/content/social" },
        { icon: Info, label: "About", path: "/admin/content/about" },
        { icon: ShieldCheck, label: "Why Choose Us", path: "/admin/content/why-us" },
        { icon: Phone, label: "Contact Info", path: "/admin/content/contact" },
      ]
    },
    {
      title: "System",
      items: [
        { icon: Settings, label: "Settings", path: "/admin/settings" },
        { icon: UserCircle, label: "Profile", path: "/admin/profile" },
      ]
    }
  ];

  return (
    <aside className="h-full glass-panel flex flex-col transition-all duration-300 relative group z-30">
      
      <div className="h-16 flex items-center justify-between border-b border-border shrink-0 px-4">
        <div className="flex items-center gap-3 cursor-pointer overflow-hidden group/logo" onClick={() => setLocation("/")} title="Go to Website">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-primary shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0 group-hover/logo:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300">
            {/* Inner stylized H */}
            <span className="font-heading font-black text-white text-xl tracking-tighter drop-shadow-md">H</span>
            {/* Small accent dot/icon */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <span className="font-heading font-bold text-lg text-foreground leading-tight tracking-tight">Hakeem</span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest leading-none">Workspace</span>
            </motion.div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 py-6">
        <div className="px-3 space-y-6 pb-20">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-2">
              {isOpen && (
                <motion.h4 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3"
                >
                  {group.title}
                </motion.h4>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.path || location.startsWith(item.path + "/");
                  
                  const linkContent = (
                    <button
                      onClick={() => setLocation(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item relative ${
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      } ${!isOpen && "justify-center"}`}
                    >
                      <item.icon size={18} className={`${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover/item:text-foreground group-hover/item:scale-110 transition-all"} shrink-0`} />
                      
                      {isOpen && <span className="text-sm tracking-tight">{item.label}</span>}
                    </button>
                  );

                  return !isOpen ? (
                    <Tooltip key={item.path} delayDuration={0}>
                      <TooltipTrigger asChild>
                        {linkContent}
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10} className="font-medium bg-card text-card-foreground border-border z-50">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={item.path}>{linkContent}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Collapse Toggle (Desktop only) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary shadow-sm transition-colors z-40 opacity-0 group-hover:opacity-100"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
}
