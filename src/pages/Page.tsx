import { useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import { lazy, Suspense } from "react";

const Footer = lazy(() => import("@/components/Footer"));

export default function Page() {
  const path = window.location.pathname;
  const slug = path.split('/').pop() || 'page';
  
  const title = slug 
    ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : "Page";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">{title}</h1>
          <p className="text-muted-foreground text-lg mb-8">
            This page is currently being updated. Please check back later for the latest information.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors">
            Return Home
          </a>
        </div>
      </main>
      <Suspense fallback={<div className="py-10 bg-[#0f172a]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
