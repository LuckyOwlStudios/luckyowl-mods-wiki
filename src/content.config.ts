import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One markdown file per mod: src/content/mods/<slug>.md
const mods = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mods' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    order: z.number().default(100),          // lower = earlier on the home page
    icon: z.string().optional(),              // path under /public
    banner: z.string().optional(),
    bannerIsTitle: z.boolean().default(false), // banner shows the mod's name: use it in place of the text title
    loaders: z.array(z.string()).default(['NeoForge']),
    minecraft: z.string().default('1.21.1'),
    version: z.string().optional(),
    status: z.enum(['released', 'beta', 'in-development', 'legacy']).default('released'),
    requires: z.array(z.object({ name: z.string(), url: z.string().optional() })).default([]),
    downloads: z.object({
      curseforge: z.string().optional(),
      modrinth: z.string().optional(),
      github: z.string().optional(),
    }).default({}),
    hideItems: z.array(z.string()).default([]), // item ids the importer found that shouldn't be listed
  }),
});

// Optional hand-written notes for single items: src/content/items/<mod-slug>/<item-id>.md
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    obtain: z.string().optional(),  // short "how to get it" line
    summary: z.string().optional(), // optional intro line shown under the title
  }).passthrough(),
});

export const collections = { mods, items };
