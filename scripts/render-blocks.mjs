#!/usr/bin/env node
// Renders 3D inventory-style pictures of a mod's blocks from its block models.
//
// Usage:  npm run render-blocks -- <wiki-slug> [path-to-mod-repo] [--force] [--only id1,id2]
// Example: npm run render-blocks -- spelunkers-charm
//
// Writes public/mods/<wiki-slug>/renders/<id>.png for every block whose item model is a 3D model
// (flat item models such as doors and plants keep their texture). Existing pictures are kept, so a
// hand-made photo dropped into renders/ is never overwritten. Pass --force to redo generated ones;
// ids listed in renders/photos.txt (one per line) are kept even then.
// Run `npm run import-mod` (or import-all) afterwards so the wiki picks the pictures up.
//
// Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`.
// Vanilla models and textures that a model builds on are downloaded once into .cache/vanilla/.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyArg = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const only = onlyArg ? new Set(onlyArg.split(',')) : null;
const [slug, repoArg] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--only');
if (!slug) {
  console.error('Usage: npm run render-blocks -- <wiki-slug> [path-to-mod-repo] [--force] [--only id1,id2]');
  process.exit(1);
}
const wikiRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(repoArg || path.join(wikiRoot, '.cache', 'mod-repos', slug));
const VANILLA_VERSION = '1.21.1';
const vanillaDir = path.join(wikiRoot, '.cache', 'vanilla', VANILLA_VERSION);
const SIZE = 256;

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright is missing. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

// ---- asset lookup (same layouts as import-mod.mjs)
function walk(dir, depth, out) {
  if (depth < 0 || !fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || ['build', '.git', '.gradle', 'run', 'node_modules', 'bin', 'out', 'archive'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.name === 'assets' && ['resources', 'generated'].includes(path.basename(dir))) out.push(p);
    else walk(p, depth - 1, out);
  }
  return out;
}
const assetRoots = walk(repo, 6, []);
if (!assetRoots.length) throw new Error(`No assets folder found in ${repo}`);

const data = JSON.parse(fs.readFileSync(path.join(wikiRoot, 'src', 'data', 'items', slug + '.json'), 'utf8'));
const ns = data.namespace;

async function vanilla(rel) {
  const local = path.join(vanillaDir, rel);
  if (fs.existsSync(local)) return local;
  if (fs.existsSync(local + '.missing')) return null;
  const res = await fetch(`https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/${VANILLA_VERSION}/assets/${rel}`);
  fs.mkdirSync(path.dirname(local), { recursive: true });
  if (!res.ok) { fs.writeFileSync(local + '.missing', ''); return null; }
  fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));
  return local;
}
async function findAsset(rel) {
  for (const root of assetRoots) {
    const p = path.join(root, rel);
    if (fs.existsSync(p)) return p;
  }
  return rel.startsWith('minecraft/') ? vanilla(rel) : null;
}
function splitId(id, defNs) {
  const [a, b] = id.includes(':') ? id.split(':') : [defNs, id];
  return { n: a, p: b };
}

