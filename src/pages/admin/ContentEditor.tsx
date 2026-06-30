import { useState } from "react";
import { useRoute } from "wouter";
import { Save, Image as ImageIcon, Hash, MessageSquare, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminContentEditor() {
  const [match, params] = useRoute("/admin/content/:section");
  const { toast } = useToast();
  const section = params?.section || "hero";

  const renderContent = () => {
    switch (section) {
      case "hero":
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Hero Section Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                  <input type="text" defaultValue="Fresh Groceries, Best Prices" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Subtitle</label>
                  <input type="text" defaultValue="Your one-stop shop for all daily needs." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                  <textarea rows={3} defaultValue="Quality products, fast delivery and best prices every day." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm resize-y"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Button Text</label>
                    <input type="text" defaultValue="Shop Now" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Button Link</label>
                    <input type="text" defaultValue="/products" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Hero Background Image</h3>
              <div 
                onClick={() => toast({ title: "Upload Image", description: "Opening file browser..." })}
                className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors bg-accent/20"
              >
                <ImageIcon className="w-12 h-12 text-primary mb-4" />
                <p className="font-semibold text-foreground">Click to upload image</p>
                <p className="text-sm text-muted-foreground mt-1">Recommended size: 1920x1080px</p>
              </div>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-6">About Us Section</h3>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Heading</label>
              <input type="text" defaultValue="About Hakeem Store" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Sub Heading</label>
              <input type="text" defaultValue="Serving since 2010" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Full Description</label>
              <textarea rows={6} defaultValue="Hakeem Store is your trusted neighborhood store providing quality groceries and daily essentials at the best prices. We believe in customer satisfaction and premium quality." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm resize-y"></textarea>
            </div>
          </div>
        );
      case "why-us":
        return (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Why Choose Us Features</h3>
            {[
              { title: "Quality Products", desc: "We provide 100% quality products." },
              { title: "Best Prices", desc: "Best prices in the market." },
              { title: "Fast Delivery", desc: "Fast and safe home delivery." },
              { title: "24/7 Support", desc: "We are always here to help you." }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-xl bg-background">
                <div>
                  <p className="font-bold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-border rounded-xl font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              + Add New Feature
            </button>
          </div>
        );
      case "social":
        return (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Social Media Links</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E1306C]/10 text-[#E1306C] rounded-lg flex items-center justify-center shrink-0"><Hash size={20}/></div>
                <input type="text" defaultValue="https://instagram.com/hakeemstore" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-lg flex items-center justify-center shrink-0"><MessageSquare size={20}/></div>
                <input type="text" defaultValue="https://wa.me/919876543210" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Store Email</label>
                <input type="email" defaultValue="contact@hakeemstore.com" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input type="text" defaultValue="+91 98765 43210" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Physical Address</label>
                <div className="flex gap-2">
                  <div className="w-12 shrink-0 bg-accent/50 border border-border rounded-xl flex items-center justify-center text-muted-foreground"><MapPin size={20}/></div>
                  <input type="text" defaultValue="123, Main Street, Your City State - 123456" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Opening Hours</label>
                <input type="text" defaultValue="10:00 AM - 09:00 PM (All Days)" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm" />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-2 capitalize">{section.replace('-', ' ')} Settings</h3>
            <p className="text-muted-foreground">This section is being configured.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1 capitalize">
            {section.replace('-', ' ')}
          </h1>
          <p className="text-sm text-muted-foreground">Manage the content displayed on the storefront.</p>
        </div>
        <button 
          onClick={() => toast({ title: "Changes Saved", description: `${section.replace('-', ' ')} settings updated successfully.` })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/20 flex items-center gap-2"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <motion.div
        key={section}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
