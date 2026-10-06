---
title: "Mod compatibility"
---

# Mod compatibility

## Containers and equipment

Vanilla bundles and shulker boxes count their contents, including nested containers. Modded items that store their
contents in Minecraft's standard `CONTAINER` or `BUNDLE_CONTENTS` item components can use the same support.

Custom backpack inventories and additional equipment slots are not automatically included. Test the actual item and slot
rather than assuming a backpack or accessory is counted.

Mod authors can register [extra inventories](/heavy-inventories/api/inventories-and-capacity)
or [custom container contents](/heavy-inventories/api/container-contents) through the API. Contents must be counted through one route;
reporting the same storage twice gives the wrong total. HI receives the server's final carried weight even when a custom
container's contents aren't available for a client tooltip.

To check a container, compare your carried total with it empty and filled. Move items between the container and your
main inventory; the contents' weight should remain accounted for. Also check its tooltip after reconnecting and after a
datapack reload.

## Recipes

Ordinary fixed-output recipes can supply inferred weights. Custom recipe types, outputs that depend on item components,
and recipes with crafting remainders may need explicit definitions. Use a [weight report](/heavy-inventories/commands-and-weight-reports)
to find items receiving the fallback.

An item definition covers the item ID. It does not provide separate base weights for individual variants based on
components.

## HUD overlap

Two mods can draw at the same position without either one crashing. Mod authors can use [HUD integration](/heavy-inventories/api/hud) to
move, hide, decorate, or replace HI's ring and numbers. HI doesn't automatically detect overlaps or reposition unrelated
HUD elements.

Players can choose a registered owner separately for the ring and readout in client settings. If an integration fails or
a selected owner is unavailable, HI falls back to its built-in display. See [display and tooltips](/heavy-inventories/display-and-tooltips)
for those controls.

## Movement and flight

Test movement mods alongside the penalties your pack enables. Check walking, sprinting, jumping, fluid movement, falls,
and elytra flight at light load, 90% capacity, and above capacity.

Heavy Inventories preserves normal fall protection, adds its knockback bonus alongside existing resistance, and leaves
currents and bubble-column motion intact. Those behaviors do not establish compatibility with every mod that changes the
same actions.

There is no verified compatibility list for third-party backpack or movement mods. If you find a conflict, include both
mod versions, the affected item or action, your settings, and a small reproduction in
an [issue](https://github.com/iso2t/Heavy-Inventories/issues).
