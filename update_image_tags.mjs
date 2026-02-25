import { promises as fs } from 'fs';
import path from 'path';

const pagesDir = path.resolve('src/pages');

async function processFile(filePath) {
    let content = await fs.readFile(filePath, 'utf8');

    // Skip if it doesn't have an img tag we care about or already has Image
    if (!content.includes('<img ') || content.includes("import { Image } from 'astro:assets';")) return;

    // Add import statement
    content = content.replace(
        /---\r?\n/,
        "---\r\nimport { Image } from 'astro:assets';\r\n"
    );

    // Replace <img with <Image
    content = content.replace(/<img /g, '<Image ');

    await fs.writeFile(filePath, content);
    console.log(`✅ Updated ${path.basename(filePath)}`);
}

async function migrate() {
    const entries = await fs.readdir(pagesDir);
    for (const entry of entries) {
        if (entry.endsWith('.astro')) {
            await processFile(path.join(pagesDir, entry));
        }
    }
}

migrate();
