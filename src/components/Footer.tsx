import { Store, Phone, MapPin } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-foreground pt-16 pb-8 border-t-[6px] border-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2 mb-6 inline-flex">
              <div className="bg-primary text-foreground p-2 rounded-lg">
                <Store size={24} />
              </div>
              <span className="font-heading text-2xl font-bold">Hakeem Store</span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your trusted neighborhood general store in Naryawal, providing quality products and excellent service to our community for years.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/hakeem_store" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors text-foreground">
                <FaInstagram size={18} />
              </a>
              <a href="https://wa.me/917896541230" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-[#25D366] transition-colors text-foreground">
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-muted-foreground hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#products" className="text-muted-foreground hover:text-secondary transition-colors">Products</a></li>
              <li><a href="#why-us" className="text-muted-foreground hover:text-secondary transition-colors">Why Choose Us</a></li>
              <li><a href="#reviews" className="text-muted-foreground hover:text-secondary transition-colors">Customer Reviews</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-lg font-heading font-bold mb-6 text-foreground">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>Naryawal, Bareilly, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="text-primary shrink-0" size={20} />
                <a href="tel:+917896541230" className="hover:text-foreground transition-colors">+91 7896541230</a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-border/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Hakeem Store. All rights reserved.
            </p>
            <a href="/admin/login" className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-default hover:cursor-pointer">
              Admin Login
            </a>
          </div>
          <div className="text-muted-foreground text-sm">
            Proudly serving Naryawal
          </div>
        </div>
      </div>
    </footer>
  );
}