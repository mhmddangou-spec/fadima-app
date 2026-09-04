const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = path.join(__dirname, '..', '..', '..', '..', '.gemini', 'antigravity-ide', 'brain', '1175d3e1-6446-4a32-bd56-998ddaf7c093', 'fadima_icon_1788516857354.jpg');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputImage)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated icon-${size}x${size}.png`);
  }
  
  // Also generate favicon
  await sharp(inputImage)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(__dirname, '..', 'app', 'favicon.ico'));
  console.log('✓ Generated favicon.ico');
  
  console.log('\\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
