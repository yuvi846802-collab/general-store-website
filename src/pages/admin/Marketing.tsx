import { Mail, Megaphone, Send, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminMarketing() {
  const { toast } = useToast();
  const campaigns = [
    { id: 1, name: "Summer Sale 2024", type: "Email Newsletter", status: "Active", reach: "12.5k", conversion: "4.2%" },
    { id: 2, name: "Welcome Series", type: "Automated", status: "Active", reach: "8.1k", conversion: "12.8%" },
    { id: 3, name: "Abandoned Cart", type: "Automated", status: "Active", reach: "3.4k", conversion: "18.5%" },
    { id: 4, name: "Spring Clearance", type: "SMS Blast", status: "Completed", reach: "5.2k", conversion: "2.1%" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] w-full space-y-6 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Marketing Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage your email newsletters and promotional campaigns in real-time.</p>
        </div>
        <button 
          onClick={() => toast({ title: "New Campaign", description: "Opening campaign builder..." })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Megaphone size={16} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20"><Mail size={24}/></div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Total Emails Sent</p>
              <h4 className="text-2xl font-bold text-foreground">45.2k</h4>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20"><Send size={24}/></div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Avg. Open Rate</p>
              <h4 className="text-2xl font-bold text-foreground">24.8%</h4>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/20"><BarChart size={24}/></div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Avg. Click Rate</p>
              <h4 className="text-2xl font-bold text-foreground">8.4%</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-lg flex flex-col flex-1 w-full min-h-[55vh] overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/20 shrink-0">
          <h3 className="font-bold text-foreground text-lg">Recent Campaigns</h3>
        </div>
        <div className="overflow-x-auto flex-1 w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/5 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Reach</th>
                <th className="px-6 py-4">Conversion</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((camp, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={camp.id} 
                  className="hover:bg-accent/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-foreground">{camp.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{camp.type}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{camp.reach}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{camp.conversion}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      camp.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      {camp.status}
                    </span>
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
