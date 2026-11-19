---
obtain: "Creative menu only (Locksmithing tab)."
summary: "Puts a Golden Lock on a container, door or trapdoor, so only a Golden Key can open it."
---

![A chest with a Golden Lock](/mods/locksmith/media/golden_locked_chest.png)

Right-click an unlocked chest, barrel, door or trapdoor with a Golden Lock to lock it. Only a [Golden Key](../golden_key/) opens it, and the key is used up when it does. The lock is not used up, so you can lock as many containers as you like with one.

It's meant for **map makers and server admins** guarding loot in dungeons and adventure maps:

- A golden locked container **can't be blown up**, and players without a Golden Key can't break it.
- A golden locked door ignores redstone, mobs, pistons and wind charges until it's unlocked, and the block under it can't be broken either.

The same lock also appears naturally: about **1 in 4 Nether Fortress chests** spawns with a Golden Lock. On NeoForge you can change that chance with the `fortressChestLockChance` config option (`0.0` to `1.0`, and `0` turns it off). On Fabric it's fixed at 25%.
