document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    daysInput: document.getElementById('days-input'),
    usesInput: document.getElementById('uses-input'),
    pack100Input: document.getElementById('pack100-input'),
    pack10Input: document.getElementById('pack10-input'),
    pack5Input: document.getElementById('pack5-input'),
    singleInput: document.getElementById('single-input'),
    daysLabel: document.getElementById('days-label'),
    usesLabel: document.getElementById('uses-label'),
    resultTitle: document.querySelector('.result-title'),
    result: document.getElementById('result'),
    bladeIcon: document.getElementById('blade-icon'),
    textInputs: document.querySelectorAll('input[type="text"]')
  };

  const inputConfig = [
    { id: 'days-input', min: 1 },
    { id: 'uses-input', min: 1 },
    { id: 'pack100-input', min: 0 },
    { id: 'pack10-input', min: 0 },
    { id: 'pack5-input', min: 0 },
    { id: 'single-input', min: 0 }
  ];

  const cache = {
    previousValues: {
      days: null,
      uses: null,
      pack100: null,
      pack10: null,
      pack5: null,
      single: null
    },
    result: null,
    needsUpdate: true
  };

  // Expose cache to window for access from other scripts
  window.cache = cache;


  const handleInput = function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    const config = inputConfig.find(c => c.id === this.id);
    if (config && (this.value === '' || parseInt(this.value) < config.min)) {
      this.value = config.min;
    }
    
    const newValue = parseInt(this.value) || 0;
    const fieldMap = {
      'days-input': 'days',
      'uses-input': 'uses',
      'pack100-input': 'pack100',
      'pack10-input': 'pack10',
      'pack5-input': 'pack5',
      'single-input': 'single'
    };
    
    const field = fieldMap[this.id];
    if (field && cache.previousValues[field] !== newValue) {
      cache.previousValues[field] = newValue;
      cache.needsUpdate = true;
    }
    
    calculateDuration();
  };


  const calculateDuration = () => {
    if (!cache.needsUpdate && cache.result !== null) {
      return;
    }
    
    const daysPerShave = parseInt(elements.daysInput.value) || 1;
    const usesPerBlade = parseInt(elements.usesInput.value) || 1;
    
    const totalBlades = [
      elements.pack100Input,
      elements.pack10Input,
      elements.pack5Input,
      elements.singleInput
    ].reduce((acc, el, i) => 
      acc + (parseInt(el.value) || 0) * [100, 10, 5, 1][i], 0);

    // Use localization for displaying the total blades text
    if (totalBlades === 0) {
      elements.resultTitle.innerHTML = localization.t('zero_blades');
    } else {
      // Get plural form for blade based on the count
      const pluralBlade = localization.pluralize(totalBlades, 'blade');
      elements.resultTitle.innerHTML = localization.t('blades_will_last', {
        count: localization.formatNumber(totalBlades),
        pluralBlade: pluralBlade
      });
    }

    // Format the duration using the localization module
    const totalDays = totalBlades * usesPerBlade * daysPerShave;
    const resultHTML = localization.formatDuration(totalDays);
    
    elements.result.innerHTML = resultHTML;
    cache.result = resultHTML;
    cache.needsUpdate = false;
  };

  document.querySelector('form').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const config = inputConfig.find(c => c.id === targetId);

    if (action === 'increase') {
      input.value = Math.max(config?.min || 0, parseInt(input.value || 0) + 1);
    } else if (action === 'decrease') {
      input.value = Math.max(config?.min || 0, parseInt(input.value || 0) - 1);
    }

    input.dispatchEvent(new Event('input'));
    cache.needsUpdate = true;
  });

  inputConfig.forEach(({ id }) => {
    const input = document.getElementById(id);
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', () => setTimeout(() => input.select(), 10));
  });

  elements.bladeIcon.addEventListener('click', () => {
    const isColorMode = elements.bladeIcon.src.includes('color');
    elements.bladeIcon.src = isColorMode 
      ? './images/blade.svg' 
      : './images/blade-color.svg';
  });

  // Make calculateDuration function available globally for language switching
  window.calculateDuration = calculateDuration;
  
  // Initial calculation
  calculateDuration();
});
