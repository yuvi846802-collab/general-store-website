import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary font-medium text-sm">
              Our Story
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
              A Legacy of Trust in <span className="text-primary">Naryawal</span>
            </h2>
            <p className="text-xl text-foreground/80 font-medium mb-8 leading-relaxed">
              For years, Hakeem Store has been the heart of our community, providing families with daily essentials, fresh groceries, and a warm smile. We believe in quality, affordability, and treating every customer like family. When you step into our store, you're not just a shopper—you're a neighbor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 p-6 bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
                <h4 className="font-heading font-bold text-primary text-4xl mb-2">1000+</h4>
                <p className="text-lg font-semibold text-foreground/80">Happy Families</p>
              </div>
              <div className="flex-1 p-6 bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-secondary/20 relative overflow-hidden group hover:border-secondary/40 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full -z-10 group-hover:bg-secondary/20 transition-colors" />
                <h4 className="font-heading font-bold text-secondary text-4xl mb-2">100%</h4>
                <p className="text-lg font-semibold text-foreground/80">Quality Assured</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl translate-x-4 translate-y-4 -z-10" />
            <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-xl relative aspect-[4/5] md:aspect-auto md:h-[600px]">
              <img 
                src={getImageUrl("/images/store_interior.png")} 
                alt="Hakeem Store Interior" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-20">
                <div className="bg-card/20 backdrop-blur-md border border-border/30 rounded-xl p-4 text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/MFA" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">Trusted Quality</h5>
                    <p className="text-sm text-white/80">Only the best for your family</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}