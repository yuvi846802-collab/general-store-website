import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Search, X, Package, ShoppingCart, Users, Tag, Box, BarChart2, Percent, Megaphone, Star, Share2, Image, FileText, ShieldCheck, Settings, UserCog, Bell, Clock, Activity, AlertTriangle, UserPlus, RefreshCcw, CreditCard, User, Home } from 'lucide-react';
import { searchService, SearchResult } from '@/services/searchService';
import { useDebounce } from '@/hooks/useDebounce';

// Map icon names to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  Package, ShoppingCart, Users, Tag, Box, BarChart2, Percent, Megaphone, Star, Share2, Image, FileText, ShieldCheck, Settings, UserCog, Bell, Clock, Activity, AlertTriangle, UserPlus, RefreshCcw, CreditCard, User, Home
};

const FILTERS = ['All', 'Products', 'Orders', 'Customers', 'Categories', 'Inventory', 'Analytics', 'Reviews', 'System', 'Content', 'Growth'];

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  // Handle Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setActiveFilter('All');
    }
  }, [isOpen]);

  // Search execution
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery && activeFilter === 'All') {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await searchService.searchGlobal(debouncedQuery, activeFilter);
        setResults(res);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery, activeFilter]);

  // Filtered results
  const filteredResults = useMemo(() => {
    if (activeFilter === 'All') return results;
    return results.filter(r => r.module === activeFilter || (activeFilter === 'System' && (r.module === 'System' || r.module === 'Dashboard')) || (activeFilter === 'Content' && r.module === 'Content'));
  }, [results, activeFilter]);

  // Keyboard Navigation inside Dropdown
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      const isShowingResults = debouncedQuery || activeFilter !== 'All';
      if (!isOpen || (!isShowingResults && recentSearches.length === 0)) return;
      
      const totalItems = isShowingResults ? filteredResults.length : recentSearches.length;
      if (totalItems === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (isShowingResults && filteredResults.length > 0) {
          handleSelectResult(filteredResults[selectedIndex]);
        } else if (!isShowingResults && recentSearches.length > 0) {
          setQuery(recentSearches[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, selectedIndex, filteredResults, recentSearches, debouncedQuery, activeFilter]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(debouncedQuery);
    setIsOpen(false);
    setLocation(result.url);
  };

  // Highlighter utility
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? <span key={i} className="text-primary font-bold bg-primary/10 px-0.5 rounded">{part}</span> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Bar */}
      <div 
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-muted-foreground w-64 md:w-80 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all cursor-text shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search anywhere... (⌘K)" 
          className="bg-transparent border-none focus:outline-none w-full text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex gap-1 text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-muted/50">
          ⌘K
        </div>
      </div>

      {/* Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-12 left-0 w-full sm:w-[500px] md:w-[600px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Modal Input (Mobile & Desktop overlay focus) */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-card/50 backdrop-blur-md">
              <Search size={20} className="text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, orders, customers..."
                className="flex-1 bg-transparent border-none focus:outline-none text-foreground text-lg placeholder:text-muted-foreground"
              />
              {isLoading && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              )}
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-accent rounded-md text-muted-foreground">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap p-3 gap-2 border-b border-border bg-muted/30">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeFilter === f 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-2 pr-3 scroll-smooth custom-scrollbar">
              {(!debouncedQuery && activeFilter === 'All') ? (
                // Recent Searches
                <div className="p-2">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Searches</h3>
                    {recentSearches.length > 0 && (
                      <button onClick={clearRecent} className="text-xs text-primary hover:underline">Clear</button>
                    )}
                  </div>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-1">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuery(term)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            selectedIndex === idx ? 'bg-accent text-foreground' : 'hover:bg-accent/50 text-muted-foreground'
                          }`}
                        >
                          <Clock size={16} />
                          <span className="text-sm font-medium">{term}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">No recent searches</p>
                      <p className="text-xs mt-1">Start typing to search across your store</p>
                    </div>
                  )}
                </div>
              ) : filteredResults.length > 0 ? (
                // Results List
                <div className="space-y-1">
                  <div className="px-3 py-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Results for "{query}"
                    </h3>
                  </div>
                  {filteredResults.map((result, idx) => {
                    const Icon = IconMap[result.iconName] || Search;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group ${
                          selectedIndex === idx ? 'bg-primary/10 border-primary/20' : 'hover:bg-accent/50 border-transparent'
                        } border`}
                      >
                        <div className={`p-2 rounded-lg ${selectedIndex === idx ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className={`text-sm font-semibold truncate ${selectedIndex === idx ? 'text-primary' : 'text-foreground'}`}>
                              {highlightText(result.title, debouncedQuery)}
                            </h4>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {result.module}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {highlightText(result.description, debouncedQuery)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // No Results Empty State
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No results found</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    We couldn't find anything matching "{query}"
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    <button onClick={() => setActiveFilter('Products')} className="px-4 py-2 bg-accent hover:bg-accent/80 text-sm font-medium rounded-lg transition-colors">
                      Search Products
                    </button>
                    <button onClick={() => setActiveFilter('Customers')} className="px-4 py-2 bg-accent hover:bg-accent/80 text-sm font-medium rounded-lg transition-colors">
                      Search Customers
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-background border border-border rounded font-sans">↑</kbd> <kbd className="px-1.5 py-0.5 bg-background border border-border rounded font-sans">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-background border border-border rounded font-sans">↵</kbd> to select</span>
              </div>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-background border border-border rounded font-sans">esc</kbd> to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
