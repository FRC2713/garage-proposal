# Agent guide

This repository is a static, single-page proposal website hosted on GitHub Pages. `CLAUDE.md` points here.

- Follow `docs/BRANDING.md`: semantic tokens, Inter, Hawk red for emphasis only, no invented logos.
- Keep the site static (`output: "static"`). Do not add a server, database, or client state library.
- Asset and link paths must include the `/garage-proposal` base; use `import.meta.env.BASE_URL`.
- Do not state costs, dates, or facts about the district that the team has not confirmed.
- `npm run check` must pass before pushing; pushing to `main` deploys the site.
