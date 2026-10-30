/**
 * Builds the printable floor plans offered on the site as PDF downloads. They
 * are drawn at build time from the same model the 3D viewer loads
 * (`public/models/garage-option-b.glb`), so they follow the model when it is
 * regenerated.
 *
 * - "empty": walls, doors, and the existing mezzanine on a 1 ft grid, for
 *   sketching other layouts.
 * - "populated": the Option B layout with its equipment, seen from above.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { NodeIO } from "@gltf-transform/core";
import {
  PDFDocument,
  PDFOperator,
  PDFOperatorNames,
  closePath,
  lineTo,
  moveTo,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setFillingRgbColor,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import { planRooms } from "../data/proposal";

export type PlanKind = "empty" | "populated";

type P3 = [number, number, number];
type Tri = {
  mat: string;
  color: RGB;
  alpha: number;
  top: number;
  v: [P3, P3, P3];
};
type Seg = [number, number, number, number];

// Plan window in model meters. It matches `plan-proposed.jpg`, so the room
// positions in `planRooms` (inches from that image's top-left) line up.
const X0 = 126.37;
const Z0 = -138.67;
const PLAN_W = 1200 * 0.0254;
const PLAN_H = 850 * 0.0254;

// Height of the horizontal cut that shows walls and doors, in meters.
const CUT = 1.2;

// 3/32 in = 1 ft on US Letter.
const PT_PER_FT = (3 / 32) * 72;
const K = PT_PER_FT / 0.3048; // points per meter
const PAGE_W = 792;
const PAGE_H = 612;
const MARGIN = 30;

const WALLS = ["CMU_1K", "Drywall", "SPF Lumber"];
const DOORS = ["Door Leaf", "Door Frame", "Overhead Door"];
const CAGE_FRONT = [
  "Lab_3C465A_20",
  "Lab_5AA55A_20",
  "Real - Laser-Rated Window (amber)",
  "Chain Link Mesh",
];
const MEZZANINE = ["Mezz Deck", "Mezz Steel", "Mezz Rail"];
// Not drawn from above: labels, wall logos, overhead duct, and the slab.
const SKIP_TOP = [
  "RoomLabel_Orange",
  "RoomLabel_Red",
  "RHR Logo Red",
  "Real - Galvanized Duct",
  "Real - Sealed Concrete Floor",
  ...WALLS,
  ...MEZZANINE,
];

const ink = rgb(0.09, 0.09, 0.11);
const muted = rgb(0.4, 0.41, 0.44);
const hawkRed = rgb(189 / 255, 0, 41 / 255);
const gridMinor = rgb(0.9, 0.91, 0.93);
const gridMajor = rgb(0.78, 0.8, 0.83);

const toSrgb = (v: number) =>
  Math.round(Math.min(1, Math.pow(v, 1 / 2.2)) * 1000) / 1000;

async function loadModel() {
  // Builds run from the project root.
  const path = resolve(process.cwd(), "public/models/garage-option-b.glb");
  const doc = await new NodeIO().read(path);
  const tris: Tri[] = [];
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const material = prim.getMaterial();
      const mat = material?.getName() ?? "";
      const [r, g, b, a] = material?.getBaseColorFactor() ?? [0.8, 0.8, 0.8, 1];
      const color = rgb(toSrgb(r), toSrgb(g), toSrgb(b));
      const pos = prim.getAttribute("POSITION")!.getArray()!;
      const idx = prim.getIndices()?.getArray();
      const n = idx ? idx.length : pos.length / 3;
      for (let i = 0; i < n; i += 3) {
        const at = (k: number): P3 => {
          const j = idx ? idx[i + k]! : i + k;
          return [pos[3 * j]!, pos[3 * j + 1]!, pos[3 * j + 2]!];
        };
        const v: Tri["v"] = [at(0), at(1), at(2)];
        const top = Math.max(v[0][1], v[1][1], v[2][1]);
        tris.push({ mat, color, alpha: a, top, v });
      }
    }
  }
  return tris;
}

/** Where a triangle crosses the cut plane, in plan points. */
function cutSegment(v: Tri["v"]): Seg | null {
  const pts: number[] = [];
  for (const [p, q] of [
    [v[0], v[1]],
    [v[1], v[2]],
    [v[2], v[0]],
  ] as const) {
    const ya = p[1] - CUT;
    const yb = q[1] - CUT;
    if (ya * yb < 0) {
      const t = ya / (ya - yb);
      pts.push(px(p[0] + t * (q[0] - p[0])), pz(p[2] + t * (q[2] - p[2])));
    }
  }
  return pts.length === 4 ? (pts as Seg) : null;
}

