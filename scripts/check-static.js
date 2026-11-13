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
  html.matchAll(/(?:src|href)="(?!https?:|\/\/|data:)(?:\.\/)?([^"?#]+)"/g),
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

// Translation keys: everything used must exist, everything defined must be used.
// localization.js is scanned for t()/pluralize() calls only: its dictionaries contain every key.
const readScript = file => fs.readFileSync(path.join(root, file), 'utf8');
const htmlScripts = htmlAssets.filter(asset => asset.endsWith('.js'));
assert.ok(htmlScripts.includes('localization.js'), 'localization.js не подключён в HTML');
const appScripts = htmlScripts.filter(file => file !== 'localization.js').map(readScript);
const allScripts = [...appScripts, readScript('localization.js')];
const knownKeys = new Set(referenceKeys);
const markupKeys = Array.from(
  html.matchAll(/\sdata-(?:i18n|unit|action)="([^"]+)"/g),
  match => match[1]
);
const calledKeys = allScripts.flatMap(source => Array.from(
  source.matchAll(/\.t\('([^']+)'/g),
  match => match[1]
));
for (const key of [...markupKeys, ...calledKeys]) {
  assert.ok(knownKeys.has(key), `Ключ локализации не найден в словарях: ${key}`);
}

// Keys picked in ternaries or assigned to dataset appear in app scripts as plain literals.
const scriptLiterals = new Set(appScripts.flatMap(source => Array.from(
  source.matchAll(/'([a-z0-9_]+)'/g),
  match => match[1]
)));
const usedKeys = new Set([...markupKeys, ...calledKeys, ...scriptLiterals]);
for (const key of referenceKeys) {
  if (key === 'plurals') continue;
  assert.ok(usedKeys.has(key), `Ключ локализации нигде не используется: ${key}`);
}

// Plurals: same words in every language, every integer plural category covered,
// and every pluralize(n, 'word') call refers to an existing word.
const referenceWords = Object.keys(localization.translations.en.plurals).sort();
for (const [language, translations] of Object.entries(localization.translations)) {
  assert.deepEqual(
    Object.keys(translations.plurals).sort(),
    referenceWords,
    `Набор слов plurals в ${language} отличается от en`
  );
  const rules = new Intl.PluralRules(language);
  const integerCategories = new Set(Array.from({ length: 1001 }, (_, n) => rules.select(n)));
  for (const [word, forms] of Object.entries(translations.plurals)) {
    for (const category of integerCategories) {
      assert.ok(
        forms[category] ?? forms.other,
        `plurals.${word} в ${language}: нет формы для категории ${category}`
      );
    }
  }
}
const pluralizedWords = allScripts.flatMap(source => Array.from(
  source.matchAll(/pluralize\([^,]+,\s*'([^']+)'\)/g),
  match => match[1]
));
assert.ok(pluralizedWords.length > 0, 'Не найдены вызовы pluralize');
for (const word of pluralizedWords) {
  assert.ok(referenceWords.includes(word), `pluralize использует неизвестное слово: ${word}`);
}
for (const word of referenceWords) {
  assert.ok(pluralizedWords.includes(word), `Слово plurals нигде не используется: ${word}`);
}

console.log('Статические контракты корректны');
