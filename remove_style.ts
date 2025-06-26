// remove-svg-styles.js
import fs from 'fs';
import path from 'path';

const dir = './src/components/youtube-icons'; // Папка с SVG

function cleanSvg(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = content.replace(/ style="[^"]*"/g, '');
    fs.writeFileSync(filePath, cleaned, 'utf8');
}

function walk(dirPath: string) {
    for (const file of fs.readdirSync(dirPath)) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.svg')) {
            cleanSvg(fullPath);
        }
    }
}

walk(dir);
console.log('✅ Все style="..." удалены');