const px = (x: number) => (x - X0) * K;
const pz = (z: number) => (z - Z0) * K;

/** Joins cut segments into closed outlines so walls can be filled solid. */
function chainLoops(segs: Seg[]) {
  const key = (x: number, y: number) =>
    `${Math.round(x * 20)},${Math.round(y * 20)}`;
  const ends = new Map<string, number[]>();
  segs.forEach((s, i) => {
    for (const k of [key(s[0], s[1]), key(s[2], s[3])]) {
      (ends.get(k) ?? ends.set(k, []).get(k)!).push(i);
    }
  });
  const used = new Set<number>();
  const loops: number[][] = [];
  for (let i = 0; i < segs.length; i++) {
    if (used.has(i)) continue;
    used.add(i);
    const loop: number[] = [...segs[i]!];
    for (;;) {
      const [x, y] = loop.slice(-2) as [number, number];
      const next = (ends.get(key(x, y)) ?? []).find((j) => !used.has(j));
      if (next === undefined) break;
      used.add(next);
      const s = segs[next]!;
      const forward = key(s[0], s[1]) === key(x, y);
      loop.push(...(forward ? [s[2], s[3]] : [s[0], s[1]]));
    }
    loops.push(loop);
  }
  return loops;
}

/** Plan coordinates have y running down from the plan's top-left corner. */
class Plan {
  constructor(
    private page: PDFPage,
    private left: number,
    private top: number,
  ) {}
  x = (u: number) => this.left + u;
  y = (v: number) => this.top - v;

  fillPolys(polys: number[][], color: RGB, opacity = 1, evenOdd = false) {
    if (!polys.length) return;
    const ops: PDFOperator[] = [
      pushGraphicsState(),
      setFillingRgbColor(color.red, color.green, color.blue),
    ];
    if (opacity < 1) {
      const gs = this.page.doc.context.obj({ Type: "ExtGState", ca: opacity });
      const name = this.page.node.newExtGState(
        "GS",
        this.page.doc.context.register(gs),
      );
      ops.push(PDFOperator.of(PDFOperatorNames.SetGraphicsStateParams, [name]));
    }
    for (const p of polys) {
      ops.push(moveTo(this.x(p[0]!), this.y(p[1]!)));
      for (let i = 2; i < p.length; i += 2)
        ops.push(lineTo(this.x(p[i]!), this.y(p[i + 1]!)));
      ops.push(closePath());
    }
    ops.push(
      PDFOperator.of(
        evenOdd ? PDFOperatorNames.FillEvenOdd : PDFOperatorNames.FillNonZero,
      ),
    );
    ops.push(popGraphicsState());
    this.page.pushOperators(...ops);
  }

  strokeSegs(segs: Seg[], color: RGB, width: number) {
    for (const s of segs) {
      this.page.drawLine({
        start: { x: this.x(s[0]), y: this.y(s[1]) },
        end: { x: this.x(s[2]), y: this.y(s[3]) },
        thickness: width,
        color,
        lineCap: 1,
      });
    }
  }
}

function drawGrid(page: PDFPage, plan: Plan) {
  const feetW = Math.floor(PLAN_W / 0.3048);
  const feetH = Math.floor(PLAN_H / 0.3048);
  for (const major of [false, true]) {
    const color = major ? gridMajor : gridMinor;
    const thickness = major ? 0.5 : 0.3;
    for (let f = 0; f <= feetW; f++) {
      if ((f % 5 === 0) !== major) continue;
      const u = f * PT_PER_FT;
      page.drawLine({
        start: { x: plan.x(u), y: plan.y(0) },
        end: { x: plan.x(u), y: plan.y(PLAN_H * K) },
        thickness,
        color,
      });
    }
    for (let f = 0; f <= feetH; f++) {
      if ((f % 5 === 0) !== major) continue;
      const v = f * PT_PER_FT;
      page.drawLine({
        start: { x: plan.x(0), y: plan.y(v) },
        end: { x: plan.x(PLAN_W * K), y: plan.y(v) },
        thickness,
        color,
      });
    }
  }
}

