---
title: "Troubleshooting"
---

# Troubleshooting

## Everything weighs 0.1

An item gets the 0.1-pound fallback when it has neither a fixed weight nor a usable recipe-derived weight. A few modded
items may need definitions. Most vanilla items all showing the fallback is not expected with the bundled defaults.

Check your Heavy Inventories version and the server log for weight-loading errors. If you're using custom datapacks,
check that they loaded successfully. An operator can run `/heavyinventories dump minecraft` to inspect the active
weights and their sources.

If it happens without custom packs, report the Minecraft version, loader, exact mod file, and whether this is a new
world, an existing world, or multiplayer.

## A datapack edit did nothing

Use Minecraft's `/reload`, then check `/datapack list enabled`. Confirm the item ID and file path, and check whether a
higher-priority pack supplies the same item. A rejected update leaves the previous weights active; the server log names
the problem.

See [weight datapacks](/heavy-inventories/weight-datapacks) for the file layout and accepted fields.

## I can't save server settings

You need operator permission to save them. In singleplayer, commands must be enabled. Other players can view the screen
without changing its values.

If someone else changed the settings while your screen was open, reload the screen's values before trying again. If a
value is rejected, correct it rather than repeatedly saving the same draft.

## I can't find the config file

Look in the active instance or server's `config` folder. Launching the client creates `heavyinventories-client.toml`;
opening a world or starting a server creates `heavyinventories-server.toml`.

On multiplayer, the gameplay file is on the server. Local client changes won't replace it. If old JSON files are still
present, use the TOML files after migration.

## The HUD is missing or overlaps the XP bar

Check **Enable GUI Overlay**, your **Weight display** selection, and whether F1 has hidden the HUD. If the ring overlaps
the XP bar or number, adjust **Ring vertical offset**. The default is 7; try 12 for a long XP number.

See [display and tooltips](/heavy-inventories/display-and-tooltips).

## I can't move or jump

Check your load percentage. Ground jumping is blocked at 90% capacity, and walking stops at 100% without Surefooted.
Removing Bracing or Reinforced armor, or losing Strength, lowers capacity and can push you over a threshold.

Unload items or equip the appropriate [enchantments](/heavy-inventories/enchantments). If you're playing a modpack, view its server
settings to check for changed rules.

## A container shows a calculation-limit warning

Try separating nested containers or moving their contents into ordinary storage. If the contents can't be fully counted,
Heavy Inventories treats the load as over capacity and shows a warning instead of a misleading total.

If an ordinary container triggers it, report the item, its contents, and any storage mods involved.

## Report a problem

Open an [issue](https://github.com/iso2t/Heavy-Inventories/issues) with your Minecraft, loader, Heavy Inventories, and
EasyConfig versions. Include whether it happens in singleplayer or on a server, the steps to reproduce it, and the
relevant log. For weight problems, include the datapack or item ID involved.
