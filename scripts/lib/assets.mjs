// Shared helpers for the asset scripts: finding a mod's assets (with vanilla fallback),
// resolving block/item models, and rendering 3D inventory pictures with three.js in Chromium.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

export const wikiRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
export const VANILLA_VERSION = '1.21.1';
const VANILLA_URL = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/${VANILLA_VERSION}`;
const vanillaDir = path.join(wikiRoot, '.cache', 'vanilla', VANILLA_VERSION);
export const SIZE = 256;

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

/** Download (once) a file from the vanilla assets/data, e.g. "assets/minecraft/lang/en_us.json". */
export async function vanillaFile(rel) {
  const local = path.join(vanillaDir, rel);
  if (fs.existsSync(local)) return local;
  if (fs.existsSync(local + '.missing')) return null;
  const res = await fetch(`${VANILLA_URL}/${rel}`);
  fs.mkdirSync(path.dirname(local), { recursive: true });
  if (!res.ok) { fs.writeFileSync(local + '.missing', ''); return null; }
  fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));
  return local;
}

export function splitId(id, defNs = 'minecraft') {
  const [a, b] = id.includes(':') ? id.split(':') : [defNs, id];
  return { n: a, p: b };
}

/** Asset lookup for one mod repo (or none: vanilla only). */
export function createAssets(repo) {
  const assetRoots = repo ? walk(repo, 6, []) : [];
  async function findAsset(rel) {
    for (const root of assetRoots) {
      const p = path.join(root, rel);
      if (fs.existsSync(p)) return p;
    }
    return rel.startsWith('minecraft/') ? vanillaFile('assets/' + rel) : null;
  }

  // Resolve a model and its parents into { elements, textures, gui, flat }.
  async function resolveModel(id, depth = 0) {
    if (depth > 12) return null;
    const { n, p } = splitId(id);
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

  async function textureFile(texId) {
    const { n, p } = splitId(texId);
    return findAsset(path.join(n, 'textures', p + '.png'));
  }

  /**
   * How an item looks in the inventory: { kind: 'flat', file } for a sprite, { kind: '3d', job } for a model
   * to render, or null (no model, or drawn by Java code).
   */
  async function inventoryLook(fullId) {
    const { n, p } = splitId(fullId);
    const model = (await resolveModel(`${n}:item/${p}`)) || (await resolveModel(`${n}:block/${p}`));
    if (!model) return null;
    const resolve = (v, d = 0) => (v && v.startsWith('#') && d < 8 ? resolve(model.textures[v.slice(1)], d + 1) : v);
    if (model.flat) {
      const tex = resolve(model.textures.layer0);
      const file = tex && (await textureFile(tex));
      return file ? { kind: 'flat', file } : null;
    }
    if (!model.elements?.length) return null;
    const textures = {};
    const elements = [];
    for (const el of model.elements) {
      const faces = {};
      for (const [dir, face] of Object.entries(el.faces || {})) {
        const tex = resolve(face.texture);
        if (!tex || tex.startsWith('#')) continue;
        if (!(tex in textures)) {
          const f = await textureFile(tex);
          textures[tex] = f ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : null;
        }
        if (!textures[tex]) continue;
        faces[dir] = { ...face, texture: tex };
      }
      elements.push({ ...el, faces });
    }
    if (!elements.some((e) => Object.keys(e.faces).length)) return null;
    return { kind: '3d', job: { id: fullId, elements, textures, gui: model.gui || { rotation: [30, 225, 0], translation: [0, 0, 0], scale: [0.625, 0.625, 0.625] } } };
  }

  return { assetRoots, findAsset, resolveModel, textureFile, inventoryLook, chestJob };
  async function chestJob(fullId, texId) {
    const f = await textureFile(texId);
    if (!f) return null;
    // The chest model is drawn by Java code; this rebuilds it from the 64x64 entity texture.
    const q = (x1, y1, x2, y2) => [x1 / 4, y1 / 4, x2 / 4, y2 / 4];
    const box = (from, to, y0, h) => ({ from, to, faces: {
      up: { uv: q(28, y0, 42, y0 + 14), texture: 't' }, down: { uv: q(14, y0, 28, y0 + 14), texture: 't' },
      east: { uv: q(0, y0 + 14, 14, y0 + 14 + h), texture: 't' }, north: { uv: q(14, y0 + 14, 28, y0 + 14 + h), texture: 't' },
      west: { uv: q(28, y0 + 14, 42, y0 + 14 + h), texture: 't' }, south: { uv: q(42, y0 + 14, 56, y0 + 14 + h), texture: 't' } } });
    const lid = box([1, 9, 1], [15, 14, 15], 0, 5);
    const base = box([1, 0, 1], [15, 10, 15], 19, 10);
    delete base.faces.up;
    const latch = { from: [7, 7, 0], to: [9, 11, 1], faces: {
      north: { uv: q(1, 1, 3, 5), texture: 't' }, up: { uv: q(1, 0, 3, 1), texture: 't' }, down: { uv: q(3, 0, 5, 1), texture: 't' },
      east: { uv: q(0, 1, 1, 5), texture: 't' }, west: { uv: q(3, 1, 4, 5), texture: 't' } } };
    return { id: fullId, elements: [base, lid, latch], textures: { t: 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') },
      gui: { rotation: [30, 225, 0], translation: [0, 0, 0], scale: [0.625, 0.625, 0.625] } };
  }
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

/** Starts Chromium with the three.js page. render(job) returns PNG bytes. */
export async function createRenderer() {
  let chromium;
  try {
    ({ chromium } = createRequire(import.meta.url)('playwright'));
  } catch {
    throw new Error('Playwright is missing. Run: npm i -D playwright && npx playwright install chromium');
  }
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
  return {
    async render(job) {
      const url = await page.evaluate((jj) => window.draw(jj), job);
      return Buffer.from(url.split(',')[1], 'base64');
    },
    close: () => browser.close(),
  };
}
