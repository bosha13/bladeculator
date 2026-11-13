const test = require('node:test');
const assert = require('node:assert/strict');
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem() {
      throw new Error('Storage unavailable');
    },
    setItem() {
      throw new Error('Storage unavailable');
    }
  }
});
// Node 21+ exposes navigator.languages from the system locale; pin it so the
// default-language fallback does not depend on where the tests run.
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: { languages: [], language: '' }
});
require('../core.js');
const localization = require('../localization.js');

test('локализация работает без доступного localStorage', () => {
  localization.memoryLanguage = null;
  assert.equal(localization.getCurrentLanguage(), 'en');
});

test('русская плюрализация обрабатывает основные формы', () => {
  localization.memoryLanguage = 'ru';
  assert.equal(localization.pluralize(1, 'day'), 'день');
  assert.equal(localization.pluralize(2, 'day'), 'дня');
  assert.equal(localization.pluralize(5, 'day'), 'дней');
  assert.equal(localization.pluralize(11, 'day'), 'дней');
  assert.equal(localization.pluralize(21, 'day'), 'день');
});

test('formatDuration использует исправленное разложение года', () => {
  localization.memoryLanguage = 'ru';
  assert.equal(localization.formatDuration(365), '1\u202Fгод');
  assert.equal(localization.formatDuration(395), '1\u202Fгод 1\u202Fмесяц');
});

test('formatNumber использует разделители тысяч языка', () => {
  localization.memoryLanguage = 'en';
  assert.equal(localization.formatNumber(12345), '12,345');
  localization.memoryLanguage = 'de';
  assert.equal(localization.formatNumber(12345), '12.345');
  localization.memoryLanguage = 'ru';
  assert.equal(localization.formatNumber(12345), '12 345');
  assert.equal(localization.formatNumber(100), '100');
});

test('pluralize использует категории CLDR для всех языков', () => {
  localization.memoryLanguage = 'en';
  assert.equal(localization.pluralize(1, 'blade'), 'blade');
  assert.equal(localization.pluralize(2, 'blade'), 'blades');
  localization.memoryLanguage = 'fr';
  assert.equal(localization.pluralize(0, 'jar'), 'pot');
  assert.equal(localization.getPluralCategory(0), 'one');
  localization.memoryLanguage = 'es';
  assert.equal(localization.pluralize(1000000, 'day'), 'días');
  localization.memoryLanguage = 'zh';
  assert.equal(localization.pluralize(5, 'day'), '天');
});
