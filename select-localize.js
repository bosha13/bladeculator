document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language-select');
  const languageDropdown = document.getElementById('language-dropdown');

  function localizeUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const attr = el.dataset.i18nAttr;
      const translated = localization.t(key);

      if (attr) {
        el.setAttribute(attr, translated);
      } else {
        el.textContent = translated;
      }
    });

    document.querySelectorAll('.select-option-icon').forEach(icon => {
      icon.setAttribute('alt', localization.t('selected'));
    });
  }

  function buildLanguageOptions() {
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
        localization.setCurrentLanguage(langCode);
        languageSelect.textContent = langName;

        document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
        optionElement.classList.add('selected');

        languageDropdown.classList.remove('active');
        localizeUI();
        document.dispatchEvent(new Event('languagechange'));
      });

      languageDropdown.appendChild(optionElement);
    });
  }

  buildLanguageOptions();
  localizeUI();

  languageSelect.addEventListener('click', function(e) {
    e.stopPropagation();
    languageDropdown.classList.toggle('active');
  });

  document.addEventListener('click', function(e) {
    if (!languageSelect.contains(e.target) && !languageDropdown.contains(e.target)) {
      languageDropdown.classList.remove('active');
    }
  });
});
