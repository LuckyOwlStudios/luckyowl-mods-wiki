#!/usr/bin/env node
// Imports a mod's recipes so item pages can show them.
//
// Usage:  npm run import-recipes -- [wiki-slug] [path-to-mod-repo]
//         (no slug: every mod in scripts/mods.json, from .cache/mod-repos/<slug>)
//
// Reads the mod's data/<ns>/recipe(s)/*.json and writes src/data/recipes/<slug>.json with every
// recipe that makes one of the mod's items (run import-mod first). Vanilla items used as
// ingredients get a name in src/data/vanilla.json and an icon in public/vanilla/<id>.png.

import fs from 'node:fs';
import path from 'node:path';
import { wikiRoot, createAssets, createRenderer, vanillaFile, splitId } from './lib/assets.mjs';

const [slugArg, repoArg] = process.argv.slice(2);
const mods = JSON.parse(fs.readFileSync(path.join(wikiRoot, 'scripts', 'mods.json'), 'utf8'));
const slugs = slugArg ? [slugArg] : Object.keys(mods);

// ---- every item the wiki has a page for, by full id
const itemsDir = path.join(wikiRoot, 'src', 'data', 'items');
const known = new Map();
for (const f of fs.readdirSync(itemsDir)) {
  const d = JSON.parse(fs.readFileSync(path.join(itemsDir, f), 'utf8'));
  for (const it of d.items) known.set(`${d.namespace}:${it.id}`, f.replace(/\.json$/, ''));
}

const vanillaJson = path.join(wikiRoot, 'src', 'data', 'vanilla.json');
const vanilla = fs.existsSync(vanillaJson) ? JSON.parse(fs.readFileSync(vanillaJson, 'utf8')) : {};
const vanillaIcons = path.join(wikiRoot, 'public', 'vanilla');
fs.mkdirSync(vanillaIcons, { recursive: true });
const lang = JSON.parse(fs.readFileSync(await vanillaFile('assets/minecraft/lang/en_us.json'), 'utf8'));
const vanillaAssets = createAssets(null);
let renderer = null;

function dataRoots(repo) {
  const out = [];
  (function walk(dir, depth) {
    if (depth < 0 || !fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory() || ['build', '.git', '.gradle', 'run', 'node_modules', 'bin', 'out', 'archive'].includes(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.name === 'data' && ['resources', 'generated'].includes(path.basename(dir))) out.push(p);
      else walk(p, depth - 1);
    }
  })(repo, 6);
  return out;
}
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };

// Common (c:) tags aren't in vanilla data: map the usual ones to the vanilla item they stand for.
function commonTag(p) {
  const [group, name] = p.split('/');
  const rules = {
    ingots: (n) => `${n}_ingot`, nuggets: (n) => `${n}_nugget`, gems: (n) => n, dusts: (n) => (n === 'redstone' ? 'redstone' : n === 'glowstone' ? 'glowstone_dust' : `${n}_dust`),
    dyes: (n) => `${n}_dye`, storage_blocks: (n) => `${n}_block`, raw_materials: (n) => `raw_${n}`, ores: (n) => `${n}_ore`,
    rods: (n) => (n === 'wooden' ? 'stick' : n === 'blaze' ? 'blaze_rod' : n === 'breeze' ? 'breeze_rod' : null),
    glass_blocks: () => 'glass', glass_panes: () => 'glass_pane', strings: () => 'string', leathers: () => 'leather',
    chests: (n) => (n === 'trapped' ? 'trapped_chest' : 'chest'), cobblestones: () => 'cobblestone', stones: () => 'stone',
    feathers: () => 'feather', slime_balls: () => 'slime_ball', bones: () => 'bone', gunpowders: () => 'gunpowder',
    wooden_chests: () => 'chest', fences: () => 'oak_fence', obsidians: () => 'obsidian', sands: () => 'sand',
    crops: (n) => n, foods: () => null, tools: () => null, eggs: () => 'egg', ender_pearls: () => 'ender_pearl',
    string: () => 'string', bricks: (n) => (n === 'nether' ? 'nether_brick' : 'brick'), buckets: (n) => (n === 'empty' ? 'bucket' : `${n}_bucket`),
    barrels: () => 'barrel', workbenches: () => 'crafting_table', gravels: () => 'gravel', netherracks: () => 'netherrack', end_stones: () => 'end_stone',
  };
  const f = rules[group];
  const id = f ? f(name || group) : null;
  return id && (lang[`item.minecraft.${id}`] || lang[`block.minecraft.${id}`]) ? [`minecraft:${id}`] : [];
}

