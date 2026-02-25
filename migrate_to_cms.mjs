import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages');
const contentDir = path.join(process.cwd(), 'src/content/artworks');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && !['index.astro', '404.astro', 'contact.astro', 'media-worth-mentioning.astro', 'musings.astro', 'biography.astro'].includes(f));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const category = file.replace('.astro', '');
  
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"[^>]*>/g;
  let match;
  let index = 1;
  
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    let alt = match[2];
    
    // Keystatic expects the image to be relative to the publicPath or correctly formatted if we bypass the UI for now.
    // For now we just put the raw absolute path in the JSON string.
    const title = `${category}-${index}`;
    const entryDir = path.join(contentDir, title);
    
    if (!fs.existsSync(entryDir)) {
      fs.mkdirSync(entryDir, { recursive: true });
    }
    
    const entryData = {
      title: title,
      category: category,
      image: src,
      medium: "",
      dimensions: "",
      year: "",
      status: "available",
      description: ""
    };
    
    fs.writeFileSync(path.join(entryDir, 'index.json'), JSON.stringify(entryData, null, 2));
    index++;
  }
}
console.log('Migrated all portfolio imagery into CMS collections.');
