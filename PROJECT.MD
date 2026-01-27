# PROJECT.md

## 1) Overview
Проект — одностраничный калькулятор запаса для двух режимов: лезвия и мыло. Переключение режимов происходит через иконки в шапке, показывая/скрывая соответствующие секции формы.

## 2) Tech Stack
- HTML + CSS + vanilla JS (без сборки и зависимостей)
- Локализация на основе `localization.js`, выбранный язык хранится в `localStorage`
- Шрифт IBM Plex Mono (Google Fonts)

## 3) App Structure
- `bladeculator.html` — разметка, `data-*` атрибуты для конфигурации и локализации
- `calculator.js` — нормализация ввода, расчёты, рендер результатов, переключение режимов
- `localization.js` — словари, правила множественного числа, форматирование чисел/длительности
- `select-localize.js` — селектор языка, применение локализации UI
- `style.css` — стили, адаптив, визуальные правила
- `images/` — иконки и SVG

## 4) Core Logic
- Состояние собирается из инпутов с `data-key`.
- Нормализация ввода: `min/max/step`, а также зависимые ограничения через `data-max-from`.
- Лезвия: `totalBlades = sum(pack * multiplier)`; `totalDays = totalBlades * usesPerBlade * daysPerShave`.
- Мыло: `totalJars = full + 0.75*rest75 + 0.5*rest50 + 0.25*rest25`; далее `totalGrams`, `shaves`, `totalDays`.
- Результат форматируется через `localization.formatDuration()` и `formatNumber()`.

## 5) Localization
- Ключи и переводы в `localization.js`.
- Плюрализация через `localization.pluralize()`.
- UI‑тексты берутся из `data-i18n` (см. `select-localize.js`).
- При смене языка `select-localize.js` диспатчит `languagechange`, на который реагирует `calculator.js`.

## 6) UI/UX Notes (кратко)
- Есть мобильные правила размера и переносов.

## 7) Extension Guide (кратко)
- Новый язык: добавить в `languages`, `languageOrder` и `translations`.
- Новый расходник: добавить секцию в HTML + формулу в `calculator.js`.

## 8) Known Constraints / TODO
- Нет автотестов.
- Валидация основана на `data-*` атрибутах и числовой нормализации.

## 9) Data Contracts (важное)
- `data-key` — имя поля в состоянии.
- `data-min`, `data-max`, `data-step` — правила нормализации значений.
- `data-max-from` — максимум, зависящий от другого инпута (по `data-key`).
- `data-multiplier` — множитель для упаковок лезвий.
- `data-mode-section` — принадлежность к режиму (лезвия/мыло).
