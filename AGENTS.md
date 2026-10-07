# Agent guide

This repository is a static, multi-page proposal website hosted on GitHub Pages. `CLAUDE.md` points here.

- Follow `docs/BRANDING.md`: semantic tokens, Inter, Hawk red for emphasis only, no invented logos.
- React is only for islands in `src/components/islands/` (the 3D viewer). Regenerate the model with the scripts described in the README; do not hand-edit the `.glb`.
- Keep the site static (`output: "static"`). Do not add a server, database, or client state library.
- Asset and link paths must include the `/garage-proposal` base; use `import.meta.env.BASE_URL`.
- Add or reorder pages through `sections` in `src/data/proposal.ts`; the nav and previous/next links follow it.
- Do not state costs, dates, or facts about the district that the team has not confirmed.
- `npm run check` must pass before pushing; pushing to `main` deploys the site.
