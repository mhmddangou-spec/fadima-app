const fs = require('fs');
const path = require('path');

function fixMojibakeInString(content) {
  return content
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã®/g, 'î')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã€/g, 'À')
    .replace(/â€™/g, "'")
    .replace(/â€”/g, "—")
    .replace(/ðŸš€/g, "🚀")
    .replace(/ðŸ ª/g, "🏪")
    .replace(/ðŸŽ‰/g, "🎉")
    .replace(/âœ…/g, "✅")
    .replace(/âš¡/g, "⚡")
    .replace(/ðŸ“‹/g, "📋")
    .replace(/âœ“/g, "✓")
    .replace(/âš ï¸ /g, "⚠️")
    .replace(/ðŸ’¡/g, "💡")
    .replace(/Ã¯/g, 'ï');
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
