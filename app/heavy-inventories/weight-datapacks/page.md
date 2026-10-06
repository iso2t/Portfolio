---
title: "Weight datapacks"
---

# Weight datapacks

Weight datapacks let you change item weights for a world. Install them on the server, or in the world folder for
singleplayer. Players receive the resulting weights automatically.

Heavy Inventories includes default weights. A datapack can replace a few of them without supplying a full catalog.

## Change an item weight

Use a datapack with valid `pack.mcmeta` metadata for Minecraft 26.3. Weight files go inside its `data` folder, alongside
any recipes or other data the pack supplies.

1. Find the item's ID. Enable advanced tooltips with F3+H, then hover over it.
2. Split the ID at the colon. The part before it is the namespace; the part after it is the item path.
3. Create a JSON file at `data/<namespace>/heavyinventories/weights/<item path>.json`.
4. Give the file a JSON object with exactly one field, as described below.

For `minecraft:feather`, the file is **`data/minecraft/heavyinventories/weights/feather.json`**. Use the item's
namespace, even if your datapack has a different name. For blocks, use the inventory item's ID.

| Field    | Value                  | Result                                                   |
|----------|------------------------|----------------------------------------------------------|
| `weight` | A number, such as 0.05 | Sets one empty item's weight in pounds                   |
| `infer`  | The boolean `true`     | Asks Heavy Inventories to derive the weight from recipes |

Choose **one** field per file. Do not combine them or add extra fields. Weight values must be numbers, not quoted text.
Zero makes the empty item weightless; a container's contents still count. Negative values are not accepted.

## Install and check the pack

1. Put the pack folder or ZIP into the world's `datapacks` folder. Its `pack.mcmeta` and `data` folder must be at the
   pack root, without an extra enclosing folder.
2. Run Minecraft's `/reload` as an operator.
3. Use `/datapack list enabled` to check that the pack is active. If it isn't, find it with `/datapack list available`
   and enable it using `/datapack enable` and command completion.
4. Check an item's tooltip. For a fuller check, run `/heavyinventories dump minecraft`, or replace `minecraft` with the
   mod's namespace.

After later edits, run `/reload` again. Connected players receive the updated weights without reconnecting.

## Pack priority

If two packs supply a file for the same item, the higher-priority pack wins. The whole file is replaced; fields aren't
merged.

Enable your override pack last when it should take precedence. If an edit doesn't appear, check the enabled pack order
and the source recorded in a [weight report](/heavy-inventories/commands-and-weight-reports).

Removing your override reveals the next available definition, including bundled defaults. To replace a fixed default
with recipe calculation, use an `infer` definition instead.

## Recipe-derived weights

An item with no fixed weight can get its weight from a supported recipe. Ingredient weights are added together and
divided by the number of output items. If several usable recipes or ingredient choices exist, the lowest calculated
weight is used.

For example, if a log weighs 8 pounds and a recipe makes four planks, that recipe gives each plank a weight of 2 pounds.
A fixed plank weight would take precedence.

Supported recipes include ordinary shaped and shapeless crafting, smelting, blasting, smoking, campfire cooking, and
stonecutting with fixed outputs. Recipes that leave crafting remainders, produce component-dependent results, or use
unsupported custom behavior need explicit weights.

If no fixed or usable recipe-derived weight is available, the item gets **0.1 pounds**. Set explicit weights for raw
materials and items whose recipes don't provide a useful result. Use `infer` on an already-defined item when you want
recipe changes to affect it.

## Errors and optional mods

A definition for an item from an absent mod is ignored with a warning. You can include optional mod weights in the same
pack.

Malformed weight files reject the weight update. An existing world session keeps its previous weight table. Check the
server log for the file and error, correct it, then run `/reload` again.
