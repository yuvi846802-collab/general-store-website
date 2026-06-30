import { useState } from "react";
import { Search, UploadCloud, Folder, Image as ImageIcon, FileVideo, MoreVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { PremiumImage } from "@/components/ui/PremiumImage";

export default function AdminMediaLibrary() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Images");

  const tabs = ["Images", "Videos", "Documents"];
  
  const mockMedia = Array.from({ length: 12 }).map((_, i) => ({
    id: `IMG-${i}`,
    name: `product_image_${i+1}.jpg`,
    size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300",
    date: "2023-10-24"
  }));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Media Library</h1>
          <p className="text-sm text-muted-foreground">Manage your product images and banners.</p>
        </div>
        <button 
          onClick={() => toast({ title: "Upload Media", description: "Opening file browser..." })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/20 flex items-center gap-2"
        >
          <UploadCloud size={18} /> Upload Files
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search media files..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Upload Card */}
        <div 
          onClick={() => toast({ title: "Upload Media", description: "Opening file browser..." })}
          className="aspect-square bg-accent/20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-primary/50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="text-primary" size={20} />
          </div>
          <p className="text-sm font-bold text-foreground">Upload</p>
        </div>

        {/* Media Cards */}
        {mockMedia.map((media, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={media.id} 
            className="aspect-square bg-card border border-border rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow"
          >
            <PremiumImage src={media.url} fallbackText={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="w-full h-full" />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <div className="flex justify-end">
                <button 
                  onClick={() => toast({ title: "Image Options", description: `Options for ${media.name}` })}
                  className="p-1.5 bg-background/20 backdrop-blur rounded-lg text-white hover:bg-background/40 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
