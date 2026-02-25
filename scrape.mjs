import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = {
    'biography': 'https://thaneartwork.com/biography/',
    'creative-connections-clubhouse-mosaic': 'https://thaneartwork.com/mosaic/',
    'embellished-furniture': 'https://thaneartwork.com/micellaneous-projects/',
    'embellished-shells': 'https://thaneartwork.com/embellished-shells/',
    'jewelry': 'https://thaneartwork.com/jewelry/',
    'media-worth-mentioning': 'https://thaneartwork.com/media-worth-mentioning/',
    'miscellaneous-projects': 'https://thaneartwork.com/miscellaneous-projects/',
    'mosaics': 'https://thaneartwork.com/mother-mosaic/',
    'murals': 'https://thaneartwork.com/murals/',
    'musings': 'https://thaneartwork.com/poetry/',
    'older-work': 'https://thaneartwork.com/older-work/',
    'photography': 'https://thaneartwork.com/photography/',
    'pottery': 'https://thaneartwork.com/pottery/',
    'pyrography': 'https://thaneartwork.com/pyrography/',
    'women': 'https://thaneartwork.com/women/',
    'contact': 'https://thaneartwork.com/contact/'
};

async function scrape() {
    const scrapedData = {};

    for (const [key, url] of Object.entries(pages)) {
        console.log(`\n--- Processing ${key} ---`);
        
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.log(`Failed to fetch ${url}`);
                continue;
            }
            const html = await res.text();
            
            // Try to extract some text (just paragraph tags roughly)
            const textMatches = Array.from(html.matchAll(/<p[^>]*>(.*?)<\/p>/gis));
            const textContent = textMatches
                .map(m => m[1].replace(/<[^>]+>/g, '').trim())
                .filter(t => t.length > 0 && !t.includes('Theme:') && !t.includes('Blog at WordPress.com') && !t.match(/Already have a WordPress\.com account/));

            // Find images
            const imgRegex = /<img[^>]+src="([^">]+\.(?:jpg|jpeg|png))(?:\?[^"]*)?"/gi;
            let match;
            const imageUrls = new Set();
            
            while ((match = imgRegex.exec(html)) !== null) {
                let imgUrl = match[1];
                // remove resize postfix e.g. -300x200
                imgUrl = imgUrl.replace(/-\d+x\d+(?=\.(?:jpg|jpeg|png)$)/i, '');
                if (imgUrl.includes('wp-content/uploads')) {
                    imageUrls.add(imgUrl);
                }
            }
            
            const localImages = [];
            if (imageUrls.size > 0) {
                const outDir = path.join(__dirname, 'public', 'images', key);
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                }
                
                let i = 1;
                for (const imgUrl of imageUrls) {
                    try {
                        const imgRes = await fetch(imgUrl);
                        if (imgRes.ok) {
                            const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
                            const filename = `${key}-${i}${ext}`;
                            const buf = await imgRes.arrayBuffer();
                            fs.writeFileSync(path.join(outDir, filename), Buffer.from(buf));
                            console.log(`Saved ${filename}`);
                            localImages.push(`/images/${key}/${filename}`);
                            i++;
                        } else {
                            console.log(`Failed to fetch img ${imgUrl} - status ${imgRes.status}`);
                        }
                    } catch (e) {
                        console.error(`Failed to download ${imgUrl} - ${e.message}`);
                    }
                }
            } else {
                console.log(`No images found.`);
            }

            scrapedData[key] = {
                title: key.replace(/-/g, ' '),
                text: textContent,
                images: localImages
            };

        } catch(e) {
            console.error(`Error processing ${key}: ${e.message}`);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'scraped-data.json'), JSON.stringify(scrapedData, null, 2));
    console.log('\n--- Scraping complete. Data saved to scraped-data.json ---');
}

scrape();
