---
title: "Installing Easy Config"
---

# Installing Easy Config

Easy Config is a dependency for mods that use its configuration API and in-game
screens, including [Heavy Inventories](/heavy-inventories) and [Sverve](/sverve).

## Choose the matching build

Use the **Fabric** or **NeoForge** mod build for your Minecraft version, and match
the Easy Config version required by the mod using it. Put that jar in the instance's
`mods` folder, including the server's folder when the consuming mod requires it there.

See the [Easy Config repository](https://github.com/iso2t/EasyConfig) for available
builds. The standalone Java `api` artifact is intended for developers; install the
loader-specific mod jar for Minecraft config screens.

## Open config screens

- **Fabric:** install [Mod Menu](https://modrinth.com/mod/modmenu) to access
  registered config screens through the mod list. Mod Menu is optional.
- **NeoForge:** open the mod list and use the mod's config button.

Mods with multiple registered configs can provide separate tabs. The settings
available depend on the mod that registered them.

For integrating your own mod, start with [dependencies](/easy-config/dependencies)
and [creating a config](/easy-config/creating-a-config).
