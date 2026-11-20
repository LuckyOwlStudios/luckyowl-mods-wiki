import { getCollection, type CollectionEntry } from 'astro:content';

export type Item = { id: string; name: string; kind: 'item' | 'block'; description: string; icon: string | null; photo?: string };

const itemFiles = import.meta.glob<{ default: { namespace: string; items: Item[] } }>('./data/items/*.json', { eager: true });

export function itemsFor(mod: CollectionEntry<'mods'>): Item[] {
  const file = itemFiles[`./data/items/${mod.id}.json`];
  if (!file) return [];
  return file.default.items.filter((i) => !mod.data.hideItems.includes(i.id));
}

export const isUpcoming = (m: CollectionEntry<'mods'>) => m.data.status === 'upcoming';

/** Every mod: released ones first (by order), then upcoming ones. */
export async function allMods() {
  return (await getCollection('mods')).sort((a, b) =>
    Number(isUpcoming(a)) - Number(isUpcoming(b)) || a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

/** Prefix a site-absolute path with the configured base (needed on GitHub Pages project sites). */
export function url(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path.startsWith('/') ? base + path : path;
}

export function namespaceFor(mod: CollectionEntry<'mods'>): string {
  return itemFiles[`./data/items/${mod.id}.json`]?.default.namespace ?? mod.id;
}

// ---- recipes (from `npm run import-recipes`)
export type Ingredient = { ids: string[]; tag?: string; count?: number } | null;
export type Recipe = {
  station: 'crafting' | 'smelting' | 'blasting' | 'smoking' | 'campfire' | 'stonecutting' | 'smithing' | 'woodcutting';
  shapeless?: boolean; grid?: Ingredient[]; inputs?: Ingredient[]; result: { id: string; count: number };
  time?: number; xp?: number; alsoBlasting?: boolean;
};
const recipeFiles = import.meta.glob<{ default: Recipe[] }>('./data/recipes/*.json', { eager: true });
const vanillaFile = import.meta.glob<{ default: Record<string, { name: string; icon: string | null }> }>('./data/vanilla.json', { eager: true });
const vanilla = Object.values(vanillaFile)[0]?.default ?? {};
const allRecipes: Recipe[] = Object.values(recipeFiles).flatMap((f) => f.default);

// Every item the wiki has a page for, by full id (namespace:id).
const byId = new Map<string, { item: Item; slug: string }>();
for (const [file, mod] of Object.entries(itemFiles)) {
  const slug = file.replace(/^.*\/(.*)\.json$/, '$1');
  for (const item of mod.default.items) byId.set(`${mod.default.namespace}:${item.id}`, { item, slug });
}

export type Thing = { name: string; icon: string | null; href?: string };
/** Name, icon and wiki link for any item id: a mod item, a vanilla item or something else. */
export function lookup(fullId: string): Thing {
  const hit = byId.get(fullId);
  if (hit) return { name: hit.item.name, icon: hit.item.icon, href: `/mods/${hit.slug}/items/${hit.item.id}/` };
  const [ns, p] = fullId.includes(':') ? fullId.split(':') : ['minecraft', fullId];
  if (ns === 'minecraft' && vanilla[p]) return { name: vanilla[p].name, icon: vanilla[p].icon };
  return { name: p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), icon: null };
}
export function tagName(tag: string) {
  const p = tag.split(':').pop()!.split('/').reverse().join(' ');
  return 'Any ' + p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const inputsOf = (r: Recipe) => [...(r.grid ?? []), ...(r.inputs ?? [])].filter((i): i is NonNullable<Ingredient> => !!i);
/** Recipes that make this item. */
export function recipesFor(mod: CollectionEntry<'mods'>, itemId: string) {
  const id = `${namespaceFor(mod)}:${itemId}`;
  return allRecipes.filter((r) => r.result.id === id);
}
/** Items made from this one, one entry per result. */
export function usedIn(mod: CollectionEntry<'mods'>, itemId: string) {
  const id = `${namespaceFor(mod)}:${itemId}`;
  const out = new Map<string, Recipe>();
  for (const r of allRecipes) if (r.result.id !== id && inputsOf(r).some((i) => i.ids.includes(id))) out.set(r.result.id, r);
  return [...out].map(([rid, recipe]) => ({ id: rid, recipe, ...lookup(rid) }));
}
