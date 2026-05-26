import fs from 'fs';
import path from 'path';

// Create a simple SVG favicon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#FF6B35"/>
  <text x="16" y="23" font-size="20" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">S</text>
</svg>`;

// Convert SVG to ICO using a simple approach - create as favicon.svg
const faviconPath = path.join('D:\Learning\spareKart\public', 'favicon.svg');
fs.mkdirSync(path.dirname(faviconPath), { recursive: true });
fs.writeFileSync(faviconPath, svg);

console.log('✅ Favicon created at public/favicon.svg');
