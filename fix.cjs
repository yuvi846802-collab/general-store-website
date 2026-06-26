const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, content.replace(search, replace));
  } catch(e) {}
};

const files = [
  'src/App.tsx',
  'src/components/AboutSection.tsx',
  'src/components/ContactSection.tsx',
  'src/components/CTASection.tsx',
  'src/components/Footer.tsx',
  'src/components/HeroSection.tsx',
  'src/components/InstagramSection.tsx',
  'src/components/Navbar.tsx',
  'src/components/ReviewsSection.tsx',
  'src/components/StatsSection.tsx',
  'src/components/WhyChooseUs.tsx',
  'src/pages/Home.tsx',
];

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace `import React, { Hook } from "react";` with `import { Hook } from "react";`
    content = content.replace(/import\s+React\s*,\s*\{/g, 'import {');
    
    // Replace `import React from "react";` (or with single quotes) with nothing
    content = content.replace(/import\s+React\s+from\s+["']react["'];?\r?\n?/g, '');
    
    fs.writeFileSync(f, content);
  } catch (e) {
    console.error(`Error processing ${f}:`, e);
  }
});

// Specific unused variables
replaceInFile('src/components/ContactSection.tsx', /,\s*FaInstagram/, '');
replaceInFile('src/components/ContactSection.tsx', /FaInstagram,\s*/, '');
replaceInFile('src/components/Footer.tsx', /,\s*Mail/, '');
replaceInFile('src/components/Footer.tsx', /Mail,\s*/, '');
replaceInFile('src/constants/data.ts', /,\s*Product/, '');
replaceInFile('src/constants/data.ts', /Product,\s*/, '');

// Fix tsconfig.json for Vite env
try {
  const tsconfigPath = 'tsconfig.json';
  const tsconfigStr = fs.readFileSync(tsconfigPath, 'utf8');
  const tsconfig = JSON.parse(tsconfigStr);
  tsconfig.compilerOptions.types = ["vite/client"];
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
} catch(e) {}

console.log('Fixes applied.');
