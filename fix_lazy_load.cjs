const fs = require('fs');
const path = require('path');
const dir = 'C:/Antigravity Projects/Website Creation for Mom/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  if (content.includes('loading="eager"') && content.includes('index) =>')) {
    content = content.replace(/loading="eager"/g, 'loading={index < 4 ? "eager" : "lazy"}');
    if (content.includes('fetchpriority="high"')) {
      content = content.replace(/fetchpriority="high"/g, 'fetchpriority={index < 4 ? "high" : "auto"}');
    }
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + file);
  }
}