async function tagItems(tag, roots, depth = 0) {
  if (depth > 5) return [];
  const { n, p } = splitId(tag);
  const files = [];
  for (const root of roots) for (const dir of ['item', 'items']) {
    const f = path.join(root, n, 'tags', dir, p + '.json');
    if (fs.existsSync(f)) files.push(f);
  }
  if (n === 'minecraft') { const f = await vanillaFile(`data/minecraft/tags/item/${p}.json`); if (f) files.push(f); }
  const out = [];
  for (const f of files) for (let v of readJson(f)?.values || []) {
    if (typeof v === 'object') v = v.id;
    if (v.startsWith('#')) out.push(...(await tagItems(v.slice(1), roots, depth + 1)));
    else out.push(v.includes(':') ? v : `minecraft:${v}`);
  }
  if (!out.length && n === 'c') out.push(...commonTag(p));
  return [...new Set(out)];
}

// One ingredient: { ids: [...], tag?: 'ns:path', count? } or null for an empty slot.
async function ingredient(raw, roots) {
  if (raw == null || raw === '' || raw === ' ') return null;
  if (Array.isArray(raw)) {
    const parts = (await Promise.all(raw.map((r) => ingredient(r, roots)))).filter(Boolean);
    return parts.length ? { ids: [...new Set(parts.flatMap((x) => x.ids))], tag: parts.length === 1 ? parts[0].tag : undefined } : null;
  }
  if (typeof raw === 'string') raw = raw.startsWith('#') ? { tag: raw.slice(1) } : { item: raw };
  if (raw.item) return { ids: [raw.item.includes(':') ? raw.item : `minecraft:${raw.item}`] };
  if (raw.tag) return { ids: await tagItems(raw.tag, roots), tag: raw.tag };
  if (raw.items) return ingredient(raw.items, roots);
  if (raw.children) return ingredient(raw.children, roots);
  if (raw.ingredient) return ingredient(raw.ingredient, roots);
  return null;
}
function result(r) {
  if (!r) return null;
  if (typeof r === 'string') return { id: r, count: 1 };
  const id = r.id || r.item;
  return id ? { id: id.includes(':') ? id : `minecraft:${id}`, count: r.count || 1 } : null;
}

const STATIONS = {
  'minecraft:crafting_shaped': 'crafting', 'minecraft:crafting_shapeless': 'crafting',
  'minecraft:smelting': 'smelting', 'minecraft:blasting': 'blasting', 'minecraft:smoking': 'smoking',
  'minecraft:campfire_cooking': 'campfire', 'minecraft:stonecutting': 'stonecutting',
  'minecraft:smithing_transform': 'smithing', 'sawmill:woodcutting': 'woodcutting',
};

async function convert(r, roots) {
  const station = STATIONS[r.type];
  if (!station) return null;
  const out = result(r.result);
  if (!out) return null;
  if (station === 'crafting') {
    const grid = Array(9).fill(null);
    if (r.type.endsWith('shaped')) {
      const pattern = r.pattern || [];
      const h = pattern.length, w = Math.max(...pattern.map((row) => row.length));
      // Narrow recipes (a single column, like a key or a stick) look best centred.
      const dx = w === 1 ? 1 : 0, dy = h === 1 ? 1 : 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < pattern[y].length; x++) {
        const ch = pattern[y][x];
        if (ch !== ' ') grid[(y + dy) * 3 + x + dx] = await ingredient(r.key?.[ch], roots);
      }
    } else {
      const ings = (await Promise.all((r.ingredients || []).map((i) => ingredient(i, roots)))).filter(Boolean);
      ings.slice(0, 9).forEach((ing, i) => (grid[i] = ing));
    }
    return { station, shapeless: r.type.endsWith('shapeless'), grid, result: out };
  }
  if (station === 'smithing') {
    const inputs = [await ingredient(r.template, roots), await ingredient(r.base, roots), await ingredient(r.addition, roots)];
    return { station, inputs, result: out };
  }
  const ing = await ingredient(r.ingredient, roots);
  if (!ing) return null;
  if (r.ingredient_count > 1) ing.count = r.ingredient_count;
  const rec = { station, inputs: [ing], result: out };
  if (['smelting', 'blasting', 'smoking', 'campfire'].includes(station)) { rec.time = (r.cookingtime || 200) / 20; rec.xp = r.experience || 0; }
  return rec;
}

