document.addEventListener('DOMContentLoaded', () => {
  const core = window.bladeculatorCore;
  const haptics = window.appHaptics;
  const elements = {
    form: document.querySelector('form'),
    content: document.querySelector('.content'),
    window: document.querySelector('.window'),
    inputs: Array.from(document.querySelectorAll('input[data-key]')),
    titleText: document.querySelector('.title-bar > span'),
    bladeResultTitle: document.querySelector('.results[data-mode-section="blades"] .result-title'),
    bladeResult: document.getElementById('result'),
    soapResultTitle: document.querySelector('.results[data-mode-section="soap"] .result-title'),
    soapResult: document.getElementById('soap-result'),
    modeIcons: Array.from(document.querySelectorAll('[data-mode]')),
    modeSections: Array.from(document.querySelectorAll('[data-mode-section]')),
    stockSizeElements: Array.from(document.querySelectorAll('.stock-size')),
    aboutButton: document.querySelector('.about-button'),
    aboutWindow: document.querySelector('.about-window'),
    aboutClose: document.querySelector('.about-close'),
    resetButton: document.querySelector('.reset-button')
  };

  const STATE_STORAGE_KEY = 'bladeculatorStateV1';
  const defaultInputValues = new Map(
    elements.inputs.map(input => [input.dataset.key, input.defaultValue])
  );

  const stockInputs = elements.inputs.filter(input => input.dataset.multiplier);
  const stockConfig = stockInputs.map(input => ({
    key: input.dataset.key,
    multiplier: parseInt(input.dataset.multiplier, 10) || 0,
    bladeType: input.dataset.bladeType || 'de'
  }));
  const maxFromMap = elements.inputs.reduce((acc, input) => {
    const key = input.dataset.maxFrom;
    if (!key) return acc;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key).push(input);
    return acc;
  }, new Map());

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
    const maxFromKey = input.dataset.maxFrom;
    if (maxFromKey) {
      const refInput = elements.inputs.find(item => item.dataset.key === maxFromKey);
      if (refInput) {
        return parseNumber(refInput.value, Infinity);
      }
    }
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

  const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

  const triggerHaptic = (pattern) => {
    const handler = haptics && haptics[pattern];
    if (typeof handler === 'function') {
      handler();
    }
  };

  // Last normalized value of each input. Calculations read these, so an emptied
  // or half-typed field never leaks into results or storage.
  const committedValues = new Map();

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

    value = core.normalizeNumericValue(value, {
      min,
      max,
      step,
      clampStep: input.dataset.stepClamp !== 'false'
    });

    input.value = String(value);
    committedValues.set(input, value);
  };

  const getStateFromInputs = () => {
    const state = {};
    elements.inputs.forEach(input => {
      state[input.dataset.key] = committedValues.get(input) ?? parseNumber(input.value, 0);
    });
    return state;
  };

  const readStoredState = () => {
    try {
      const raw = localStorage.getItem(STATE_STORAGE_KEY);
      if (!raw) return null;
      const stored = JSON.parse(raw);
      if (
        !stored ||
        stored.version !== 1 ||
        !stored.values ||
        typeof stored.values !== 'object' ||
        Array.isArray(stored.values)
      ) {
        return null;
      }
      return stored;
    } catch (error) {
      return null;
    }
  };

  const restoreState = () => {
    const stored = readStoredState();
    if (!stored) return 'blades';

    elements.inputs.forEach(input => {
      const value = stored.values[input.dataset.key];
      if (Number.isFinite(value)) {
        input.value = String(value);
      }
    });

    return stored.mode === 'soap' ? 'soap' : 'blades';
  };

  let currentMode = null;
  const persistState = () => {
    try {
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
        version: 1,
        mode: currentMode || 'blades',
        values: getStateFromInputs()
      }));
    } catch (error) {
      // Storage can be unavailable; calculations must keep working in memory.
    }
  };

  const calculateBladeTotals = (state) => core.calculateBladeTotals(state, stockConfig);
  const calculateSoapTotals = (state) => core.calculateSoapTotals(state);

  const getCurrentModeInputs = () => elements.inputs.filter(input => {
    const modeSection = input.closest('[data-mode-section]');
    return !modeSection || modeSection.dataset.modeSection === currentMode;
  });

  const updateResetVisibility = () => {
    if (!elements.resetButton || !currentMode) return;
    elements.resetButton.hidden = !getCurrentModeInputs().some(input => (
      input.value !== (defaultInputValues.get(input.dataset.key) ?? '')
    ));
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
      elements.bladeResultTitle.textContent = localization.t('zero_blades');
    } else {
      const pluralBlade = localization.pluralize(totalBlades, 'blade');
      const key = localization.getPluralCategory(totalBlades) === 'one'
        ? 'blades_will_last_singular'
        : 'blades_will_last';
      elements.bladeResultTitle.textContent = localization.t(key, {
        count: localization.formatNumber(totalBlades),
        pluralBlade
      });
    }

    elements.bladeResult.textContent = localization.formatDuration(totalDays);
  };

  const renderSoapResults = ({ totalDays, totalContainers }) => {
    elements.soapResult.textContent = localization.formatDuration(totalDays);

    if (elements.soapResultTitle) {
      const isSingular = localization.getPluralCategory(totalContainers) === 'one';
      const key = isSingular
        ? 'soap_will_last_with_count_singular'
        : 'soap_will_last_with_count_plural';
      const pluralJar = localization.pluralize(totalContainers, 'jar');
      elements.soapResultTitle.textContent = localization.t(key, {
        count: localization.formatNumber(totalContainers),
        pluralJar
      });
    }
  };

  const updateModeTitles = (mode) => {
    const titleKey = mode === 'soap' ? 'app_title_soap' : 'app_title_blades';
    const title = localization.t(titleKey);
    if (elements.titleText) {
      // Keep the key in sync so select-localize.js does not restore the blades title.
      elements.titleText.dataset.i18n = titleKey;
      elements.titleText.textContent = title;
    }
    document.title = title;
  };

  let lastSignature = null;
  const updateResults = ({ force = false } = {}) => {
    updateResetVisibility();
    const state = getStateFromInputs();
    const signature = JSON.stringify(state);

    if (!force && signature === lastSignature) {
      return;
    }

    lastSignature = signature;
    renderBladeResults(calculateBladeTotals(state));
    renderSoapResults(calculateSoapTotals(state));
    persistState();
  };

  const commitInput = (input) => {
    normalizeInput(input);
    const key = input.dataset.key;
    if (key && maxFromMap.has(key)) {
      maxFromMap.get(key).forEach(normalizeInput);
    }
    updateResults();
  };

  const handleInput = (event) => {
    const input = event.target;
    // A cleared field stays empty while the user types; blur restores or commits it.
    if (input.value === '') {
      updateResetVisibility();
      return;
    }
    if (input.dataset.allowEmptyOnInput === 'true') {
      if (event.isTrusted) {
        const digitsOnly = input.value.replace(/[^0-9]/g, '');
        if (digitsOnly !== input.value) {
          input.value = digitsOnly;
        }
        updateResetVisibility();
        return;
      }
      commitInput(input);
      return;
    }
    commitInput(input);
  };

  // Returns false when the value is already at its limit.
  const stepInput = (btn) => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return false;

    const min = getMin(input);
    const max = getMax(input);
    const step = getStep(input);
    const current = parseNumber(input.value, min);
    const delta = btn.dataset.action === 'increase' ? step : -step;
    const nextValue = clampValue(current + delta, min, max);

    if (nextValue === current) {
      return false;
    }

    triggerHaptic('selection');

    input.value = String(nextValue);
    input.dispatchEvent(new Event('input'));
    return true;
  };

  const HOLD_DELAY = 400;
  const HOLD_INTERVAL = 80;
  let holdTimer = null;
  let holdRepeated = false;
  const stopHold = () => {
    clearTimeout(holdTimer);
    holdTimer = null;
  };

  elements.form.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    // The pointer click that ends a press-and-hold must not add one more step.
    // Keyboard clicks have detail 0 and are never suppressed.
    if (event.detail !== 0 && holdRepeated) return;
    stepInput(btn);
  });

  elements.form.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      stopHold();
      holdRepeated = false;
      const repeat = () => {
        holdRepeated = true;
        holdTimer = stepInput(btn) ? setTimeout(repeat, HOLD_INTERVAL) : null;
      };
      holdTimer = setTimeout(repeat, HOLD_DELAY);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => {
      btn.addEventListener(type, stopHold);
    });
    // Long press must not open the image context menu on touch devices.
    btn.addEventListener('contextmenu', event => event.preventDefault());
  });

  // Native modal <dialog> handles focus trapping, Escape, background inertness and focus restore.
  if (elements.aboutButton && elements.aboutWindow) {
    elements.aboutButton.addEventListener('click', () => {
      triggerHaptic('selection');
      elements.aboutWindow.showModal();
    });
  }
  if (elements.aboutClose && elements.aboutWindow) {
    elements.aboutClose.addEventListener('click', () => elements.aboutWindow.close());
  }
  if (elements.aboutWindow) {
    elements.aboutWindow.addEventListener('click', (event) => {
      // Clicks on the backdrop are dispatched to the dialog itself, outside its box.
      if (event.target !== elements.aboutWindow) return;
      const rect = elements.aboutWindow.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) elements.aboutWindow.close();
    });
  }
  if (elements.resetButton) {
    elements.resetButton.addEventListener('click', () => {
      const currentInputs = getCurrentModeInputs();
      currentInputs.forEach(input => {
        input.value = defaultInputValues.get(input.dataset.key) ?? '';
      });
      currentInputs.forEach(input => {
        normalizeInput(input);
      });
      updateResults({ force: true });
      triggerHaptic('selection');
    });
  }

  elements.inputs.forEach(input => {
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', () => setTimeout(() => input.select(), 10));
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.value = String(committedValues.get(input) ?? '');
        updateResetVisibility();
        return;
      }
      commitInput(input);
    });
    if (input.dataset.allowEmptyOnInput === 'true') {
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        if (input.value === '') return;
        commitInput(input);
        input.blur();
      });
    }
  });

  const applyModeVisibility = (mode) => {
    elements.modeSections.forEach(section => {
      section.hidden = section.dataset.modeSection !== mode;
    });
  };

  const getViewportMetrics = () => {
    if (window.visualViewport) {
      return {
        height: window.visualViewport.height,
        offsetTop: window.visualViewport.offsetTop
      };
    }
    return { height: window.innerHeight, offsetTop: 0 };
  };

  const updateWindowAnchor = () => {
    if (!elements.window) return;
    const bodyStyles = getComputedStyle(document.body);
    const paddingTop = parseFloat(bodyStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(bodyStyles.paddingBottom) || 0;
    const viewport = getViewportMetrics();
    const availableHeight = viewport.height - paddingTop - paddingBottom;
    const windowHeight = elements.window.offsetHeight;
    const offset = Math.max((availableHeight - windowHeight) / 2, 0);
    elements.window.style.marginTop = `${offset + viewport.offsetTop}px`;
  };

  const setMode = (mode) => {
    if (mode === currentMode) {
      return false;
    }
    currentMode = mode;
    document.body.dataset.mode = mode;
    applyModeVisibility(mode);
    elements.modeIcons.forEach(icon => {
      icon.classList.toggle('active', icon.dataset.mode === mode);
      icon.setAttribute('aria-pressed', String(icon.dataset.mode === mode));
    });
    const bladeIcon = document.getElementById('blade-icon');
    if (bladeIcon) {
      bladeIcon.src = mode === 'blades' ? './images/blade-color.svg' : './images/blade.svg';
    }
    const soapIcon = document.getElementById('soap-icon');
    if (soapIcon) {
      soapIcon.src = mode === 'soap' ? './images/soap-color.svg' : './images/soap.svg';
    }
    updateModeTitles(mode);
    updateResetVisibility();
    persistState();
    // Modes have different heights, so the window must be re-centered.
    updateWindowAnchor();
    return true;
  };

  elements.modeIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      if (setMode(icon.dataset.mode)) {
        triggerHaptic('soft');
      }
    });
  });

  document.addEventListener('languagechange', () => {
    updateStockSizes();
    updateResults({ force: true });
    updateModeTitles(currentMode);
    updateWindowAnchor();
  });

  const restoredMode = restoreState();
  elements.inputs.forEach(normalizeInput);
  setMode(restoredMode);
  updateStockSizes();
  updateResults({ force: true });

  updateWindowAnchor();
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateWindowAnchor);
    window.visualViewport.addEventListener('scroll', updateWindowAnchor);
  }
  window.addEventListener('resize', updateWindowAnchor);
});
