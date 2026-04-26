# Press logos

Drop press logos here as SVG (preferred) or transparent PNG. Files referenced by
`lib/config/press.ts`:

- `corriere-della-sera.svg` — Corriere della Sera masthead
- `eco-di-bergamo.svg` — Eco di Bergamo masthead

Until a file exists at the configured path, the homepage `<PressSection>`
renders a typographic wordmark fallback so the section never looks broken.

When a published article exists, also set the `href` field in
`lib/config/press.ts` so each logo links to the article.

Use the official press kit / brand assets (search "[outlet] media kit" or
"[outlet] download logo"). Make sure usage is permitted — for editorial
"as featured in" use this is generally fine when an actual article exists.
