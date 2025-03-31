document.addEventListener('DOMContentLoaded', function() {
  function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    const languageDropdown = document.getElementById('language-dropdown');
    
    languageDropdown.innerHTML = '';
    const currentLang = localization.getCurrentLanguage();
    languageSelect.textContent = localization.languages[currentLang];
    
    localization.languageOrder.forEach(langCode => {
      const langName = localization.languages[langCode];
      const optionElement = document.createElement('div');
      optionElement.className = 'select-option';
      optionElement.setAttribute('data-value', langCode);
      
      if (langCode === currentLang) {
        optionElement.classList.add('selected');
      }

      optionElement.innerHTML = `
        ${langName}
        <img src="./images/check.svg" alt="${localization.t('selected')}" class="select-option-icon" width="16" height="16">
      `;

      optionElement.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        localization.setCurrentLanguage(value);

        languageSelect.textContent = langName;

        document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        languageDropdown.classList.remove('active');

        localizeUI();
        
        if (typeof calculateDuration === 'function') {
          if (window.cache) {
            window.cache.needsUpdate = true;
          }
          calculateDuration();
        }
      });
      
      languageDropdown.appendChild(optionElement);
    });
    
    languageSelect.addEventListener('click', function(e) {
      e.stopPropagation();
      languageDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
      if (!languageSelect.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove('active');
      }
    });
  }
  
  function localizeUI() {
    document.title = localization.t('app_title');
    
    document.querySelector('.title-bar > span').textContent = localization.t('app_title');
    
    document.querySelector('.close-button img').setAttribute('alt', localization.t('close'));
    
    document.querySelector('.input-group:nth-child(1) .input-label').textContent = localization.t('shave_frequency');
    document.querySelector('.input-group:nth-child(2) .input-label').textContent = localization.t('blade_usage');
    
    document.querySelector('.razor-stock-title').textContent = localization.t('total_blades');
    
    const stockItems = document.querySelectorAll('.stock-item');
    
    stockItems[0].querySelector('.stock-label').textContent = localization.t('blocks');
    stockItems[1].querySelector('.stock-label').textContent = localization.t('packs');
    stockItems[2].querySelector('.stock-label').textContent = localization.t('packs');
    stockItems[3].querySelector('.stock-label').textContent = localization.t('individually');
    
    document.querySelectorAll('.stock-size').forEach(el => {
      const value = el.textContent.split(' ')[0];
      el.textContent = `${value} ${localization.t('pieces')} ×`;
    });
  }
  
  initializeLanguageSelector();
  localizeUI();
});
