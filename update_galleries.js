import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && !['index.astro', '404.astro'].includes(f));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add data-reveal to gallery-grid
  content = content.replace(/<section class="gallery-grid">/g, '<section class="gallery-grid" data-reveal>');
  content = content.replace(/<div class="gallery-grid">/g, '<div class="gallery-grid" data-reveal>'); // In case some use div
  
  // Add data-stagger to gallery-items
  content = content.replace(/<div class="gallery-item">/g, '<div class="gallery-item" data-stagger>');
  
  // Find img tags missing `loading="lazy"` and decoding. Actually, they all have `loading="lazy"`. Let's just find `loading="lazy"` and add decoding="async".
  content = content.replace(/loading="lazy"/g, 'loading="lazy" decoding="async"');
  
  // And let's get rid of any duplicates I might accidentally introduce by running it multiple times
  content = content.replace(/decoding="async" decoding="async"/g, 'decoding="async"');
  content = content.replace(/data-reveal data-reveal/g, 'data-reveal');
  content = content.replace(/data-stagger data-stagger/g, 'data-stagger');
  
  fs.writeFileSync(filePath, content);
}
console.log('Applied fast animation settings (data-reveal, data-stagger, async) to all portfolios.');
