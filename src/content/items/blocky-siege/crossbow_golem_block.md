---
summary: "An automatic turret that fires a crossbow at hostile mobs. Give it a crossbow and ammo, and it guards your base on its own."
hideRecipe: true
structure:
  rows:
    - ["", "minecraft:carved_pumpkin", ""]
    - [{ tag: "minecraft:logs", ids: [minecraft:oak_log, minecraft:spruce_log, minecraft:birch_log, minecraft:jungle_log, minecraft:acacia_log, minecraft:dark_oak_log, minecraft:mangrove_log, minecraft:cherry_log] }, "minecraft:dispenser", { tag: "minecraft:logs", ids: [minecraft:oak_log, minecraft:spruce_log, minecraft:birch_log, minecraft:jungle_log, minecraft:acacia_log, minecraft:dark_oak_log, minecraft:mangrove_log, minecraft:cherry_log] }]
    - ["", "minecraft:iron_block", ""]
  note: "Place the carved pumpkin last"
  intro: "Build it like an iron golem. Place an **iron block** on the ground, a **dispenser** on top of it, and a **log** of any kind on each side of the dispenser. Then put a **carved pumpkin** on top, and the blocks turn into a Crossbow Golem. Whatever was in the dispenser drops out, and the golem joins the team of the player who placed the pumpkin."
---

<figure class="item-photo"><img src="/mods/blocky-siege/media/crossbow-golem.webp" alt="The Crossbow Golem spinning" /></figure>

## How it works

Right-click the golem to open it. Put a **crossbow** in its crossbow slot and up to **9 stacks** of arrows, tipped arrows, spectral arrows or fireworks in its ammo slots. It loads the crossbow like a player would, so **Quick Charge** works, and it fires a random stack each shot.

- It shoots **hostile mobs** up to **48 blocks** away.
- **Teams:** it joins your scoreboard team and leaves your teammates alone, but shoots players on other teams. Without a team, it shoots every player.
- **Repair:** right-click it with an **iron ingot** to heal it, like an iron golem.
- A **Mending** crossbow doesn't lose durability when the golem fires.
- **Fletchers** nearby restock it with a few arrows each morning.
