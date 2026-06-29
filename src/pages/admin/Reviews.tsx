import { useState, useMemo } from "react";
import { Search, Filter, Star, CheckCircle, XCircle, Trash2, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const INITIAL_REVIEWS = Array.from({ length: 12 }).map((_, i) => ({
  id: `REV-00${i + 1}`,
  customer: `Ravi Kumar ${i + 1}`,
  rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
  comment: "Great quality products and fast delivery.",
  date: `12 May 2024`,
  status: i % 3 === 0 ? "Pending" : i % 5 === 0 ? "Rejected" : "Approved",
}));

export default function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const { toast } = useToast();

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchSearch = r.customer.toLowerCase().includes(searchTerm.toLowerCase()) || r.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchRating = ratingFilter === "All" || r.rating.toString() === ratingFilter;
      return matchSearch && matchStatus && matchRating;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Reviews</h1>
          <p className="text-sm text-muted-foreground">Manage customer feedback and ratings.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20 rounded-t-2xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reviews or customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors shadow-sm ${
                isFilterOpen || statusFilter !== "All" || ratingFilter !== "All"
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500' 
                  : 'bg-background border-border text-foreground hover:bg-accent'
              }`}
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Filters</span>
              {(statusFilter !== "All" || ratingFilter !== "All") && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-xs font-bold">
                  {(statusFilter !== "All" ? 1 : 0) + (ratingFilter !== "All" ? 1 : 0)}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border bg-muted/10">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Filter Reviews</h3>
                        <button 
                          onClick={() => {
                            setStatusFilter("All");
                            setRatingFilter("All");
                            setIsFilterOpen(false);
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Status Filter */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Status</label>
                        <div className="flex flex-wrap gap-2">
                          {["All", "Pending", "Approved", "Rejected"].map(status => (
                            <button
                              key={status}
                              onClick={() => setStatusFilter(status)}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                                statusFilter === status 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'bg-background text-muted-foreground border-border hover:bg-accent'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Rating</label>
                        <div className="flex flex-wrap gap-2">
                          {["All", "5", "4", "3", "2", "1"].map(rating => (
                            <button
                              key={rating}
                              onClick={() => setRatingFilter(rating)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                                ratingFilter === rating 
                                  ? 'bg-amber-500 text-white border-amber-500' 
                                  : 'bg-background text-muted-foreground border-border hover:bg-accent'
                              }`}
                            >
                              {rating !== "All" ? <><Star size={12} className={ratingFilter === rating ? "fill-white" : "fill-amber-400 text-amber-400"} /> {rating}</> : "All Ratings"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating & Review</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No reviews found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={review.id} 
                    className="hover:bg-accent/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {review.customer.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">{review.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {renderStars(review.rating)}
                        <p className="text-muted-foreground truncate max-w-[300px]">{review.comment}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{review.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        review.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                        review.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                        'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => {
                                setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status: 'Approved' } : r));
                                toast({ title: "Review Approved", description: "This review is now public on the store." });
                              }}
                              className="p-2 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20 shadow-sm"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status: 'Rejected' } : r));
                                toast({ title: "Review Rejected", description: "This review has been hidden.", variant: "destructive" });
                              }}
                              className="p-2 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors border border-destructive/20 shadow-sm"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => {
                              setReviews(prev => prev.filter(r => r.id !== review.id));
                              toast({ title: "Review Deleted", description: "Review permanently removed.", variant: "destructive" });
                            }}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
