---
name: "Blocky Siege"
tagline: "Siege weapons for Minecraft: cannons, burst cannons, spewers, volley racks, crossbow golems and bombs."
order: 3
icon: /mods/blocky-siege/media/icon.png
loaders: [NeoForge, Fabric]
minecraft: "1.21.1"
version: "4.0.0"
hideItems: [shoot, bullet, explosive_keg, crossbow_golem_spawn_egg]
downloads:
  modrinth: https://modrinth.com/mod/luckys-blocky-siege
  github: https://github.com/LuckyOwlStudios/Luckys-Blocky-Siege
---

**Blocky Siege** adds placeable siege weapons to Minecraft. Load them, aim them and bring down your enemies' walls (or your friends'). It runs on both **NeoForge** and **Fabric**.

## Weapons

<div class="feature-row">
<div class="feature-text">

### [Cannon](items/cannon/)

Shoots **any block**. Load gunpowder as the fuse and set the power from 1 to 4. Each point of power uses one gunpowder.

Cannonballs and bombs have their own effects, TNT explodes on impact, melons and dried kelp blocks burst into their drops, and any other block lands and places itself where it hits.

</div>
<figure><img src="/mods/blocky-siege/media/cannon.webp" alt="The Cannon spinning" loading="lazy" /></figure>
</div>

<div class="feature-row">
<div class="feature-text">

### [Burst-Cannon](items/multi_cannon/)

Shoots **any item**, in bursts of 1 to 4 rounds. Each round uses one gunpowder.

Arrows, fire charges, snowballs and other throwables fly as themselves, firework stars burst, and anything else flies out and drops where it lands.

</div>
<figure><img src="/mods/blocky-siege/media/burst-cannon.webp" alt="The Burst-Cannon spinning" loading="lazy" /></figure>
</div>

<div class="feature-row">
<div class="feature-text">

### [Spewer](items/spewer_cannon/)

Shoots **any liquid** from a one-bucket tank. Fill it with buckets, potions or any modded fluid container. Hold fire to keep spraying.

Water puts out fires and wets farmland, lava sprays burning embers, and potions splash their effect where they land.

</div>
<figure><img src="/mods/blocky-siege/media/spewer.webp" alt="The Spewer spinning" loading="lazy" /></figure>
</div>

<div class="feature-row">
<div class="feature-text">

### [Volley Rack](items/volley_rack/)

Holds 8 stacks of arrows, fireworks or other projectiles and launches them in a rapid volley while it's powered, or while you hold the fire key. Each shot uses one gunpowder.

</div>
<figure><img src="/mods/blocky-siege/media/volley-rack.webp" alt="The Volley Rack spinning" loading="lazy" /></figure>
</div>

<div class="feature-row">
<div class="feature-text">

### [Crossbow Golem](items/crossbow_golem_block/)

An automatic turret. Give it a crossbow and up to 9 stacks of arrows or fireworks, and it shoots at monsters, and at players who aren't on your team, up to 48 blocks away. See [Crossbow Golem](#crossbow-golem) below.

</div>
<figure><img src="/mods/blocky-siege/media/crossbow-golem.webp" alt="The Crossbow Golem spinning" loading="lazy" /></figure>

</div>

## Using a weapon

1. **Right-click** the weapon to open it and load it.
2. **Fire it** with flint and steel, or with a redstone signal.
3. Or press **Click to Aim** in its screen to sit at the weapon and man it. Turn to aim, and press the **Fire Cannon** key (right mouse button by default) to shoot. A small display shows your fuse, ammo and the weapon's health. Holding the key keeps the Spewer and Volley Rack firing.

Weapons wear out. A full-power cannon shot has a small chance to damage the cannon, and strong projectiles hitting a weapon damage it too. A badly damaged weapon blows apart, so repair it before that happens: right-click it with an **iron ingot**, or **planks** for the Volley Rack.

## Crossbow Golem

Build it like an iron golem: place an **iron block** on the ground, a **dispenser** on top, a **log** on each side of the dispenser, and a **carved pumpkin** on top. The golem joins your scoreboard team, so it leaves your teammates alone. Without a team, it shoots at every player. It has 50 health, loads its crossbow like a player would (so Quick Charge works), and fires a random stack from its ammo. It shows cracks as it takes damage, its ammo box sinks as it runs low, and it happily shoots mobs far below it, so it works well on top of a tower. Right-click it with an **iron ingot** to repair it, and nearby Fletchers restock it with a few arrows each morning.

## Ammunition

- **[Cannonball](items/cannonball/):** punches through blocks, then skims, bounces and rolls to a stop. Hit a landed cannonball a few times to knock it loose and pick it up.
- **Spectral Cannonball:** punches through several blocks in a row.
- **[Fire Bomb](items/fire_bomb/):** bursts into flames and spreads burning embers around where it lands. With a dynamic lights mod, the bomb and its embers light up their surroundings.
- **[Frost Bomb](items/frost_bomb/):** bursts into a spray of frost that leaves frost piles behind.
- **[Wind Bomb](items/wind_bomb/):** a supersized wind charge that blasts everything away.
- **[Explosive Barrel](items/explosive_barrel/):** light it like TNT, or fire it from a cannon. It blows up into a spray of wooden shrapnel, thrown forward if it's moving or all around if it isn't.

Placed ammo can be taken back: right-click a stack of cannonballs or bombs to pick up one piece.

## Siege crews

**Pillagers**, **Vindicators** and **Piglins** man siege weapons they find nearby. They walk to a Cannon, Burst-Cannon or Spewer, sit down, aim with a proper arc, lead moving targets and fire. They jump off to fight when you get close. When a weapon runs dry, they reload it with their own ammo: Pillagers bring cannonballs, arrows and water, and Piglins bring fire bombs, fire charges and lava. Crew shots are tamer than yours: cannonballs only break weak blocks, and arrows can't be picked up.

Turn crews off with the gamerule `/gamerule doSiegeWeaponCrews false`, or change them in the [Config](config/).

## Villagers and banners

The **Siege Engineer** is a new villager who works at a Cannon. They sell gunpowder, Explosive Barrels, Cannonballs, and later Cannons, Burst-Cannons, Volley Racks and Spewers. The mod also adds the **Fort** and **Boom** banner patterns.

## Compatibility

- **Sable and Create Aeronautics:** siege weapons work on moving ships. You can crew weapons on them, Crossbow Golems ride along and shoot from them, and cannonballs hit and break blocks on ships too.
- **LambDynamicLights:** Fire Bombs and embers light up their surroundings.
- **Farmer's Delight:** its crop crates and rice bags burst into their crops when fired from a cannon.
- **Modded fluids** work in the Spewer.
- **Datapacks** can give any block its own cannon behavior in `data/<namespace>/blockysiege/block_projectile_behaviors/`.

## Details

- **Cannonball deaths** show one of 8 death messages, like *"Steve was flattened by Alex's cannonball"* or *"Steve didn't see the cannonball coming"*.
- **Advancement:** build a Crossbow Golem to earn **Iron Sentry**.
- **Translations:** English, Russian, Ukrainian, Spanish (Spain) and Spanish (Mexico).
- Everything is in the **Siege Weapons** creative tab.
- See the [changelog](https://github.com/LuckyOwlStudios/Luckys-Blocky-Siege/blob/master/CHANGELOG.md) for everything new in 4.0.0.
