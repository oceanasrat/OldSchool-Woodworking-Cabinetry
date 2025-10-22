# Artisan Portfolio (Seller Edition)

**Purpose:** A white-label, config-driven portfolio you can brand and resell to artisans (woodworkers, metalworkers, etc.). Deployed on GitHub Pages with one push.

## Quick Start (for you)
```bash
npm i
npm run brand -- --repo my-client-site --name "Old School Woodworks" --phone "(214) 555-0192" --email "hello@oldschoolwoodworks.com" --city "Dallas–Fort Worth"
npm run dev   # preview locally
```

Commit & push to GitHub. In the repo: **Settings → Pages → Source: GitHub Actions**.

## What `npm run brand` does
- Updates `vite.config.ts` base to `/<repo>/`
- Sets site name, phone, email, city in `/data/site.json`
- Updates `<title>` in `index.html`

## Client Handoff Checklist
- [ ] Replace placeholder images in `/public/images/` with real project photos
- [ ] Fill out `/data/projects.json`, `/data/testimonials.json`, `/data/blog.json`
- [ ] Update `/data/site.json` (colors, socials, services)
- [ ] Connect the form to Formspree or your preferred endpoint (see below)
- [ ] Push to `main` → Pages auto-deploys

## Forms (no backend)
- **Formspree**: create a form and set its endpoint in `/data/site.json` (`formspreeEndpoint`). The form will POST there.

## Structure
- `/data/*` → All editable content (no code changes required)
- `/public/images/*` → Client photos
- `/src/App.tsx` → Layout pulling from `/data`
- `/scripts/brand.mjs` → One-command branding

## License
MIT — you may resell this template. Keep the license in the repo.
