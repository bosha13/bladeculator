const localization = {
  defaultLanguage: 'en',
  languages: {
    'ru': 'Русский',
    'en': 'English',
    'es': 'Español',
    'de': 'Deutsch',
    'fr': 'Français',
    'zh': '中文'
  },
  
  languageOrder: ['ru', 'en', 'es', 'de', 'fr', 'zh'],
  
  translations: {
    'ru': {
      'app_title_blades': 'Калькулятор запаса лезвий',
      'app_title_soap': 'Калькулятор запаса мыл',
      'shave_frequency': 'Частота бритья (дни)',
      'blade_usage': '1 лезвие используется (раз)',
      'total_blades': 'Всего лезвий:',
      'blocks': 'Блоки',
      'packs': 'Пачки',
      'individually': 'Поштучно',
      'pieces': 'шт.',
      'grams': 'г',
      'soap_usage': 'Расход мыла на бритье, г',
      'soap_jar_weight': 'Средний вес мыла в банке, г',
      'soap_stock_title': 'Количество банок:',
      'soap_full': 'Полных',
      'soap_75': 'Остаток <75%',
      'soap_50': 'Остаток <50%',
      'soap_25': 'Остаток <25%',
      'soap_will_last': 'Моего мыла хватит на:',
      'blade_icon': 'Лезвия',
      'soap_icon': 'Мыло',
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
      'app_title_blades': 'Razor Blade Stock Calculator',
      'app_title_soap': 'Soap Stock Calculator',
      'shave_frequency': 'Shaving frequency (days)',
      'blade_usage': '1 blade lasts',
      'total_blades': 'Blades total:',
      'blocks': 'Blocks',
      'packs': 'Packs',
      'individually': 'Single',
      'pieces': 'pcs',
      'grams': 'g',
      'soap_usage': 'Soap use per shave, g',
      'soap_jar_weight': 'Average soap weight per jar, g',
      'soap_stock_title': 'Jars total:',
      'soap_full': 'Full',
      'soap_75': '<75% left',
      'soap_50': '<50% left',
      'soap_25': '<25% left',
      'soap_will_last': 'My soap will last for:',
      'blade_icon': 'Blades',
      'soap_icon': 'Soap',
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
      'app_title_blades': 'Calculadora de stock de cuchillas',
      'app_title_soap': 'Calculadora de stock de jabón',
      'shave_frequency': 'Frecuencia de afeitado (días)',
      'blade_usage': '1 cuchilla dura',
      'total_blades': 'Total cuchillas:',
      'blocks': 'Bloques',
      'packs': 'Paquetes',
      'individually': 'Sueltas',
      'pieces': 'unid',
      'grams': 'g',
      'soap_usage': 'Consumo de jabón por afeitado, g',
      'soap_jar_weight': 'Peso medio del jabón en el tarro, g',
      'soap_stock_title': 'Tarros totales:',
      'soap_full': 'Llenos',
      'soap_75': '<75% restante',
      'soap_50': '<50% restante',
      'soap_25': '<25% restante',
      'soap_will_last': 'Mi jabón durará:',
      'blade_icon': 'Cuchillas',
      'soap_icon': 'Jabón',
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
    },
    
    'de': {
      'app_title_blades': 'Rasierklingen-Vorratsrechner',
      'app_title_soap': 'Seifenvorratsrechner',
      'shave_frequency': 'Rasierhäufigkeit (Tage)',
      'blade_usage': '1 Klinge hält',
      'total_blades': 'Klingen gesamt:',
      'blocks': 'Blöcke',
      'packs': 'Packungen',
      'individually': 'Einzeln',
      'pieces': 'Stk.',
      'grams': 'g',
      'soap_usage': 'Seifenverbrauch pro Rasur, g',
      'soap_jar_weight': 'Durchschnittsgewicht der Seife je Dose, g',
      'soap_stock_title': 'Dosen gesamt:',
      'soap_full': 'Voll',
      'soap_75': '<75% Rest',
      'soap_50': '<50% Rest',
      'soap_25': '<25% Rest',
      'soap_will_last': 'Meine Seife reicht für:',
      'blade_icon': 'Klingen',
      'soap_icon': 'Seife',
      
      'blades_will_last': '{count} {pluralBlade} reichen für:',
      'zero_blades': '0 Klingen reichen für:',
      'zero_days': '0 Tage',
      
      'plurals': {
        'day': ['Tag', 'Tage'],
        'month': ['Monat', 'Monate'],
        'year': ['Jahr', 'Jahre'],
        'blade': ['Klinge', 'Klingen']
      },
      
      'close': 'Schließen',
      'selected': 'Ausgewählt',
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    },
    
    'fr': {
      'app_title_blades': 'Calculateur de stock de lames',
      'app_title_soap': 'Calculateur de stock de savon',
      'shave_frequency': 'Fréquence de rasage (jours)',
      'blade_usage': '1 lame dure',
      'total_blades': 'Total des lames :',
      'blocks': 'Boîtes',
      'packs': 'Paquets',
      'individually': 'À l’unité',
      'pieces': 'pièces',
      'grams': 'g',
      'soap_usage': 'Consommation de savon par rasage, g',
      'soap_jar_weight': 'Poids moyen du savon par pot, g',
      'soap_stock_title': 'Pots au total :',
      'soap_full': 'Pleins',
      'soap_75': '<75% restants',
      'soap_50': '<50% restants',
      'soap_25': '<25% restants',
      'soap_will_last': 'Mon savon durera :',
      'blade_icon': 'Lames',
      'soap_icon': 'Savon',
      
      'blades_will_last': '{count} {pluralBlade} dureront :',
      'zero_blades': '0 lames dureront :',
      'zero_days': '0 jours',
      
      'plurals': {
        'day': ['jour', 'jours'],
        'month': ['mois', 'mois'],
        'year': ['an', 'ans'],
        'blade': ['lame', 'lames']
      },
      
      'close': 'Fermer',
      'selected': 'Sélectionné',
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    },
    
    'zh': {
      'app_title_blades': '刀片库存计算器',
      'app_title_soap': '剃须皂库存计算器',
      'shave_frequency': '刮胡频率（天）',
      'blade_usage': '1个刀片使用次数',
      'total_blades': '刀片总数：',
      'blocks': '整盒',
      'packs': '包装',
      'individually': '单个',
      'pieces': '片',
      'grams': '克',
      'soap_usage': '每次刮胡用量（克）',
      'soap_jar_weight': '每罐剃须皂平均重量（克）',
      'soap_stock_title': '罐装数量：',
      'soap_full': '满罐',
      'soap_75': '剩余<75%',
      'soap_50': '剩余<50%',
      'soap_25': '剩余<25%',
      'soap_will_last': '我的剃须皂可用：',
      'blade_icon': '刀片',
      'soap_icon': '剃须皂',
      'close': '关闭',
      'selected': '已选择',
      
      'blades_will_last': '{count}个{pluralBlade}可使用：',
      'zero_blades': '0个刀片可使用：',
      'zero_days': '0天',
      
      'plurals': {
        'day': ['天'],
        'month': ['个月'],
        'year': ['年'],
        'blade': ['刀片']
      },
      
      'getPluralForm': function(number, forms) {
        return forms[0];
      }
    }
  },
  
  // Language detection
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
  
  // Thousands separators
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
  
  // Duration in days to a human-readable string
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
