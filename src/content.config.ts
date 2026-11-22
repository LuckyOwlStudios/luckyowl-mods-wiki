import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One markdown file per mod: src/content/mods/<slug>.md
const mods = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mods' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    order: z.number().default(100),          // upcoming mods are always listed after released ones          // lower = earlier on the home page
    icon: z.string().optional(),              // path under /public
    banner: z.string().optional(),
    bannerIsTitle: z.boolean().default(false), // banner shows the mod's name: use it in place of the text title
    loaders: z.array(z.string()).default(['NeoForge']),
    minecraft: z.string().default('1.21.1'),
    version: z.string().optional(),
    status: z.enum(['released', 'beta', 'in-development', 'upcoming', 'legacy']).default('released'),
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
    hideRecipe: z.boolean().optional(), // don't show its crafting recipe (e.g. it's meant to be built in the world)
    // A structure built in the world, like an iron golem. rows go top to bottom; each cell is "" (anything),
    // a block id, or { tag, ids } for "any log" style cells. Shown as a "How to build" card.
    structure: z.object({
      rows: z.array(z.array(z.union([z.string(), z.object({ tag: z.string(), ids: z.array(z.string()) })]))),
      note: z.string().optional(),
      intro: z.string().optional(), // a line above the card; **bold** works
      image: z.string().optional(),  // picture or animation of it being built, shown beside the card
    }).optional(),
  }).passthrough(),
});

// Hand-written pages in extra groups (Biomes, Potions, ...): src/content/pages/<mod-slug>/<group>/<id>.md
// The folder name becomes the sidebar group, e.g. biomes -> "Biomes".
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(), // intro line under the title, also used in search results
    icon: z.string().optional(),    // path under /public
    order: z.number().default(100),
  }),
});

export const collections = { mods, items, pages };
