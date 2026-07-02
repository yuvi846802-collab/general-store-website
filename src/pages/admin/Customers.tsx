import { useState } from "react";
import { Search, Download, RefreshCw, Mail, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { exportService } from "@/services/exportService";
import { useQuery } from "@tanstack/react-query";

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.users || [];
  };

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchCustomers,
  });

  const formattedCustomers = users.map((u: any) => ({
    id: u.id,
    name: u.name || "Anonymous User",
    email: u.email,
    phone: u.phone || "N/A",
    role: u.role,
    orders: u._count?.orders || 0,
    status: u.isVerified ? "Verified" : "Unverified",
  }));

  const filteredCustomers = formattedCustomers.filter((c: any) => {
    const searchLower = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(searchLower) || 
           c.email.toLowerCase().includes(searchLower);
  });

  const handleExportCustomers = () => {
    if (filteredCustomers.length === 0) {
      toast({ title: "No Customers", description: "There are no customers to export.", variant: "destructive" });
      return;
    }
    const exportData = filteredCustomers.map((c: any) => ({
      "Customer ID": c.id,
      "Name": c.name,
      "Email": c.email,
      "Phone": c.phone,
      "Orders Count": c.orders,
      "Status": c.status,
    }));
    const filename = `customers_export_${new Date().toISOString().split('T')[0]}`;
    exportService.downloadCSV(exportData, filename);
    toast({ title: "Export Successful", description: `Downloaded ${filename}.csv successfully.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers Directory</h1>
          <p className="text-sm text-muted-foreground">Manage registered store accounts and order activity.</p>
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
            onClick={handleExportCustomers}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email / Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground animate-pulse">Loading customer list...</td></tr>
              ) : paginatedCustomers(filteredCustomers).length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No customers found.</td></tr>
              ) : (
                paginatedCustomers(filteredCustomers).map((customer: any, idx: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={customer.id} 
                    className="hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-foreground text-sm">{customer.name}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      <div>{customer.email}</div>
                      <div className="text-[11px] text-muted-foreground/80">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-primary font-bold">{customer.role}</td>
                    <td className="px-6 py-4 font-bold text-foreground text-sm">{customer.orders}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        customer.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={`mailto:${customer.email}`}
                        className="p-2 inline-flex text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </a>
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

function paginatedCustomers(list: any[]) {
  return list.slice(0, 50);
}
