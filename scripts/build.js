const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');



const scriptContent = fs.readFileSync(path.join(SRC, 'jscripts/main.min.js'), 'utf8').trim();
const stylesContent = fs.readFileSync(path.join(SRC, 'styles/styles.min.css'), 'utf8').trim();

const indexContent = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8')
        .replace(/<script.*?\/script>/i, `<script>${scriptContent}</script>`)
        .replace(/<link[^>]+>/i, `<style>${stylesContent}</style>`);

fs.writeFileSync(path.join(DIST, '404.html'), indexContent, 'utf-8');

console.log(`✅ Build terminé.`);