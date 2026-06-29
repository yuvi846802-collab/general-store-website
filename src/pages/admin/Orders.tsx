import { useState } from "react";
import { Search, Filter, Download, Eye, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const { toast } = useToast();

  const mockOrders = Array.from({ length: 45 }).map((_, i) => ({
    id: `ORD-100${i + 1}`,
    customer: `Customer Name ${i + 1}`,
    date: `12 May 2024`,
    amount: `₹${(Math.random() * 5000 + 500).toFixed(2)}`,
    status: i % 4 === 0 ? "Delivered" : i % 3 === 0 ? "Shipped" : i % 2 === 0 ? "Processing" : "Cancelled",
  }));

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Shipped": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Processing": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Orders Management</h1>
          <p className="text-sm text-muted-foreground">View and manage all customer orders.</p>
        </div>
        <button 
          onClick={() => toast({ title: "Export Started", description: "Your CSV file is being generated." })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20 rounded-t-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`appearance-none flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm px-4 py-2 pr-8 rounded-lg transition-colors shadow-sm font-medium outline-none cursor-pointer ${
                  statusFilter !== "All Status" 
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" 
                    : "bg-background border border-border text-foreground hover:bg-accent"
                }`}
              >
                <option value="All Status">All Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${statusFilter !== "All Status" ? "text-white" : "text-foreground"}`} />
            </div>
            <button 
              onClick={() => toast({ title: "Filters", description: "Advanced filtering options opening..." })}
              className="flex items-center justify-center gap-2 text-sm text-foreground bg-background border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors shadow-sm font-medium"
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No orders found.</td></tr>
              ) : (
                paginatedOrders.map((order, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={order.id} 
                    className="hover:bg-accent/30 transition-colors group"
                  >
                  <td className="px-6 py-4 font-mono font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {order.customer.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toast({ title: "Order Details", description: `Viewing details for ${order.id}` })}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => toast({ title: "More Options", description: "Opening context menu..." })}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm bg-muted/10 rounded-b-2xl">
          <div className="text-muted-foreground font-medium">
            Showing <span className="text-foreground font-semibold">{filteredOrders.length === 0 ? 0 : startIndex + 1}</span> to <span className="text-foreground font-semibold">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of <span className="text-foreground font-semibold">{filteredOrders.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-background border border-border text-foreground rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
            >
              Previous
            </button>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm">{currentPage}</button>
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 bg-background border border-border text-foreground rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
