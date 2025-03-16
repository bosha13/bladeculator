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

  const NARROW_SPACE = '\u202F';

  const pluralize = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    return n === 1 ? one : n >= 2 && n <= 4 ? two : five;
  };

  const pluralizeBlade = number => {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod100 >= 11 && mod100 <= 19) return 'лезвий';
    return mod10 === 1 ? 'лезвие' : mod10 >= 2 && mod10 <= 4 ? 'лезвия' : 'лезвий';
  };

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

  const formatNumber = number => {
    const str = String(number);
    if (str.length <= 3) return str;
    
    const result = [];
    const len = str.length;
    
    for (let i = 0; i < len; i++) {
      result.push(str[i]);
      const remaining = len - i - 1;
      if (remaining > 0 && remaining % 3 === 0) {
        result.push(NARROW_SPACE);
      }
    }
    
    return result.join('');
  };

  const formatDuration = days => {
    if (days <= 0) return '0&nbsp;дней';
    
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;
    
    const parts = [];
    
    if (years > 0) {
      const yearText = pluralize(years, 'год', 'года', 'лет');
      parts.push(`${formatNumber(years)} ${yearText}`);
    }
    
    if (months > 0) {
      const monthText = pluralize(months, 'месяц', 'месяца', 'месяцев');
      parts.push(`${formatNumber(months)} ${monthText}`);
    }
    
    if (remainingDays > 0 || parts.length === 0) {
      const dayText = pluralize(remainingDays, 'день', 'дня', 'дней');
      parts.push(`${formatNumber(remainingDays)} ${dayText}`);
    }
    
    return parts.join(' ');
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

    elements.resultTitle.innerHTML = totalBlades === 0 
      ? '0 лезвий хватит на:' 
      : `${formatNumber(totalBlades)} ${pluralizeBlade(totalBlades)} хватит на:`;

    const resultHTML = totalBlades === 0 
      ? '0&nbsp;дней' 
      : formatDuration(totalBlades * usesPerBlade * daysPerShave);
      
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

  calculateDuration();
});