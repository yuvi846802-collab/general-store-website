import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Search, X, Package, ShoppingCart, Users, Tag, Box, BarChart2, Percent, Megaphone, Star, Share2, Image as ImageIcon, FileText, ShieldCheck, Settings, UserCog, Bell, Clock, Activity, AlertTriangle, UserPlus, RefreshCcw, CreditCard, User, Home, Mic, ChevronRight, Edit, Trash2, Copy, Eye, Calendar, UserCheck } from 'lucide-react';
import { searchService, SearchResult } from '@/services/searchService';
import { useDebounce } from '@/hooks/useDebounce';

// Map icon names to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  Package, ShoppingCart, Users, Tag, Box, BarChart2, Percent, Megaphone, Star, Share2, Image: ImageIcon, FileText, ShieldCheck, Settings, UserCog, Bell, Clock, Activity, AlertTriangle, UserPlus, RefreshCcw, CreditCard, User, Home
};

const FILTERS = [
  { label: 'All', icon: Home },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Customers', icon: Users },
  { label: 'Categories', icon: Tag },
  { label: 'Inventory', icon: Box },
  { label: 'Analytics', icon: BarChart2 },
  { label: 'System', icon: Settings },
];

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_searches_v2');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches_v2', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches_v2');
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

  // Scroll active item into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const container = scrollContainerRef.current;
        const offsetTop = activeEl.offsetTop;
        const height = activeEl.offsetHeight;
        
        if (offsetTop < container.scrollTop) {
          container.scrollTop = offsetTop - 10;
        } else if (offsetTop + height > container.scrollTop + container.clientHeight) {
          container.scrollTop = offsetTop + height - container.clientHeight + 10;
        }
      }
    }
  }, [selectedIndex]);

  // Keyboard Navigation inside Dropdown
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      const isShowingResults = debouncedQuery || activeFilter !== 'All';
      if (!isOpen) return;
      
      const totalItems = isShowingResults ? filteredResults.length : recentSearches.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (totalItems > 0) setSelectedIndex(prev => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (totalItems > 0) setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (totalItems > 0) {
          if (isShowingResults) {
            handleSelectResult(filteredResults[selectedIndex]);
          } else {
            setQuery(recentSearches[selectedIndex]);
          }
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = FILTERS.findIndex(f => f.label === activeFilter);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + FILTERS.length) % FILTERS.length 
          : (currentIndex + 1) % FILTERS.length;
        setActiveFilter(FILTERS[nextIndex].label);
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
    if (!highlight.trim() || !text) return <span>{text || ''}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span className="truncate">
        {parts.map((part, i) => 
          regex.test(part) ? <strong key={i} className="text-teal-600 dark:text-teal-400 font-bold">{part}</strong> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const selectedItem = filteredResults[selectedIndex];
  const isShowingResults = debouncedQuery || activeFilter !== 'All';

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      {/* Trigger */}
      <div 
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-card/50 border border-border/50 rounded-xl text-sm text-muted-foreground w-64 md:w-80 hover:bg-accent hover:border-border transition-all cursor-text shadow-sm backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search anywhere...</span>
        <div className="flex gap-1 text-[10px] font-medium text-muted-foreground border border-border/50 rounded-md px-1.5 py-0.5 bg-accent/50 shadow-inner">
          ⌘K
        </div>
      </div>

      {/* Dropdown Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:top-[10vh] md:w-[900px] max-h-[calc(100vh-2rem)] md:max-h-[750px] bg-card/95 backdrop-blur-3xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden z-[101] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-6 h-16 border-b border-border/50 bg-accent/30">
                <Search size={22} className="text-teal-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, orders, customers, inventory..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-foreground text-lg placeholder:text-muted-foreground/60 font-medium"
                />
                
                <div className="flex items-center gap-2 shrink-0">
                  {isLoading && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {query && (
                    <button onClick={() => setQuery('')} className="p-1.5 hover:bg-accent/50 rounded-lg text-muted-foreground transition-colors">
                      <X size={18} />
                    </button>
                  )}
                  <div className="w-[1px] h-6 bg-accent/50 mx-1 hidden sm:block"></div>
                  <button className="hidden sm:flex p-1.5 hover:bg-accent/50 rounded-lg text-muted-foreground transition-colors" title="Voice Search">
                    <Mic size={18} />
                  </button>
                </div>
              </div>

              {/* Filters / Pills */}
              <div className="px-4 py-3 border-b border-border/50 bg-accent/20 overflow-x-auto no-scrollbar flex gap-2">
                {FILTERS.map(f => {
                  const Icon = f.icon;
                  const isActive = activeFilter === f.label;
                  return (
                    <button
                      key={f.label}
                      onClick={() => setActiveFilter(f.label)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        isActive 
                          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-sm' 
                          : 'bg-transparent text-muted-foreground border border-transparent hover:bg-accent/60 hover:text-foreground'
                      }`}
                    >
                      <Icon size={14} />
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area (Two Pane) */}
              <div className="flex flex-1 overflow-hidden min-h-[300px]">
                
                {/* Left Pane: Results List */}
                <div className="flex-1 overflow-y-auto p-2 scroll-smooth custom-scrollbar" ref={scrollContainerRef}>
                  
                  {!isShowingResults ? (
                    // Recent Searches
                    <div className="p-3">
                      <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Searches</h3>
                        {recentSearches.length > 0 && (
                          <button onClick={clearRecent} className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">Clear</button>
                        )}
                      </div>
                      
                      {recentSearches.length > 0 ? (
                        <div className="space-y-1">
                          {recentSearches.map((term, idx) => (
                            <button
                              key={idx}
                              onClick={() => setQuery(term)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                                selectedIndex === idx ? 'bg-accent/80 text-foreground shadow-sm border border-border/50' : 'hover:bg-accent/40 text-muted-foreground border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Clock size={16} className={selectedIndex === idx ? 'text-teal-500' : 'text-muted-foreground'} />
                                <span className="text-sm font-medium">{term}</span>
                              </div>
                              <ChevronRight size={16} className={`transition-opacity ${selectedIndex === idx ? 'opacity-100 text-teal-500' : 'opacity-0'}`} />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl bg-accent/50 flex items-center justify-center mb-4 border border-border shadow-inner">
                            <Activity size={24} className="text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                          <p className="text-xs mt-1">Start typing to search your workspace</p>
                        </div>
                      )}
                    </div>
                  ) : filteredResults.length > 0 ? (
                    // Rich Search Results
                    <div className="space-y-1">
                      <div className="px-3 py-2">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Results
                        </h3>
                      </div>
                      
                      {filteredResults.map((result, idx) => {
                        const Icon = IconMap[result.iconName] || Search;
                        const isSelected = selectedIndex === idx;
                        
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelectResult(result)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden border ${
                              isSelected 
                                ? 'bg-accent/80 border-border/50 shadow-sm' 
                                : 'hover:bg-accent/40 border-transparent'
                            }`}
                            style={{ height: '72px' }}
                          >
                            {/* Accent Bar */}
                            {isSelected && (
                              <motion.div 
                                layoutId="accent-bar"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full"
                              />
                            )}

                            {/* Icon / Image */}
                            {result.imageUrl ? (
                              <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-border bg-background shadow-sm">
                                <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center border ${
                                isSelected 
                                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' 
                                  : 'bg-background text-muted-foreground border-border/60 shadow-sm'
                                } transition-colors`}
                              >
                                <Icon size={20} />
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {highlightText(result.title, debouncedQuery)}
                                </h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isSelected ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20' : 'bg-accent/50 text-muted-foreground border border-border/50'
                                }`}>
                                  {result.module}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground truncate max-w-[80%]">
                                  {highlightText(result.description, debouncedQuery)}
                                </p>
                                {result.status && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                    <span className="text-[10px] text-muted-foreground capitalize">{result.status}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Empty State
                    <div className="h-full flex flex-col items-center justify-center py-12 px-6">
                      <div className="w-20 h-20 bg-accent/50 border border-border rounded-3xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-50"></div>
                        <Search size={32} className="text-muted-foreground relative z-10" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">No results found</h3>
                      <p className="text-sm text-muted-foreground text-center mb-8 max-w-[250px]">
                        We couldn't find anything matching <span className="text-foreground font-medium">"{query}"</span>
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm">
                        <button onClick={() => setActiveFilter('Products')} className="flex items-center gap-2 px-4 py-2 bg-accent/50 hover:bg-accent/50 border border-border text-muted-foreground text-sm font-medium rounded-xl transition-colors">
                          <Package size={16} /> Products
                        </button>
                        <button onClick={() => setActiveFilter('Orders')} className="flex items-center gap-2 px-4 py-2 bg-accent/50 hover:bg-accent/50 border border-border text-muted-foreground text-sm font-medium rounded-xl transition-colors">
                          <ShoppingCart size={16} /> Orders
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Pane: Preview (Desktop Only) */}
                {isShowingResults && filteredResults.length > 0 && selectedItem && (
                  <div className="hidden md:flex w-[340px] border-l border-border/50 bg-accent/10 flex-col overflow-y-auto custom-scrollbar">
                    <div className="p-6 pb-20 relative">
                      
                      {/* Preview Image/Icon Header */}
                      <div className="mb-6 flex flex-col items-center text-center">
                        {selectedItem.imageUrl ? (
                          <div className="relative w-32 h-32 rounded-2xl border border-border/60 overflow-hidden shadow-xl mb-4 bg-background">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/50 to-transparent mix-blend-overlay"></div>
                            <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover relative z-10" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-background border border-border/60 flex items-center justify-center shadow-xl mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/50 to-transparent"></div>
                            {React.createElement(IconMap[selectedItem.iconName] || Search, { size: 48, className: "text-muted-foreground relative z-10" })}
                          </div>
                        )}
                        <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">{selectedItem.title}</h2>
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 inline-block mt-1">
                          {selectedItem.module}
                        </span>
                      </div>

                      {/* Data Grid */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {selectedItem.price && (
                            <div className="bg-accent/50 border border-border rounded-xl p-3">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Price</span>
                              <span className="text-sm font-semibold text-muted-foreground">{selectedItem.price}</span>
                            </div>
                          )}
                          {selectedItem.stock !== undefined && (
                            <div className="bg-accent/50 border border-border rounded-xl p-3">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Inventory</span>
                              <span className="text-sm font-semibold text-muted-foreground">{selectedItem.stock} in stock</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border">
                          {selectedItem.status && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-medium">Status</span>
                              <span className="text-xs font-semibold text-muted-foreground capitalize">{selectedItem.status}</span>
                            </div>
                          )}
                          {selectedItem.date && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Calendar size={12}/> Date</span>
                              <span className="text-xs font-medium text-muted-foreground">{selectedItem.date}</span>
                            </div>
                          )}
                          {selectedItem.owner && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><UserCheck size={12}/> Owner</span>
                              <span className="text-xs font-medium text-muted-foreground">{selectedItem.owner}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Section */}
                        {selectedItem.description && (
                          <div className="pt-4 border-t border-border">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Description</span>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {selectedItem.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions Footer (Absolute to bottom of pane) */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-card via-card to-transparent pt-10">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSelectResult(selectedItem)}
                            className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                          >
                            <Eye size={14} /> Open
                          </button>
                          {selectedItem.actionButtons?.map(btn => (
                            <button 
                              key={btn} 
                              onClick={() => handleSelectResult(selectedItem)}
                              className="flex-1 bg-background hover:bg-accent text-foreground text-xs font-bold py-2.5 rounded-lg transition-colors border border-border flex items-center justify-center shadow-sm"
                            >
                              {btn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Footer Shortcuts */}
              <div className="px-5 py-3 border-t border-border/50 bg-card/80 flex items-center justify-between text-[11px] font-medium text-muted-foreground backdrop-blur-md rounded-b-3xl">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-muted-foreground font-sans shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)]">↑</kbd> 
                    <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-muted-foreground font-sans shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)]">↓</kbd> 
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-muted-foreground font-sans shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)]">↵</kbd> 
                    Open
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-muted-foreground font-sans shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)]">Tab</kbd> 
                    Filter
                  </span>
                </div>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border/60 rounded text-muted-foreground font-sans shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)]">esc</kbd> 
                  Close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
