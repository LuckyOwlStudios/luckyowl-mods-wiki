#!/usr/bin/env node
// Imports the item/block list of a mod into the wiki.
//
// Usage:  npm run import-mod -- <wiki-slug> <path-to-mod-repo> [mod-namespace]
// Example: npm run import-mod -- spelunkers-charm ../luckys-spelunkers-charm
//
// Reads the mod's en_us.json + item models/textures and writes:
//   src/data/items/<wiki-slug>.json          (the item list the wiki renders)
//   public/mods/<wiki-slug>/items/<id>.png   (icons)
// Hand-written notes for an item go in src/content/items/<wiki-slug>/<id>.md
// and are never touched by this script, so re-running it is safe.

import fs from 'node:fs';
import path from 'node:path';

const [slug, repoArg, nsArg] = process.argv.slice(2);
if (!slug || !repoArg) {
  console.error('Usage: npm run import-mod -- <wiki-slug> <path-to-mod-repo> [mod-namespace]');
  process.exit(1);
}
const repo = path.resolve(repoArg);
const wikiRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// ---- find every resources root (handles MDK, datagen and multiloader layouts)
function walk(dir, depth, out) {
  if (depth < 0 || !fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || ['build', '.git', '.gradle', 'run', 'node_modules', 'bin', 'out'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.name === 'assets' && path.basename(dir) === 'resources') out.push(p);
    else walk(p, depth - 1, out);
  }
  return out;
}
const assetRoots = walk(repo, 6, []);
if (!assetRoots.length) throw new Error(`No assets folder found in ${repo}`);

// ---- pick the namespace: the one with the biggest en_us.json
let ns = nsArg;
if (!ns) {
  let best = 0;
  for (const root of assetRoots) for (const n of fs.readdirSync(root)) {
    const f = path.join(root, n, 'lang', 'en_us.json');
    if (fs.existsSync(f) && fs.statSync(f).size > best) { best = fs.statSync(f).size; ns = n; }
  }
}
if (!ns) throw new Error('Could not find a lang/en_us.json');

const lang = {};
for (const root of assetRoots) {
  const f = path.join(root, ns, 'lang', 'en_us.json');
  if (fs.existsSync(f)) Object.assign(lang, JSON.parse(fs.readFileSync(f, 'utf8')));
}

function findAsset(rel) {
  for (const root of assetRoots) {
    const p = path.join(root, rel);
    if (fs.existsSync(p)) return p;
  }
  return null;
}
function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }
function splitId(id, defNs = ns) {
  const [a, b] = id.includes(':') ? id.split(':') : [defNs, id];
  return { n: a, p: b };
}
function modelFile(id) { const { n, p } = splitId(id); return findAsset(path.join(n, 'models', p + '.json')); }

// Resolve a model (with parents) to its merged texture map.
function textures(id, seen = new Set()) {
  if (seen.has(id)) return {};
  seen.add(id);
  const f = modelFile(id);
  if (!f) return {};
  const m = readJson(f) || {};
  const parent = m.parent ? textures(m.parent, seen) : {};
  return { ...parent, ...(m.textures || {}) };
}
function pickTexture(tex) {
  const order = ['layer0', 'all', 'front', 'side', 'texture', 'end', 'top', 'cross', 'plant', 'wool', 'pattern', 'particle'];
  const resolve = (v, d = 0) => (v && v.startsWith('#') && d < 8 ? resolve(tex[v.slice(1)], d + 1) : v);
  for (const k of order) if (tex[k]) { const v = resolve(tex[k]); if (v && !v.startsWith('#')) return v; }
  for (const v of Object.values(tex)) { const r = resolve(v); if (r && !r.startsWith('#')) return r; }
  return null;
}
function textureFile(texId) {
  const { n, p } = splitId(texId, 'minecraft');
  return findAsset(path.join(n, 'textures', p + '.png'));
}

// ---- collect entries
const skipSuffix = /\.(desc|description|tooltip|info|lore)(\.\d+)?$/;
const items = [];
for (const [key, name] of Object.entries(lang)) {
  const m = key.match(new RegExp(`^(item|block)\\.${ns}\\.([a-z0-9_]+)$`));
  if (!m) continue;
  const [, kind, id] = m;
  const clean = (t) => t.replace(/§./g, '').replace(/\s+/g, ' ').trim();
  if (items.some((i) => i.id === id)) continue;
  const desc = [
    lang[`${key}.description`], lang[`${key}.desc`], lang[`${key}.tooltip`],
    lang[`tooltip.${ns}.${id}`], lang[`${kind}.${ns}.${id}.tooltip`],
  ].filter(Boolean);

  let tex = pickTexture(textures(`${ns}:item/${id}`));
  if (!tex) tex = pickTexture(textures(`${ns}:block/${id}`));
  let file = tex && textureFile(tex);
  if (!file) file = findAsset(path.join(ns, 'textures', 'item', id + '.png')) || findAsset(path.join(ns, 'textures', 'block', id + '.png'));

  items.push({ id, name: clean(name), kind, description: clean(desc.join(' ')), icon: file ? `/mods/${slug}/items/${id}.png` : null, _file: file });
}
// Same display name twice (e.g. two "Banner Pattern"s): add the description to tell them apart.
const nameCount = {};
for (const it of items) nameCount[it.name] = (nameCount[it.name] || 0) + 1;
for (const it of items) if (it.description && nameCount[it.name] > 1) it.name = `${it.name} (${it.description})`;
items.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'item' ? -1 : 1));

// ---- write output
const iconDir = path.join(wikiRoot, 'public', 'mods', slug, 'items');
fs.rmSync(iconDir, { recursive: true, force: true });
fs.mkdirSync(iconDir, { recursive: true });
for (const it of items) { if (it._file) fs.copyFileSync(it._file, path.join(iconDir, it.id + '.png')); delete it._file; }
fs.mkdirSync(path.join(wikiRoot, 'src', 'data', 'items'), { recursive: true });
fs.writeFileSync(path.join(wikiRoot, 'src', 'data', 'items', slug + '.json'), JSON.stringify({ namespace: ns, items }, null, 2) + '\n');
console.log(`${slug}: ${items.length} entries from namespace "${ns}" (${items.filter((i) => i.icon).length} with icons)`);
