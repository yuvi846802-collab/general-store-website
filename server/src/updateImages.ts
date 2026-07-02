import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const sourceDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\d6455964-9aa8-4fff-ae54-36272c548c59';
const destDir = path.join(__dirname, '../../public/assets/categories');

// Create dest dir if not exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of category slug to source image regex
const imageMapping: Record<string, string> = {
  'grocery-items': 'category_grocery_',
  'beverages': 'category_beverages_',
  'snacks': 'category_snacks_',
  'household-essentials': 'category_household_',
  'personal-care': 'category_personal_',
  'cleaning-products': 'category_cleaning_',
  'daily-needs': 'category_grocery_', // fallback
  'stationery': 'category_household_', // fallback
};

async function main() {
  const files = fs.readdirSync(sourceDir);
  
  for (const [slug, prefix] of Object.entries(imageMapping)) {
    const matchingFile = files.find(f => f.startsWith(prefix) && f.endsWith('.png'));
    if (matchingFile) {
      const srcPath = path.join(sourceDir, matchingFile);
      const destName = `${slug}.png`;
      const destPath = path.join(destDir, destName);
      
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${matchingFile} to ${destPath}`);
      
      // Update DB
      const dbUrl = `/assets/categories/${destName}`;
      await prisma.category.updateMany({
        where: { slug: slug },
        data: { image: dbUrl }
      });
      console.log(`Updated DB for ${slug} with ${dbUrl}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
