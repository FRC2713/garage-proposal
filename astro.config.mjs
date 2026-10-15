// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Static build for GitHub Pages: https://frc2713.github.io/garage-proposal/
export default defineConfig({
  output: "static",
  site: "https://frc2713.github.io",
  base: "/garage-proposal",
  integrations: [react()],
  // The 3D model page now lives on the gallery page.
  redirects: { "/model": "/garage-proposal/gallery/#3d" },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: { syntaxHighlight: false },
});
