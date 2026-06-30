import { motion } from "framer-motion";
import { ShieldCheck, Tag, MapPin, Smile, Layers, ThumbsUp, Store, Star, ArrowRight, Headphones, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { 
    id: "01",
    title: "Quality Products", 
    icon: ShieldCheck, 
    desc: "We source only the best products for our customers, ensuring freshness and quality.",
    color: "text-emerald-400",
    bgLight: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    lineGradient: "from-transparent via-emerald-400 to-transparent"
  },
  { 
    id: "02",
    title: "Affordable Prices", 
    icon: Tag, 
    desc: "Great value for your money. We keep our prices competitive without compromising on quality.",
    color: "text-amber-400",
    bgLight: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    lineGradient: "from-transparent via-amber-400 to-transparent"
  },
  { 
    id: "03",
    title: "Trusted Local Store", 
    icon: MapPin, 
    desc: "A neighborhood staple in Naryawal for years. We're proud to serve our community.",
    color: "text-teal-400",
    bgLight: "bg-teal-400/10",
    borderColor: "border-teal-400/30",
    lineGradient: "from-transparent via-teal-400 to-transparent"
  },
  { 
    id: "04",
    title: "Friendly Service", 
    icon: Smile, 
    desc: "Always greeted with a smile. Our staff is ready to help you find what you need.",
    color: "text-blue-400",
    bgLight: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    lineGradient: "from-transparent via-blue-400 to-transparent"
  },
  { 
    id: "05",
    title: "Wide Selection", 
    icon: Layers, 
    desc: "From daily groceries to household essentials, find everything under one roof.",
    color: "text-purple-400",
    bgLight: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    lineGradient: "from-transparent via-purple-400 to-transparent"
  },
  { 
    id: "06",
    title: "Customer Satisfaction", 
    icon: ThumbsUp, 
    desc: "Your happiness is our priority. We go the extra mile to ensure you leave satisfied.",
    color: "text-green-400",
    bgLight: "bg-green-400/10",
    borderColor: "border-green-400/30",
    lineGradient: "from-transparent via-green-400 to-transparent"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-background text-foreground transition-colors">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 mb-6 backdrop-blur-md"
          >
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-muted-foreground text-sm font-medium">Trusted by 10,000+ Happy Customers</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight font-heading tracking-tight"
          >
            Why Thousands <br className="hidden md:block" />
            Trust <span className="text-emerald-400">Hakeem Store</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            We are more than just a store; we are a part of your daily life.<br className="hidden md:block" />
            Offering quality products, best prices and a service you can rely on.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Store size={18} />
          </motion.div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <div className="relative glass-card rounded-2xl p-8 h-full flex flex-col group hover:bg-accent/50 transition-colors duration-300 overflow-hidden shadow-2xl backdrop-blur-sm">
                
                {/* Colored bottom glow line */}
                <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r opacity-50 transition-opacity group-hover:opacity-100 ${feature.lineGradient}`}></div>
                
                {/* Top Row: Icon & Number */}
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl border ${feature.borderColor} ${feature.bgLight} ${feature.color} flex items-center justify-center shadow-lg backdrop-blur-md group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={26} strokeWidth={1.5} />
                  </div>
                  <div className="text-5xl font-black text-muted-foreground/10 select-none font-heading tracking-tighter group-hover:text-muted-foreground/20 transition-colors duration-300 mt-[-5px]">
                    {feature.id}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 font-heading tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                  {feature.desc}
                </p>
                
                {/* Learn More Link */}
                <a href="#products" className={`inline-flex items-center gap-2 text-sm font-semibold ${feature.color} group/link hover:opacity-80 transition-opacity`}>
                  Learn More 
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass-card border-border/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow behind CTA */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-5 w-full md:w-auto relative z-10">
            <div className="w-14 h-14 shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-foreground font-bold text-lg mb-1 tracking-tight">Need Help? We're Here For You!</h4>
              <p className="text-muted-foreground text-sm">Call us now or visit our store. We'd love to assist you.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10">
            <a href="#contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent border-border text-foreground hover:bg-accent rounded-full px-6 py-5 gap-2 transition-all font-medium">
                <Store size={18} />
                Visit Our Store
              </Button>
            </a>
            <a href="tel:+917896541230" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 py-5 gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] font-medium border-0">
                <Phone size={18} />
                Call Us Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}