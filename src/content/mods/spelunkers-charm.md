---
name: "Spelunker's Charm"
tagline: "Caves deserve more. Makes going underground feel alive, dangerous and worth the trip."
order: 1
icon: /mods/spelunkers-charm/logo.png
banner: /mods/spelunkers-charm/media/logo.png
loaders: [NeoForge]
minecraft: "1.21.1"
version: "5.1.1"
requires:
  - name: TerraBlender
    url: https://modrinth.com/mod/terrablender
downloads:
  curseforge: https://www.curseforge.com/minecraft/mc-mods/spelunkers-charm-ii
  github: https://github.com/LuckyOwlStudios/luckys-spelunkers-charm
---

Caves & Cliffs gave Minecraft huge caves, but most of them still feel the same once you're down there. **Spelunker's Charm** fills the underground with things to find, things to fear and things to use: cracked-open boulders full of ore, geysers that erupt under your feet, tremors that shake rocks loose from the ceiling, a spider-infested cave biome, and helmets to light the way.

Everything sits alongside vanilla and other mods. Features place themselves across every Overworld biome (modded ones included), and most of them can be switched off in the [config](#configuration).

## Boulders

![A cracked boulder full of raw gold in a deepslate cave](/mods/spelunkers-charm/media/boulders.webp)

Huge 3×3×3 boulders sit on cave floors. Crack one open and you might find a jackpot of **raw iron**, **raw copper** or **raw gold** at its core, or nothing but stone.

- **Lush boulders**, wrapped in moss, show up in lush and jungle caves.
- Boulders obey gravity. Mine out what's under one and it **falls**, crushing anything it lands on (the longer the drop, the harder it hits).
- Hang a boulder from a **chain** to suspend it in mid-air, then cut it loose when something walks underneath.
- Placeable by players too, for traps and builds.
- Advancement: *It's not a Boulder, it's a Rock!* Ride a boulder as it falls.

**Modded ore boulders.** With a mod that adds **zinc** (Create), **osmium** (Mekanism), **tin** or **lead**, matching ore boulders generate automatically through the common `c:storage_blocks/raw_<ore>` and `c:raw_materials/<ore>` tags. Without such a mod they never generate and stay out of the creative tab.

## Geysers

Geysers form in the deepslate layer over pockets of lava, and you can place deepslate or basalt geysers over water too. What a geyser shoots depends on the fluid below it.

- They build up pressure, then **erupt** in a column of fire or steam that launches anything standing on them. Lava geysers burn, too.
- Set one off yourself with **flint and steel** or a **fire charge**, or wait for a tremor to do it.
- Keep them as harmless decoration with the `activeGeysers` config option.

## Tremors

The deeper you go, the less stable the ground gets.

- Every so often, a player underground may feel a **tremor**. A low rumble warns you a few seconds before it hits, then it builds to full strength and fades out.
- Tremors are **more likely, longer and stronger the deeper you are**.
- While the ground shakes, **rocks fall** from stone ceilings (deepslate, dripstone, basalt and ice drop their own kinds), sand and gravel collapse, pointed dripstone snaps off, and **geysers erupt**.
- **Underground explosions** (below Y 32 by default) set off tremors sized to the blast. TNT mining has consequences.
- With **Camera Overhaul** installed, your camera shakes while a tremor is nearby.
- Lush caves, the deep dark and the spider cave are spared.
- Operators can trigger them with `/tremor start <seconds> <intensity>` and end them with `/tremor stop`.

## Spider Cave

![The Spider Cave biome](/mods/spelunkers-charm/media/spider-cave.webp)

A new underground biome (via TerraBlender) that's dark, quiet and crawling.

- Walls and ceilings are coated in **web veins**, **packed webs** and **hanging webs**.
- **Spider eggs** cling to the stone. They slowly crack when a player is nearby and hatch into **baby cave spiders**. Step on them carelessly and they break; sneak to walk past safely.
- Its own eerie ambient sounds.

## Cave decorations

- **Rock piles** of stone, deepslate, dripstone and basalt (in the Nether) scatter cave floors. Pick them up, stack up to three, or **throw** them at mobs.
- **Clay piles** you can build up by hand (sneak and use a clay ball).
- **Cave mushrooms**, with giant cave mushroom variants.
- **Cold caves** under snowy biomes get large **icicles**, icicle clusters, ice sheets on the floor and piles of **ice balls**.
- **Jungle caves** get extra moss and lush ceiling vegetation.

## Equipment

![New equipment](/mods/spelunkers-charm/media/equipment.png)

- **Candle Helmet.** A craftable helmet with a candle on top. The flame follows your head and goes out in water or rain, then relights when you're dry again.
- **Mining Helmet.** A sturdier helmet with a bright lamp that works underwater. It adds explosion knockback resistance. You can't craft it: buy it from the **Wandering Trader** as a rare trade.

Both helmets light up the area around you when paired with a dynamic lights mod such as **LambDynamicLights**.

## Blaster

A redstone-powered block built around a geyser. Load it with a **lava**, **water** or **powder snow bucket**, face it any direction, and power it: it fires a 5-block jet that pushes mobs and players, burning them with lava or freezing them with snow. Great for launchers, traps and mob funnels.

## Potion of Haste

Brew an **Awkward Potion** with a **Cave Mushroom** to get a Potion of Haste. Add redstone to make it last longer or glowstone to make it stronger. Splash and lingering versions work as usual.

## Biome stone (experimental)

![Cave biome stones](/mods/spelunkers-charm/media/cave-biomes.webp)

Off by default. With `stoneReplacers` turned on, the stone underground changes to match the biome above it:

- **Dunestone** under deserts, savannas and badlands
- **Permafrost** (and **Silt**) under snowy and frozen biomes
- **Wildstone** under jungles

Each stone comes with cobbled, brick and chiseled variants, stairs, slabs and walls, plus its own versions of every vanilla ore. There's also a set of **Polished Amethyst** and **Amethyst Brick** blocks. This changes world generation in big ways, so it needs a game restart and is best turned on in a new world.

![New ore variants](/mods/spelunkers-charm/media/newOres.png)

## In development

- **Lifts and lift tracks** (marked *[BETA]* in game), planned once 1.21.6+ entity collision is available.
- Sneak-using a hopper, chest, furnace or TNT on a minecart turns it into that minecart, and TNT minecarts can be lit by hand.

## Requirements

| | Version |
|---|---|
| Minecraft | 1.21.1 |
| NeoForge | 21.1.0 or newer |
| [TerraBlender](https://modrinth.com/mod/terrablender) | 4.1.0.8 (required) |

Needed on both client and server. **Recommended:** a dynamic lights mod such as [LambDynamicLights](https://modrinth.com/mod/lambdynamiclights).

**Optional:** [Create](https://modrinth.com/mod/create) adds zinc boulders, [Supplementaries](https://modrinth.com/mod/supplementaries) lets ropes suspend boulders, and [Camera Overhaul](https://modrinth.com/mod/cameraoverhaul) adds camera shake during tremors.

## Configuration

Settings live in `config/spelunkers_charm-common.toml`, and client-only settings in `config/spelunkers_charm-client.toml`.

### World generation

| Option | Default | What it does |
|---|---|---|
| `stoneReplacers` | `false` | Biome stone and ores (Dunestone, Permafrost, Wildstone). Needs a restart. |
| `tremors` | `true` | Whether tremors can happen at all. |
| `rocks` | `true` | Rock piles around the world. |
| `geysers` | `true` | Whether geysers generate. |
| `activeGeysers` | `true` | Whether geysers can erupt. Off keeps them as decoration. |
| `boulders` | `true` | Whether boulders generate in caves. |
| `moddedBoulders.zinc` / `osmium` / `tin` / `lead` | `true` | Per-ore switch for modded ore boulders. |

### Tremors

| Option | Default | What it does |
|---|---|---|
| `checkIntervalSeconds` | `600` | How often each player is checked for a natural tremor. |
| `shallowChance` | `0.01` | Chance per check at Y 64 or above. |
| `deepChance` | `0.15` | Chance per check at the bottom of the world. Scales with depth in between. |
| `shallowLengthSeconds` | `20` | Tremor length at Y 64 or above. |
| `deepLengthSeconds` | `40` | Tremor length at the bottom of the world. |
| `maxLengthSeconds` | `60` | Hard cap on any tremor's length, including stacked ones. |
| `maxMagnitude` | `5` | Strongest a tremor can get (reached at the bottom of the world). |
| `warningSeconds` | `5` | Time between the warning rumble and the shaking. |
| `rampSeconds` | `6` | Time to build up to full strength and to fade out. |
| `effectRadius` | `32` | Horizontal radius of the shaking. Vertical range is half this. |
| `rockChance` | `0.15` | Chance a shaken stone ceiling drops a rock. |
| `maxRocksPerTick` | `1` | Most rocks one tremor drops per tick. |
| `maxRocksNearby` | `20` | Rocks stop falling while this many are already falling nearby. |
| `rockPlayerRange` | `32` | Rocks only fall within this many blocks of a player. |
| `explosionTremors` | `true` | Whether underground explosions cause tremors. |
| `explosionMaxY` | `32` | Explosions must be below this Y to cause one. |
| `explosionSecondsPerRadius` | `3.0` | Seconds of tremor per block of blast radius (TNT is 4). |

### Client

| Option | Default | What it does |
|---|---|---|
| `tremorCameraShake` | `true` | Shake the camera during nearby tremors. Needs Camera Overhaul. |
| `tremorCameraShakeStrength` | `1.0` | How strong that shake is, from `0.0` (off) to `3.0`. |

## Compatibility

- **Modded biomes:** rocks, boulders and geysers are added to every Overworld biome. Cold and hot cave features follow the `spelunkers_charm:is_cold_cave` and `spelunkers_charm:is_hot_cave` biome tags, which a datapack can extend.
- **Tremor-free biomes:** add a biome to `spelunkers_charm:no_tremors` to keep tremors out of it.
- **Hanging boulders:** a boulder under a vertical chain hangs from it. With Supplementaries, a rope works too. Other rope blocks can be added to the `spelunkers_charm:boulder_ropes` block tag.
- **Dynamic lights:** both helmets ship with LambDynamicLights data.
