document.addEventListener('DOMContentLoaded', () => {
  const haptics = window.appHaptics;
  const languageSelect = document.getElementById('language-select');
  const languageSelectLabel = document.getElementById('language-select-label');
  const languageDropdown = document.getElementById('language-dropdown');

  const getInputLabel = (input) => {
    const group = input.closest('.input-group');
    if (!group) return input.dataset.key;
    return Array.from(group.querySelectorAll('.input-label, .stock-label, .stock-size'))
      .map(element => element.textContent.trim())
      .filter(Boolean)
      .join(' ');
  };

  const localizeControls = () => {
    document.querySelectorAll('input[data-key]').forEach(input => {
      input.setAttribute('aria-label', getInputLabel(input));
    });

    document.querySelectorAll('[data-action]').forEach(control => {
      const input = document.getElementById(control.dataset.target);
      const action = localization.t(control.dataset.action);
      const label = input ? getInputLabel(input) : '';
      control.setAttribute('aria-label', `${action}: ${label}`);
    });
  };

  const localizeUI = () => {
    document.documentElement.lang = localization.getCurrentLanguage();
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const attr = element.dataset.i18nAttr;
      const translated = localization.t(key);

      if (attr) {
        element.setAttribute(attr, translated);
      } else {
        element.textContent = translated;
      }
    });
    localizeControls();
  };

  const getOptions = () => Array.from(languageDropdown.querySelectorAll('[role="option"]'));

  const updateSelectedOption = () => {
    const currentLang = localization.getCurrentLanguage();
    languageSelectLabel.textContent = localization.languages[currentLang];
    getOptions().forEach(option => {
      const isSelected = option.dataset.value === currentLang;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-selected', String(isSelected));
    });
  };

  const closeDropdown = ({ restoreFocus = false } = {}) => {
    languageDropdown.classList.remove('active');
    languageSelect.setAttribute('aria-expanded', 'false');
    if (restoreFocus) languageSelect.focus();
  };

  const openDropdown = (focusTarget = 'selected') => {
    languageDropdown.classList.add('active');
    languageSelect.setAttribute('aria-expanded', 'true');
    const options = getOptions();
    if (options.length === 0) return;

    const selectedIndex = options.findIndex(option => option.getAttribute('aria-selected') === 'true');
    const index = focusTarget === 'last'
      ? options.length - 1
      : focusTarget === 'first'
        ? 0
        : Math.max(selectedIndex, 0);
    options[index].focus();
  };

  const selectLanguage = (langCode) => {
    const changed = langCode !== localization.getCurrentLanguage();
    localization.setCurrentLanguage(langCode);
    updateSelectedOption();
    closeDropdown({ restoreFocus: true });

    if (!changed) return;
    if (haptics && typeof haptics.selection === 'function') {
      haptics.selection();
    }
    localizeUI();
    document.dispatchEvent(new Event('languagechange'));
    localizeControls();
  };

  const buildLanguageOptions = () => {
    languageDropdown.replaceChildren();
    localization.languageOrder.forEach(langCode => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'select-option';
      option.dataset.value = langCode;
      option.setAttribute('role', 'option');
      option.setAttribute('tabindex', '-1');

      const label = document.createElement('span');
      label.textContent = localization.languages[langCode];

      const check = document.createElement('img');
      check.src = './images/check.svg';
      check.width = 16;
      check.height = 16;
      check.className = 'select-option-icon';
      check.dataset.i18n = 'selected';
      check.dataset.i18nAttr = 'alt';

      option.append(label, check);
      option.addEventListener('click', () => selectLanguage(langCode));
      languageDropdown.appendChild(option);
    });
    updateSelectedOption();
  };

  buildLanguageOptions();
  localizeUI();

  languageSelect.addEventListener('click', () => {
    if (!languageDropdown.classList.contains('active')) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  languageSelect.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openDropdown(event.key === 'ArrowDown' ? 'first' : 'last');
    } else if (event.key === 'Escape') {
      closeDropdown();
    }
  });

  languageDropdown.addEventListener('keydown', event => {
    const options = getOptions();
    const currentIndex = options.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown({ restoreFocus: true });
      return;
    }
    if (event.key === 'Tab') {
      closeDropdown();
      return;
    }

    let nextIndex = null;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    options[nextIndex].focus();
  });

  document.addEventListener('click', event => {
    if (!languageSelect.contains(event.target) && !languageDropdown.contains(event.target)) {
      closeDropdown();
    }
  });
});
