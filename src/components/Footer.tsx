import { useState } from "react";
import { Store, Phone, MapPin, Mail, Clock, Lock, ArrowRight, ShieldCheck, Truck, Tag, Headset } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { categoryService } from "@/services/categoryService";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Footer() {
  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const socialIcons: Record<string, React.ElementType> = {
    instagram: FaInstagram,
    whatsapp: FaWhatsapp,
    facebook: FaFacebook,
    twitter: FaTwitter,
  };

  const paymentIcons: Record<string, string> = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    upi: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
    paytm: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
    phonepe: "https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png",
  };

  if (isSettingsLoading) {
    return (
      <footer className="bg-[#0f172a] text-foreground pt-16 pb-8 border-t-[6px] border-secondary min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </footer>
    );
  }

  const s = settings || {} as any;
  let socialLinks = [];
  let paymentMethods = [];
  let quickLinks = [];
  let supportLinks = [];

  try {
    socialLinks = JSON.parse(s.socialLinks || "[]");
    paymentMethods = JSON.parse(s.paymentMethods || "[]");
    quickLinks = JSON.parse(s.quickLinks || "[]");
    supportLinks = JSON.parse(s.supportLinks || "[]");
  } catch (e) {
    console.error("Error parsing settings JSON", e);
  }

  const topCategories = (categories || []).slice(0, 5);

  return (
    <footer className="bg-[#0b1120] text-foreground pt-48 pb-8 relative mt-48 border-t border-border/5">
      {/* CTA Banner */}
      <div className="container mx-auto px-4 absolute -top-32 left-0 right-0 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#003B46] to-[#042A2B] rounded-3xl p-8 lg:p-12 shadow-2xl shadow-black/50 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative border border-white/5"
        >
          {/* Background Decorative */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230aa790\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          
          <div className="flex-1 relative z-10 w-full text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">
              Visit <span className="text-primary">{s.storeName || "Hakeem Store"}</span> Today
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              {s.ctaSubtitle || "Everything you need, all in one place."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href={`tel:${s.ctaPhone || "+917896541230"}`} className="group relative px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 transition-all overflow-hidden flex items-center justify-center gap-2">
                <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                <Phone size={18} className="relative z-10" />
                <span className="relative z-10">Call Now</span>
              </a>
              <a href={s.ctaMapsUrl || "#"} target="_blank" rel="noopener noreferrer" className="group relative px-6 py-3 bg-transparent border border-primary text-primary hover:bg-primary/10 font-semibold rounded-full transition-all flex items-center justify-center gap-2">
                <MapPin size={18} />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10 border-l border-white/10 pl-0 lg:pl-10">
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group transition-colors pt-4 lg:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm">100% Quality Assured</h4>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">Premium quality products you can trust.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group transition-colors pt-4 lg:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Fast & Reliable Delivery</h4>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">On-time delivery at your doorstep.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group transition-colors pt-4 lg:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Tag size={24} />
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Best Prices</h4>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">Competitive prices every day.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group transition-colors pt-4 lg:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Headset size={24} />
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Customer Support</h4>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">We're here to help you anytime.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-20 lg:mt-0">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 xl:gap-12 mb-16 border-b border-white/5 pb-16">
          
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 inline-flex group">
              <div className="bg-primary text-white p-2.5 rounded-xl group-hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <Store size={26} strokeWidth={2.5} />
              </div>
              <span className="font-heading text-2xl font-bold text-white">
                {s.storeName || "Hakeem"} <span className="text-primary">Store</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {s.storeDescription || "Your trusted neighborhood general store in Naryawal, providing quality products and excellent service to our community for years."}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social: any, idx: number) => {
                const Icon = socialIcons[social.platform.toLowerCase()] || FaInstagram;
                return (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary text-gray-400 hover:text-white transition-all hover:-translate-y-1">
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-primary">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.url} className="text-gray-400 hover:text-white transition-colors flex items-center group text-sm">
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-primary">Categories</h4>
            <ul className="space-y-4">
              {topCategories.map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-400 hover:text-white transition-colors flex items-center group text-sm">
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
              {topCategories.length === 0 && !isCategoriesLoading && <li className="text-gray-400 text-sm">No categories</li>}
              <li>
                <Link href="/categories" className="text-primary hover:text-primary/80 transition-colors flex items-center group mt-2 font-medium text-sm">
                  View All Categories <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-primary">Customer Support</h4>
            <ul className="space-y-4">
              {supportLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.url} className="text-gray-400 hover:text-white transition-colors flex items-center group text-sm">
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-primary">Contact Info</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-gray-400 group text-sm">
                <MapPin className="text-primary mt-0.5 shrink-0" size={18} />
                <a href={s.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors leading-relaxed line-clamp-2">
                  {s.address}
                </a>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group text-sm">
                <Phone className="text-primary shrink-0" size={18} />
                <a href={`tel:${s.phone?.replace(/ /g, '')}`} className="hover:text-primary transition-colors">
                  {s.phone}
                </a>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group text-sm">
                <Mail className="text-primary shrink-0" size={18} />
                <a href={`mailto:${s.email}`} className="hover:text-primary transition-colors">
                  {s.email}
                </a>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group text-sm">
                <Clock className="text-primary shrink-0" size={18} />
                <span>{s.businessHours}</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <Lock size={16} className="text-primary" />
            <span className="font-medium text-white">Secure Shopping</span>
            <span className="hidden sm:inline mx-1 text-white/20">|</span>
            <span className="text-xs">Your data is protected with 256-bit SSL encryption.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {paymentMethods.map((method: string, idx: number) => {
              const url = paymentIcons[method.toLowerCase()];
              if (!url) return null;
              return (
                <div key={idx} className="w-12 h-7 bg-white/10 rounded flex items-center justify-center p-1">
                  <img src={url} alt={method} className="h-full object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" loading="lazy" />
                </div>
              );
            })}
            {paymentMethods.length > 5 && <span className="text-xs text-gray-500 ml-2">& more</span>}
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-gray-500 text-sm">
              {s.copyrightText || `© ${new Date().getFullYear()} Hakeem Store. All rights reserved.`}
            </p>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              Proudly serving Naryawal <span className="text-primary text-sm">♥</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}