import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import { motion } from 'framer-motion';

const Footer = lazy(() => import('@/components/Footer'));

export default function About() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* About Hero */}
        <div className="bg-primary/5 py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-heading mb-6"
            >
              More Than Just a Store
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto"
            >
              At Hakeem Store, we bring the best of Naryawal right to your doorstep. Our commitment to quality, affordability, and community has made us a trusted name for families across the region.
            </motion.p>
          </div>
        </div>

        {/* Existing About Section Component */}
        <AboutSection />

        {/* Core Values */}
        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do at Hakeem Store.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Quality First", desc: "We handpick every item to ensure only the highest quality products reach your family." },
                { title: "Community Focused", desc: "We are proudly rooted in Naryawal and dedicated to serving our neighbors with care." },
                { title: "Honest Pricing", desc: "Great products shouldn't break the bank. We promise fair and unbeatable prices everyday." }
              ].map((value, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Suspense fallback={<div className="py-10 bg-[#0f172a]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
