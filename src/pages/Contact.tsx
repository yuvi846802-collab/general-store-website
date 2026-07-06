import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ContactSection from '@/components/ContactSection';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Footer = lazy(() => import('@/components/Footer'));

export default function Contact() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Contact Hero */}
        <div className="bg-primary/5 py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-heading mb-6"
            >
              We'd Love to Hear From You
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto"
            >
              Whether you have a question about our products, store hours, or just want to say hello, we are always here for you.
            </motion.p>
          </div>
        </div>

        {/* Existing Contact Component (Map & Info) */}
        <ContactSection />

        {/* Contact Form Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-card border border-border shadow-lg rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Send Us a Message</h2>
                <p className="text-muted-foreground">Fill out the form below and our team will get back to you shortly.</p>
              </div>

              <form className="relative z-10 space-y-6" onSubmit={(e) => { 
                e.preventDefault(); 
                toast({
                  title: "Message Sent!",
                  description: "Thank you for reaching out. We will get back to you shortly.",
                });
                (e.target as HTMLFormElement).reset();
              }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input placeholder="John Doe" required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" placeholder="john@example.com" required className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="How can we help you?" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Write your message here..." rows={5} required className="bg-background resize-none" />
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto px-8 rounded-full font-bold">
                  Send Message
                </Button>
              </form>
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
