import { useState } from "react";
import { Save, Store, Globe, Palette, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "seo", label: "SEO & Web", icon: Globe },
    { id: "theme", label: "Theme & Branding", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Mail },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store configuration and preferences.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm shadow-md shadow-primary/20 transition-colors">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-2 shadow-sm flex flex-row md:flex-col overflow-x-auto">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Store Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Store Name</label>
                    <input type="text" defaultValue="Hakeem Store" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Store Contact Email</label>
                      <input type="email" defaultValue="contact@hakeemstore.com" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Store Phone</label>
                      <input type="text" defaultValue="+91 7896541230" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Physical Address</label>
                    <textarea rows={3} defaultValue="Naryawal, Bareilly, Uttar Pradesh, India" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Standards & Formats</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Currency</label>
                    <select className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option>Indian Rupee (INR ₹)</option>
                      <option>US Dollar (USD $)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Timezone</label>
                    <select className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option>(GMT+05:30) Asia/Kolkata</option>
                    </select>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab !== "general" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-2xl p-12 shadow-sm text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="text-muted-foreground w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h2>
              <p className="text-muted-foreground max-w-md mx-auto">This section is part of the enterprise upgrade and is currently being configured.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