// Name and icon for a vanilla item used as an ingredient.
async function ensureVanilla(id) {
  const { n, p } = splitId(id);
  if (n !== 'minecraft' || vanilla[p]) return;
  const name = lang[`item.minecraft.${p}`] || lang[`block.minecraft.${p}`] || p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  // Sprites go in public/vanilla/, 3D renders in public/vanilla/renders/ (they're scaled smoothly).
  let file = [path.join(vanillaIcons, p + '.png'), path.join(vanillaIcons, 'renders', p + '.png')].find((f) => fs.existsSync(f));
  if (!file) {
    const chests = { chest: 'entity/chest/normal', trapped_chest: 'entity/chest/trapped', ender_chest: 'entity/chest/ender' };
    const look = chests[p] ? { kind: '3d', job: await vanillaAssets.chestJob(id, chests[p]) } : await vanillaAssets.inventoryLook(id);
    if (look?.kind === 'flat') fs.copyFileSync(look.file, (file = path.join(vanillaIcons, p + '.png')));
    else if (look?.kind === '3d') {
      if (renderer === null) renderer = await createRenderer().catch((e) => (console.warn(`No 3D icons for vanilla blocks: ${e.message}`), false));
      if (!renderer) { vanilla[p] = { name, icon: null }; return; }
      fs.mkdirSync(path.join(vanillaIcons, 'renders'), { recursive: true });
      fs.writeFileSync((file = path.join(vanillaIcons, 'renders', p + '.png')), await renderer.render(look.job));
    }
  }
  vanilla[p] = { name, icon: file ? '/' + path.relative(path.join(wikiRoot, 'public'), file) : null };
}

fs.mkdirSync(path.join(wikiRoot, 'src', 'data', 'recipes'), { recursive: true });
for (const slug of slugs) {
  const repo = path.resolve(slugArg && repoArg ? repoArg : path.join(wikiRoot, '.cache', 'mod-repos', slug));
  if (!fs.existsSync(repo)) { console.log(`${slug}: no repo at ${repo}, skipped`); continue; }
  const roots = dataRoots(repo);
  const recipes = [];
  const seen = new Set();
  for (const root of roots) for (const ns of fs.readdirSync(root)) for (const dir of ['recipe', 'recipes']) {
    const base = path.join(root, ns, dir);
    if (!fs.existsSync(base)) continue;
    for (const f of fs.readdirSync(base, { recursive: true }).filter((f) => f.endsWith('.json'))) {
      const raw = readJson(path.join(base, f));
      if (!raw) continue;
      const rec = await convert(raw, roots);
      if (!rec) continue;
      // Keep recipes that make one of this mod's items, or use one (shown as "Used to make").
      const uses = [...(rec.grid || []), ...(rec.inputs || [])].some((i) => i?.ids.some((id) => known.get(id) === slug));
      if (known.get(rec.result.id) !== slug && !uses) continue;
      const key = JSON.stringify(rec);
      if (seen.has(key)) continue; // multiloader repos often have the same recipe twice
      seen.add(key);
      recipes.push(rec);
    }
  }
  // A blast furnace recipe that matches a furnace one is shown as a note on the furnace recipe.
  const sig = (r) => JSON.stringify([r.inputs, r.result]);
  const smelt = new Map(recipes.filter((r) => r.station === 'smelting').map((r) => [sig(r), r]));
  const final = recipes.filter((r) => {
    if (r.station !== 'blasting' || !smelt.has(sig(r))) return true;
    smelt.get(sig(r)).alsoBlasting = true;
    return false;
  });
  for (const r of final) {
    for (const ing of [...(r.grid || []), ...(r.inputs || [])]) for (const id of ing?.ids || []) await ensureVanilla(id);
    await ensureVanilla(r.result.id);
  }
  final.sort((a, b) => a.result.id.localeCompare(b.result.id));
  fs.writeFileSync(path.join(wikiRoot, 'src', 'data', 'recipes', slug + '.json'), JSON.stringify(final, null, 1) + '\n');
  const counts = {};
  for (const r of final) counts[r.station] = (counts[r.station] || 0) + 1;
  console.log(`${slug}: ${final.length} recipes ${JSON.stringify(counts)}`);
}
// Icons for the station shown on each recipe card.
for (const id of ['crafting_table', 'furnace', 'blast_furnace', 'smoker', 'campfire', 'stonecutter', 'smithing_table']) await ensureVanilla(`minecraft:${id}`);
if (renderer) await renderer.close();
const sorted = Object.fromEntries(Object.entries(vanilla).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(vanillaJson, JSON.stringify(sorted, null, 1) + '\n');
