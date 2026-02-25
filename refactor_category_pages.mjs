import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && !['index.astro', '404.astro', 'contact.astro', 'media-worth-mentioning.astro', 'musings.astro', 'biography.astro', 'women.astro'].includes(f));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const category = file.replace('.astro', '');

  // 1. Inject the import and collection fetching
  if (!content.includes("getCollection('artworks')")) {
    const frontmatterEndIndex = content.indexOf('---', 3);
    const injection = `import { getCollection } from 'astro:content';\n\nconst allArtworks = await getCollection('artworks');\nconst pageArtworks = allArtworks.filter(art => art.data.category === '${category}');\n`;
    content = content.slice(0, frontmatterEndIndex) + injection + content.slice(frontmatterEndIndex);
  }

  // 2. Replace the static <section class="gallery-grid"> with dynamic rendering
  const sectionRegex = /<section class="gallery-grid"[^>]*>([\s\S]*?)<\/section>/;
  const match = content.match(sectionRegex);
  
  if (match && !match[0].includes('pageArtworks.map')) {
    const dynamicSection = `<section class="gallery-grid" data-reveal>
    {pageArtworks.map((artwork, index) => (
      <div class="gallery-item" data-stagger>
        <img 
          src={artwork.data.image} 
          alt={artwork.data.title || "Artwork from ${category}"} 
          loading={index === 0 ? "eager" : "lazy"} 
          fetchpriority={index === 0 ? "high" : "auto"}
          decoding="async" 
        />
      </div>
    ))}
  </section>`;
    content = content.replace(sectionRegex, dynamicSection);
    fs.writeFileSync(filePath, content);
  }
}
console.log('All portfolio pages updated to use dynamic Keystatic Collections.');
