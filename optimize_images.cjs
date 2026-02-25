const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicImagesDir = path.join(__dirname, 'public', 'images');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const allFiles = walkSync(publicImagesDir);
const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

console.log(`Found ${imageFiles.length} images to optimize.`);

async function processImages() {
  let totalSaved = 0;
  for (const file of imageFiles) {
    const stats = fs.statSync(file);
    const originalSize = stats.size;
    
    // Only optimize if > 250KB for speed, or always resize?
    // Let's just do everything > 300KB
    if (originalSize < 300000) continue;

    const tempFile = file + '.tmp';
    
    try {
      await sharp(file)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80, force: false })
        .png({ quality: 80, force: false })
        .toFile(tempFile);
      
      const newStats = fs.statSync(tempFile);
      if (newStats.size < originalSize) {
        try {
          fs.renameSync(tempFile, file);
          totalSaved += (originalSize - newStats.size);
          console.log(`✅ Optimized ${path.basename(file)}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newStats.size / 1024 / 1024).toFixed(2)}MB`);
        } catch(e) {
          console.log(`⚠️ Could not save over ${file}, locked.`);
        }
      } else {
        try { fs.unlinkSync(tempFile); } catch(e){}
      }
    } catch (e) {
      console.error(`❌ Failed processing ${path.basename(file)}: ${e.message}`);
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch(e){}
      }
    }
  }
  console.log(`\n🎉 Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB!`);
}

processImages();
