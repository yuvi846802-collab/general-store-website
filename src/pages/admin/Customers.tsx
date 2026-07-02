import { useState } from "react";
import { Search, Download, MoreHorizontal, Mail, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { exportService } from "@/services/exportService";

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const mockCustomers = Array.from({ length: 8 }).map((_, i) => ({
    id: `CST-00${i + 1}`,
    name: `Customer Name ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    orders: Math.floor(Math.random() * 20) + 1,
    spent: `₹${(Math.random() * 20000 + 1000).toFixed(2)}`,
    status: i % 5 === 0 ? "Inactive" : "Active",
  }));

  const filteredCustomers = mockCustomers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return customer.name.toLowerCase().includes(searchLower) || 
           customer.email.toLowerCase().includes(searchLower);
  });

  const handleExportCustomers = () => {
    const exportData = filteredCustomers.map(c => ({
      "Customer ID": c.id,
      "Name": c.name,
      "Email": c.email,
      "Orders Count": c.orders,
      "Total Spent": c.spent,
      "Status": c.status,
    }));
    const filename = `customers_export_${new Date().toISOString().split('T')[0]}`;
    exportService.downloadCSV(exportData, filename);
    toast({ title: "Export Successful", description: `Downloaded ${filename}.csv successfully.` });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] w-full space-y-6 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage your store's user base in real-time.</p>
        </div>
        <button 
          onClick={handleExportCustomers}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-lg flex flex-col flex-1 w-full min-h-[75vh] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-border flex items-center gap-4 bg-muted/20 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No customers found matching your search.</td></tr>
              ) : (
                filteredCustomers.map((customer, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={customer.id} 
                  className="hover:bg-accent/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2 mt-2">
                    <Mail size={14} /> {customer.email}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{customer.orders}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{customer.spent}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      customer.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toast({ title: "View Customer", description: `Redirecting to profile for ${customer.name}...` })}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => toast({ title: "More Options", description: "Opening customer menu..." })}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
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
