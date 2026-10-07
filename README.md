# Garage robotics lab proposal

A proposal website from Red Hawk Robotics (FRC Team 2713) to the Superintendent of Schools in Melrose, Massachusetts, asking to convert the garage into a robotics lab. It has an executive summary, an analysis of the space, a phased plan, and a gallery of concept renderings.

Live site: <https://frc2713.github.io/garage-proposal/>

Built from [`FRC2713/hawk-app-template`](https://github.com/FRC2713/hawk-app-template), trimmed to a static Astro site so it can be hosted on GitHub Pages.

## Edit the content

- Shared data: `src/data/proposal.ts` holds the section list, stats, spaces, safety items, phases, gallery captions, and requests.
- One page per section in `src/pages/`: `index` (overview), `summary`, `analysis`, `plan`, `model`, `gallery`, `request`.
- Header, section nav, and footer: `src/layouts/AppLayout.astro`. Page banners and previous/next links: `src/components/`.
- Renderings: `public/images/`. They come from the SketchUp model `frc2713_shop.skp`, Option B.
- 3D model page: `src/components/islands/GarageViewer.tsx` (React Three Fiber). Camera presets are written in SketchUp feet at the top of that file.
- Visual rules: `docs/BRANDING.md`.

## Update the 3D model

The viewer loads `public/models/garage-option-b.glb`, built from the SketchUp model in two steps:

1. In SketchUp with `frc2713_shop.skp` open, run `scripts/export-option-b.rb` in the Ruby console. It writes `~/Desktop/option-b-mesh.json` with the visible Option B geometry (roof, ceilings, and floating labels left out).
2. Run `node scripts/build-model.mjs ~/Desktop/option-b-mesh.json` to write the `.glb`.

## Run locally

```sh
npm install
npm run dev
```

Open <http://localhost:4321/garage-proposal/>.

## Publish

Every push to `main` runs `npm run check` and deploys `dist/` to GitHub Pages through `.github/workflows/deploy.yml`.
