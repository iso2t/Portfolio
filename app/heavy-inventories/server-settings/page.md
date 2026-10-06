---
title: "Server settings"
---

# Server settings

Gameplay settings are saved in **`config/heavyinventories-server.toml`** on the server. In singleplayer, this is in your
Minecraft instance and is shared by its worlds. Item weights belong in [datapacks](/heavy-inventories/weight-datapacks).

The file is created when a server starts or a singleplayer world opens. It includes comments describing the settings and
defaults.

## Change settings in game

1. Open `/heavyinventories config server`.
2. Change the settings you want.
3. Select Save to apply them and write the server's TOML file.

Everyone can view this screen. Saving requires operator permission, including in singleplayer, where commands must be
enabled.

Done closes without saving. Reset changes the draft to defaults; save afterward to apply them. Reload discards the draft
and returns to the server's current settings.

## Edit the file

Edit the server's TOML file, save it, then run `/heavyinventories reload`. A restart also loads the file.

Use the field names already in the generated file. They are lowercase; enum choices such as `PROGRESSIVE` are uppercase.
If a reload is rejected, fix the reported entry and reload again. The previous active settings remain in use.

## Capacity and walking

| Setting           | Default      | What to choose                                                             |
|-------------------|--------------|----------------------------------------------------------------------------|
| Starting capacity | 1,000 pounds | Base capacity before Strength and armor bonuses; must be greater than zero |
| Walking mode      | Progressive  | Slow down as weight increases, or keep full speed until 90% capacity       |

Changing the base capacity also changes the size of Strength, Bracing, and Reinforced bonuses. It does not change the
reference weights used for flight or knockback.

## Individual effects

Each effect has its own enable switch. Percentages below refer to the player's capacity after Strength and equipment
bonuses, except where a weight in pounds is given.

| Effect                | Default settings                                                                                            |
|-----------------------|-------------------------------------------------------------------------------------------------------------|
| Exhaustion            | Enabled; up to 1.5 times normal movement exhaustion and 0.01 extra exhaustion per block of ordinary walking |
| Fall damage           | Enabled; starts above 90%, reaches a maximum of twice normal damage at 125%                                 |
| Swimming              | Enabled; starts above 90%, reaches half horizontal movement at 100%                                         |
| Sinking               | Enabled; starts above 90%, reaches twice normal fluid gravity at 100%                                       |
| Block upward movement | Disabled; if enabled, starts at 100%                                                                        |
| Knockback resistance  | Enabled; up to +0.4 resistance at 1,000 carried pounds                                                      |
| Elytra flight         | Enabled; up to 15% less lift and 25% less rocket thrust at 1,000 carried pounds                             |

Exhaustion follows the selected walking mode, before Surefooted. It adds no idle drain.

Water and lava each have a separate switch, both enabled by default. They control where swimming, sinking, and
upward-movement restrictions apply.

For fall damage, swimming, and sinking, keep the full-penalty threshold above the starting threshold. Penalties increase
between those values and stop increasing at the full threshold.

Multipliers use 1 for unchanged behavior, 0.5 for half, and 2 for double. Elytra reductions use fractions: 0.15 means a
15% reduction. Set either flight reduction to zero to disable just that part, or switch off the effect to disable both.

## Reloading settings versus datapacks

Use `/heavyinventories reload` after editing **TOML settings**. Use Minecraft's `/reload` after editing **datapacks or
recipes**. The Heavy Inventories command does not read changed datapack files from disk.
