# Press logos

Drop press logos here as SVG (preferred) or transparent PNG. Files referenced by
`lib/config/press.ts`:

- `fondazione-pesenti.svg` — Fondazione Pesenti
- `italpress.svg` — Italpress
- `ansa.svg` — ANSA
- `lombardia-italia-economy.svg` — Lombardia Italia Economy

Until a file exists at the configured path, the homepage `<PressSection>`
renders an italicised serif wordmark fallback so the section never looks
broken in production.

## Sourcing logos

Use the official press kit / brand assets (search "[outlet] media kit").
Editorial "as featured in" use is generally permitted when an actual
article exists — and each entry in `lib/config/press.ts` already links
to its real article via `href`.

## Adding a new outlet

1. Confirm the article URL exists and names InTransparency by name.
2. Add an entry to `PRESS_ITEMS` in `lib/config/press.ts`.
3. Drop the logo SVG in this directory.

If no article exists, the outlet doesn't belong in the press strip.
Don't add fabricated trust signals.
