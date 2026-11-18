---
name: "Personality"
tagline: "Wildlife feels more alive: animals sleep at night and hide from the rain."
order: 2
loaders: [Fabric, NeoForge]
minecraft: "1.21.1"
version: "0.1.0"
status: upcoming
downloads:
  github: https://github.com/LuckyOwlStudios/personality
---

**Personality** makes the animals of Minecraft feel more alive. It runs on both **Fabric** and **NeoForge**. This mod is still being made, so details may change before release.

## Sleep

- **Animals sleep at night.** Each one has its own bedtime and wake-up time, so a herd drifts off one by one.
- **Night owls.** Cats, ocelots and armadillos sleep through the day instead.
- **Standing naps.** Horses, donkeys and mules doze standing up, with their necks hanging low.
- **Really asleep.** Sleeping animals fold their legs, lie down and close their eyes. They don't move, look around or make ambient sounds.
- **Waking up.** They wake when hurt, when you interact with them, when you sprint nearby (sneak or walk to let them be), when leashed, when picked up by water, or when morning comes.
- **Pets.** Tamed pets that follow you stay up until you go to bed or leave them behind. Pets told to sit will doze off.

## Rain

- When it rains, animals head for the nearest cover, like under trees, roofs or overhangs, and stay there until the rain stops.
- Animals can't fall asleep with rain falling on them. One caught out at bedtime wakes up, looks for cover, then dozes off once it's dry. Animals with no cover nearby stay awake.
- Frogs, axolotls and turtles don't mind the rain. Tamed pets stick with their owner, and leashed or ridden animals go where they're taken.

## For pack makers and modders

Sleep and rain behavior are data-driven, so datapacks and other mods can opt their mobs in with entity type tags:

- `personality:sleeps`: mobs that follow a sleep schedule.
- `personality:nocturnal`: sleepers that sleep by day.
- `personality:sleeps_standing`: sleepers that stay on their feet.
- `personality:dislikes_rain`: mobs that look for cover when it rains.

Closed eyes are painted on at runtime from a small file per mob at `assets/<namespace>/personality/eyelids/<entity>.json`, so every texture variant and resource pack gets matching eyelids without extra art:

```json
{
  "texture_width": 64,
  "texture_height": 32,
  "eyes": [[6, 8, 2, 2], [12, 8, 2, 2]]
}
```

Each eye is `[x, y, width, height]` in texture pixels. An optional `"lash_shade"` (default `0.6`) sets how dark the lash line is. Any model whose legs follow vanilla naming (`left_front_leg`, `right_hind_leg`, ...) can lie down.