// Resolve a model and its parents into { elements, textures, gui, flat }.
async function resolveModel(id, depth = 0) {
  if (depth > 12) return null;
  const { n, p } = splitId(id, 'minecraft');
  if (n === 'minecraft' && ['builtin/generated', 'builtin/entity', 'item/generated', 'item/handheld'].includes(p)) {
    return { elements: null, textures: {}, gui: null, flat: p !== 'builtin/entity' };
  }
  const f = await findAsset(path.join(n, 'models', p + '.json'));
  if (!f) return null;
  let m;
  try { m = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
  const parent = m.parent ? await resolveModel(m.parent, depth + 1) : { elements: null, textures: {}, gui: null, flat: false };
  if (!parent) return null;
  return {
    elements: m.elements || parent.elements,
    textures: { ...parent.textures, ...(m.textures || {}) },
    gui: m.display?.gui || parent.gui,
    flat: m.elements ? false : parent.flat,
  };
}

async function textureDataUrl(texId) {
  const { n, p } = splitId(texId, 'minecraft');
  const f = await findAsset(path.join(n, 'textures', p + '.png'));
  return f ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : null;
}

// Build the render job for one block: elements plus every texture they use, as data URLs.
async function job(id) {
  const model = (await resolveModel(`${ns}:item/${id}`)) || (await resolveModel(`${ns}:block/${id}`));
  if (!model || model.flat || !model.elements?.length) return null;
  const resolve = (v, d = 0) => (v && v.startsWith('#') && d < 8 ? resolve(model.textures[v.slice(1)], d + 1) : v);
  const textures = {};
  const elements = [];
  for (const el of model.elements) {
    const faces = {};
    for (const [dir, face] of Object.entries(el.faces || {})) {
      const tex = resolve(face.texture);
      if (!tex || tex.startsWith('#')) continue;
      if (!(tex in textures)) textures[tex] = await textureDataUrl(tex);
      if (!textures[tex]) continue;
      faces[dir] = { ...face, texture: tex };
    }
    elements.push({ ...el, faces });
  }
  if (!elements.some((e) => Object.keys(e.faces).length)) return null;
  return { id, elements, textures, gui: model.gui || { rotation: [30, 225, 0], translation: [0, 0, 0], scale: [0.625, 0.625, 0.625] } };
}

// ---- the page that draws one model with three.js
const page_html = `<!doctype html><html><body style="margin:0;background:transparent">
<canvas id="c" width="${SIZE}" height="${SIZE}"></canvas>
<script type="module">
import * as THREE from 'http://render.local/three.module.js';
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const loader = new THREE.TextureLoader();
// Same face shading Minecraft uses for blocks in the inventory.
const SHADE = { up: 1, down: 0.5, north: 0.8, south: 0.8, east: 0.6, west: 0.6 };
function corners(dir, [x1, y1, z1], [x2, y2, z2]) {
  // top-left, top-right, bottom-right, bottom-left as seen from outside the face
  return {
    north: [[x2, y2, z1], [x1, y2, z1], [x1, y1, z1], [x2, y1, z1]],
    south: [[x1, y2, z2], [x2, y2, z2], [x2, y1, z2], [x1, y1, z2]],
    west: [[x1, y2, z1], [x1, y2, z2], [x1, y1, z2], [x1, y1, z1]],
    east: [[x2, y2, z2], [x2, y2, z1], [x2, y1, z1], [x2, y1, z2]],
    up: [[x1, y2, z1], [x2, y2, z1], [x2, y2, z2], [x1, y2, z2]],
    down: [[x1, y1, z2], [x2, y1, z2], [x2, y1, z1], [x1, y1, z1]],
  }[dir];
}
function defaultUv(dir, [x1, y1, z1], [x2, y2, z2]) {
  return {
    north: [16 - x2, 16 - y2, 16 - x1, 16 - y1], south: [x1, 16 - y2, x2, 16 - y1],
    west: [z1, 16 - y2, z2, 16 - y1], east: [16 - z2, 16 - y2, 16 - z1, 16 - y1],
    up: [x1, z1, x2, z2], down: [x1, 16 - z2, x2, 16 - z1],
  }[dir];
}
async function loadTex(url) {
  const t = await loader.loadAsync(url);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  // Animated textures are a vertical strip of square frames: show the first.
  const { width, height } = t.image;
  if (height > width) { t.repeat.set(1, width / height); t.offset.set(0, 1 - width / height); }
  return t;
}
window.draw = async (job) => {
  const scene = new THREE.Scene();
  const mats = {};
  for (const [id, url] of Object.entries(job.textures)) if (url) mats[id] = await loadTex(url);
  const model = new THREE.Group();
  for (const el of job.elements) {
    const group = new THREE.Group();
    for (const [dir, face] of Object.entries(el.faces)) {
      const tex = mats[face.texture]; if (!tex) continue;
      const c = corners(dir, el.from, el.to);
      const [u1, v1, u2, v2] = (face.uv || defaultUv(dir, el.from, el.to)).map((n) => n / 16);
      let uvs = [[u1, v1], [u2, v1], [u2, v2], [u1, v2]];
      const k = ((face.rotation || 0) / 90) % 4;
      uvs = uvs.map((_, i) => uvs[(i - k + 4) % 4]);
      const pos = [], uv = [];
      for (const i of [0, 3, 1, 1, 3, 2]) { pos.push(...c[i]); const [u, v] = uvs[i]; uv.push(u * tex.repeat.x + tex.offset.x, (1 - v) * tex.repeat.y + tex.offset.y); }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      const shade = SHADE[dir] ?? 1;
      const color = new THREE.Color(shade, shade, shade);
      if (face.tintindex !== undefined) color.multiply(new THREE.Color(0x79c05a));
      const m = new THREE.MeshBasicMaterial({ map: tex, color, alphaTest: 0.1, transparent: true, side: THREE.DoubleSide });
      group.add(new THREE.Mesh(g, m));
    }
    if (el.rotation && el.rotation.angle) {
      const { origin, axis, angle, rescale } = el.rotation;
      const r = THREE.MathUtils.degToRad(angle);
      const pivot = new THREE.Group();
      pivot.position.set(...origin);
      group.position.set(-origin[0], -origin[1], -origin[2]);
      const inner = new THREE.Group();
      inner.rotation[axis] = r;
      if (rescale) { const s = 1 / Math.cos(r); inner.scale.set(axis === 'x' ? 1 : s, axis === 'y' ? 1 : s, axis === 'z' ? 1 : s); }
      inner.add(group); pivot.add(inner); model.add(pivot);
    } else model.add(group);
  }
  model.position.set(-8, -8, -8);
  const gui = new THREE.Group();
  const d = (n) => THREE.MathUtils.degToRad(n);
  const [rx, ry, rz] = job.gui.rotation || [0, 0, 0];
  gui.rotation.set(d(rx), d(ry), d(rz), 'XYZ');
  gui.scale.set(...(job.gui.scale || [1, 1, 1]));
  gui.position.set(...(job.gui.translation || [0, 0, 0]));
  gui.add(model);
  // Minecraft's inventory view is mirrored compared to three.js (a furnace shows its front on the left).
  const view = new THREE.Group(); view.scale.x = -1; view.add(gui); scene.add(view);
  const cam = new THREE.OrthographicCamera(-8, 8, 8, -8, -100, 100);
  cam.position.set(0, 0, 50);
  renderer.render(scene, cam);
  return document.getElementById('c').toDataURL('image/png');
};
window.ready = true;
</script></body></html>`;

const outDir = path.join(wikiRoot, 'public', 'mods', slug, 'renders');
fs.mkdirSync(outDir, { recursive: true });
const photosFile = path.join(outDir, 'photos.txt');
const photos = new Set(fs.existsSync(photosFile) ? fs.readFileSync(photosFile, 'utf8').split(/\s+/).filter(Boolean) : []);

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
const threePath = createRequire(import.meta.url).resolve('three').replace(/three\.cjs$/, 'three.module.js');
await page.route('http://render.local/**', (route) => {
  const name = new URL(route.request().url()).pathname.slice(1);
  if (name === 'index.html') return route.fulfill({ contentType: 'text/html', body: page_html });
  return route.fulfill({ contentType: 'text/javascript', path: path.join(path.dirname(threePath), name) });
});
await page.goto('http://render.local/index.html');
await page.waitForFunction(() => window.ready);

let made = 0, flat = 0, kept = 0;
const failed = [];
for (const item of data.items.filter((i) => i.kind === 'block' && (!only || only.has(i.id)))) {
  const out = path.join(outDir, item.id + '.png');
  if (fs.existsSync(out) && (!force || photos.has(item.id))) { kept++; continue; }
  try {
    const j = await job(item.id);
    if (!j) { flat++; continue; }
    const url = await page.evaluate((jj) => window.draw(jj), j);
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
    made++;
  } catch (e) {
    failed.push(`${item.id}: ${e.message}`);
  }
}
await browser.close();
console.log(`${slug}: ${made} rendered, ${kept} kept, ${flat} flat (no 3D model)${failed.length ? `, ${failed.length} failed` : ''}`);
for (const f of failed) console.log('  ' + f);
