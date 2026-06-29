import { useState, useEffect } from "react";
import { Store, Phone, Menu, X, Search, User, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-md border-b border-border/50 py-3" 
          : "bg-background/80 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300">
            <span className="font-heading font-black text-white text-2xl tracking-tighter drop-shadow-md">H</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-foreground leading-none">
              Hakeem Store
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Quality | Trust | Service
            </span>
          </div>
        </a>
        
        {/* Desktop Links Container */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#home" className="text-sm font-semibold text-foreground relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:rounded-full">
            Home
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </a>
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer group">
            Products <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
          </div>
          <a href="#why-us" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Why Us
          </a>
          <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Reviews
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact Us
          </a>
        </div>
        
        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">

          
          <button 
            onClick={() => toast({ title: "Search", description: "Search feature coming soon!" })}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search products"
          >
            <Search size={18} />
          </button>

          <button 
            onClick={() => setLocation("/admin/login")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="User account"
          >
            <User size={18} />
          </button>

          <button 
            onClick={() => toast({ title: "Shopping Cart", description: "Your cart is currently empty." })}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Shopping cart with 2 items"
          >
            <ShoppingCart size={18} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-background" aria-hidden="true">
              2
            </span>
          </button>
          
          <a href="tel:+917896541230" aria-label="Call Hakeem Store">
            <Button className="bg-gradient-to-r from-[#4ade80] to-[#16a34a] hover:from-[#22c55e] hover:to-[#15803d] text-white rounded-full px-5 h-[42px] flex items-center gap-2 shadow-md shadow-green-900/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <div className="bg-white/20 p-1 rounded-full" aria-hidden="true"><Phone size={14} fill="currentColor" /></div>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="font-bold text-sm">Call Now</span>
                <span className="text-[9px] font-medium opacity-95">We're Online</span>
              </div>
            </Button>
          </a>
        </div>

        {/* Mobile menu button and Theme toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button 
            onClick={() => toast({ title: "Shopping Cart", description: "Your cart is currently empty." })}
            className="relative p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full" 
            aria-label="Shopping cart with 2 items"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-background" aria-hidden="true">
              2
            </span>
          </button>

          <button 
            className="p-2 rounded-md hover:bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl shadow-2xl border-t border-border overflow-hidden"
          >
            <div className="p-5 flex flex-col gap-2">
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search here..." className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm" />
              </div>
              
              {["Home", "About Us", "Products", "Why Us", "Reviews", "Contact Us"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="font-medium text-base text-foreground/80 hover:text-green-600 px-4 py-3 rounded-xl hover:bg-muted/60 transition-colors flex items-center justify-between"
                >
                  {item}
                  {item === "Products" && <ChevronDown size={16} />}
                </a>
              ))}
              <a href="tel:+917896541230" className="mt-4">
                <Button className="w-full bg-gradient-to-r from-[#4ade80] to-[#16a34a] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2">
                  <Phone size={20} fill="currentColor" /> Call Now
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}