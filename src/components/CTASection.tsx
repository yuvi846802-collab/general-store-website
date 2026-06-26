import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary to-teal-900 text-white">
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-extrabold mb-6">Visit Hakeem Store Today</h2>
          <p className="text-xl text-teal-100 mb-10 font-medium">Everything You Need, All in One Place.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917896541230">
              <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all">
                <Phone className="mr-2" size={20} /> Call Now
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-border text-white hover:bg-card hover:text-primary font-heading text-lg px-8 py-6 rounded-full transition-all">
                <MapPin className="mr-2" size={20} /> Get Directions
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}