---
title: "Config"
summary: "Locksmith's setting for how often Nether Fortress chests are golden locked."
---

On **NeoForge**, settings live in `config/locksmith-common.toml`.

| Option | Default | What it does |
|---|---|---|
| `fortressChestLockChance` | `0.25` | Chance (`0.0` to `1.0`) that an unopened Nether Fortress chest gets a [Golden Lock](../items/golden_lock/). Each chest is rolled once, the first time its chunk loads. `0` turns it off. |

On **Fabric** there's no config file yet, and the chance is fixed at 25%.
