---
title: "Carrying weight"
---

# Carrying weight

**Carried weight** is the total weight of the items you have with you. **Capacity** is how much you can carry before
becoming overloaded. The closer you get to that capacity, the more your load affects you.

## What counts toward your load

Your load includes your main inventory, offhand, and equipped armor. Wearing an item does not make it lighter. Items on
your inventory cursor and in your personal crafting grid count too.

Bundles and shulker boxes weigh as much as the empty container plus everything inside. Putting one container inside
another still counts its contents. Items stored in an external chest or your Ender Chest do not count toward your load.

For modded backpacks and extra equipment slots, see [mod compatibility](/heavy-inventories/mod-compatibility).

## Capacity

The default base capacity is **1,000 pounds**. Strength adds 10% of base capacity per effect level: Strength I adds 100
pounds at the default capacity, and Strength II adds 200.

[Bracing and Reinforced](/heavy-inventories/enchantments) add capacity while you're wearing the enchanted armor. These bonuses add together
with Strength. With the defaults, Bracing X, Reinforced V, and Strength II give a total capacity of **2,450 pounds**.

Removing that armor or losing Strength can put you over capacity immediately.

## Encumbrance

Encumbrance is the movement penalty from carrying too much. You become encumbered at 90% of your capacity and over
encumbered at 100%. With the default 1,000-pound capacity and no bonuses, those thresholds are 900 and 1,000 pounds.

| Load                  | Status          | Ground jumping |
|-----------------------|-----------------|----------------|
| Below 90% of capacity | Normal          | Allowed        |
| 90% to below 100%     | Encumbered      | Blocked        |
| 100% or more          | Over encumbered | Blocked        |

Walking uses one of two server settings:

- **Progressive**, the default: you gradually slow down as your load increases, including below 90%.
- **Begin at 90%**: full walking speed up to 90%, then a gradual slowdown to zero at capacity.

Without Surefooted, walking reaches zero at 100% in either mode. [Surefooted](/heavy-inventories/enchantments) lets you keep moving at a
reduced speed, but does not restore ground jumping. If a jump is blocked, a brief message appears above the hotbar.

## Hunger, falls, and swimming

These are the defaults. Server owners can [adjust or disable individual effects](/heavy-inventories/server-settings).

**Hunger:** carrying a load makes movement use more of your food reserves. Heavy Inventories uses Minecraft's hunger and
exhaustion system; there is no separate stamina bar. Sprinting, swimming, and jumping can cost up to 1.5 times their
normal exhaustion; ordinary walking also gains a small cost. Standing still adds no extra drain. Surefooted does not
reduce this cost.

**Falls:** extra fall damage begins above 90% capacity. It rises gradually to twice normal damage at 125%, then stops
increasing. Normal fall protection still applies.

**Water and lava:** movement slows and sinking becomes stronger between 90% and 100% capacity. At 100%, horizontal
movement is halved and fluid gravity is doubled. Currents and bubble columns retain their motion. Servers can also block
swimming upward when overloaded, but that option is off by default.

**Knockback:** a heavier load makes you harder to knock back. The default bonus reaches +0.4 resistance at 1,000 carried
pounds. Increasing your capacity does not reduce this bonus.

Creative and spectator players are exempt from weight penalties. For elytra, see [flight](/heavy-inventories/elytra-flight).
