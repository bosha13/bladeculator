const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core.js');

test('splitDuration корректно обрабатывает границы года', () => {
  assert.deepEqual(core.splitDuration(364), { years: 0, months: 12, remainingDays: 4 });
  assert.deepEqual(core.splitDuration(365), { years: 1, months: 0, remainingDays: 0 });
  assert.deepEqual(core.splitDuration(366), { years: 1, months: 0, remainingDays: 1 });
  assert.deepEqual(core.splitDuration(395), { years: 1, months: 1, remainingDays: 0 });
  assert.deepEqual(core.splitDuration(730), { years: 2, months: 0, remainingDays: 0 });
});

test('calculateBladeTotals учитывает DE и SE отдельно', () => {
  const state = { days: 2, deUses: 3, seUses: 4, dePacks: 2, sePacks: 1 };
  const stock = [
    { key: 'dePacks', multiplier: 5, bladeType: 'de' },
    { key: 'sePacks', multiplier: 10, bladeType: 'se' }
  ];

  assert.deepEqual(core.calculateBladeTotals(state, stock), {
    totalBlades: 20,
    totalDays: 140
  });
});

test('calculateSoapTotals учитывает приблизительный остаток банок', () => {
  const result = core.calculateSoapTotals({
    days: 2,
    soapGramsPerShave: 3,
    soapJarWeight: 120,
    soapFull: 1,
    soap75: 1,
    soap50: 1,
    soap25: 1
  });

  assert.deepEqual(result, {
    totalDays: 200,
    totalGrams: 300,
    totalContainers: 4
  });
});

test('normalizeNumericValue применяет шаг и зависимый максимум', () => {
  assert.equal(core.normalizeNumericValue(12, { min: 5, max: 10, step: 5 }), 10);
  assert.equal(core.normalizeNumericValue(123, {
    min: 5,
    max: 120,
    step: 5,
    clampStep: false
  }), 120);
});
