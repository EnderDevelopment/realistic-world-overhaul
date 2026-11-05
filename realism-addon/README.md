# Realism Add-On for Minecraft Bedrock & Education Edition

A Minecraft **Bedrock / Education Edition** add-on that makes the world feel real:
realistic hardened tools, flowing water physics, sprint stamina, realistic mob
walk/run animations, and six new mobs that spawn naturally in their own biomes.

> **Loader note:** This project targets Minecraft **Bedrock / Education Edition**.
> It is delivered as an **add-on** (behavior pack + resource pack), *not* a Java
> mod. Bedrock/Education Edition cannot run Java mods or Gradle builds.

---

## Features

### 🛠️ Realistic hardened tools
Craft stronger, tougher tools from **Hardened Iron** and **Obsidian**:

| Item | Durability | Damage / Use |
|------|-----------|--------------|
| Hardened Sword | 1200 | 8 damage |
| Hardened Pickaxe | 1650 | 10× stone/metal (efficiency digger) |
| Hardened Axe | 1450 | 9 damage, 10× wood |
| Hardened Shovel | 1300 | 10× sand/dirt/grass |
| Hardened Hoe | 1100 | till fast |
| Obsidian-Tipped Sword | 1500 | 10 damage |

### 💧 Realistic water physics (scripting)
- Water flows **downhill**: entities in a current get pushed along the flow.
- **Buoyancy**: when you're fully underwater you're pushed gently back up.
- **Sprint stamina**: energy drains while sprinting and recovers when you rest,
  so you can't run forever.

### 🐾 Realistic mob walk/run animations
- Each mob has dedicated walk and run (or swim/hop) animations via Molang
  animation controllers — a deer ambles calmly and bounds when startled, a wolf
  trots then sprints.

### 🦌 New mobs, each spawning in its own biome
| Mob | Habitat | Behavior |
|-----|---------|----------|
| Deer | Forests & Plains | Passive, flees, breedable, rideable |
| Jaguar | Jungle | Predator that hunts deer & pigs |
| Scorpid | Desert | Hostile, poison sting |
| Shark | Ocean | Swims, attacks swimmers |
| Snow Wolf | Snowy biomes | Packs, hunts players |
| Swamp Toad | Swamps | Passive amphibian |

---

## 📦 Install instructions

1. **Enable experimental/creativity features** if prompted when creating the world
   (in Bedrock, toggle **"Beta APIs"** / experiment toggles; in Education Edition
   enable add-ons for the world).
2. **Pack the add-on**: zip the `behavior_pack` folder and the `resource_pack`
   folder, then rename to `.mcpack` each — or zip the two packs together and
   rename to **`realism.mcaddon`**.
3. **Import** the add-on: double-click the `.mcaddon` / `.mcpack` file (or open
   it with Minecraft), then confirm each pack is added.
4. In the world's **Settings → Behavior Packs / Resource Packs**, activate both
   **"Realism Pack (Behavior)"** and **"Realism Pack (Resources)"**.
5. Join the world. You'll see a welcome message when the pack loads.

### ⚠️ Required textures (PNG images)
The add-on references textures that must be added as real PNG images. Because
this repo ships source only, copy or generate these files (any 64×64 or
16×16 PNG works):

- Resource pack:
  - `textures/entity/deer.png`, `jaguar.png`, `scorpid.png`, `shark.png`,
    `snow_wolf.png`, `swamp_toad.png`
  - `textures/items/hardened_iron_ingot.png`, `obsidian_shard.png`,
    `hardened_sword.png`, `hardened_pickaxe.png`, `hardened_axe.png`,
    `hardened_shovel.png`, `hardened_hoe.png`, `obsidian_tipped_sword.png`
  - `pack_icon.png` (optional)

---

## 🎮 Commands

Spawn any new mob with the `/summon` command:

```
/summon realism:deer
/summon realism:jaguar
/summon realism:scorpid
/summon realism:shark
/summon realism:snow_wolf
/summon realism:swamp_toad
```

Give yourself the new items:

```
/give @s realism:hardened_iron_ingot 8
/give @s realism:obsidian_shard 4
/give @s realism:hardened_sword
/give @s realism:obsidian_tipped_sword
```

---

## 🧱 Add-on layout

```
realism-addon/
├── behavior_pack/
│   ├── manifest.json          (data + script modules)
│   ├── entities/              (mob behavior: AI, health, attacks)
│   ├── spawn_rules/           (biome-based natural spawning)
│   ├── items/                 (hardened tools & materials)
│   ├── loot_tables/entities/  (mob drops)
│   ├── recipes/               (crafting)
│   └── scripts/main.js        (water physics + sprint stamina)
└── resource_pack/
    ├── manifest.json
    ├── entity/                (client entity bindings)
    ├── models/entity/         (Bedrock geometry models)
    ├── animations/            (walk/run/swim/hop keyframes)
    ├── animation_controllers/ (Molang state machines)
    ├── render_controllers/
    ├── textures/              (item texture atlas + list)
    └── texts/                 (localization)
```

## 🔧 Building / packaging (no Gradle)

There is no compilation for Bedrock add-ons. To produce the installable file:

1. Select both folders, zip them, and rename the archive to **`realism.mcaddon`**.
2. Or zip each folder separately, rename to `realism_behavior.mcpack` and
   `realism_resource.mcpack`, and import both.

The `.mcaddon`/`.mcpack` is a standard zip — nothing to compile.
