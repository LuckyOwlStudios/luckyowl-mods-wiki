#!/usr/bin/env node
// Renders 3D inventory-style pictures of a mod's blocks from its block models.
//
// Usage:  npm run render-blocks -- <wiki-slug> [path-to-mod-repo] [--force] [--only id1,id2]
// Example: npm run render-blocks -- spelunkers-charm
//
// Writes public/mods/<wiki-slug>/renders/<id>.png for every block whose item model is a 3D model
// (flat item models such as doors and plants keep their texture). Existing pictures are kept, so a
// hand-made icon dropped into renders/ is never overwritten. (In-game photos for a block's page go
// in public/mods/<wiki-slug>/photos/<id>.png instead.) Pass --force to redo generated ones;
// ids listed in renders/photos.txt (one per line) are kept even then.
// Run `npm run import-mod` (or import-all) afterwards so the wiki picks the pictures up.
//
// Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`.
// Vanilla models and textures that a model builds on are downloaded once into .cache/vanilla/.

import fs from 'node:fs';
import path from 'node:path';
import { wikiRoot, createAssets, createRenderer } from './lib/assets.mjs';

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyArg = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const only = onlyArg ? new Set(onlyArg.split(',')) : null;
const [slug, repoArg] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--only');
if (!slug) {
  console.error('Usage: npm run render-blocks -- <wiki-slug> [path-to-mod-repo] [--force] [--only id1,id2]');
  process.exit(1);
}
const repo = path.resolve(repoArg || path.join(wikiRoot, '.cache', 'mod-repos', slug));
const assets = createAssets(repo);
if (!assets.assetRoots.length) throw new Error(`No assets folder found in ${repo}`);
const data = JSON.parse(fs.readFileSync(path.join(wikiRoot, 'src', 'data', 'items', slug + '.json'), 'utf8'));

const outDir = path.join(wikiRoot, 'public', 'mods', slug, 'renders');
fs.mkdirSync(outDir, { recursive: true });
const photosFile = path.join(outDir, 'photos.txt');
const photos = new Set(fs.existsSync(photosFile) ? fs.readFileSync(photosFile, 'utf8').split(/\s+/).filter(Boolean) : []);

const renderer = await createRenderer();
let made = 0, flat = 0, kept = 0;
const failed = [];
for (const item of data.items.filter((i) => i.kind === 'block' && (!only || only.has(i.id)))) {
  const out = path.join(outDir, item.id + '.png');
  if (fs.existsSync(out) && (!force || photos.has(item.id))) { kept++; continue; }
  try {
    const look = await assets.inventoryLook(`${data.namespace}:${item.id}`);
    if (look?.kind !== '3d') { flat++; continue; }
    fs.writeFileSync(out, await renderer.render(look.job));
    made++;
  } catch (e) {
    failed.push(`${item.id}: ${e.message}`);
  }
}
await renderer.close();
console.log(`${slug}: ${made} rendered, ${kept} kept, ${flat} flat (no 3D model)${failed.length ? `, ${failed.length} failed` : ''}`);
for (const f of failed) console.log('  ' + f);
