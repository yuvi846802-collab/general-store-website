import { motion } from "framer-motion";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We're here to help. Reach out to us via phone, WhatsApp, or visit us in Naryawal.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto w-full">
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 bg-primary/10 text-primary rounded-full">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Address</h4>
                    <p className="text-muted-foreground">Naryawal, India</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <a href="tel:+917896541230" className="block">
                <Card className="hover:border-secondary hover:shadow-sm transition-all group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 bg-secondary/10 text-secondary-foreground rounded-full group-hover:bg-secondary group-hover:text-white transition-colors">
                      <FaPhone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Call Us</h4>
                      <p className="text-muted-foreground">+91 7896541230</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <a href="https://wa.me/917896541230" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="hover:border-[#25D366] hover:shadow-sm transition-all group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 bg-[#25D366]/10 text-[#25D366] rounded-full group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                      <FaWhatsapp size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">WhatsApp</h4>
                      <p className="text-muted-foreground">Message us anytime</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="lg:col-span-3 h-full min-h-[300px]"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-md">
              <iframe 
                src="https://maps.google.com/maps?q=Naryawal,+Bareilly,+Uttar+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                className="absolute inset-0 w-full h-full border-0 bg-muted" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Hakeem Store Location"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}