import { useState, useEffect, useRef } from "react";
import { Store, Phone, Menu, X, Search, User, ShoppingCart, ChevronDown, Package, Box, Tag, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService, SearchResult } from "@/services/searchService";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Why Us", href: "#why-us" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact Us", href: "#contact" }
  ];
  
  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { isAuthenticated, user } = useAuthStore();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section tracking for active link
      let current = "";
      for (const link of navLinks) {
        const sectionId = link.href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 150px offset to account for navbar height and visual padding
          if (rect.top <= 150) {
            current = link.name;
          }
        }
      }
      
      if (current) {
        setActiveLink((prev) => (prev !== current ? current : prev));
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount to set initial active state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setSearchError("");
        return;
      }

      setIsSearching(true);
      setSearchError("");
      
      try {
        if (!navigator.onLine) {
          throw new Error("You are offline. Please check your network connection.");
        }
        
        const fetchPromise = searchService.searchGlobal(debouncedSearch, "All");
        const timeoutPromise = new Promise<SearchResult[]>((_, reject) => 
          setTimeout(() => reject(new Error("Search request timed out")), 10000)
        );
        
        const results = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (isMounted) {
          setSearchResults(results);
          setIsSearching(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsSearching(false);
          setSearchError(err.message || "An error occurred while searching. Please try again.");
          if (err.response?.status === 404) setSearchError("No results found or endpoint missing.");
          if (err.response?.status >= 500) setSearchError("Server error. Please try again later.");
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

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
          {navLinks.map((item) => {
            const isActive = activeLink === item.name;
            const isProducts = item.name === "Products";
            
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveLink(item.name)}
                className={`text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-foreground relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:rounded-full"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>
        
        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">

          
          <button 
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search products"
          >
            <Search size={18} />
          </button>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <button 
              onClick={() => setLocation('/profile')}
              className="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 border border-transparent hover:border-border"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase shrink-0 overflow-hidden">
                {user.profileImage ? (
                  <img src={getImageUrl(user.profileImage)} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : user.name ? (
                  user.name.charAt(0)
                ) : (
                  user.email ? user.email.charAt(0) : <User size={14} />
                )}
              </div>
              <span className="text-sm font-semibold hidden sm:block max-w-[100px] truncate">
                {user.name || user.email.split('@')[0]}
              </span>
            </button>
          ) : (
            <button 
              onClick={() => setLocation("/login")}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="User account"
            >
              <User size={18} />
            </button>
          )}

          <button 
            onClick={toggleCart}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`Shopping cart with ${cartItemsCount} items`}
          >
            <ShoppingCart size={18} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-background shadow-sm" aria-hidden="true">
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </span>
            )}
          </button>
          
          <Button asChild className="bg-gradient-to-r from-[#4ade80] to-[#16a34a] hover:from-[#22c55e] hover:to-[#15803d] text-white rounded-full px-5 h-[42px] flex items-center gap-2 shadow-md shadow-green-900/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <a href="tel:+917704849886" aria-label="Call Hakeem Store">
              <div className="bg-white/20 p-1 rounded-full" aria-hidden="true"><Phone size={14} fill="currentColor" /></div>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="font-bold text-sm">Call Now</span>
                <span className="text-[9px] font-medium opacity-95">We're Online</span>
              </div>
            </a>
          </Button>
        </div>

        {/* Mobile menu button and Theme toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button 
            onClick={toggleCart}
            className="relative p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full" 
            aria-label={`Shopping cart with ${cartItemsCount} items`}
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-background" aria-hidden="true">
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </span>
            )}
          </button>

          <ThemeToggle />

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
              
              {navLinks.map((item) => {
                const isActive = activeLink === item.name;
                return (
                  <a 
                    key={item.name}
                    href={item.href} 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveLink(item.name);
                    }} 
                    className={`font-medium text-base px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                      isActive 
                        ? "text-green-600 bg-green-500/10" 
                        : "text-foreground/80 hover:text-green-600 hover:bg-muted/60"
                    }`}
                  >
                    {item.name}
                    {item.name === "Products" && <ChevronDown size={16} />}
                  </a>
                );
              })}
              <Button asChild className="mt-4 w-full bg-gradient-to-r from-[#4ade80] to-[#16a34a] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2">
                <a href="tel:+917704849886">
                  <Phone size={20} fill="currentColor" /> Call Now
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] sm:w-[500px] md:w-[600px] bg-card border border-border rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center px-4 py-3 border-b border-border gap-3 bg-card">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, pages..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
                />
                {isSearching && <Loader2 size={20} className="text-primary animate-spin shrink-0" />}
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 min-h-[200px]">
                {searchError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <AlertCircle size={40} className="text-destructive mb-4" />
                    <p className="text-foreground font-medium">{searchError}</p>
                  </div>
                ) : debouncedSearch && searchResults.length === 0 && !isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Search size={40} className="mb-4 opacity-20" />
                    <p>No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try checking for typos or using broader terms.</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          setLocation(result.url);
                          setSearchOpen(false);
                        }}
                        className="flex items-start gap-4 p-3 hover:bg-muted rounded-xl transition-colors text-left group w-full"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors overflow-hidden">
                          {result.imageUrl ? (
                            <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                          ) : result.iconName === 'Package' ? (
                            <Package size={20} />
                          ) : result.iconName === 'Tag' ? (
                            <Tag size={20} />
                          ) : result.iconName === 'Box' ? (
                            <Box size={20} />
                          ) : (
                            <Search size={20} />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-semibold text-foreground truncate">{result.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                        </div>
                        {result.price && (
                          <div className="text-right shrink-0">
                            <span className="font-bold text-primary">{result.price}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <p>Start typing to search for products, categories, or pages.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}