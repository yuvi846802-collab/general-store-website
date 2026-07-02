import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import { getActiveHeroSlides, HeroSlide } from '@/services/heroService';

const fallbackSlides: HeroSlide[] = [
  {
    id: '1',
    image: '/images/instagram_groceries.png',
    badgeText: 'Fresh Groceries',
    heading: 'Fresh Groceries, ',
    highlightText: 'Better Living',
    description: 'Premium quality products at unbeatable prices, every single day.',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: '/products',
    secondaryBtnText: 'Explore Offers',
    secondaryBtnLink: '/offers',
    overlayColor: 'gradient',
    opacity: 0.7,
    textAlignment: 'left',
    ctaVisible: true,
    displayOrder: 1,
    isActive: true,
    autoPlaySpeed: 5000,
    transitionDuration: 1000,
  },
  {
    id: '2',
    image: '/images/instagram_household.png',
    badgeText: 'Stock Up & Save Big',
    heading: 'Daily Essentials ',
    highlightText: 'Delivered to You',
    description: 'Everything your family needs, delivered fast and fresh.',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: '/products',
    secondaryBtnText: 'View Categories',
    secondaryBtnLink: '/categories',
    overlayColor: 'light',
    opacity: 0.4,
    textAlignment: 'left',
    ctaVisible: true,
    displayOrder: 2,
    isActive: true,
    autoPlaySpeed: 5000,
    transitionDuration: 1000,
  },
  {
    id: '3',
    image: '/images/instagram_personal_care.png',
    badgeText: 'Great Quality. Great Prices.',
    heading: 'Quality You Trust, Prices ',
    highlightText: "You'll Love",
    description: 'Handpicked products. Honest prices. Happy families.',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: '/products',
    secondaryBtnText: 'View Deals',
    secondaryBtnLink: '/offers',
    overlayColor: 'dark',
    opacity: 0.6,
    textAlignment: 'left',
    ctaVisible: true,
    displayOrder: 3,
    isActive: true,
    autoPlaySpeed: 5000,
    transitionDuration: 1000,
  },
  {
    id: '4',
    image: '/images/instagram_snacks.png',
    badgeText: 'Eat Fresh, Stay Healthy',
    heading: 'Farm Fresh ',
    highlightText: 'Goodness',
    description: 'Straight from farms to your doorstep. Because you deserve the best.',
    primaryBtnText: 'Shop Fresh',
    primaryBtnLink: '/products?category=fresh',
    secondaryBtnText: 'Learn More',
    secondaryBtnLink: '/about',
    overlayColor: 'dark',
    opacity: 0.7,
    textAlignment: 'left',
    ctaVisible: true,
    displayOrder: 4,
    isActive: true,
    autoPlaySpeed: 5000,
    transitionDuration: 1000,
  },
  {
    id: '5',
    image: '/images/hero_background.png',
    badgeText: "Welcome to Naryawal's Finest",
    heading: 'Your Trusted General Store ',
    highlightText: 'in Naryawal',
    description: 'Quality Products • Affordable Prices • Trusted by Families',
    primaryBtnText: 'Call Now',
    primaryBtnLink: 'tel:+917896541230',
    secondaryBtnText: 'Visit Store',
    secondaryBtnLink: '/contact',
    overlayColor: 'dark',
    opacity: 0.7,
    textAlignment: 'center',
    ctaVisible: true,
    displayOrder: 5,
    isActive: true,
    autoPlaySpeed: 5000,
    transitionDuration: 1000,
  },
];

// Animation Variants matching exact requirements
const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.05,
    filter: "blur(8px)",
  },
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: {
    zIndex: 0,
    opacity: 0,
    scale: 1.03,
    filter: "blur(8px)",
    transition: {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const textContainerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    }
  },
};

const fadeUpVariant: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const scaleUpVariant: any = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getActiveHeroSlides();
        if (data.length > 0) {
          setSlides(data);
        } else {
          setSlides(fallbackSlides);
        }
      } catch (error) {
        setSlides(fallbackSlides);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const delay = 3000;
    
    const timer = setTimeout(() => {
      nextSlide();
    }, delay);

    return () => clearTimeout(timer);
  }, [activeIndex, slides.length, nextSlide]);

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex];

  let overlayClass = '';
  if (activeSlide.overlayColor === 'dark') overlayClass = 'bg-black/60';
  if (activeSlide.overlayColor === 'light') overlayClass = 'bg-white/40';
  if (activeSlide.overlayColor === 'gradient') overlayClass = 'bg-gradient-to-r from-black/80 via-black/40 to-transparent';

  const alignClass = activeSlide.textAlignment === 'center' ? 'items-center text-center mx-auto' : 
                     activeSlide.textAlignment === 'right' ? 'items-end text-right ml-auto' : 'items-start text-left';

  return (
    <section 
      className="relative w-full h-[75vh] md:h-[85vh] lg:h-[100vh] min-h-[600px] overflow-hidden bg-black group"
    >
      <AnimatePresence>
        <motion.div
          key={activeSlide.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image (Fixed position, only faded via parent) */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={activeSlide.image} 
              alt={activeSlide.heading} 
              className="w-full h-full object-cover object-center" 
            />
          </div>

          {/* Overlay */}
          <div className={`absolute inset-0 ${overlayClass}`} />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 md:px-6 z-10 flex flex-col justify-center">
            <motion.div 
              className={`max-w-3xl flex flex-col ${alignClass}`}
              variants={textContainerVariants}
              initial="hidden"
              animate="show"
            >
              {activeSlide.badgeText && (
                <motion.div variants={fadeUpVariant} className="mb-6">
                  <span className={`inline-block py-2 px-4 rounded-full text-sm font-bold tracking-wider uppercase backdrop-blur-md border ${activeSlide.overlayColor === 'light' ? 'bg-black/10 text-black border-black/20' : 'bg-white/10 text-white border-white/20'}`}>
                    {activeSlide.badgeText}
                  </span>
                </motion.div>
              )}
              
              <motion.h1 variants={scaleUpVariant} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.1] sm:leading-[1.1]">
                {activeSlide.heading}
                {activeSlide.highlightText && (
                  <span className="block text-primary mt-2">{activeSlide.highlightText}</span>
                )}
              </motion.h1>
              
              {activeSlide.description && (
                <motion.p variants={fadeUpVariant} className="text-base sm:text-xl md:text-2xl text-white/90 font-medium max-w-2xl mt-4 sm:mt-6 mb-8 sm:mb-10">
                  {activeSlide.description}
                </motion.p>
              )}
              
              {activeSlide.ctaVisible && (
                <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4 mt-2">
                  <Link href={activeSlide.primaryBtnLink || '/products'}>
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl flex items-center gap-2">
                      {activeSlide.primaryBtnText || 'Shop Now'}
                      <ChevronRight size={20} />
                    </button>
                  </Link>
                  {activeSlide.secondaryBtnText && (
                    <Link href={activeSlide.secondaryBtnLink || '/offers'}>
                      <button className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl border-2 backdrop-blur-sm ${activeSlide.overlayColor === 'light' ? 'bg-white/50 border-black/10 text-black hover:bg-white/80' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`}>
                        {activeSlide.secondaryBtnText}
                      </button>
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Pagination */}
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === activeIndex 
                    ? 'w-10 h-1.5 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                    : 'w-2 h-1.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}