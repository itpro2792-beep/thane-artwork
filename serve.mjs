// Simple static file server for Mom's website
// Replaces Astro's preview server to avoid Vite host blocking
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST = join(__dirname, 'site', 'dist');
const PORT = 4321;

const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2',
    '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'application/xml',
    '.txt': 'text/plain',
};

createServer((req, res) => {
    let url = decodeURIComponent(req.url.split('?')[0]);
    if (url.endsWith('/')) url += 'index.html';
    if (!extname(url)) {
        // Try as directory with index.html (Astro SSG convention)
        const dirIndex = join(DIST, url, 'index.html');
        if (existsSync(dirIndex)) { url = url + '/index.html'; }
        else { url += '.html'; }
    }

    const filePath = join(DIST, url);
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        // Try 404 page
        const notFound = join(DIST, '404.html');
        if (existsSync(notFound)) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(readFileSync(notFound));
        } else {
            res.writeHead(404); res.end('Not Found');
        }
        return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(readFileSync(filePath));
}).listen(PORT, '0.0.0.0', () => {
    console.log(`\n[MOM'S SITE] Static server on http://0.0.0.0:${PORT}`);
    console.log(`[MOM'S SITE] Serving from: ${DIST}\n`);
});
