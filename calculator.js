const inputIds = ['days-input', 'uses-input', 'pack100-input', 'pack10-input', 'pack5-input', 'single-input'];
inputIds.forEach(inputId => {
  const input = document.getElementById(inputId);
  input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if ((inputId === 'days-input' || inputId === 'uses-input') && (this.value === '' || parseInt(this.value) < 1)) {
      this.value = '1';
    }
    updateLabels();
    calculateDuration();
  });
});

function changeValue(inputId, delta) {
  const input = document.getElementById(inputId);
  let value = parseInt(input.value) || 0;
  value = Math.max((inputId === 'days-input' || inputId === 'uses-input') ? 1 : 0, value + delta);
  input.value = value;
  updateLabels();
  calculateDuration();
}

function updateLabels() {
  const daysValue = parseInt(document.getElementById('days-input').value) || 0;
  const usesValue = parseInt(document.getElementById('uses-input').value) || 0;
  document.getElementById('days-label').textContent = pluralize(daysValue, 'день', 'дня', 'дней');
  document.getElementById('uses-label').textContent = pluralize(usesValue, 'раз', 'раза', 'раз');
}

function formatNumberWithNarrowSpace(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;');
}

function calculateDuration() {
  const daysPerShave = parseInt(document.getElementById('days-input').value) || 1;
  const usesPerBlade = parseInt(document.getElementById('uses-input').value) || 1;
  const totalBlades = (parseInt(document.getElementById('pack100-input').value) || 0) * 100 +
                     (parseInt(document.getElementById('pack10-input').value) || 0) * 10 +
                     (parseInt(document.getElementById('pack5-input').value) || 0) * 5 +
                     (parseInt(document.getElementById('single-input').value) || 0);

  const resultTitle = document.querySelector('.result-title');
  resultTitle.innerHTML = `${formatNumberWithNarrowSpace(totalBlades)} ${pluralizeBlade(totalBlades)} хватит на:`;
  
  if (totalBlades === 0) {
    document.getElementById('result').innerHTML = '0&nbsp;дней';
    return;
  }
  const totalDays = totalBlades * usesPerBlade * daysPerShave;
  document.getElementById('result').innerHTML = formatDuration(totalDays);
}

function formatDuration(days) {
  if (days <= 0) return '0&nbsp;дней';
  const years = Math.floor(days / 365);
  days -= years * 365;
  const months = Math.floor(days / 30);
  days -= months * 30;
  let result = '';
  if (years > 0) result += `${formatNumberWithNarrowSpace(years)}&nbsp;${pluralize(years, 'год', 'года', 'лет')} `;
  if (months > 0) result += `${formatNumberWithNarrowSpace(months)}&nbsp;${pluralize(months, 'месяц', 'месяца', 'месяцев')} `;
  if (days > 0 || (years === 0 && months === 0)) result += `${formatNumberWithNarrowSpace(days)}&nbsp;${pluralize(days, 'день', 'дня', 'дней')}`;
  return result.trim();
}

function pluralizeBlade(number) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'лезвий';
  if (mod10 === 1) return 'лезвие';
  if (mod10 >= 2 && mod10 <= 4) return 'лезвия';
  return 'лезвий';
}

function pluralize(number, one, few, many) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

updateLabels();
calculateDuration();

document.addEventListener('DOMContentLoaded', function() {
  const textInputs = document.querySelectorAll('input[type="text"]');
  
  textInputs.forEach(input => {
    input.addEventListener('focus', function() {
      setTimeout(() => this.select(), 10);
    });
    
    input.addEventListener('click', function() {
      setTimeout(() => this.select(), 10);
    });
    
    input.addEventListener('touchstart', function() {
      setTimeout(() => this.select(), 10);
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const bladeIcon = document.getElementById('blade-icon');
  let isColorMode = false;

  bladeIcon.addEventListener('click', function() {
    if (isColorMode) {
      bladeIcon.src = './images/blade.svg';
    } else {
      bladeIcon.src = './images/blade-color.svg';
    }
    isColorMode = !isColorMode;
  });
});