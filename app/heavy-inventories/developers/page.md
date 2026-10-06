---
title: "Developers"
---

# Developers

Heavy Inventories exposes an API for reading weights, counting your mod's storage, adding carrying capacity, and
integrating its weight display with your HUD. Integrations live in your mod and register through an HI plugin. Fabric
and NeoForge use the same API classes.

These guides describe **4.263.0.0-rc.2 for Minecraft 26.3**, using Java 25. The API is part of this release candidate;
don't assume these entry points exist in older HI releases. [Getting started](/heavy-inventories/api/getting-started) covers the iso2t
Maven coordinates, local testing before publication,
and the API and loader dependencies.

## Choose an integration

| What you want to do                                   | Guide                                                    |
|-------------------------------------------------------|----------------------------------------------------------|
| Give your items fixed weights                         | [Weight datapacks](/heavy-inventories/weight-datapacks)                     |
| Set up an HI plugin on either loader                  | [Getting started](/heavy-inventories/api/getting-started)                   |
| Read item, stack, or player weight                    | [Weight queries](/heavy-inventories/api/weight-queries)                     |
| Count an accessory inventory or add capacity          | [Inventories and capacity](/heavy-inventories/api/inventories-and-capacity) |
| Count contents in a custom backpack or container item | [Container contents](/heavy-inventories/api/container-contents)             |
| Move, hide, decorate, or replace the ring and numbers | [HUD integration](/heavy-inventories/api/hud)                               |
| React to a reload, player update, or disconnect       | [Notifications](/heavy-inventories/api/notifications)                       |
| Check your integration and diagnose failures          | [Testing an integration](/heavy-inventories/api/testing)                    |

## Supply weights with your mod

Bundle definitions in your mod's data resources using the paths and fields in the [datapack guide](/heavy-inventories/weight-datapacks).
Pack makers can override them with their own datapacks. This doesn't need a Java plugin.

Give raw materials and items with unusual recipes explicit weights. Check inferred weights for ordinary crafting outputs
before adding definitions for every item. The Java API reads the server's selected weights; it does not register
replacement base-weight tables.

## Choose the right side

The server owns carried weight, capacity, and gameplay penalties. Inventory and capacity providers run there. Clients
receive the resulting player state and use it for display.

Client plugins handle the HUD and local weight queries. Custom container providers can also run on the client for stack
previews. They must report unavailable contents honestly if the client doesn't have the necessary data.

An integrated server still has separate client and server threads. Keep client imports in the client plugin and use the
level or player supplied to gameplay callbacks.

## Work on HI itself

See [contributing](/heavy-inventories/contributing) for the build, runtime tests, translations, and bug reports.
The [compatibility guide](/heavy-inventories/mod-compatibility) describes what happens without an integration and what to check alongside
other mods.
