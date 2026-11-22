---
name: "Blocky Siege"
tagline: "Siege weapons for Minecraft: cannons, burst cannons, spewers, volley racks, crossbow golems and bombs."
order: 3
icon: /mods/blocky-siege/media/icon.png
loaders: [NeoForge, Fabric]
minecraft: "1.21.1"
version: "3.0.0"
hideItems: [shoot, bullet, explosive_keg, crossbow_golem_spawn_egg]
downloads:
  modrinth: https://modrinth.com/mod/luckys-blocky-siege
  github: https://github.com/LuckyOwlStudios/Luckys-Blocky-Siege
---

**Blocky Siege** adds placeable siege weapons to Minecraft. Load them, aim them and bring down your enemies' walls (or your friends'). It runs on both **NeoForge** and **Fabric**.

## Weapons

<div class="media-row">
  <figure><img src="/mods/blocky-siege/media/cannon.webp" alt="The Cannon spinning" loading="lazy" /><figcaption>Cannon</figcaption></figure>
  <figure><img src="/mods/blocky-siege/media/burst-cannon.webp" alt="The Burst-Cannon spinning" loading="lazy" /><figcaption>Burst-Cannon</figcaption></figure>
  <figure><img src="/mods/blocky-siege/media/spewer.webp" alt="The Spewer spinning" loading="lazy" /><figcaption>Spewer</figcaption></figure>
</div>

- **[Cannon](items/cannon/):** shoots **any block**. Load gunpowder as the fuse and set the power from 1 to 4. Each point of power uses one gunpowder. Cannonballs and bombs have their own effects, TNT explodes on impact, melons and dried kelp blocks burst into their drops, and any other block lands and places itself where it hits.
- **[Burst-Cannon](items/multi_cannon/):** shoots **any item**, in bursts of 1 to 4 rounds. Arrows, fire charges, snowballs and other throwables fly as themselves, firework stars burst, and anything else flies out and drops where it lands. Each round uses one gunpowder.
- **[Spewer](items/spewer_cannon/):** shoots **any liquid** from a one-bucket tank. Fill it with buckets, potions or any modded fluid container. Water puts out fires and wets farmland, lava sprays burning embers, and potions splash their effect where they land. Hold fire to keep spraying.
- **[Volley Rack](items/volley_rack/):** holds 8 stacks of arrows, fireworks or other projectiles and launches them in a rapid volley while it's powered. Each shot uses one gunpowder.
- **[Crossbow Golem](items/crossbow_golem_block/):** an automatic turret. Give it a crossbow and up to 9 stacks of arrows or fireworks, and it shoots at monsters, and at players who aren't on your team, up to 48 blocks away. See [Crossbow Golem](#crossbow-golem) below.

## Using a weapon

1. **Right-click** the weapon to open it and load it.
2. **Fire it** with flint and steel, or with a redstone signal.
3. Or press **Click to Aim** in its screen to sit at the weapon and man it. Turn to aim, and press the **Fire Cannon** key (right mouse button by default) to shoot. A small display shows your fuse, ammo and the weapon's health. Holding the key keeps the Spewer and Volley Rack firing.

Weapons wear out. A full-power cannon shot has a small chance to damage the cannon, and strong projectiles hitting a weapon damage it too. A badly damaged weapon blows apart, so repair it before that happens: right-click it with an **iron ingot**, or **planks** for the Volley Rack.

## Crossbow Golem

Craft it, or build it like an iron golem: an **iron block** on the ground, a **dispenser** on top, a **log** on each side of the dispenser, and a **carved pumpkin** on top. The golem joins your scoreboard team, so it leaves your teammates alone. Without a team, it shoots at every player. It has 50 health, loads its crossbow like a player would (so Quick Charge works), and fires a random stack from its ammo. Right-click it with an **iron ingot** to repair it, and nearby Fletchers restock it with a few arrows each morning.

## Ammunition

- **[Cannonball](items/cannonball/):** punches through blocks, then skims, bounces and rolls to a stop. Hit a landed cannonball a few times to knock it loose and pick it up.
- **[Fire Bomb](items/fire_bomb/):** bursts into flames and spreads burning embers around where it lands.
- **[Frost Bomb](items/frost_bomb/):** bursts into a spray of frost that leaves frost piles behind.
- **[Wind Bomb](items/wind_bomb/):** a supersized wind charge that blasts everything away.
- **[Explosive Barrel](items/explosive_barrel/):** light it like TNT, or fire it from a cannon. It blows up into a spray of wooden shrapnel, thrown forward if it's moving or all around if it isn't.

## Siege crews

**Pillagers**, **Vindicators** and **Piglins** man siege weapons they find nearby. They walk to a Cannon, Burst-Cannon or Spewer, sit down, aim with a proper arc, lead moving targets and fire. They jump off to fight when you get close. When a weapon runs dry, they reload it with their own ammo: Pillagers bring cannonballs, arrows and water, and Piglins bring fire bombs, fire charges and lava. Crew shots are tamer than yours: cannonballs only break weak blocks, and arrows can't be picked up.

Turn crews off with the gamerule `/gamerule doSiegeWeaponCrews false`, or change them in the [Config](config/).

## Villagers and banners

The **Siege Engineer** is a new villager who works at a Cannon. They sell gunpowder, Explosive Barrels, Cannonballs, and later Cannons, Burst-Cannons, Volley Racks and Spewers. The mod also adds the **Fort** and **Boom** banner patterns.

## Compatibility

With **Farmer's Delight**, its crop crates and rice bags burst into their crops when fired from a cannon. Datapacks can give any block its own cannon behavior in `data/<namespace>/blockysiege/block_projectile_behaviors/`.
