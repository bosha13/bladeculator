const localization = {
  defaultLanguage: 'ru',
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
      'app_title_soap': 'Калькулятор запаса мыла для бритья',
      'shave_frequency': 'Частота бритья, дни',
      'de_blade_usage': 'DE-лезвие используется',
      'se_blade_usage': 'SE-лезвие используется',
      'blocks': 'Блоки',
      'packs': 'Пачки',
      'se_containers': 'Контейнеры',
      'individually': 'Поштучно',
      'pieces': 'шт.',
      'grams': 'г',
      'soap_usage': 'Расход на бритьё, г',
      'soap_jar_weight': 'Ср. вес мыла в банках, г',
      'soap_stock_title': 'Количество банок:',
      'soap_full': 'Практически полных',
      'soap_75': 'Остаток <75%',
      'soap_50': 'Остаток <50%',
      'soap_25': 'Остаток <25%',
      'soap_will_last': '{count} {pluralJar} мыла хватит на:',
      'soap_will_last_with_count_singular': '{count} {pluralJar} мыла хватит на:',
      'soap_will_last_with_count_plural': '{count} {pluralJar} мыла хватит на:',
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
        'blade': ['лезвие', 'лезвия', 'лезвий'],
        'jar': ['банка', 'банки', 'банок']
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
      'app_title_soap': 'Shaving Soap Stock Calculator',
      'shave_frequency': 'Shaving frequency (days)',
      'de_blade_usage': 'DE-blade lasts (uses)',
      'se_blade_usage': 'SE-blade lasts (uses)',
      'blocks': 'Blocks',
      'packs': 'Packs',
      'se_containers': 'Dispensers',
      'individually': 'Single',
      'pieces': 'pcs',
      'grams': 'g',
      'soap_usage': 'Use per shave (g)',
      'soap_jar_weight': 'Average soap weight (g)',
      'soap_stock_title': 'Jars total:',
      'soap_full': 'Almost full',
      'soap_75': '<75% left',
      'soap_50': '<50% left',
      'soap_25': '<25% left',
      'soap_will_last': '{count} {pluralJar} will last for:',
      'soap_will_last_with_count_singular': '{count} {pluralJar} will last for:',
      'soap_will_last_with_count_plural': '{count} {pluralJar} will last for:',
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
        'blade': ['blade', 'blades'],
        'jar': ['jar', 'jars']
      },
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    },
    
    'es': {
      'app_title_blades': 'Calculadora de stock de cuchillas',
      'app_title_soap': 'Calculadora de stock de jabón de afeitar',
      'shave_frequency': 'Frecuencia de afeitado (días)',
      'de_blade_usage': 'Cuchilla DE dura (usos)',
      'se_blade_usage': 'Cuchilla SE dura (usos)',
      'blocks': 'Bloques',
      'packs': 'Paquetes',
      'se_containers': 'Dispensadores',
      'individually': 'Sueltas',
      'pieces': 'unid',
      'grams': 'g',
      'soap_usage': 'Consumo por afeitado (g)',
      'soap_jar_weight': 'Peso medio del jabón (g)',
      'soap_stock_title': 'Tarros totales:',
      'soap_full': 'Casi llenas',
      'soap_75': '<75% restante',
      'soap_50': '<50% restante',
      'soap_25': '<25% restante',
      'soap_will_last': '{count} {pluralJar} de jabón durará:',
      'soap_will_last_with_count_singular': '{count} {pluralJar} de jabón durará:',
      'soap_will_last_with_count_plural': '{count} {pluralJar} de jabón durarán:',
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
        'blade': ['cuchilla', 'cuchillas'],
        'jar': ['tarro', 'tarros']
      },
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    },
    
    'de': {
      'app_title_blades': 'Rasierklingen-Vorratsrechner',
      'app_title_soap': 'Rasierseifenvorratsrechner',
      'shave_frequency': 'Rasierhäufigkeit (Tage)',
      'de_blade_usage': 'DE-Klinge hält',
      'se_blade_usage': 'SE-Klinge hält',
      'blocks': 'Blöcke',
      'packs': 'Packungen',
      'se_containers': 'Klingenspender',
      'individually': 'Einzeln',
      'pieces': 'Stk.',
      'grams': 'g',
      'soap_usage': 'Verbrauch pro Rasur (g)',
      'soap_jar_weight': 'Seifengewicht (g)',
      'soap_stock_title': 'Dosen gesamt:',
      'soap_full': 'Fast voll',
      'soap_75': '<75% Rest',
      'soap_50': '<50% Rest',
      'soap_25': '<25% Rest',
      'soap_will_last': '{count} {pluralJar} Seife reicht für:',
      'soap_will_last_with_count_singular': '{count} {pluralJar} Seife reicht für:',
      'soap_will_last_with_count_plural': '{count} {pluralJar} Seife reichen für:',
      'blade_icon': 'Klingen',
      'soap_icon': 'Seife',
      
      'blades_will_last': '{count} {pluralBlade} reichen für:',
      'zero_blades': '0 Klingen reichen für:',
      'zero_days': '0 Tage',
      
      'plurals': {
        'day': ['Tag', 'Tage'],
        'month': ['Monat', 'Monate'],
        'year': ['Jahr', 'Jahre'],
        'blade': ['Klinge', 'Klingen'],
        'jar': ['Dose', 'Dosen']
      },
      
      'close': 'Schließen',
      'selected': 'Ausgewählt',
      
      'getPluralForm': function(number, forms) {
        return number === 1 ? forms[0] : forms[1];
      }
    },
    
    'fr': {
      'app_title_blades': 'Calculateur de stock de lames',
      'app_title_soap': 'Calculateur de stock de savon à raser',
      'shave_frequency': 'Fréquence de rasage (jours)',
      'de_blade_usage': 'Lame DE dure',
      'se_blade_usage': 'Lame SE dure',
      'blocks': 'Boîtes',
      'packs': 'Paquets',
      'se_containers': 'Distributeurs',
      'individually': 'À l’unité',
      'pieces': 'pièces',
      'grams': 'g',
      'soap_usage': 'Consommation par rasage (g)',
      'soap_jar_weight': 'Poids moyen du savon (g)',
      'soap_stock_title': 'Pots au total :',
      'soap_full': 'Presque pleines',
      'soap_75': '<75% restants',
      'soap_50': '<50% restants',
      'soap_25': '<25% restants',
      'soap_will_last': '{count} {pluralJar} de savon durera :',
      'soap_will_last_with_count_singular': '{count} {pluralJar} de savon durera :',
      'soap_will_last_with_count_plural': '{count} {pluralJar} de savon dureront :',
      'blade_icon': 'Lames',
      'soap_icon': 'Savon',
      
      'blades_will_last': '{count} {pluralBlade} dureront :',
      'zero_blades': '0 lames dureront :',
      'zero_days': '0 jours',
      
      'plurals': {
        'day': ['jour', 'jours'],
        'month': ['mois', 'mois'],
        'year': ['an', 'ans'],
        'blade': ['lame', 'lames'],
        'jar': ['pot', 'pots']
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
      'shave_frequency': '刮胡频率，天',
      'de_blade_usage': 'DE刀片使用次数',
      'se_blade_usage': 'SE刀片使用次数',
      'blocks': '整盒',
      'packs': '包装',
      'se_containers': '刀片分配器',
      'individually': '单个',
      'pieces': '片',
      'grams': '克',
      'soap_usage': '每次刮胡用量（克）',
      'soap_jar_weight': '每罐剃须皂平均重量（克）',
      'soap_stock_title': '罐装数量：',
      'soap_full': '几乎满',
      'soap_75': '剩余<75%',
      'soap_50': '剩余<50%',
      'soap_25': '剩余<25%',
      'soap_will_last': '{count}{pluralJar}剃须皂可用：',
      'soap_will_last_with_count_singular': '{count}{pluralJar}剃须皂可用：',
      'soap_will_last_with_count_plural': '{count}{pluralJar}剃须皂可用：',
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
        'blade': ['刀片'],
        'jar': ['罐']
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
