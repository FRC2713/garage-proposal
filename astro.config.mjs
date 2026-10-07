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
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: { syntaxHighlight: false },
});
