import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace dynamic eager/lazy loading with just eager
  content = content.replace(/loading=\{index === 0 \? "eager" : "lazy"\}/g, 'loading="eager"');
  content = content.replace(/fetchpriority=\{index === 0 \? "high" : "auto"\}/g, 'fetchpriority="high"');
  
  // Also look for any hardcoded loading="lazy" in index.astro or others
  content = content.replace(/loading="lazy"/g, 'loading="eager"');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Finished updating ${modifiedCount} files to remove lazy loading.`);
