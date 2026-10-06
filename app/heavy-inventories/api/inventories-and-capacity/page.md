---
title: "Inventories and capacity"
---

# Inventories and capacity

Use an inventory provider for player-owned slots HI cannot already see, such as a belt or accessory inventory. Use a
capacity provider for a bonus supplied by your equipment or mechanics. Register both from
a [common plugin](/heavy-inventories/api/getting-started).

These callbacks run on the **server thread** during normal player updates. HI sends the resulting weight and capacity to
the client. You don't need a client provider for a separate equipment inventory.

## Count each storage location once

HI already counts the main inventory, offhand, armor, cursor stack, and personal crafting inputs. Do not report those
again. Don't include crafting-result previews or an external chest just because its screen is open.

If a carried backpack's contents are supplied through a [container provider](/heavy-inventories/api/container-contents), don't also report
those contents as extra player slots. Choose one route for each storage location. HI rejects duplicate slot IDs and
shared stack references, including aliases of vanilla stacks, but cannot recognize two separate copies of the same
logical storage.

## Connect an extra inventory

This adapter accepts your mod's lookup for a player's belt inventory. Call `BeltWeights.register` during plugin
registration, passing a function that returns a `Container` for that player. A null result means the player has no belt
inventory. If an existing inventory cannot be read, throw an exception instead of reporting it as absent.

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.plugin.PluginRegistration;
import net.minecraft.resources.Identifier;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.Container;

import java.util.function.Function;

public final class BeltWeights {
    public static void register(
        PluginRegistration registration,
        Function<ServerPlayer, Container> inventories
    ) {
        registration.inventory(
            Identifier.fromNamespaceAndPath("expedition", "belt"),
            (player, slots) -> {
                var inventory = inventories.apply(player);
                if (inventory == null) return;
                for (int index = 0; index < inventory.getContainerSize(); index++) {
                    var slot = Identifier.fromNamespaceAndPath(
                        "expedition", "belt/" + index
                    );
                    if (!slots.accept(slot, inventory.getItem(index))) return;
                }
            }
        );
    }
}
```

The lookup is supplied by your mod; HI doesn't create, save, or synchronize the belt inventory. Use the supplied player
to find storage on the server. Don't capture one player's inventory during registration.

Give each slot a stable ID. Here `expedition:belt/0` continues to mean the first belt slot even when empty. Slot IDs are
unique across all inventory providers, so a second inventory should use a different path, such as `expedition:quiver/0`.

Report empty slots consistently. The sink copies each stack when accepted, and HI compares slot IDs, counts, and
components during later updates. Don't mutate stacks while reporting them. Stop immediately when `accept` returns false,
and never retain the sink or use it on another thread.

## Add capacity

The [starter plugin](/heavy-inventories/api/getting-started#write-a-common-plugin) registers an equipment-based bonus. A capacity provider
returns **additional pounds**, not a multiplier and not the final capacity.

With a base capacity of 1,000, a Strength bonus of 100, and a provider returning 125, effective capacity is 1,225 before
any other active bonuses. Existing encumbrance thresholds use that effective capacity. A second provider returning 50
adds another 50.

Return zero while your feature is inactive. Bonuses must be finite and nonnegative. A negative value, NaN, infinity, an
exception, or a contribution that overflows effective capacity adds nothing; other valid providers still apply. This API
does not supply capacity penalties or replace the server's configured base capacity.

Capacity providers run every server update. Read the player's current equipment or effects and return the result. Don't
maintain an accumulating total, copy an old entity's bonus after respawn, or run a weight calculation inside the
callback. Removing the equipment should naturally make the next result zero.

## Updates and failures

HI compares extra slots during normal updates. When external storage changes without a visible stack change, call the
retained `ServerWeights.invalidate(player)` on the server thread. It schedules a later recalculation. An unchanged
inventory also refreshes every 20 ticks.

The shared extra-inventory budget is **4,096 slots**, including empty slots. Null stacks, duplicate or foreign-namespace
slot IDs, rejected ownership, exceeded limits, and provider exceptions make carried weight **incomplete**. HI does not
publish the successfully read portion as a full total.

Provider failures identify the registration in the log and are limited to once per minute per provider/category. Keep
callbacks cheap and free of file or network access. They may read the last completed player snapshot and request later
invalidation, but must not start another weight calculation.

HI rebuilds derived weight and bonuses for replacement players. Your mod remains responsible for saving its inventory,
deciding whether it survives death, and clearing its own world or player references.

Test by moving an item between vanilla storage and your extra inventory: the total should stay the same. Then test empty
slots, count changes, removal of the storage item, death with and without retained inventory, and reconnecting.
See [testing an integration](/heavy-inventories/api/testing).