function drawLabels(page: PDFPage, plan: Plan, bold: PDFFont) {
  const fs = 8;
  for (const r of planRooms) {
    const [ix = 0, iy = 0] = r.proposed;
    const cx = plan.x(ix * 0.0254 * K);
    const cy = plan.y(iy * 0.0254 * K);
    if (r.inLab) {
      const w = bold.widthOfTextAtSize(r.name, fs) + fs * 1.2;
      const h = fs * 1.8;
      page.drawRectangle({
        x: cx - w / 2,
        y: cy - h / 2,
        width: w,
        height: h,
        color: hawkRed,
      });
      page.drawText(r.name, {
        x: cx - (w - fs * 1.2) / 2,
        y: cy - fs * 0.35,
        size: fs,
        font: bold,
        color: rgb(1, 1, 1),
      });
    } else {
      page.drawCircle({
        x: cx,
        y: cy,
        size: fs * 0.9,
        color: rgb(1, 1, 1),
        borderColor: muted,
        borderWidth: 0.75,
      });
      const tw = bold.widthOfTextAtSize(r.mark, fs);
      page.drawText(r.mark, {
        x: cx - tw / 2,
        y: cy - fs * 0.35,
        size: fs,
        font: bold,
        color: muted,
      });
    }
  }
}

function drawScaleBar(page: PDFPage, x: number, y: number, font: PDFFont) {
  const steps = [0, 5, 10, 20];
  const h = 4;
  for (const [i, [from, to]] of [
    [0, 5],
    [5, 10],
    [10, 20],
  ].entries()) {
    const a = x + from! * PT_PER_FT;
    const w = (to! - from!) * PT_PER_FT;
    page.drawRectangle({
      x: a,
      y,
      width: w,
      height: h,
      color: i % 2 ? rgb(1, 1, 1) : ink,
      borderColor: ink,
      borderWidth: 0.5,
    });
  }
  for (const s of steps) {
    const label = s === 20 ? "20 ft" : `${s}`;
    page.drawText(label, {
      x: x + s * PT_PER_FT - (s ? 2 : 1),
      y: y + h + 3,
      size: 6.5,
      font,
      color: ink,
    });
  }
}

let modelCache: Promise<Tri[]> | undefined;

