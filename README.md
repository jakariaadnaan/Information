# Number Lookup BD

A free, static first version of a Bangladesh mobile-number lookup interface.

## Included
- Responsive Bengali-language interface for desktop and mobile.
- Client-side format validation for common Bangladesh mobile-number patterns.
- Prefix-based operator-range estimate with a mobile-number-portability caveat.
- Browser-local spam/harassment report notes using `localStorage`.
- No account, backend, API key, or paid hosting required for this demo.

## Run it
Open `index.html` in a browser, or enable GitHub Pages for this repository using **Settings → Pages → Deploy from a branch → main → /(root)**.

After Pages is enabled, the site will be available at:
`https://jakariaadnaan.github.io/Information/`

## Important limitations
This is a **front-end demo**, not a live reverse-phone lookup service. It does not query public databases, verify an operator in real time, or share reports between users. Reports are saved only in the current browser. Clearing browser storage removes them.

It does not identify a subscriber, reveal NID/SIM registration, call/SMS history, or live location. Do not use this tool to publish unverified accusations or personal information.

## Next steps for a real public-data service
A backend or trusted API would be needed for shared community reports and public-web matches. Before adding one, document the data source, terms, retention period, abuse controls, and privacy notice. Never collect private subscriber data without lawful authorization.
