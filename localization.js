const localization = {
  defaultLanguage: 'en',
  languages: {
    'ru': 'Русский',
    'en': 'English',
    'es': 'Español'
  },
  
  languageOrder: ['ru', 'en', 'es'],
  
  translations: {
    'ru': {
      'app_title': 'Калькулятор запаса лезвий v.1.1',
      'shave_frequency': 'Я бреюсь раз в',
      'blade_usage': 'Использую 1 лезвие',
      'total_blades': 'Всего лезвий:',
      'blocks': 'Блоки',
      'packs': 'Пачки',
      'individually': 'Поштучно',
      'pieces': 'шт.',
      'close': 'Закрыть',
      'selected': 'Выбрано',
      
      'blades_will_last': '{count} {pluralBlade} хватит на:',
      'zero_blades': '0 лезвий хватит на:',
      'zero_days': '0 дней',
      
      'plurals': {
        'day': ['день', 'дня', 'дней'],
        'month': ['месяц', 'месяца', 'месяцев'],
        'year': ['год', 'года', 'лет'],
        'blade': ['лезвие', 'лезвия', 'лезвий']
      },
      
      'getPluralForm': function(number, forms) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) return forms[2];
        n %= 10;
        return n === 1 ? forms[0] : n >= 2 && n <= 4 ? forms[1] : forms[2];
      }
    },
    
    'en': {
      'app_title': 'Blade Stock Calculator v.1.1',
      'shave_frequency': 'I shave every',
      'blade_usage': 'I use 1 blade for',
      'total_blades': 'Total blades:',
      'blocks': 'Blocks',
      'packs': 'Packs',
      'individually': 'Individual',
      'pieces': 'pcs.',
      'close': 'Close',
      'selected': 'Selected',
      
      'blades_will_last': '{count} {pluralBlade} will last for:',
      'zero_blades': '0 blades will last for:',
      'zero_days': '0 days',
      
      'plurals': {
        'day': ['day', 'days'],
        'month': ['month', 'months'],
        'year': ['year', 'years'],
        'blade': ['blade', 'blades']
      },
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    },
    
    'es': {
      'app_title': 'Calculadora de stock de cuchillas v.1.1',
      'shave_frequency': 'Me afeito cada',
      'blade_usage': 'Uso 1 cuchilla para',
      'total_blades': 'Cuchillas totales:',
      'blocks': 'Bloques',
      'packs': 'Paquetes',
      'individually': 'Individual',
      'pieces': 'uds.',
      'close': 'Cerrar',
      'selected': 'Seleccionado',
      
      'blades_will_last': '{count} {pluralBlade} durarán:',
      'zero_blades': '0 cuchillas durarán:',
      'zero_days': '0 días',
      
      'plurals': {
        'day': ['día', 'días'],
        'month': ['mes', 'meses'],
        'year': ['año', 'años'],
        'blade': ['cuchilla', 'cuchillas']
      },
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    }
  },
  
  // Language detection and management methods
  detectBrowserLanguage: function() {
    const browserLang = navigator.language.split('-')[0];
    return this.translations[browserLang] ? browserLang : this.defaultLanguage;
  },
  
  getCurrentLanguage: function() {
    return localStorage.getItem('selectedLanguage') || this.detectBrowserLanguage();
  },
  
  setCurrentLanguage: function(langCode) {
    if (this.translations[langCode]) {
      localStorage.setItem('selectedLanguage', langCode);
      return true;
    }
    return false;
  },
  
  t: function(key, params = {}) {
    const currentLang = this.getCurrentLanguage();
    const translations = this.translations[currentLang];
    
    if (!translations || !translations[key]) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
      return key;
    }
    
    let text = translations[key];
    
    Object.keys(params).forEach(param => {
      const regex = new RegExp(`{${param}}`, 'g');
      text = text.replace(regex, params[param]);
    });
    
    return text;
  },
  
  pluralize: function(number, key) {
    const currentLang = this.getCurrentLanguage();
    const translations = this.translations[currentLang];
    
    if (!translations || !translations.plurals || !translations.plurals[key]) {
      console.warn(`Pluralization missing for key: ${key} in language: ${currentLang}`);
      return key;
    }
    
    const pluralForms = translations.plurals[key];
    return translations.getPluralForm(number, pluralForms);
  },
  
  // Format a number with spaces as thousands separators
  formatNumber: function(number) {
    const str = String(number);
    if (str.length <= 3) return str;
    
    const result = [];
    const len = str.length;
    const NARROW_SPACE = '\u202F';
    
    for (let i = 0; i < len; i++) {
      result.push(str[i]);
      const remaining = len - i - 1;
      if (remaining > 0 && remaining % 3 === 0) {
        result.push(NARROW_SPACE);
      }
    }
    
    return result.join('');
  },
  
  // Format duration in days to a human-readable string
  formatDuration: function(days) {
    if (days <= 0) return this.t('zero_days');
    
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;
    
    const parts = [];
    const NARROW_NO_BREAK_SPACE = '\u202F';
    
    if (years > 0) {
      const yearText = this.pluralize(years, 'year');
      parts.push(`${this.formatNumber(years)}${NARROW_NO_BREAK_SPACE}${yearText}`);
    }
    
    if (months > 0) {
      const monthText = this.pluralize(months, 'month');
      parts.push(`${this.formatNumber(months)}${NARROW_NO_BREAK_SPACE}${monthText}`);
    }
    
    if (remainingDays > 0 || parts.length === 0) {
      const dayText = this.pluralize(remainingDays, 'day');
      parts.push(`${this.formatNumber(remainingDays)}${NARROW_NO_BREAK_SPACE}${dayText}`);
    }
    
    return parts.join(' ');
  }
};
