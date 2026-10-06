---
title: "Installation"
---

# Installation

Install the Heavy Inventories file for your **Minecraft version and mod loader**. Fabric and NeoForge use separate
files.

For the Minecraft 26.3 release candidate:

| Loader   | Required alongside Heavy Inventories |
|----------|--------------------------------------|
| Fabric   | Fabric API and EasyConfig            |
| NeoForge | EasyConfig                           |

This branch targets EasyConfig **1.263.0.9**. Use its matching Minecraft and loader version. Cloth Config is not
required by this candidate; keep it if another mod needs it.

## Singleplayer

1. Add Heavy Inventories and its dependencies to your instance's `mods` folder, or install them through your launcher.
2. Launch the game and open a world.
3. Hover over an item. Its tooltip should show a weight, and the ring should appear behind your XP level.

Open `/heavyinventories config client` to change the display. On Fabric, Mod Menu also provides a settings button. On
NeoForge, use Heavy Inventories' config button in the mod list.

## Multiplayer

Install Heavy Inventories and its dependencies on **the server and every client**. Use the same Heavy Inventories
version on both ends. EasyConfig is required on dedicated servers too.

The server supplies gameplay settings and item weights. Each player can still choose their own display units and HUD
layout.

Weight datapacks belong in the server world's `datapacks` folder. Players do not need to install a separate copy of
those packs.

## Config files

The client creates `config/heavyinventories-client.toml` when the game starts. The server creates
`config/heavyinventories-server.toml` when it starts; in singleplayer, that happens when you open a world.

If you're upgrading from JSON settings, the matching old file is imported when its TOML replacement doesn't exist. The
old file stays as a backup. Make subsequent edits in TOML.
