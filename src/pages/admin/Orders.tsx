import { useState } from "react";
import { Search, Filter, Download, Eye, MoreHorizontal, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { exportService } from "@/services/exportService";
import { useQuery } from "@tanstack/react-query";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const { toast } = useToast();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.orders || [];
  };

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchOrders,
  });

  const formattedOrders = orders.map((o: any) => ({
    id: o.id,
    customer: o.user?.name || o.user?.email || "Guest Customer",
    date: new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    amount: `₹${o.totalAmount.toFixed(2)}`,
    status: o.status,
    raw: o
  }));

  const filteredOrders = formattedOrders.filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || order.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleExportOrders = () => {
    if (filteredOrders.length === 0) {
      toast({ title: "No Orders", description: "There are no orders to export.", variant: "destructive" });
      return;
    }
    const exportData = filteredOrders.map((order: any) => ({
      "Order ID": order.id,
      "Customer Name": order.customer,
      "Order Date": order.date,
      "Total Amount": order.amount,
      "Order Status": order.status,
    }));
    const filename = `orders_export_${new Date().toISOString().split('T')[0]}`;
    exportService.downloadCSV(exportData, filename);
    toast({ title: "Export Successful", description: `Downloaded ${filename}.csv successfully.` });
  };

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
    switch (status.toUpperCase()) {
      case "DELIVERED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "SHIPPED": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "PROCESSING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CANCELLED": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage store customer transactions in real time.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleExportOrders}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Table Container */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter size={18} className="text-muted-foreground hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-48"
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground animate-pulse">Loading live orders...</td></tr>
              ) : paginatedOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No orders found.</td></tr>
              ) : (
                paginatedOrders.map((order: any, idx: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={order.id} 
                    className="hover:bg-accent/30 transition-colors group"
                  >
                  <td className="px-6 py-4 font-mono font-medium text-primary text-xs">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {order.customer.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground text-sm">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-foreground text-sm">{order.amount}</td>
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
                    </div>
                  </td>
                </motion.tr>
                )))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-border text-sm text-muted-foreground">
            <div>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders</div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-border rounded-lg disabled:opacity-50 hover:bg-accent transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-border rounded-lg disabled:opacity-50 hover:bg-accent transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
