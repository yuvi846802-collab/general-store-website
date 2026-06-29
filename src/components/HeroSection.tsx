import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

const HeroSection = memo(() => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getImageUrl("/images/hero_background.png")} 
          alt="Hakeem Store Interior" 
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-md text-secondary font-medium tracking-wide"
        >
          Welcome to Naryawal's Finest
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          Your Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">General Store</span><br className="hidden md:block"/> in Naryawal
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-10 text-teal-50 max-w-3xl mx-auto"
        >
          Quality Products • Affordable Prices • Trusted by Families
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="tel:+917896541230">
            <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] text-lg px-8 py-6 rounded-full font-heading transition-all">
              Call Now
            </Button>
          </a>
          <a href="#contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-border/50 text-white hover:bg-card/10 hover:border-border text-lg px-8 py-6 rounded-full font-heading transition-all backdrop-blur-sm">
              Visit Store
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70"
      >
        <span className="text-sm font-medium tracking-widest uppercase text-white/80">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
});

export default HeroSection;