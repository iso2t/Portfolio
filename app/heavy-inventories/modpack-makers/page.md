---
title: "Modpack makers"
---

# Modpack makers

Use the server config for gameplay rules and datapacks for item weights. Both apply to everyone playing on that server.
In singleplayer, the same rules come from the local instance.

1. [Install the mod and dependencies](/heavy-inventories/installation) on clients and the server.
2. Open a world once to generate the TOML settings files.
3. Set capacity, walking behavior, and individual penalties in [server settings](/heavy-inventories/server-settings).
4. Add [weight datapacks](/heavy-inventories/weight-datapacks) to the world for any item weights you want to change.
5. [Export a weight report](/heavy-inventories/commands-and-weight-reports) and check your changes in game.

When testing balance, try a mining trip, a loaded bundle or shulker box, a swim, and an elytra trip. Check both with and
without capacity enchantments. Flight and knockback use actual weight, so raising capacity won't change those effects.

## Files to include

Ship `config/heavyinventories-server.toml` for gameplay defaults. You can also supply
`config/heavyinventories-client.toml` for initial display preferences; players can change those locally.

Install weight datapacks in each world that needs them. If your pack uses a separate tool to load datapacks into every
world, configure and test that tool as part of your pack. Heavy Inventories itself reads the world's enabled datapacks.

See [importing old weights](/heavy-inventories/importing-old-weights) if you're moving from namespace-based files in the old `weights`
folder.
