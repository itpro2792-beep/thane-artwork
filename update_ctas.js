import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && !['index.astro', '404.astro', 'contact.astro', 'media-worth-mentioning.astro'].includes(f));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Look for the end of the intro block / content wrapper, and right before gallery-grid, inject a CTA 
  const targetSplitText = '<section class="gallery-grid"';
  
  // Don't inject if it already exists
  if (content.includes(targetSplitText) && !content.includes('portfolio-cta-block')) {
    const ctaHtml = `
    <div class="portfolio-cta-block" data-reveal style="text-align: center; margin-bottom: 4rem; padding: 2rem; background: var(--bg-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border);">
      <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-primary);">Interested in this style?</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Inquire about availability or discuss a custom commission.</p>
      <a href="/contact/" class="btn btn-primary" style="padding: 0.75rem 2rem; border-radius: 40px;">Contact for Inquiry</a>
    </div>

`;
    content = content.replace(targetSplitText, ctaHtml + targetSplitText);
    fs.writeFileSync(filePath, content);
  }
}
console.log('Added global CTA blocks to portfolio pages');
