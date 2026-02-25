const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && !['index.astro', '404.astro', 'biography.astro', 'mosaics.astro'].includes(f));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old plain text header with the styled dark mode header
  const oldHeaderRegex = /<div class="content-wrapper">\s*<p>ANN M\. THANE<\/p>\s*<p>artist • explorer • mom<\/p>/g;
  const newHeader = `<div class="content-wrapper">\n      <div class="intro-block" data-reveal>\n        <p class="lead" style="margin-bottom: 0px; font-size: var(--text-3xl); font-family: var(--font-display); color: var(--text-primary); text-align: center;">ANN M. THANE</p>\n        <p class="meta" style="font-family: var(--font-mono); font-size: var(--text-sm); letter-spacing: 2px; text-transform: uppercase; color: var(--accent-sage); text-align: center; margin-bottom: 4rem;">artist • explorer • mom</p>\n      </div>`;
  
  content = content.replace(oldHeaderRegex, newHeader);
  fs.writeFileSync(filePath, content);
}
console.log('Updated the intro blocks in:', files.join(', '));
