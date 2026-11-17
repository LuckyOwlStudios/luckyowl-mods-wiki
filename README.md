# LuckyOwl's Mods Wiki

A fast, static wiki for LuckyOwl's Minecraft mods, built with [Astro](https://astro.build) and searchable with [Pagefind](https://pagefind.app). It deploys to GitHub Pages on every push to `main`, and it has ad slots ready for Google AdSense.

## Run it locally

### In IntelliJ IDEA

Shared run configurations live in `.run/` and appear in the run dropdown at the top of the window:

- **Wiki - Install dependencies**: run this once after cloning (and after pulling changes to `package.json`).
- **Wiki - Run dev server**: starts the site at http://localhost:4321 and opens your browser. Edits to content and styles show up instantly. Search doesn't work in this mode.
- **Wiki - Preview built site (with search)**: builds the real site and serves it, including search.

These need [Node.js 22 or newer](https://nodejs.org) and IntelliJ IDEA Ultimate (or WebStorm). If IntelliJ asks for a Node interpreter, pick the installed Node under Settings → Languages & Frameworks → Node.js. On IntelliJ Community, run the commands below in IntelliJ's Terminal tab instead.

### From a terminal

```bash
npm install
npm run dev        # http://localhost:4321, live reload, shows ad slot placeholders
npm run build      # builds to dist/ and creates the search index
npm run preview    # serve the built site (search works here)
```

## Editing content

| What | Where |
|---|---|
| A mod's overview page (text, images, download links, version) | `src/content/mods/<slug>.md` |
| Notes for a single item or block (optional) | `src/content/items/<mod-slug>/<item-id>.md` (see the Spelunker's Charm helmets for examples) |
| Images, videos | `public/mods/<slug>/media/`, linked as `/mods/<slug>/media/file.webp` |
| Site name, social links, ads | `src/site.config.ts` |
| Colors and layout | `src/styles/global.css` |

Adding a new mod: create `src/content/mods/<slug>.md` (copy an existing one), add the repo to `scripts/mods.json`, then run `npm run import-all -- <slug>`.

## Item and block lists are imported from the mod repos

Every item and block page is generated from the mod's `en_us.json` and textures, so the wiki stays in sync with the code:

```bash
npm run import-all                 # re-import every mod in scripts/mods.json from GitHub
npm run import-all -- wardrobe     # just one
npm run import-mod -- wardrobe ../luckys-wardrobe   # from a local checkout (works for private repos)
```

This rewrites `src/data/items/<slug>.json` and `public/mods/<slug>/items/`. Your hand-written notes in `src/content/items/` are never touched. To hide something the importer picks up, add its id to `hideItems` in the mod's front matter.

## Ads

Ad slots are already placed on every page (under the header, in the right column, mid-page and above the footer). They render nothing until you switch them on:

1. Get the site approved by [Google AdSense](https://adsense.google.com) (it needs to be live on its own domain with real content).
2. In `src/site.config.ts`, set `ads.enabled = true`, your `client` id (`ca-pub-…`) and each slot id.
3. Put your publisher line in `public/ads.txt`.

The privacy page updates itself to mention AdSense cookies once ads are enabled.

## Deploying

The workflow in `.github/workflows/deploy.yml` builds and publishes to GitHub Pages. In the repo, go to **Settings → Pages → Source** and pick **GitHub Actions**. For a custom domain, add it under Settings → Pages; the build picks up the new address automatically.
