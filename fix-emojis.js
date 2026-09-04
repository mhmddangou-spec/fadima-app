const fs = require('fs');
const path = require('path');

function fixMojibakeInString(content) {
  return content
    .replace(/ðŸš—/g, "🚗")
    .replace(/ðŸ“¦/g, "📦")
    .replace(/ðŸ  /g, "🏠")
    .replace(/ðŸ“±/g, "📱")
    .replace(/ðŸ‘¤/g, "👤")
    .replace(/ðŸ ”/g, "🍔")
    .replace(/ðŸŒ /g, "🌐")
    .replace(/ðŸ’µ/g, "💵")
    .replace(/ðŸ”„/g, "🔄")
    .replace(/ðŸ’¸/g, "💸")
    .replace(/ðŸ‘‹/g, "👋")
    .replace(/ðŸ‘¥/g, "👥")
    .replace(/ðŸ“ /g, "📍")
    .replace(/â†’/g, "→")
    .replace(/Ã©/g, 'é') // just in case
    .replace(/ðŸ ª/g, "🏪")
    .replace(/ðŸš€/g, "🚀");
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.md')) {
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      const fixedContent = fixMojibakeInString(originalContent);
      if (originalContent !== fixedContent) {
        fs.writeFileSync(fullPath, fixedContent, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

const dirsToProcess = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components'),
  path.join(__dirname, 'lib')
];

for (const dir of dirsToProcess) {
  processDirectory(dir);
}
