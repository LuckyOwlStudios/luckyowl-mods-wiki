// Everything you are likely to want to change about the site lives here.

export const site = {
  name: "LuckyOwl's Mods Wiki",
  shortName: 'LuckyOwl Wiki',
  description: "The official wiki for LuckyOwl's Minecraft mods: every item, block, feature and config option.",
  author: 'LuckyOwl (Lucky Owl Studios)',
  links: {
    github: 'https://github.com/LuckyOwlStudios',
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
