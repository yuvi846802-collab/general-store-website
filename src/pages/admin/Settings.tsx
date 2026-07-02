import { useState, useEffect } from "react";
import { Save, Store, Globe, Palette, Mail, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, StoreSettings } from "@/services/settingsService";
import { toast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<StoreSettings>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: Partial<StoreSettings>) => settingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({ title: "Success", description: "Settings saved successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    mutation.mutate(formData);
  };

  const tabs = [
    { id: "general", label: "General & Footer", icon: Store },
    { id: "seo", label: "SEO & Web", icon: Globe },
    { id: "theme", label: "Theme & Branding", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Mail },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store configuration, footer details and preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={mutation.isPending}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold rounded-xl text-sm shadow-md shadow-primary/20 transition-colors"
        >
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          Save Changes
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
                    <input type="text" name="storeName" value={formData.storeName || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Store Description (Footer)</label>
                    <textarea name="storeDescription" value={formData.storeDescription || ""} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Contact Email</label>
                      <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Store Phone</label>
                      <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Business Hours</label>
                      <input type="text" name="businessHours" value={formData.businessHours || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Copyright Text</label>
                      <input type="text" name="copyrightText" value={formData.copyrightText || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Physical Address</label>
                    <textarea name="address" value={formData.address || ""} onChange={handleChange} rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Google Maps URL</label>
                    <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Footer CTA Banner</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">CTA Heading</label>
                    <input type="text" name="ctaHeading" value={formData.ctaHeading || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">CTA Subtitle</label>
                    <input type="text" name="ctaSubtitle" value={formData.ctaSubtitle || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">CTA Phone</label>
                    <input type="text" name="ctaPhone" value={formData.ctaPhone || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">CTA Maps URL</label>
                    <input type="url" name="ctaMapsUrl" value={formData.ctaMapsUrl || ""} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Advanced Configurations (JSON)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Social Links</label>
                    <textarea name="socialLinks" value={formData.socialLinks || ""} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Payment Methods</label>
                    <textarea name="paymentMethods" value={formData.paymentMethods || ""} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Quick Links</label>
                    <textarea name="quickLinks" value={formData.quickLinks || ""} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Support Links</label>
                    <textarea name="supportLinks" value={formData.supportLinks || ""} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"></textarea>
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
