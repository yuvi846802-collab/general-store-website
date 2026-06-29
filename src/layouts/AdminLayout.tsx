import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { LogOut, Menu, User as UserIcon, Search, Bell, Globe, Sun, Moon, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-muted-foreground w-64 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search anywhere... (⌘K)" 
                  className="bg-transparent border-none focus:outline-none w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              
              <button 
                onClick={() => toast({ title: "Quick Create", description: "Opening creation menu..." })}
                className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
              >
                <Plus size={16} />
                <span>Create</span>
              </button>

              <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

              <button 
                onClick={() => setLocation("/")}
                title="Go to Live Website"
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                <Globe size={18} />
              </button>

              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

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
              {children}
            </div>
          </main>

          {/* Floating Action Button (Mobile) */}
          <button className="sm:hidden fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-20">
            <Plus size={24} />
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
