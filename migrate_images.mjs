import { promises as fs } from 'fs';
import path from 'path';

const publicDir = path.resolve('public/images');
const assetsDir = path.resolve('src/assets/images');
const contentDir = path.resolve('src/content/artworks');

async function migrate() {
    // 1. Rename public/images to src/assets/images
    try {
        await fs.mkdir(path.resolve('src/assets'), { recursive: true });
        await fs.rename(publicDir, assetsDir);
        console.log('Moved public/images to src/assets/images');
    } catch (e) {
        console.error('Error moving directory, maybe already moved?', e);
    }

    // 2. Update JSON files
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    let updated = 0;

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const jsonPath = path.join(contentDir, entry.name, 'index.json');
        try {
            const data = await fs.readFile(jsonPath, 'utf8');
            let json = JSON.parse(data);

            if (json.image && json.image.startsWith('/images/')) {
                // Change /images/.... to ../../../assets/images/....
                json.image = json.image.replace('/images/', '../../../assets/images/');
                await fs.writeFile(jsonPath, JSON.stringify(json, null, 2));
                updated++;
            }
        } catch (e) {
            console.error(`Error processing ${entry.name}:`, e.message);
        }
    }

    console.log(`Updated ${updated} JSON files with relative image paths.`);
}

migrate();
