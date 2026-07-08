const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const features = [
  { 
    title: "Quality Products", 
    icon: "ShieldCheck", 
    description: "We source only the best products for our customers, ensuring freshness and quality.",
    color: "text-emerald-400",
    displayOrder: 0
  },
  { 
    title: "Affordable Prices", 
    icon: "Tag", 
    description: "Great value for your money. We keep our prices competitive without compromising on quality.",
    color: "text-amber-400",
    displayOrder: 1
  },
  { 
    title: "Trusted Local Store", 
    icon: "MapPin", 
    description: "A neighborhood staple in Naryawal for years. We're proud to serve our community.",
    color: "text-teal-400",
    displayOrder: 2
  },
  { 
    title: "Friendly Service", 
    icon: "Smile", 
    description: "Always greeted with a smile. Our staff is ready to help you find what you need.",
    color: "text-blue-400",
    displayOrder: 3
  },
  { 
    title: "Wide Selection", 
    icon: "Layers", 
    description: "From daily groceries to household essentials, find everything under one roof.",
    color: "text-purple-400",
    displayOrder: 4
  },
  { 
    title: "Customer Satisfaction", 
    icon: "ThumbsUp", 
    description: "Your happiness is our priority. We go the extra mile to ensure you leave satisfied.",
    color: "text-green-400",
    displayOrder: 5
  },
];

async function seed() {
  console.log("Seeding Why Choose Us Features...");
  
  // Clear existing if any (optional, but good for reset)
  await prisma.whyChooseUsFeature.deleteMany({});
  
  for (const feature of features) {
    await prisma.whyChooseUsFeature.create({
      data: feature
    });
  }
  
  console.log("Seeding complete!");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
