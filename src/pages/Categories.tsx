import { useQuery } from "@tanstack/react-query";
import { fetchPublicCategories } from "@/services/api";
import { CategoryCard } from "@/features/products/CategoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import React from "react";

const MemoizedCategoryCard = React.memo(CategoryCard);

export default function Categories() {
  const { data: dbCategories = [], isLoading } = useQuery({
    queryKey: ['public-categories'],
    queryFn: fetchPublicCategories,
    refetchInterval: 2000
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">All Categories</h1>
              <p className="text-foreground/80 font-medium text-xl max-w-2xl mx-auto">
                Explore our wide range of products organized by category.
              </p>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dbCategories.map((cat: any, index: number) => (
                <Link key={cat.id} href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="cursor-pointer h-full">
                    <MemoizedCategoryCard 
                      category={cat} 
                      index={index} 
                      isSelected={false} 
                      onClick={() => {}} 
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
