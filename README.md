# Number Lookup BD

A free, privacy-first static Bangladesh mobile-number format checker, designed to run on GitHub Pages without paid hosting.

## Features
- Responsive Bengali/English interface with dark/light themes.
- Bangladesh mobile number normalization and format validation.
- Prefix-based operator-range estimate with a number-portability caveat.
- Local search history, search filter, repeat lookup, and JSON export.
- Batch validation from pasted lines or imported TXT/CSV, with CSV export.
- Local report creation, filtering, deletion, and CSV export.
- Privacy Center to export/restore JSON backups or delete local app data.
- Dashboard counters, keyboard shortcuts (Alt+K lookup, Alt+H history, Alt+B batch), PWA install support, and service-worker offline caching.
- SEO description and Open Graph preview metadata.
- No account, backend, paid hosting, or API key required for these local features.

## Publish free with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**, then save.
4. Wait for deployment. The expected site URL is https://jakariaadnaan.github.io/Information/

## Privacy and limitations
- Search history, reports, theme, and language are saved in this browser's localStorage. They do not sync between devices and are not publicly shared.
- Batch validation is local; imported files are read in the browser and are not uploaded.
- Prefix-based operator estimates are not guaranteed, especially because of mobile number portability.
- This is not a live reverse-phone lookup service. It does not reveal subscriber names, NID/SIM registration, call/SMS history, or live location.
- Publicly shared community reports and live public-data matching require a separate trusted backend/API and careful privacy/abuse controls. Do not publish unverified accusations or private information.

## Keyboard shortcuts
- **Alt + K**: focus the number lookup input.
- **Alt + H**: focus the history search.
- **Alt + B**: focus the batch input.
