document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language-select');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageOptions = document.querySelectorAll('.select-option');
  
  // Показать/скрыть выпадающий список при клике
  languageSelect.addEventListener('click', function(e) {
    e.stopPropagation();
    languageDropdown.classList.toggle('active');
  });
  
  // Обработка клика по опции
  languageOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Получаем значение опции
      const value = this.getAttribute('data-value');
      const text = this.textContent.trim();
      
      // Обновляем текст в основном элементе
      languageSelect.textContent = text;
      
      // Обновляем класс selected
      languageOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      
      // Скрываем выпадающий список
      languageDropdown.classList.remove('active');
      
      // Здесь можно добавить логику для смены языка приложения
      // Например, вызвать функцию changeLanguage(value)
      console.log('Выбран язык:', text, 'с значением:', value);
    });
  });
  
  // Закрытие выпадающего списка при клике в другом месте
  document.addEventListener('click', function(e) {
    if (!languageSelect.contains(e.target) && !languageDropdown.contains(e.target)) {
      languageDropdown.classList.remove('active');
    }
  });
});