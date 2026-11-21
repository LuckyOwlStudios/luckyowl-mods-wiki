---
title: "Config"
summary: "Every Spelunker's Charm setting: what can generate, how tremors behave, and camera shake."
---

Settings live in `config/spelunkers_charm-common.toml`, and client-only settings in `config/spelunkers_charm-client.toml`.

## World generation

| Option | Default | What it does |
|---|---|---|
| `stoneReplacers` | `false` | Biome stone and ores (Dunestone, Permafrost, Wildstone). Needs a restart. |
| `tremors` | `true` | Whether tremors can happen at all. |
| `rocks` | `true` | Rock piles around the world. |
| `geysers` | `true` | Whether geysers generate. |
| `activeGeysers` | `true` | Whether geysers can erupt. Off keeps them as decoration. |
| `boulders` | `true` | Whether boulders generate in caves. |
| `moddedBoulders.zinc` / `osmium` / `tin` / `lead` | `true` | Per-ore switch for modded ore boulders. |

## Tremors

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

## Client

| Option | Default | What it does |
|---|---|---|
| `tremorCameraShake` | `true` | Shake the camera during nearby tremors. Needs Camera Overhaul. |
| `tremorCameraShakeStrength` | `1.0` | How strong that shake is, from `0.0` (off) to `3.0`. |
