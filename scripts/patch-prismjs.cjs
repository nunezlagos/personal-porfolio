const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'node_modules', 'prismjs', 'components');
const targetFile = path.join(targetDir, 'index.js');

const content = `'use strict';
module.exports = function loadLanguages(langs) {
  for (let i = 0; i < langs.length; i++) {
    try {
      require('./prism-' + langs[i]);
    } catch (e) {
    }
  }
};
`;

if (!fs.existsSync(targetDir)) {
  console.warn('patch-prismjs: no existe node_modules/prismjs/components, omitiendo.');
  process.exit(0);
}

try {
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('patch-prismjs: creado prismjs/components/index.js');
} catch (err) {
  console.error('patch-prismjs:', err.message);
  process.exit(1);
}
