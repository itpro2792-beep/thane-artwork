const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/pages');

// Define the exact order of the portfolio for next/prev navigation
const portfolioNav = [
  { name: 'Home', file: 'index.astro', path: '/' },
  { name: 'The Women Series', file: 'women.astro', path: '/women/' },
  { name: 'Mosaics', file: 'mosaics.astro', path: '/mosaics/' },
  { name: 'Creative Connections Mosaic', file: 'creative-connections-clubhouse-mosaic.astro', path: '/creative-connections-clubhouse-mosaic/' },
  { name: 'Pottery', file: 'pottery.astro', path: '/pottery/' },
  { name: 'Murals', file: 'murals.astro', path: '/murals/' },
  { name: 'Pyrography', file: 'pyrography.astro', path: '/pyrography/' },
  { name: 'Photography', file: 'photography.astro', path: '/photography/' },
  { name: 'Jewelry', file: 'jewelry.astro', path: '/jewelry/' },
  { name: 'Embellished Furniture', file: 'embellished-furniture.astro', path: '/embellished-furniture/' },
  { name: 'Embellished Shells', file: 'embellished-shells.astro', path: '/embellished-shells/' },
  { name: 'Miscellaneous Projects', file: 'miscellaneous-projects.astro', path: '/miscellaneous-projects/' },
  { name: 'Older Work', file: 'older-work.astro', path: '/older-work/' }
];

for (let i = 1; i < portfolioNav.length; i++) { // Skip index.astro
  const current = portfolioNav[i];
  const prev = i > 1 ? portfolioNav[i-1] : null;
  const next = i < portfolioNav.length - 1 ? portfolioNav[i+1] : null;
  
  const filePath = path.join(dir, current.file);
  
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Extract first image for OpenGraph 
  const imgRegex = /<img[^>]+src="([^"]+)"/i;
  const match = content.match(imgRegex);
  if (match && match[1]) {
    const imgSrc = match[1];
    
    // Check if <Layout ... > already has image prop
    if (content.includes('<Layout') && !content.includes('image="')) {
       // Find the start of the layout tag and inject the image prop
       content = content.replace(/<Layout/i, `<Layout image="${imgSrc}"`);
    }
  }

  // 2. Add Prev/Next Page Navigation
  if (!content.includes('portfolio-page-nav')) {
    let navHtml = `\n    <nav class="portfolio-page-nav" data-reveal style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 2rem; margin-top: 2rem; max-width: 1400px; margin-left: auto; margin-right: auto; padding-left: 5%; padding-right: 5%;">\n`;
    
    if (prev) {
      navHtml += `      <a href="${prev.path}" class="nav-prev" style="text-decoration: none; color: var(--text-secondary);">&larr; ${prev.name}</a>\n`;
    } else {
      navHtml += `      <span></span>\n`; // Empty placeholder for flexbox spacing
    }
    
    if (next) {
      navHtml += `      <a href="${next.path}" class="nav-next" style="text-decoration: none; color: var(--text-secondary);">${next.name} &rarr;</a>\n`;
    }
    
    navHtml += `    </nav>\n  </main>`;
    
    content = content.replace('</main>', navHtml);
  }

  fs.writeFileSync(filePath, content);
  console.log('Processed', current.file);
}

// Add the hover styles to the Layout or global css if they aren't there.
// We can just rely on the existing btn logic or inline styles for now.
