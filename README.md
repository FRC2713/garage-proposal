# Garage robotics lab proposal

A one-page proposal website from Red Hawk Robotics (FRC Team 2713) to the Superintendent of Schools in Melrose, Massachusetts, asking to convert the garage into a robotics lab. It has an executive summary, an analysis of the space, a phased plan, and a gallery of concept renderings.

Live site: <https://frc2713.github.io/garage-proposal/>

Built from [`FRC2713/hawk-app-template`](https://github.com/FRC2713/hawk-app-template), trimmed to a static Astro site so it can be hosted on GitHub Pages.

## Edit the content

- Page text and data: `src/pages/index.astro` (the lists at the top hold the stats, spaces, safety items, phases, and gallery captions).
- Header and footer: `src/layouts/AppLayout.astro`.
- Renderings: `public/images/`. They come from the SketchUp model `frc2713_shop.skp`, Option B.
- Visual rules: `docs/BRANDING.md`.

## Run locally

```sh
npm install
npm run dev
```

Open <http://localhost:4321/garage-proposal/>.

## Publish

Every push to `main` runs `npm run check` and deploys `dist/` to GitHub Pages through `.github/workflows/deploy.yml`.
