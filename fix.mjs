import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/components/admin/GlobalSearch.tsx',
  'src/components/Footer.tsx',
  'src/components/ProductCategories.tsx',
  'src/pages/admin/Users.tsx',
  'src/pages/admin/ContentEditor.tsx',
  'src/pages/admin/Reviews.tsx',
  'src/pages/not-found.tsx'
];

filesToFix.forEach(relativePath => {
  const filePath = path.resolve(process.cwd(), relativePath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace hardcoded white/black background opacities
    content = content.replace(/bg-white\/\[?0?\.?\d+\]?/g, 'bg-accent/50');
    content = content.replace(/bg-white\/\d+/g, 'bg-accent/50');
    content = content.replace(/bg-white/g, 'bg-background');
    content = content.replace(/bg-black\/\d+/g, 'bg-foreground/10');
    
    // Replace text colors
    content = content.replace(/text-slate-\d00/g, 'text-muted-foreground');
    content = content.replace(/text-gray-\d00/g, 'text-muted-foreground');
    content = content.replace(/text-white\/\d+/g, 'text-muted-foreground');
    content = content.replace(/text-white/g, 'text-foreground');
    content = content.replace(/text-black/g, 'text-foreground');
    
    // Replace borders
    content = content.replace(/border-white\/\d+/g, 'border-border');
    content = content.replace(/border-gray-\d00/g, 'border-border');
    
    // Hover states
    content = content.replace(/hover:bg-white\/\d+/g, 'hover:bg-accent');
    content = content.replace(/hover:text-slate-\d00/g, 'hover:text-foreground');
    content = content.replace(/hover:text-white/g, 'hover:text-foreground');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed colors in ${relativePath}`);
  }
});
