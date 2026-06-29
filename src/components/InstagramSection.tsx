import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

const instagramPosts = [
  { id: 1, category: "Fresh Groceries", image: "/images/instagram_groceries.png" },
  { id: 2, category: "Household Items", image: "/images/instagram_household.png" },
  { id: 3, category: "Daily Snacks", image: "/images/instagram_snacks.png" },
  { id: 4, category: "Beverages", image: "/images/instagram_beverages.png" },
  { id: 5, category: "Personal Care", image: "/images/instagram_personal_care.png" },
  { id: 6, category: "Store Front", image: "/images/instagram_storefront.png" },
];

export default function InstagramSection() {
  return (
    <section id="instagram" className="py-24 bg-card">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex justify-center mb-4 text-pink-600">
            <FaInstagram size={48} />
          </div>
          <h2 className="text-4xl font-heading font-bold text-foreground mb-2">Follow Us On Instagram</h2>
          <a href="https://instagram.com/hakeem_store" target="_blank" rel="noopener noreferrer" className="text-lg text-muted-foreground hover:text-primary transition-colors">
            @hakeem_store
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-12 max-w-5xl mx-auto">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="aspect-square rounded-2xl relative overflow-hidden group cursor-pointer bg-muted"
            >
              <img src={getImageUrl(post.image)} alt={post.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaInstagram className="text-white text-3xl transform scale-50 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-white font-medium text-sm md:text-base">{post.category}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a href="https://instagram.com/hakeem_store" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-heading gap-2 px-8 rounded-full">
              <FaInstagram size={18} /> Follow on Instagram
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}