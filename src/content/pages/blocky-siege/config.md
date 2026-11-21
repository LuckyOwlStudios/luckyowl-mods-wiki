---
title: "Config"
summary: "Blocky Siege's settings for cannon damage and cannon volume."
---

On **NeoForge**, settings live in two files. On **Fabric** there's no config file yet, so the defaults below are used.

## Common

In `config/blockysiege-common.toml`, under `worldGeneration`:

| Option | Default | What it does |
|---|---|---|
| `cannonDamage` | `25.0` | How much damage cannons deal. |

## Client

In `config/blockysiege-client.toml`, under `client`:

| Option | Default | What it does |
|---|---|---|
| `cannonVolume` | `1.0` | Volume of cannon sounds, from `0.0` (silent) to `1.0`. |
