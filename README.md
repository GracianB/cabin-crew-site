# Gracian Baena | Cabin Crew Portfolio

A public, independent aviation candidate website.
Prior ESATUR training, an international service career, and a deliberate return to aviation.

Not affiliated with or endorsed by any airline.
No current Cabin Crew qualification or commercial flight history is claimed.

This repository serves ONLY static website assets. Automated tests and a GitHub Actions workflow verify the published site; they are not shipped to visitors.
Private application documents and historical commits were not copied.
No password, analytics or visitor accounts.

Published using GitHub Pages.


## Public browser quality gate

A reproducible Chromium check verifies the actual static site at 320, 390, 768 and 1440 px, including menu navigation, Escape, six-step timeline, keyboard focus, recruiter introduction, reduced motion, local network errors, horizontal overflow, and absence of linked private CV/application files.

The check runs on pull requests and on the public repository's `main` branch. Source remains static with no analytics, tracking or server-side runtime added.

Run in a checkout with Python 3 and Node 24:

```bash
npm install --no-save --no-package-lock playwright@1.58.2
npx playwright install chromium
node scripts/browser-smoke.mjs
```

## Appearance and portfolio navigation

The header theme button switches between light and dark and remembers the choice locally when storage is available. The footer links to the main portfolio, professional deck, Systems Lab / Aigoritmo and Yoga. The aviation profile supports English and Spanish, including the six interactive career chapters, introduction dialog and accessibility labels. The language preference is stored locally and can be overridden with `?lang=es` or `?lang=en`.

Translations are maintained in `translations.json` and embedded into `language.js` to keep the language switch available without an additional fetch. Keep both dictionaries in sync when editing copy.
