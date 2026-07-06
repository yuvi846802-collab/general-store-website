import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fallbackSlides = [
  {
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
    image: '/images/hero_background.png',
    badgeText: "Welcome to Naryawal's Finest",
    heading: 'Your Trusted General Store ',
    highlightText: 'in Naryawal',
    description: 'Quality Products • Affordable Prices • Trusted by Families',
    primaryBtnText: 'Call Now',
    primaryBtnLink: 'tel:+917704849886',
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

async function seed() {
  const existing = await prisma.heroSlide.count();
  if (existing === 0) {
    for (const slide of fallbackSlides) {
      await prisma.heroSlide.create({ data: slide });
    }
    console.log('Seeded HeroSlides successfully.');
  } else {
    console.log('HeroSlides already exist.');
  }
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
