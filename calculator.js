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

  const pluralize = (number, one, few, many) => {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod100 >= 11 && mod100 <= 19) return many;
    return mod10 === 1 ? one : mod10 >= 2 && mod10 <= 4 ? few : many;
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
    updateLabels();
    calculateDuration();
  };

  const updateLabels = () => {
    const days = parseInt(elements.daysInput.value) || 0;
    const uses = parseInt(elements.usesInput.value) || 0;
    elements.daysLabel.textContent = pluralize(days, 'день', 'дня', 'дней');
    elements.usesLabel.textContent = pluralize(uses, 'раз', 'раза', 'раз');
  };

  const formatNumber = number => 
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;');

  const formatDuration = days => {
    if (days <= 0) return '0&nbsp;дней';
    
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    const parts = [];
    if (years > 0) parts.push(`${formatNumber(years)} ${pluralize(years, 'год', 'года', 'лет')}`);
    if (months > 0) parts.push(`${formatNumber(months)} ${pluralize(months, 'месяц', 'месяца', 'месяцев')}`);
    if (remainingDays > 0 || parts.length === 0) parts.push(`${formatNumber(remainingDays)} ${pluralize(remainingDays, 'день', 'дня', 'дней')}`);

    return parts.join(' ');
  };

  const calculateDuration = () => {
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

    elements.result.innerHTML = totalBlades === 0 
      ? '0&nbsp;дней' 
      : formatDuration(totalBlades * usesPerBlade * daysPerShave);
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

  updateLabels();
  calculateDuration();
});