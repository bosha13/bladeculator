# PROJECT.md

## 1) Overview
Проект — одностраничный калькулятор запаса для двух режимов: лезвия и мыло. Переключение режимов происходит через иконки в шапке, показывая/скрывая соответствующие секции формы. В режиме лезвий есть два независимых блока (DE и SE) со своими настройками использования.

## 2) Tech Stack
- HTML + CSS + vanilla JS (без сборки и зависимостей)
- Локализация на основе `localization.js`, выбранный язык хранится в `localStorage`
- PWA через `manifest.webmanifest`, `pwa.js` и `sw.js`
- Haptic feedback для поддерживаемых мобильных браузеров через `haptics.js`
- Шрифт IBM Plex Mono (Google Fonts)

## 3) App Structure
- `bladeculator.html` — разметка, `data-*` атрибуты для конфигурации и локализации
- `calculator.js` — нормализация ввода, расчёты, рендер результатов, переключение режимов
- `localization.js` — словари, правила множественного числа, форматирование чисел/длительности
- `select-localize.js` — селектор языка, применение локализации UI
- `haptics.js` — интеграция тактильной отдачи для поддерживаемых мобильных браузеров
- `pwa.js` — регистрация Service Worker и перезагрузка при обновлении кэша
- `sw.js` — кэширование core assets и offline support
- `manifest.webmanifest` — метаданные PWA
- `style.css` — стили, адаптив, визуальные правила
- `images/` — иконки и SVG

## 4) Core Logic
- Состояние собирается из инпутов с `data-key`.
- Нормализация ввода: `min/max/step`, а также зависимые ограничения через `data-max-from`.
- Лезвия: суммируется количество DE и SE лезвий; дни считаются отдельно по типу (`uses` для DE/SE) и затем суммируются.
- Мыло: `totalJars = full + 0.75*rest75 + 0.5*rest50 + 0.25*rest25`; далее `totalGrams`, `shaves`, `totalDays`.
- Результат форматируется через `localization.formatDuration()` и `formatNumber()`.

## 5) Localization
- Ключи и переводы в `localization.js`.
- Плюрализация через `localization.pluralize()`.
- UI‑тексты берутся из `data-i18n` (см. `select-localize.js`).
- При смене языка `select-localize.js` диспатчит `languagechange`, на который реагирует `calculator.js`.

## 6) UI/UX Notes (кратко)
- Есть мобильные правила размера и переносов.
- Между секциями используется единый вертикальный ритм; в лезвиях DE/SE разделены отдельными секциями.
- Для ключевых действий на поддерживаемых мобильных устройствах используется haptic feedback.

## 7) PWA / Delivery
- Приложение можно устанавливать как PWA.
- Core assets кэшируются через Service Worker.
- При обновлении кэша клиент получает сигнал на перезагрузку, чтобы подтянуть свежую версию.

## 8) Run Locally
- Базовый сценарий: открыть `bladeculator.html` в браузере.
- Для PWA-функций нужен локальный сервер и запуск через `http://localhost` или локальный IP.

Пример:
```bash
python3 -m http.server
```

Открыть `http://localhost:8000/bladeculator.html`.

## 9) Localization Notes
- Языковые ключи и переводы находятся в `localization.js` внутри `translations`.
- Выбранный язык хранится в `localStorage`.
- При первом запуске язык определяется по настройкам устройства, fallback — `en`.
- Смена языка диспатчит `languagechange` для перерасчёта и обновления UI.
- Поддерживаемые языки: `ru`, `en`, `es`, `de`, `fr`, `zh`, `ko`.
- Locale aliases, например `pt-br -> pt`, обрабатываются через `localeAliases`.

## 10) Extension Guide (кратко)
- Новый язык: добавить в `languages`, `languageOrder` и `translations`.
- Для нового языка нужно добавить правило множественного числа через `getPluralForm`.
- Новый расходник: добавить секцию в HTML + формулу в `calculator.js`.

## 11) Known Constraints / TODO
- Нет автотестов.
- Валидация основана на `data-*` атрибутах и числовой нормализации.

## 12) Data Contracts (важное)
- `data-key` — имя поля в состоянии.
- `data-min`, `data-max`, `data-step` — правила нормализации значений.
- `data-max-from` — максимум, зависящий от другого инпута (по `data-key`).
- `data-multiplier` — множитель для упаковок лезвий.
- `data-blade-type` — тип лезвий для упаковки (`de` или `se`), влияет на расчёт использования.
- `data-mode-section` — принадлежность к режиму (лезвия/мыло).
