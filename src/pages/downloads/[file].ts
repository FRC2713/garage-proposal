import type { APIRoute, GetStaticPaths } from "astro";
import { floorPlanFiles } from "../../data/proposal";
import { buildFloorPlanPdf } from "../../lib/floor-plan-pdf";

/** Printable floor plans, written as static PDFs at build time. */
export const getStaticPaths = (() =>
  floorPlanFiles.map((f) => ({
    params: { file: f.file },
    props: { kinds: f.kinds },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const bytes = await buildFloorPlanPdf(props.kinds);
  return new Response(bytes as BodyInit, {
    headers: { "Content-Type": "application/pdf" },
  });
};
