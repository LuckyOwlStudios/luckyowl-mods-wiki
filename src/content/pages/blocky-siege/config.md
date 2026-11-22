---
title: "Config"
summary: "Blocky Siege's settings for cannon damage, siege crews and cannon volume."
---

Settings live in two files, one for the game and one for your client. On **NeoForge** they're `config/blockysiege-common.toml` and `config/blockysiege-client.toml`. On **Fabric** they're `config/blockysiege-common.properties` and `config/blockysiege-client.properties`.

## Common

| Option | Default | What it does |
|---|---|---|
| `cannonDamage` | `25.0` | How much damage cannons deal. |
| `crewsBringAmmo` | `true` | Whether Pillagers and Piglins reload empty weapons with their own ammo. When `false`, they only use weapons that are already loaded. |
| `crewSearchRadius` | `16` | How far, in blocks, a crew mob with a target looks for a weapon to man (4 to 48). |

On NeoForge, `cannonDamage` is under `worldGeneration` and the crew options are under `siegeCrews`.

To turn siege crews off completely, use the gamerule `/gamerule doSiegeWeaponCrews false`.

## Client

| Option | Default | What it does |
|---|---|---|
| `cannonVolume` | `1.0` | Volume of cannon sounds, from `0.0` (silent) to `1.0`. |
