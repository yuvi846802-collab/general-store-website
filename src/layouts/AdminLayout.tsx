import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import GlobalSearch from "@/components/admin/GlobalSearch";
import QuickCreateModal from "@/components/admin/QuickCreateModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Menu, User as UserIcon, Search, Bell, Globe, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => setMounted(true), []);
  
  useEffect(() => {
    const handleScroll = (e: any) => {
      setIsScrolled(e.target.scrollTop > 10);
    };
    const mainArea = document.getElementById("main-scroll-area");
    if (mainArea) mainArea.addEventListener("scroll", handleScroll);
    return () => mainArea?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-full bg-background text-foreground flex overflow-hidden selection:bg-primary/30">
        
        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-40 ${sidebarOpen ? 'w-[260px]' : 'w-[80px]'} shrink-0 hidden md:block border-r border-border shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
          <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-50 w-[260px] md:hidden shadow-2xl`}>
          <AdminSidebar isOpen={true} setIsOpen={setSidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-secondary/30 relative">
          
          {/* Topbar */}
          <header className={`h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors md:hidden"
              >
                <Menu size={20} />
              </button>

              <GlobalSearch />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
              >
                <Plus size={16} />
                <span>Create</span>
              </motion.button>

              <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

              <button 
                onClick={() => setLocation("/")}
                title="Go to Live Website"
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                <Globe size={18} />
              </button>

              <ThemeToggle />

              <button 
                onClick={() => toast({ title: "Notifications", description: "You have 3 new notifications." })}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
              </button>

              <div className="w-px h-6 bg-border mx-1"></div>
              
              <div 
                onClick={() => setLocation("/admin/profile")}
                className="flex items-center gap-3 cursor-pointer hover:bg-accent p-1.5 rounded-xl transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground leading-none mb-1">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground capitalize leading-none">{user?.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-primary w-full h-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </header>

          {/* Page Content Scroll Area */}
          <main id="main-scroll-area" className="flex-1 overflow-auto p-4 sm:p-8 relative">
            <div className="max-w-[1600px] mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Floating Action Button (Mobile) */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCreateOpen(true)}
            className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40"
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </div>
      
      {/* Modals */}
      <QuickCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </ProtectedRoute>
  );
}
