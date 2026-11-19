---
name: "Locksmith"
tagline: "Lock your chests, barrels and doors with keys, and break into golden and trial locked chests found in the world."
order: 4
icon: /mods/locksmith/media/icon.png
banner: /mods/locksmith/media/title.webp
loaders: [Fabric, NeoForge]
minecraft: "1.21.1"
version: "1.1.0"
requires:
  - name: "Fabric API (Fabric only)"
    url: https://modrinth.com/mod/fabric-api
downloads:
  modrinth: https://modrinth.com/mod/luckys-locksmith
  github: https://github.com/LuckyOwlStudios/luckys-locksmith
---

**Locksmith** lets you lock chests, barrels, doors and trapdoors so only the right key opens them. It also adds golden and trial locked treasure, the Dungeon Slime, and sturdier iron and golden chests that you can dye any color. It runs on both **NeoForge** and **Fabric**, and it's needed on both the server and the client.

## Locking chests

- Right-click an unlocked chest or barrel with a [Key](items/key/) to lock it. Every key has its own random **5-digit code**, and only a key with the same code opens what it locked.
- Hold <kbd>Shift</kbd> while hovering over a key to see its code.
- A matching key works from your hand or from anywhere in your inventory.
- **Copy a key** in an anvil: key on the left, Iron Ingot on the right. You keep the original and get a copy to share.
- Other players can't break your locked container. You can, and so can anyone carrying the right key.
- With [Curios](https://www.curseforge.com/minecraft/mc-mods/curios) installed on NeoForge, you can wear a key in its own slot and it opens matching locks without being held.

## Doors and trapdoors

Locks work on **doors and trapdoors** too, including iron, copper and modded ones. Right-click one with a key, Golden Lock or Trial Lock, just like a chest.

- A padlock shows on both sides of a locked door and swings with it. Trapdoors don't show a padlock yet.
- A locked door ignores redstone, villagers, zombies, pistons and wind charges until someone with the right key opens it.
- Locked doors can't be blown up or broken by other players, and neither can the block holding them up.

Door locks are based on a contribution by [KevoMartinez256](https://github.com/KevoMartinez256).

## Unlocking chests

![A golden locked chest in a dungeon](/mods/locksmith/media/golden_locked_chest_dungeon.webp)

Some locks don't take a key code. They open for one special key, and the key is used up when the lock comes off.

- **Golden Locks** open with a [Golden Key](items/golden_key/). About **1 in 4 Nether Fortress chests** is golden locked, so bring a key with you.
- **Trial Locks** open with a vanilla **Trial Key**, the same key that opens vaults in Trial Chambers.
- Containers with a golden or trial lock are **explosion proof**, so you can't blow your way in.
- Map makers can put a [Golden Lock](items/golden_lock/) or [Trial Lock](items/trial_lock/) on any container to guard loot in their own dungeons.

<div class="media-row">
  <img src="/mods/locksmith/media/trial.webp" alt="A trial locked chest" />
</div>

## Dungeon Slime

A gray, see-through slime with a Golden Key floating inside it, and the main source of Golden Keys.

- It spawns in the Overworld **below Y 0** in full darkness, and in **strongholds** at any height. Never on Peaceful, in Mushroom Fields or in the Deep Dark.
- It always spawns at medium size and drops **exactly one Golden Key**. The small slimes it splits into drop slimeballs instead.

More on the [Dungeon Slime Spawn Egg](items/dungeon_slime_spawn_egg/) page.

## Dyeing chests

![Iron chests dyed red, blue and purple](/mods/locksmith/media/dye_chest.webp)

[Iron Chests](items/iron_chest/) and [Golden Chests](items/golden_chest/), and their trapped versions, can be dyed. Use any dye on the chest to change its color, and use a different dye to change it again. Great for color-coding your storage room.

## Getting the items

| Item | How to get it |
| --- | --- |
| **Key** | Crafted: 1 Iron Ingot on top of 2 Iron Nuggets, in a vertical column |
| **Key copy** | Anvil: Key + Iron Ingot |
| **Golden Key** | Dropped by Dungeon Slimes, and found in 15% of Nether Fortress chests |
| **Trial Key** | Vanilla: earned from Trial Spawners in Trial Chambers |
| **Iron Chest** | Crafted: a Chest surrounded by 4 Iron Ingots (top, bottom, left and right) |
| **Golden Chest** | Crafted: a Chest surrounded by 4 Gold Ingots (top, bottom, left and right) |
| **Trapped versions** | Crafted: the Iron or Golden Chest + a Tripwire Hook |
| **Golden Lock / Trial Lock** | Creative menu only, for map makers and server admins |

Everything is in the **Locksmithing** creative tab.

## Config

On NeoForge, `fortressChestLockChance` (from `0.0` to `1.0`) sets how often Nether Fortress chests are golden locked. `0` turns it off. On Fabric it's fixed at 25%.
