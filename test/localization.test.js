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
