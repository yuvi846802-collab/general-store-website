import { Store, Phone, MapPin, Mail, Clock, Lock, ArrowRight, ShieldCheck, Truck, Tag, Headset, ChevronRight, MailOpen, LogIn } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1c] text-slate-300 font-sans border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        
        {/* Top Newsletter & Features Box */}
        <div className="border border-white/10 rounded-2xl p-6 lg:p-10 mb-16 bg-[#0f172a]/50 flex flex-col xl:flex-row gap-10 items-center justify-between">
          
          <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
            <div className="w-16 h-16 rounded-full bg-[#00d4a1]/10 flex items-center justify-center shrink-0 border border-[#00d4a1]/20">
              <MailOpen className="text-[#00d4a1]" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Stay Updated with <span className="text-[#00d4a1]">Hakeem Store</span></h3>
              <p className="text-sm text-slate-400 mb-4 max-w-sm">Subscribe to get special offers, new product alerts and exclusive discounts.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="email" placeholder="Enter your email address" className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d4a1]/50" />
                </div>
                <button className="bg-[#00d4a1] hover:bg-[#00b388] text-[#0a0f1c] font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-2">
                  Subscribe Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden xl:block w-px h-24 bg-white/10"></div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full xl:w-auto text-center md:text-left">
            <div className="flex flex-col items-center md:items-center xl:items-start group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-[#00d4a1] group-hover:bg-[#00d4a1]/10 transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-white text-sm font-bold mb-1">100% Quality Assured</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[130px]">Premium quality products you can trust.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-center xl:items-start group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-[#00d4a1] group-hover:bg-[#00d4a1]/10 transition-colors">
                <Truck size={24} />
              </div>
              <h4 className="text-white text-sm font-bold mb-1">Fast & Reliable Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[130px]">On-time delivery at your doorstep.</p>
            </div>

            <div className="flex flex-col items-center md:items-center xl:items-start group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-[#00d4a1] group-hover:bg-[#00d4a1]/10 transition-colors">
                <Tag size={24} />
              </div>
              <h4 className="text-white text-sm font-bold mb-1">Best Prices</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[130px]">Competitive prices every day.</p>
            </div>

            <div className="flex flex-col items-center md:items-center xl:items-start group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-[#00d4a1] group-hover:bg-[#00d4a1]/10 transition-colors">
                <Headset size={24} />
              </div>
              <h4 className="text-white text-sm font-bold mb-1">Customer Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[130px]">We're here to help you anytime.</p>
            </div>
          </div>
          
        </div>

        {/* Middle Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-4 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 mb-6 inline-flex">
              <div className="bg-[#00d4a1] text-[#0a0f1c] p-2.5 rounded-xl">
                <Store size={26} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Hakeem <span className="text-[#00d4a1]">Store</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
              Your trusted neighborhood general store in Naryawal, providing quality products and excellent service to our community for years.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00d4a1] hover:border-[#00d4a1] hover:text-[#0a0f1c] text-[#00d4a1] transition-all"><FaFacebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00d4a1] hover:border-[#00d4a1] hover:text-[#0a0f1c] text-[#00d4a1] transition-all"><FaInstagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00d4a1] hover:border-[#00d4a1] hover:text-[#0a0f1c] text-[#00d4a1] transition-all"><FaWhatsapp size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00d4a1] hover:border-[#00d4a1] hover:text-[#0a0f1c] text-[#00d4a1] transition-all"><FaXTwitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#00d4a1] tracking-wider uppercase mb-6">QUICK LINKS</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-600 group-hover:text-[#00d4a1] transition-colors" /> Home</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-600 group-hover:text-[#00d4a1] transition-colors" /> Categories</Link></li>
              <li><Link href="/offers" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-600 group-hover:text-[#00d4a1] transition-colors" /> Offers</Link></li>
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-600 group-hover:text-[#00d4a1] transition-colors" /> About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-600 group-hover:text-[#00d4a1] transition-colors" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#00d4a1] tracking-wider uppercase mb-6">CATEGORIES</h4>
            <ul className="space-y-4">
              <li><Link href="/category/grocery" className="text-sm text-slate-400 hover:text-white transition-colors">Grocery</Link></li>
              <li><Link href="/category/beverages" className="text-sm text-slate-400 hover:text-white transition-colors">Beverages</Link></li>
              <li><Link href="/category/personal-care" className="text-sm text-slate-400 hover:text-white transition-colors">Personal Care</Link></li>
              <li><Link href="/category/household" className="text-sm text-slate-400 hover:text-white transition-colors">Household</Link></li>
              <li><Link href="/categories" className="text-sm text-[#00d4a1] hover:text-[#00b388] transition-colors flex items-center gap-1 mt-6 font-medium">View All Categories <ArrowRight size={14} /></Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#00d4a1] tracking-wider uppercase mb-6">CUSTOMER SUPPORT</h4>
            <ul className="space-y-4">
              <li><Link href="/faqs" className="text-sm text-slate-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="text-sm text-slate-400 hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="text-sm text-slate-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#00d4a1] tracking-wider uppercase mb-6">CONTACT INFO</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#00d4a1] mt-0.5 shrink-0" size={16} />
                <span className="text-sm text-slate-400 leading-relaxed">Naryawal, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#00d4a1] shrink-0" size={16} />
                <span className="text-sm text-slate-400">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#00d4a1] shrink-0" size={16} />
                <span className="text-sm text-slate-400">info@hakeemstore.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="text-[#00d4a1] mt-0.5 shrink-0" size={16} />
                <span className="text-sm text-slate-400">Mon - Sun: 9:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 bg-[#080d17]">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Lock size={16} className="text-[#00d4a1]" />
              <span className="font-semibold text-white">Secure Shopping</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10"></div>
            <span className="text-xs text-slate-500">Your data is protected with 256-bit SSL encryption.</span>
          </div>

          <div className="flex items-center gap-4">
             <span className="text-xs text-slate-500 font-medium">We Accept</span>
             <div className="flex gap-2">
               <div className="w-11 h-7 bg-white rounded flex items-center justify-center p-1"><img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="w-full h-full object-contain"/></div>
               <div className="w-11 h-7 bg-white rounded flex items-center justify-center p-1"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="w-full h-full object-contain"/></div>
               <div className="w-11 h-7 bg-white rounded flex items-center justify-center p-1 border border-gray-200">
                  <span className="text-[9px] font-bold text-teal-600 leading-none tracking-tighter">SadaPay</span>
               </div>
               <div className="w-11 h-7 bg-white rounded flex items-center justify-center p-1 border border-gray-200">
                  <span className="text-[8px] font-bold text-green-500 leading-none tracking-tighter">easypaisa</span>
               </div>
             </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5">
            <p className="text-xs text-slate-400">© 2026 Hakeem Store. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mt-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">Proudly serving Naryawal <span className="text-[#00d4a1]">♥</span></span>
              
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              
              {/* ADMIN LOGIN BUTTON */}
              <Link href="/admin/login" className="group flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-[#00d4a1]/10 border border-white/10 hover:border-[#00d4a1]/30 rounded-full transition-all">
                <LogIn size={12} className="text-[#00d4a1] group-hover:scale-110 transition-transform" /> 
                <span className="text-xs font-medium text-slate-300 group-hover:text-[#00d4a1] transition-colors">Admin Login</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}