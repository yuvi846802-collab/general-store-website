import { Home, Coffee, Cookie, Package, Sparkles, SprayCan, PenTool, Store } from "lucide-react";
import { Category } from "../types";

export const categories: Category[] = [
  { id: "1", name: "Grocery Items", slug: "grocery-items", description: "Fresh & quality staples delivered to your home", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" },
  { id: "2", name: "Household Essentials", slug: "household-essentials", description: "Everything for your home", image: "/assets/household_essentials.png" },
  { id: "3", name: "Beverages", slug: "beverages", description: "Cold drinks & refreshments", image: "/assets/beverages.png" },
  { id: "4", name: "Snacks", slug: "snacks", description: "Tasty treats for everyone", image: "/assets/snacks.png" },
  { id: "5", name: "Daily Needs", slug: "daily-needs", description: "Your everyday requirements", image: "/assets/daily_needs.png" },
  { id: "6", name: "Personal Care", slug: "personal-care", description: "Beauty & grooming products", image: "/assets/personal_care.png" },
  { id: "7", name: "Cleaning Products", slug: "cleaning-products", description: "Keep your home spotless", image: "/assets/cleaning_products.png" },
  { id: "8", name: "Stationery", slug: "stationery", description: "School & office supplies", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800" },
];

export const categoryIcons: Record<string, any> = {
  "Grocery Items": Store,
  "Household Essentials": Home,
  "Beverages": Coffee,
  "Snacks": Cookie,
  "Daily Needs": Package,
  "Personal Care": Sparkles,
  "Cleaning Products": SprayCan,
  "Stationery": PenTool,
};

export const categoryStyles: Record<string, any> = {
  "Grocery Items": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(2,44,22,0.95) 100%)", iconBg: "bg-[#022c16]", textColor: "text-[#022c16]" },
  "Household Essentials": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(8,15,35,0.95) 100%)", iconBg: "bg-[#0f172a]", textColor: "text-[#0f172a]" },
  "Beverages": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.95) 100%)", iconBg: "bg-black", textColor: "text-black" },
  "Snacks": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(61,24,4,0.95) 100%)", iconBg: "bg-[#3d1804]", textColor: "text-[#3d1804]" },
  "Daily Needs": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(79,29,149,0.95) 100%)", iconBg: "bg-[#4F1D95]", textColor: "text-[#4F1D95]" },
  "Personal Care": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(76,5,25,0.95) 100%)", iconBg: "bg-[#4c0519]", textColor: "text-[#4c0519]" },
  "Cleaning Products": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(8,51,68,0.95) 100%)", iconBg: "bg-[#083344]", textColor: "text-[#083344]" },
  "Stationery": { gradient: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(67,20,7,0.95) 100%)", iconBg: "bg-[#431407]", textColor: "text-[#431407]" },
};
