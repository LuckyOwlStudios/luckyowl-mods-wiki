#!/usr/bin/env node
// Re-imports every mod listed in scripts/mods.json straight from GitHub.
// Usage: npm run import-all            (all mods)
//        npm run import-all -- wardrobe (just one)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const mods = JSON.parse(fs.readFileSync(path.join(here, 'mods.json'), 'utf8'));
const only = process.argv.slice(2);
const cache = path.join(here, '..', '.cache', 'mod-repos');
fs.mkdirSync(cache, { recursive: true });

for (const [slug, repo] of Object.entries(mods)) {
  if (only.length && !only.includes(slug)) continue;
  const dir = path.join(cache, slug);
  fs.rmSync(dir, { recursive: true, force: true });
  execFileSync('git', ['clone', '--quiet', '--depth', '1', `https://github.com/${repo}.git`, dir], { stdio: 'inherit' });
  execFileSync('node', [path.join(here, 'import-mod.mjs'), slug, dir], { stdio: 'inherit' });
}
