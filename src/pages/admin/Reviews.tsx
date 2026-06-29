import { useState } from "react";
import { Search, Filter, Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const mockReviews = Array.from({ length: 6 }).map((_, i) => ({
    id: `REV-00${i + 1}`,
    customer: `Ravi Kumar ${i + 1}`,
    rating: Math.floor(Math.random() * 2) + 4,
    comment: "Great quality products and fast delivery.",
    date: `12 May 2024`,
    status: i % 3 === 0 ? "Pending" : i % 5 === 0 ? "Rejected" : "Approved",
  }));

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
          <button 
            onClick={() => toast({ title: "Filters", description: "Advanced filtering options opening..." })}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-accent transition-colors shadow-sm"
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
          </button>
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
              {mockReviews.map((review, idx) => (
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
                            onClick={() => toast({ title: "Review Approved", description: "This review is now public on the store." })}
                            className="p-2 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20 shadow-sm"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => toast({ title: "Review Rejected", description: "This review has been hidden.", variant: "destructive" })}
                            className="p-2 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors border border-destructive/20 shadow-sm"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => toast({ title: "Review Deleted", description: "Review permanently removed.", variant: "destructive" })}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
