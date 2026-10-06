---
title: "Installing Sverve"
---

# Installing Sverve

The current source branch targets **Minecraft 26.3 / Java 25**, with separate
Fabric and NeoForge builds. Choose a release that matches your Minecraft version
and loader. Check the [repository](https://github.com/iso2t/Sverve) for available builds.

## Requirements

| Loader | Required mods |
| --- | --- |
| Fabric | Sverve, [Easy Config](/easy-config/installation), Fabric API |
| NeoForge | Sverve, [Easy Config](/easy-config/installation) |

Put the matching mod jars in the `mods` folder on both the server and each client,
then start the game. For a single-player world, install them in your game instance.

The current source branch uses Easy Config **1.263.0.9**. Follow the dependency
requirements of the Sverve release you install if they differ.

## Heavy Inventories integration

[Heavy Inventories](/heavy-inventories/installation) is optional. Sverve includes
a native integration for it; the current source branch requires Heavy Inventories
**4.263.0.0-rc.2 or newer** when it is installed. Match both mods to the same
Minecraft version and loader.

Next, read the [survival guide](/sverve/survival).
