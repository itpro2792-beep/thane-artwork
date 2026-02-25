const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && !['index.astro', '404.astro'].includes(f));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let pageName = file.replace('.astro', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  if (pageName === 'Creative Connections Clubhouse Mosaic') pageName = 'Creative Connections';
  
  const breadcrumbHtml = `
      <nav aria-label="Breadcrumb" class="breadcrumb" style="text-align: center; margin-bottom: 2rem; font-family: var(--font-mono); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 1px;">
        <a href="/" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='var(--accent-terracotta)'" onmouseout="this.style.color='var(--text-muted)'">Home</a> 
        <span style="color: var(--border-hover); margin: 0 0.5rem;">/</span> 
        <span style="color: var(--accent-sage);">${pageName}</span>
      </nav>`;
  
  if (!content.includes('aria-label="Breadcrumb"') && content.includes('<h1 class="page-title">')) {
    content = content.replace('<h1 class="page-title">', breadcrumbHtml + '\n      <h1 class="page-title">');
    fs.writeFileSync(filePath, content);
  }
}
console.log('Breadcrumbs added to subpages.');
