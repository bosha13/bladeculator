document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    form: document.querySelector('form'),
    inputs: Array.from(document.querySelectorAll('input[data-key]')),
    resultTitle: document.querySelector('.result-title'),
    result: document.getElementById('result'),
    bladeIcon: document.getElementById('blade-icon')
  };

  const stockInputs = elements.inputs.filter(input => input.dataset.multiplier);

  const parseNumber = (value, fallback = 0) => {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const getMin = (input) => {
    const minAttr = input.dataset.min ?? input.getAttribute('min');
    const min = parseNumber(minAttr, 0);
    return Number.isFinite(min) ? min : 0;
  };

  const normalizeInput = (input) => {
    const digitsOnly = input.value.replace(/[^0-9]/g, '');
    if (digitsOnly !== input.value) {
      input.value = digitsOnly;
    }

    const min = getMin(input);
    const value = parseNumber(input.value, min);
    if (input.value === '' || value < min) {
      input.value = String(min);
    }
  };

  const getStateFromInputs = () => {
    const state = {};
    elements.inputs.forEach(input => {
      state[input.dataset.key] = parseNumber(input.value, 0);
    });
    return state;
  };

  const calculateTotals = (state) => {
    const daysPerShave = Math.max(1, state.days || 1);
    const usesPerBlade = Math.max(1, state.uses || 1);

    const totalBlades = stockInputs.reduce((acc, input) => {
      const multiplier = parseNumber(input.dataset.multiplier, 0);
      const value = parseNumber(state[input.dataset.key], 0);
      return acc + value * multiplier;
    }, 0);

    const totalDays = totalBlades * usesPerBlade * daysPerShave;
    return { totalBlades, totalDays };
  };

  const renderResults = ({ totalBlades, totalDays }) => {
    if (totalBlades === 0) {
      elements.resultTitle.innerHTML = localization.t('zero_blades');
    } else {
      const pluralBlade = localization.pluralize(totalBlades, 'blade');
      elements.resultTitle.innerHTML = localization.t('blades_will_last', {
        count: localization.formatNumber(totalBlades),
        pluralBlade
      });
    }

    elements.result.innerHTML = localization.formatDuration(totalDays);
  };

  let lastSignature = null;
  const updateResults = ({ force = false } = {}) => {
    const state = getStateFromInputs();
    const signature = JSON.stringify(state);

    if (!force && signature === lastSignature) {
      return;
    }

    lastSignature = signature;
    renderResults(calculateTotals(state));
  };

  const handleInput = (event) => {
    normalizeInput(event.target);
    updateResults();
  };

  elements.form.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;

    const input = document.getElementById(btn.dataset.target);
    if (!input) return;

    const min = getMin(input);
    const current = parseNumber(input.value, min);
    const delta = btn.dataset.action === 'increase' ? 1 : -1;

    input.value = String(Math.max(min, current + delta));
    input.dispatchEvent(new Event('input'));
  });

  elements.inputs.forEach(input => {
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', () => setTimeout(() => input.select(), 10));
  });

  document.addEventListener('languagechange', () => updateResults({ force: true }));

  elements.bladeIcon.addEventListener('click', () => {
    const isColorMode = elements.bladeIcon.src.includes('color');
    elements.bladeIcon.src = isColorMode
      ? './images/blade.svg'
      : './images/blade-color.svg';
  });

  updateResults({ force: true });
});
