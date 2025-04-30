const fs = require('fs');
const path = require('path');

// Получаем значение переменной окружения PLATFORM, либо 'web' по умолчанию
const platform = process.env.PLATFORM || 'web';

const content = `(function (window) {
  window.__env = window.__env || {};
  window.__env.platform = '${platform}';
})(this);
`;

const outputPath = path.join(__dirname, '..', 'assets',  'env.js');
fs.writeFileSync(outputPath, content);
console.log(`✅ Created env.js with platform: "${platform}"`);
