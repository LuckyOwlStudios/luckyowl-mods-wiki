import { getCollection, type CollectionEntry } from 'astro:content';

export type Item = { id: string; name: string; kind: 'item' | 'block'; description: string; icon: string | null; photo?: string };

export type Advancement = { id: string; title: string; description: string; frame: 'task' | 'goal' | 'challenge'; icon: string | null; parent?: { id: string; title: string; tab?: string }; hidden: boolean; xp: number; ownTab: boolean };

const itemFiles = import.meta.glob<{ default: { namespace: string; items: Item[]; advancements?: Advancement[] } }>('./data/items/*.json', { eager: true });

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

// ---- advancements (from import-mod) and hand-written page groups
export function advancementsFor(mod: CollectionEntry<'mods'>): Advancement[] {
  return itemFiles[`./data/items/${mod.id}.json`]?.default.advancements ?? [];
}

export type Entry = { id: string; name: string; href: string; icon: string | null };
export type Group = { label: string; anchor: string; entries: Entry[] };
const titleCase = (s: string) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Every sidebar group of a mod: Items, Blocks, hand-written groups (Biomes, ...), Advancements. */
export async function groupsFor(mod: CollectionEntry<'mods'>): Promise<Group[]> {
  const items = itemsFor(mod);
  const asEntry = (i: Item): Entry => ({ id: i.id, name: i.name, href: `/mods/${mod.id}/items/${i.id}/`, icon: i.icon });
  const groups: Group[] = [
    { label: 'Items', anchor: 'items', entries: items.filter((i) => i.kind === 'item').map(asEntry) },
    { label: 'Blocks', anchor: 'blocks', entries: items.filter((i) => i.kind === 'block').map(asEntry) },
  ];
  const pages = (await getCollection('pages')).filter((p) => p.id.startsWith(mod.id + '/') && p.id.split('/').length === 3);
  const byGroup = new Map<string, typeof pages>();
  for (const p of pages) {
    const g = p.id.split('/')[1];
    byGroup.set(g, [...(byGroup.get(g) ?? []), p]);
  }
  for (const [g, list] of [...byGroup].sort(([a], [b]) => a.localeCompare(b))) {
    list.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
    groups.push({ label: titleCase(g), anchor: g, entries: list.map((p) => ({ id: p.id.split('/')[2], name: p.data.title, href: `/mods/${p.id}/`, icon: p.data.icon ?? null })) });
  }
  groups.push({ label: 'Advancements', anchor: 'advancements', entries: advancementsFor(mod).map((a) => ({ id: a.id, name: a.title, href: `/mods/${mod.id}/advancements/${a.id}/`, icon: a.icon ? lookup(a.icon).icon : null })) });
  return groups.filter((g) => g.entries.length);
}

/** A mod's stand-alone pages, like Config: src/content/pages/<mod-slug>/<id>.md -> /mods/<mod>/<id>/ */
export async function singlePagesFor(mod: CollectionEntry<'mods'>) {
  return (await getCollection('pages'))
    .filter((p) => p.id.startsWith(mod.id + '/') && p.id.split('/').length === 2)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
    .map((p) => ({ title: p.data.title, href: `/mods/${p.id}/` }));
}
