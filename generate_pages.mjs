import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'scraped-data.json'), 'utf8'));

// We want to generate an astro file for each category
const pagesDir = path.join(__dirname, 'src', 'pages');

for (const [key, categoryData] of Object.entries(data)) {
    // skip index, 404
    if (key === 'index' || key === '404') continue;

    const pagePath = path.join(pagesDir, `${key}.astro`);
    const title = categoryData.title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const textHtml = categoryData.text && categoryData.text.length > 0 
        ? categoryData.text.map(t => `    <p>${t}</p>`).join('\n')
        : '';

    const imagesHtml = categoryData.images && categoryData.images.length > 0
        ? `
  <section class="gallery-grid">
${categoryData.images.map(img => `    <div class="gallery-item">
      <img src="${img}" alt="Artwork from ${title}" loading="lazy" />
    </div>`).join('\n')}
  </section>`
        : '';

    const afroContent = `---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import StructuredData from '../components/StructuredData.astro';
---

<Layout title="${title} | Ann M. Thane">
  <StructuredData />
  <Header />
  
  <main class="page-container fade-in">
    <header class="page-header">
      <h1 class="page-title">${title}</h1>
      <div class="page-divider"></div>
    </header>

    <div class="content-wrapper">
${textHtml}
    </div>

${imagesHtml}
  </main>

  <Footer />
</Layout>

<style>
  .page-container {
    padding-top: 120px;
    padding-bottom: 60px;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .page-title {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }
  
  .page-divider {
    height: 2px;
    width: 60px;
    background: var(--color-accent);
    margin: 0 auto;
  }

  .content-wrapper {
    max-width: 800px;
    margin: 0 auto 4rem;
    font-size: 1.1rem;
    line-height: 1.8;
  }

  .content-wrapper p {
    margin-bottom: 1.5rem;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 5%;
  }

  .gallery-item {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 4px;
    background: var(--color-surface);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }

  .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2.5rem;
    }
  }
</style>
`;

    fs.writeFileSync(pagePath, afroContent, 'utf8');
}

console.log('Successfully generated all Astro pages mapping perfectly to the old WordPress site!');
