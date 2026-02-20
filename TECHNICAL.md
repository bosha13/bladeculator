# Техническая документация

**How It Works**
- Inputs are normalized via `data-*` rules in HTML
- Blades: DE and SE totals are calculated separately, then summed in days
- Soap: `totalJars = full + 0.75*rest75 + 0.5*rest50 + 0.25*rest25`
- Durations are formatted via `localization.formatDuration()`

**Run Locally**
- Basic usage: open `bladeculator.html` in a browser
- For PWA features: run a local server and open the page via `http://localhost`

Example:
```bash
python3 -m http.server
```
Open `http://localhost:8000/bladeculator.html`.

**Project Structure**
- `bladeculator.html` HTML layout and `data-*` configs
- `style.css` styles and responsive rules
- `calculator.js` input normalization, calculations, and rendering
- `localization.js` languages, pluralization, formatting, detection
- `select-localize.js` language selector and UI localization
- `pwa.js` Service Worker registration and update reload
- `sw.js` cache strategy and offline support
- `manifest.webmanifest` PWA manifest
- `images/` icons and assets

**Localization Notes**
- Keys live in `localization.js` under `translations`
- Language selection is stored in `localStorage`
- Initial language is auto-detected from device preferences, fallback to English
- Language changes dispatch a `languagechange` event for recalculation
- Available languages: ru, en, es, de, fr, zh, ko
- Locale aliases (e.g. `pt-br` -> `pt`) are supported via `localeAliases`. On first load, the detected language is saved to `localStorage` so it becomes the default until the user changes it.

**Add a Language**
- Add to `languages`, `languageOrder`, and `translations`
- Provide plural rules via `getPluralForm`

**Known Constraints**
- No automated tests
