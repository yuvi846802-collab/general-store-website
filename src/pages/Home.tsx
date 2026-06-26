import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

// Lazy load components below the fold for performance
const ProductCategories = React.lazy(() => import("@/components/ProductCategories"));
const WhyChooseUs = React.lazy(() => import("@/components/WhyChooseUs"));
const StatsSection = React.lazy(() => import("@/components/StatsSection"));
const ReviewsSection = React.lazy(() => import("@/components/ReviewsSection"));
const InstagramSection = React.lazy(() => import("@/components/InstagramSection"));
const ContactSection = React.lazy(() => import("@/components/ContactSection"));
const CTASection = React.lazy(() => import("@/components/CTASection"));
const Footer = React.lazy(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading sections...</div>}>
          <ProductCategories />
          <WhyChooseUs />
          <StatsSection />
          <ReviewsSection />
          <InstagramSection />
          <ContactSection />
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="py-10 bg-[#0f172a]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}