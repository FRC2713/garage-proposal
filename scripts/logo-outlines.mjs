// Flatten the team logo SVGs into outline polygons that SketchUp can turn
// into faces (scripts/add-branding.rb reads the output).
//
//   node scripts/logo-outlines.mjs
//
// Writes scripts/logo-outlines.json: for each logo, its size in SVG units and
// a list of closed loops (y down, as in the SVG). Thin stroked lines become
// rectangles.
import { readFile, writeFile } from "node:fs/promises";

const LOGOS = {
  full: "docs/logos/rhr-full-logo-2026-red.svg",
  mark: "docs/logos/rhr-r-logo.svg",
};
const CURVE_STEPS = 10;

const tokenize = (d) =>
  d.match(/[A-Za-z]|-?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) ?? [];

function pathLoops(d) {
  const t = tokenize(d);
  const loops = [];
  let cur = null;
  let x = 0,
    y = 0,
    sx = 0,
    sy = 0,
    cmd = "";
  // Second control point of the last curve, for reflecting in S commands.
  let cx = 0,
    cy = 0;
  let i = 0;
  const num = () => parseFloat(t[i++]);
  const push = (px, py) => cur.push([px, py]);
  const cubic = (x1, y1, x2, y2, ex, ey) => {
    for (let s = 1; s <= CURVE_STEPS; s++) {
      const u = s / CURVE_STEPS,
        v = 1 - u;
      push(
        v * v * v * x +
          3 * v * v * u * x1 +
          3 * v * u * u * x2 +
          u * u * u * ex,
        v * v * v * y +
          3 * v * v * u * y1 +
          3 * v * u * u * y2 +
          u * u * u * ey,
      );
    }
    cx = x2;
    cy = y2;
    x = ex;
    y = ey;
  };
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0,
      oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case "M":
        x = ox + num();
        y = oy + num();
        cur = [[x, y]];
        loops.push(cur);
        sx = x;
        sy = y;
        cmd = rel ? "l" : "L";
        break;
      case "L":
        x = ox + num();
        y = oy + num();
        push(x, y);
        break;
      case "H":
        x = ox + num();
        push(x, y);
        break;
      case "V":
        y = oy + num();
        push(x, y);
        break;
      case "C": {
        const a = [num(), num(), num(), num(), num(), num()];
        cubic(ox + a[0], oy + a[1], ox + a[2], oy + a[3], ox + a[4], oy + a[5]);
        continue;
      }
      case "S": {
        const a = [num(), num(), num(), num()];
        cubic(
          2 * x - cx,
          2 * y - cy,
          ox + a[0],
          oy + a[1],
          ox + a[2],
          oy + a[3],
        );
        continue;
      }
      case "Z":
        x = sx;
        y = sy;
        cur = null;
        break;
      default:
        throw new Error(`Unsupported path command ${cmd}`);
    }
    cx = x;
    cy = y;
  }
  return loops;
}

function clean(loop) {
  const out = [];
  for (const p of loop) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05) out.push(p);
  }
  const a = out[0],
    b = out[out.length - 1];
  if (out.length > 1 && Math.hypot(a[0] - b[0], a[1] - b[1]) <= 0.05) out.pop();
  return out.map(([px, py]) => [+px.toFixed(3), +py.toFixed(3)]);
}

const result = {};
for (const [key, file] of Object.entries(LOGOS)) {
  const svg = await readFile(file, "utf8");
  const [, , w, h] = svg
    .match(/viewBox="([^"]+)"/)[1]
    .split(/\s+/)
    .map(Number);
  const shapes = [];
  for (const [, cls, d] of svg.matchAll(
    /<path[^>]*class="(st\d)"[^>]*d="([^"]+)"/g,
  )) {
    const loops = pathLoops(d)
      .map(clean)
      .filter((l) => l.length >= 2);
    // A two-point open path is a stroked rule: give it the stroke width.
    if (loops.length === 1 && loops[0].length === 2) {
      const [[x1, y1], [x2]] = loops[0];
      const half = cls === "st1" ? 0.6 : 0.5;
      shapes.push([
        [
          [x1, y1 - half],
          [x2, y1 - half],
          [x2, y1 + half],
          [x1, y1 + half],
        ],
      ]);
      continue;
    }
    shapes.push(loops.filter((l) => l.length >= 3));
  }
  for (const [, pts] of svg.matchAll(/<polygon[^>]*points="([^"]+)"/g)) {
    const n = pts
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    const loop = [];
    for (let k = 0; k < n.length; k += 2) loop.push([n[k], n[k + 1]]);
    shapes.push([clean(loop)]);
  }
  result[key] = { width: w, height: h, shapes };
  console.log(`${key}: ${shapes.length} shapes, ${shapes.flat().length} loops`);
}
await writeFile("scripts/logo-outlines.json", JSON.stringify(result));
console.log("Wrote scripts/logo-outlines.json");
