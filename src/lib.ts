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
