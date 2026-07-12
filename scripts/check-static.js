const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const localization = require('../localization.js');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'bladeculator.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));

const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML содержит повторяющиеся id');

const dataKeys = Array.from(html.matchAll(/\sdata-key="([^"]+)"/g), match => match[1]);
assert.equal(new Set(dataKeys).size, dataKeys.length, 'HTML содержит повторяющиеся data-key');
const knownDataKeys = new Set(dataKeys);
for (const match of html.matchAll(/\sdata-max-from="([^"]+)"/g)) {
  assert.ok(knownDataKeys.has(match[1]), `data-max-from ссылается на неизвестный ключ: ${match[1]}`);
}

const htmlAssets = Array.from(
  html.matchAll(/(?:src|href)="\.\/([^"?#]+)"/g),
  match => match[1]
);
const swAssetsBlock = sw.match(/const ASSETS = \[([\s\S]*?)\];/);
assert.ok(swAssetsBlock, 'Не найден список ASSETS в sw.js');
const swAssets = Array.from(
  swAssetsBlock[1].matchAll(/'\.\/([^']+)'/g),
  match => match[1]
);

const manifestAssets = (manifest.icons || [])
  .map(icon => icon.src)
  .filter(src => src.startsWith('./'))
  .map(src => src.slice(2));

for (const asset of new Set([...htmlAssets, ...swAssets, ...manifestAssets])) {
  assert.ok(fs.existsSync(path.join(root, asset)), `Не найден локальный ассет: ${asset}`);
}

const cachedAssets = new Set(swAssets);
for (const asset of htmlAssets) {
  assert.ok(cachedAssets.has(asset), `HTML-ассет отсутствует в PWA app shell: ${asset}`);
}

const referenceKeys = Object.keys(localization.translations.en).sort();
for (const [language, translations] of Object.entries(localization.translations)) {
  assert.deepEqual(
    Object.keys(translations).sort(),
    referenceKeys,
    `Набор ключей локализации ${language} отличается от en`
  );
}

console.log('Статические контракты корректны');
