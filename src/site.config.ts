// Everything you are likely to want to change about the site lives here.

export const site = {
  name: "LuckyOwl's Mods Wiki",
  shortName: 'LuckyOwl Wiki',
  description: "The official wiki for LuckyOwl's Minecraft mods: every item, block, feature and config option.",
  author: 'LuckyOwl (Lucky Owl Studios)',
  // Links shown in the Community menu. Uncomment and fill in to add more.
  links: <Record<string, string | undefined>>{
    github: 'https://github.com/LuckyOwlStudios',
    modpack: 'https://www.curseforge.com/minecraft/modpacks/official-luckyowl-modpack',
    // curseforge: 'https://www.curseforge.com/members/<you>/projects',
    // discord: 'https://discord.gg/xxxx',
    // kofi: 'https://ko-fi.com/xxxx',
  },
};

// ---- Ads ------------------------------------------------------------------
// While `enabled` is false, ad slots render nothing on the live site (and a
// dashed placeholder in `npm run dev`, so you can see where they go).
// To turn on Google AdSense once your account is approved:
//   1. set enabled: true and client: 'ca-pub-XXXXXXXXXXXXXXXX'
//   2. paste each ad unit's slot id below
//   3. put your publisher line in public/ads.txt
export const ads = {
  enabled: false,
  client: '',
  slots: {
    header: '',   // leaderboard under the top bar, every page
    sidebar: '',  // tall unit in the right column on wide screens
    inContent: '',// between sections of a mod page
    footer: '',   // above the footer, every page
  },
};

// ---- Home page ---------------------------------------------------------------
export const home = {
  hero: {
    eyebrow: 'Minecraft mods by LuckyOwl',
    title: 'Worlds worth',
    titleItalic: 'exploring',
    tagline: 'Deeper caves, handmade outfits, siege engines and cozy builds, all made to feel like they were always part of the game.',
    // Background. Drop a landscape video in public/home/ and set `video` to
    // e.g. '/home/hero.mp4'; the image is then used as the poster/fallback.
    image: '/home/hero.webp',
    video: '',
  },
  intro: {
    title: 'The official wiki',
    text: 'Every item, block, feature and config option from LuckyOwl\'s mods, documented in one place and kept in sync with the mods themselves. Find out how things work, where to find them, and what to build next.',
  },
  // The spotlight under the intro. Point `mod` at a mod slug (its file name in
  // src/content/mods), or leave `mod` empty and fill in title/text/link for news.
  featured: {
    label: 'Most downloaded',
    mod: 'wardrobe',
    title: '',      // defaults to the mod's name
    text: 'Over 500,000 downloads and counting. Dress for every biome with snowy coats, desert robes, animal hats, work aprons and more, all drawn in Minecraft\'s own style.',
    image: '/home/featured-wardrobe.webp',
    link: '',       // defaults to the mod's wiki page
    linkLabel: 'Explore the wardrobe',
  },
};
