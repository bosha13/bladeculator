document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    form: document.querySelector('form'),
    inputs: Array.from(document.querySelectorAll('input[data-key]')),
    titleText: document.querySelector('.title-bar > span'),
    bladeResultTitle: document.querySelector('.results[data-mode-section="blades"] .result-title'),
    bladeResult: document.getElementById('result'),
    soapResultTitle: document.querySelector('.results[data-mode-section="soap"] .result-title'),
    soapResult: document.getElementById('soap-result'),
    modeIcons: Array.from(document.querySelectorAll('[data-mode]')),
    modeSections: Array.from(document.querySelectorAll('[data-mode-section]')),
    stockSizeElements: Array.from(document.querySelectorAll('.stock-size'))
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

  const getMax = (input) => {
    const maxAttr = input.dataset.max ?? input.getAttribute('max');
    if (maxAttr === null || maxAttr === undefined || maxAttr === '') {
      return Infinity;
    }
    const max = parseNumber(maxAttr, Infinity);
    return Number.isFinite(max) ? max : Infinity;
  };

  const getStep = (input) => {
    const stepAttr = input.dataset.step ?? input.getAttribute('step');
    const step = parseNumber(stepAttr, 1);
    return step > 0 ? step : 1;
  };

  const clampToStep = (value, min, step) => {
    if (!Number.isFinite(step) || step <= 0) return value;
    const offset = value - min;
    return Math.round(offset / step) * step + min;
  };

  const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

  const normalizeInput = (input) => {
    const digitsOnly = input.value.replace(/[^0-9]/g, '');
    if (digitsOnly !== input.value) {
      input.value = digitsOnly;
    }

    const min = getMin(input);
    const max = getMax(input);
    const step = getStep(input);
    let value = parseNumber(input.value, min);

    if (input.value === '') {
      value = min;
    }

    value = clampToStep(value, min, step);
    value = clampValue(value, min, max);

    input.value = String(value);
  };

  const getStateFromInputs = () => {
    const state = {};
    elements.inputs.forEach(input => {
      state[input.dataset.key] = parseNumber(input.value, 0);
    });
    return state;
  };

  const constrainSoapUsage = (state) => {
    const jarWeight = Math.max(1, state.soapJarWeight || 0);
    const gramsPerShave = Math.max(1, state.soapGramsPerShave || 1);
    if (gramsPerShave > jarWeight) {
      const soapInput = elements.inputs.find(input => input.dataset.key === 'soapGramsPerShave');
      if (soapInput) {
        soapInput.value = String(jarWeight);
      }
      return { ...state, soapGramsPerShave: jarWeight };
    }
    return state;
  };

  const calculateBladeTotals = (state) => {
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

  const calculateSoapTotals = (state) => {
    const daysPerShave = Math.max(1, state.days || 1);
    const gramsPerShave = Math.max(1, state.soapGramsPerShave || 1);
    const jarWeight = Math.max(1, state.soapJarWeight || 0);

    const full = parseNumber(state.soapFull, 0);
    const rest75 = parseNumber(state.soap75, 0);
    const rest50 = parseNumber(state.soap50, 0);
    const rest25 = parseNumber(state.soap25, 0);

    const totalJars = full + rest75 * 0.75 + rest50 * 0.5 + rest25 * 0.25;
    const totalContainers = full + rest75 + rest50 + rest25;
    const totalGrams = jarWeight * totalJars;
    const shaves = gramsPerShave > 0 ? Math.floor(totalGrams / gramsPerShave) : 0;
    const totalDays = shaves * daysPerShave;

    return { totalDays, totalGrams, totalContainers };
  };

  const formatAmount = (value) => {
    const rounded = Math.round(value);
    return localization.formatNumber(rounded);
  };

  const updateStockSizes = () => {
    elements.stockSizeElements.forEach(el => {
      const size = parseFloat(el.dataset.size);
      if (!Number.isFinite(size)) return;
      const unitKey = el.dataset.unit || 'pieces';
      el.textContent = `${formatAmount(size)} ${localization.t(unitKey)} ×`;
    });
  };

  const renderBladeResults = ({ totalBlades, totalDays }) => {
    if (totalBlades === 0) {
      elements.bladeResultTitle.innerHTML = localization.t('zero_blades');
    } else {
      const pluralBlade = localization.pluralize(totalBlades, 'blade');
      elements.bladeResultTitle.innerHTML = localization.t('blades_will_last', {
        count: localization.formatNumber(totalBlades),
        pluralBlade
      });
    }

    elements.bladeResult.innerHTML = localization.formatDuration(totalDays);
  };

  const renderSoapResults = ({ totalDays, totalContainers }) => {
    elements.soapResult.innerHTML = localization.formatDuration(totalDays);

    if (elements.soapResultTitle) {
      const isSingular = totalContainers === 1;
      const key = isSingular
        ? 'soap_will_last_with_count_singular'
        : 'soap_will_last_with_count_plural';
      const pluralJar = localization.pluralize(totalContainers, 'jar');
      elements.soapResultTitle.innerHTML = localization.t(key, {
        count: localization.formatNumber(totalContainers),
        pluralJar
      });
    }
  };

  const updateModeTitles = (mode) => {
    const titleKey = mode === 'soap' ? 'app_title_soap' : 'app_title_blades';
    const title = localization.t(titleKey);
    if (elements.titleText) {
      elements.titleText.textContent = title;
    }
    document.title = title;
  };

  let lastSignature = null;
  const updateResults = ({ force = false } = {}) => {
    const state = constrainSoapUsage(getStateFromInputs());
    const signature = JSON.stringify(state);

    if (!force && signature === lastSignature) {
      return;
    }

    lastSignature = signature;
    updateStockSizes();
    renderBladeResults(calculateBladeTotals(state));
    renderSoapResults(calculateSoapTotals(state));
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
    const max = getMax(input);
    const step = getStep(input);
    const current = parseNumber(input.value, min);
    const delta = btn.dataset.action === 'increase' ? step : -step;

    input.value = String(clampValue(current + delta, min, max));
    input.dispatchEvent(new Event('input'));
  });

  elements.inputs.forEach(input => {
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', () => setTimeout(() => input.select(), 10));
  });

  let currentMode = 'blades';
  const setMode = (mode) => {
    currentMode = mode;
    document.body.dataset.mode = mode;
    elements.modeSections.forEach(section => {
      section.hidden = section.dataset.modeSection !== mode;
    });
    elements.modeIcons.forEach(icon => {
      icon.classList.toggle('active', icon.dataset.mode === mode);
    });
    const bladeIcon = document.getElementById('blade-icon');
    if (bladeIcon) {
      bladeIcon.src = mode === 'blades' ? './images/blade-color.svg' : './images/blade.svg';
    }
    updateModeTitles(mode);
  };

  elements.modeIcons.forEach(icon => {
    icon.addEventListener('click', () => setMode(icon.dataset.mode));
  });

  document.addEventListener('languagechange', () => {
    updateResults({ force: true });
    updateModeTitles(currentMode);
  });

  elements.inputs.forEach(normalizeInput);
  setMode('blades');
  updateResults({ force: true });
});
