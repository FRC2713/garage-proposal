// Convert the SketchUp mesh export (scripts/export-option-b.rb) into a compact
// glTF binary for the 3D viewer.
//
//   node scripts/build-model.mjs path/to/option-b-mesh.json
//
// Writes public/models/garage-option-b.glb.
import { readFile, mkdir } from "node:fs/promises";
import { Document, NodeIO } from "@gltf-transform/core";
import { dedup, weld, prune } from "@gltf-transform/functions";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/build-model.mjs <mesh.json>");
  process.exit(1);
}

const buckets = JSON.parse(await readFile(input, "utf8"));
const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene("Option B");

// Keep SketchUp's coordinates (converted to meters, Y up) so the viewer's
// camera presets can be written in the same feet the model uses.
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (const b of buckets) {
  for (let i = 0; i < b.pos.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], b.pos[i + k]);
      max[k] = Math.max(max[k], b.pos[i + k]);
    }
  }
}

const srgbToLinear = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

for (const b of buckets) {
  const pos = new Float32Array(b.pos);
  const material = doc
    .createMaterial(b.name)
    .setBaseColorFactor([...b.color.map(srgbToLinear), b.alpha])
    .setRoughnessFactor(
      /steel|metal|alum|galv|stainless|plate/i.test(b.name) ? 0.45 : 0.85,
    )
    .setMetallicFactor(
      /steel|metal|alum|galv|stainless|plate/i.test(b.name) ? 0.35 : 0,
    )
    .setDoubleSided(true);
  if (b.alpha < 1) material.setAlphaMode("BLEND");

  const prim = doc
    .createPrimitive()
    .setMaterial(material)
    .setAttribute(
      "POSITION",
      doc.createAccessor().setType("VEC3").setArray(pos).setBuffer(buffer),
    )
    .setAttribute(
      "NORMAL",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(b.nrm))
        .setBuffer(buffer),
    );
  const mesh = doc.createMesh(b.name).addPrimitive(prim);
  scene.addChild(doc.createNode(b.name).setMesh(mesh));
}

await doc.transform(weld(), dedup(), prune());
await mkdir("public/models", { recursive: true });
const out = "public/models/garage-option-b.glb";
await new NodeIO().write(out, doc);
const size = (await readFile(out)).length;
console.log(
  `Wrote ${out}: ${buckets.length} materials, ${(size / 1024).toFixed(0)} KB, ` +
    `${(max[0] - min[0]).toFixed(1)} × ${(max[2] - min[2]).toFixed(1)} m`,
);
