import { useState } from "react";
import { useRoute } from "wouter";
import { Save, Image as ImageIcon, Hash, MessageSquare, MapPin, GripVertical, Trash2, Lightbulb, Share2 } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link2 } from "lucide-react";

function SocialMediaEditor() {
  const [links, setLinks] = useState([
    { id: 1, name: "Instagram", url: "https://instagram.com/hakeemstore", enabled: true, isCustom: false },
    { id: 2, name: "WhatsApp", url: "https://wa.me/917704849886", enabled: true, isCustom: false }
  ]);

  const addLink = () => {
    const newId = links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1;
    setLinks([...links, { id: newId, name: "New Link", url: "", enabled: true, isCustom: true }]);
  };

  const removeLink = (id: number) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id: number, field: string, value: string | boolean) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card/50 border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
            <Share2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Social Media Links</h3>
            <p className="text-sm text-muted-foreground mt-1">Add and manage your social media links. These will be displayed on your website.</p>
          </div>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border bg-background/50 rounded-xl">
              <div className="flex items-center gap-3 shrink-0">
                <GripVertical size={18} className="text-muted-foreground cursor-grab" />
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                  link.name === "Instagram" ? "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]" : 
                  link.name === "WhatsApp" ? "bg-[#25D366]" : "bg-primary/20 text-primary"
                }`}>
                  {link.name === "Instagram" ? <FaInstagram size={20} /> : 
                   link.name === "WhatsApp" ? <FaWhatsapp size={20} /> : <Link2 size={20} />}
                </div>
                {link.isCustom ? (
                  <input 
                    type="text" 
                    value={link.name} 
                    onChange={(e) => updateLink(link.id, 'name', e.target.value)}
                    className="font-semibold text-foreground w-24 bg-transparent border-b border-border focus:outline-none focus:border-primary" 
                    placeholder="Name"
                  />
                ) : (
                  <span className="font-semibold text-foreground w-24">{link.name}</span>
                )}
              </div>
              <input 
                type="text" 
                value={link.url}
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                placeholder="https://"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" 
              />
              <div className="flex items-center gap-4 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={link.enabled}
                    onChange={(e) => updateLink(link.id, 'enabled', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
                <button 
                  onClick={() => removeLink(link.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-border/50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addLink}
          className="w-full mt-6 py-3 border-2 border-dashed border-teal-500/30 rounded-xl font-semibold text-teal-500 hover:bg-teal-500/5 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> Add New Link
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4 relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0 z-10">
          <Lightbulb size={24} />
        </div>
        <div className="z-10">
          <h3 className="text-base font-bold text-foreground">Tips</h3>
          <p className="text-sm text-muted-foreground mt-1">Add your social media profiles to increase trust and engagement with your customers.</p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20 pointer-events-none flex items-center justify-end pr-8">
          <Hash size={100} className="text-teal-500" />
        </div>
      </div>
    </div>
  );
}

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
        return <SocialMediaEditor />;
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
