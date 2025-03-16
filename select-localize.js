document.addEventListener('DOMContentLoaded', function() {
  // Initialize the language dropdown
  function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    const languageDropdown = document.getElementById('language-dropdown');
    
    // Clear existing options
    languageDropdown.innerHTML = '';
    
    // Get current language or detect browser language
    const currentLang = localization.getCurrentLanguage();
    
    // Update the selected language text
    languageSelect.textContent = localization.languages[currentLang];
    
    // Create language options based on the order defined in localization
    localization.languageOrder.forEach(langCode => {
      const langName = localization.languages[langCode];
      const optionElement = document.createElement('div');
      optionElement.className = 'select-option';
      optionElement.setAttribute('data-value', langCode);
      
      // Mark the current language as selected
      if (langCode === currentLang) {
        optionElement.classList.add('selected');
      }
      
      // Create the option content
      optionElement.innerHTML = `
        ${langName}
        <img src="./images/check.svg" alt="${localization.t('selected')}" class="select-option-icon" width="16" height="16">
      `;
      
      // Add click event handler
      optionElement.addEventListener('click', function() {
        // Set the new language
        const value = this.getAttribute('data-value');
        localization.setCurrentLanguage(value);
        
        // Update UI
        languageSelect.textContent = langName;
        
        // Update selected class
        document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        // Hide dropdown
        languageDropdown.classList.remove('active');
        
        // Apply translations to UI
        localizeUI();
        
        // Recalculate the result with new language
        if (typeof calculateDuration === 'function') {
          calculateDuration();
        }
      });
      
      // Add to dropdown
      languageDropdown.appendChild(optionElement);
    });
    
    // Show/hide dropdown on click
    languageSelect.addEventListener('click', function(e) {
      e.stopPropagation();
      languageDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!languageSelect.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove('active');
      }
    });
  }
  
  // Apply translations to UI elements
  function localizeUI() {
    // Update page title
    document.title = localization.t('app_title');
    
    // Update header title
    document.querySelector('.title-bar > span').textContent = localization.t('app_title');
    
    // Update close button alt text
    document.querySelector('.close-button img').setAttribute('alt', localization.t('close'));
    
    // Update input labels
    document.querySelector('.input-group:nth-child(1) .input-label').textContent = localization.t('shave_frequency');
    document.querySelector('.input-group:nth-child(2) .input-label').textContent = localization.t('blade_usage');
    
    // Update razor stock section
    document.querySelector('.razor-stock-title').textContent = localization.t('total_blades');
    
    // Update stock labels
    const stockItems = document.querySelectorAll('.stock-item');
    
    // First two items are "Blocks" and "Packs"
    stockItems[0].querySelector('.stock-label').textContent = localization.t('blocks');
    stockItems[1].querySelector('.stock-label').textContent = localization.t('packs');
    stockItems[2].querySelector('.stock-label').textContent = localization.t('packs');
    stockItems[3].querySelector('.stock-label').textContent = localization.t('individually');
    
    // Update "pieces" text
    document.querySelectorAll('.stock-size').forEach(el => {
      const value = el.textContent.split(' ')[0];
      el.textContent = `${value} ${localization.t('pieces')} ×`;
    });
  }
  
  // Initialize the language selector and apply translations
  initializeLanguageSelector();
  localizeUI();
});
