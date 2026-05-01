import fs from 'fs';
import path from 'path';

const dataDir = './data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to find keys that start with a digit but are unquoted
  // We look for patterns like ,05011: or {05011: or 5G050:
  // But we must be careful not to match values.
  
  // Pattern: (brace or comma) followed by (digit) followed by (alphanumeric) followed by (colon)
  const keyRegex = /([{,]\s*)([0-9][a-zA-Z0-9_]*)\s*:/g;
  
  const newContent = content.replace(keyRegex, (match, p1, p2) => {
    return `${p1}"${p2}":`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed unquoted numeric keys in ${file}`);
  }
});