export async function buildFloorPlanPdf(
  kinds: readonly PlanKind[],
): Promise<Uint8Array> {
  const tris = await (modelCache ??= loadModel());
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const require = createRequire(resolve(process.cwd(), "package.json"));
  const fontFile = (w: number) =>
    readFileSync(
      require.resolve(`@fontsource/inter/files/inter-latin-${w}-normal.woff`),
    );
  const regular = await pdf.embedFont(fontFile(400), { subset: true });
  const bold = await pdf.embedFont(fontFile(600), { subset: true });

  pdf.setTitle(
    kinds.length > 1
      ? "Robotics lab floor plans"
      : kinds[0] === "empty"
        ? "Robotics lab floor plan (empty)"
        : "Robotics lab floor plan (Option B layout)",
  );
  pdf.setAuthor("Red Hawk Robotics, FRC Team 2713");
  pdf.setCreator("frc2713.github.io/garage-proposal");

  const wallSegs: Seg[] = [];
  const doorSegs: Seg[] = [];
  const cageSegs: Seg[] = [];
  for (const t of tris) {
    const list = WALLS.includes(t.mat)
      ? wallSegs
      : DOORS.includes(t.mat)
        ? doorSegs
        : CAGE_FRONT.includes(t.mat)
          ? cageSegs
          : null;
    if (!list) continue;
    const s = cutSegment(t.v);
    if (s) list.push(s);
  }
  const wallLoops = chainLoops(wallSegs);

  // Mezzanine footprint from its deck, drawn dashed.
  const deck = tris
    .filter((t) => t.mat === "Mezz Deck")
    .flatMap((t) => t.v.map((q) => [q[0], q[2]] as const));
  const mezz = deck.length
    ? {
        x0: px(Math.min(...deck.map((p) => p[0]))),
        x1: px(Math.max(...deck.map((p) => p[0]))),
        y0: pz(Math.min(...deck.map((p) => p[1]))),
        y1: pz(Math.max(...deck.map((p) => p[1]))),
      }
    : null;

  // Upward-facing triangles of the equipment, lowest first, so taller things
  // cover shorter ones when seen from above.
  const above = tris
    .filter(
      (t) =>
        !SKIP_TOP.includes(t.mat) &&
        !CAGE_FRONT.includes(t.mat) &&
        !DOORS.includes(t.mat),
    )
    .filter((t) => {
      const [[ax, , az], [bx, , bz], [cx, , cz]] = t.v;
      return (bx - ax) * (cz - az) - (bz - az) * (cx - ax) < -1e-6;
    })
    .sort((a, b) => a.top - b.top);

  for (const kind of kinds) {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const planW = PLAN_W * K;
    const planH = PLAN_H * K;
    const left = (PAGE_W - planW) / 2;
    const top = PAGE_H - MARGIN - 44;
    const plan = new Plan(page, left, top);
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_W,
      height: PAGE_H,
      color: rgb(1, 1, 1),
    });

    // Header
    page.drawText(
      kind === "empty"
        ? "Robotics lab floor plan: empty"
        : "Robotics lab floor plan: Option B layout",
      {
        x: MARGIN,
        y: PAGE_H - MARGIN - 14,
        size: 15,
        font: bold,
        color: ink,
      },
    );
    page.drawText(
      kind === "empty"
        ? "Walls, doors, and the existing mezzanine on a 1 ft grid (heavier lines every 5 ft), for sketching layouts."
        : "Proposed equipment layout from the SketchUp model, seen from above. Walls are cut at 4 ft.",
      {
        x: MARGIN,
        y: PAGE_H - MARGIN - 30,
        size: 8.5,
        font: regular,
        color: muted,
      },
    );
    const team = "Red Hawk Robotics · FRC Team 2713";
    page.drawText(team, {
      x: PAGE_W - MARGIN - regular.widthOfTextAtSize(team, 8.5),
      y: PAGE_H - MARGIN - 12,
      size: 8.5,
      font: regular,
      color: muted,
    });
    page.drawLine({
      start: { x: MARGIN, y: top + 6 },
      end: { x: PAGE_W - MARGIN, y: top + 6 },
      thickness: 1,
      color: hawkRed,
    });

    // Plan body, clipped to the plan window.
    page.pushOperators(
      pushGraphicsState(),
      moveTo(plan.x(0), plan.y(0)),
      lineTo(plan.x(planW), plan.y(0)),
      lineTo(plan.x(planW), plan.y(planH)),
      lineTo(plan.x(0), plan.y(planH)),
      closePath(),
      PDFOperator.of(PDFOperatorNames.ClipNonZero),
      PDFOperator.of(PDFOperatorNames.EndPath),
    );

    if (kind === "empty") {
      drawGrid(page, plan);
    } else {
      // Batch neighbouring triangles of one color into one path so no seams show.
      let batch: number[][] = [];
      let cur: Tri | undefined;
      const flush = () => {
        if (cur) plan.fillPolys(batch, cur.color, cur.alpha);
        batch = [];
      };
      for (const t of above) {
        if (!cur || t.mat !== cur.mat) {
          flush();
          cur = t;
        }
        batch.push(t.v.flatMap((q) => [px(q[0]), pz(q[2])]));
      }
      flush();
    }

    if (mezz) {
      page.drawRectangle({
        x: plan.x(mezz.x0),
        y: plan.y(mezz.y1),
        width: mezz.x1 - mezz.x0,
        height: mezz.y1 - mezz.y0,
        borderColor: ink,
        borderWidth: 0.75,
        borderDashArray: [4, 3],
      });
      page.drawText("Mezzanine above", {
        x: plan.x(mezz.x0) + 4,
        y: plan.y(mezz.y0) - 10,
        size: 6.5,
        font: regular,
        color: ink,
      });
    }

    plan.strokeSegs(cageSegs, ink, 0.6);
    plan.strokeSegs(doorSegs, muted, 0.6);
    plan.fillPolys(wallLoops, ink, 1, true);
    plan.strokeSegs(wallSegs, ink, 0.4);
    page.pushOperators(popGraphicsState());

    page.drawRectangle({
      x: plan.x(0),
      y: plan.y(planH),
      width: planW,
      height: planH,
      borderColor: gridMajor,
      borderWidth: 0.5,
    });
    drawLabels(page, plan, bold);

    // Footer
    const fy = MARGIN - 4;
    drawScaleBar(page, MARGIN, fy, regular);
    const note =
      "Scale 3/32 in = 1 ft when printed on US Letter at 100%. Drawn from the SketchUp model (frc2713_shop.skp, Option B); check dimensions on site.";
    page.drawText(note, {
      x: PAGE_W - MARGIN - regular.widthOfTextAtSize(note, 6.5),
      y: fy,
      size: 6.5,
      font: regular,
      color: muted,
    });
  }

  return pdf.save();
}
