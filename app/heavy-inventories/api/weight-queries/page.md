---
title: "Reading weights"
---

# Reading weights

Obtain `ServerWeights` from your common plugin's registrar, or `ClientWeights` from the client registrar. Keep the
service and call it when you need a value. Don't import HI's player holder, caches, or weight calculator.

All numeric weights and capacities use **pounds**, before display conversion or rounding. Changing the player's display
units does not change the values returned by the API.

## Choose a query

| Query                                  | Result                                                                     |
|----------------------------------------|----------------------------------------------------------------------------|
| `ServerWeights.item(server, itemId)`   | Base weight of one empty item                                              |
| `ServerWeights.stack(level, stack)`    | Stack count, shell weight, and supported nested contents, using that level |
| `ServerWeights.stack(server, stack)`   | The same calculation with the overworld as container context               |
| `ServerWeights.player(player)`         | The player's last completed weight and capacity snapshot                   |
| `ServerWeights.source(server, itemId)` | How the active item weight was selected                                    |
| `ClientWeights.item(itemId)`           | The synchronized base weight of one empty item                             |
| `ClientWeights.stack(stack)`           | A preview using the current client level and available contents            |
| `ClientWeights.player()`               | The local player's synchronized snapshot                                   |
| `ClientWeights.format(pounds)`         | Text using the player's local units and HI's rounding rules                |

Call server queries on the owning **server thread** and client queries on the **client thread**. A network handler or
background task must hand work to the appropriate game thread first. In singleplayer, querying a server player from a
render callback is still a wrong-thread call.

Use the level overload for custom containers whose contents depend on dimension. Reading a player snapshot does not
calculate the inventory again. Calling a stack query does traverse that stack; avoid repeating it every rendered frame
for large containers.

## Handle missing results

`WeightResult.status()` tells you whether `pounds()` contains a value:

| Status         | Meaning                                                                                | Handling                                            |
|----------------|----------------------------------------------------------------------------------------|-----------------------------------------------------|
| `COMPLETE`     | A valid weight, including zero or a registered item's recipe fallback                  | Read `pounds()`                                     |
| `UNAVAILABLE`  | Definitions or synchronized state aren't ready, or the session has ended               | Wait for readiness; clear stale displays            |
| `UNKNOWN_ITEM` | The queried item ID is not registered                                                  | Check the ID or whether its owning mod is installed |
| `INCOMPLETE`   | Contents couldn't be read fully, a provider failed, or a calculation limit was reached | Show an unknown/incomplete state                    |

Only `COMPLETE` carries a number. Do not replace an absent value with zero: a container with unreadable contents has not
become weightless. A known item using the 0.1-pound fallback is `COMPLETE`, not `UNKNOWN_ITEM`.

This helper can be called from your server-side command or interaction handler, passing the retained service:

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.ServerWeights;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;

public final class WeightQueries {
    public static Component heldStack(ServerWeights weights, ServerPlayer player) {
        var result = weights.stack(player.level(), player.getMainHandItem());
        return switch (result.status()) {
            case COMPLETE -> Component.literal(
                "Held stack: " + result.pounds().orElseThrow() + " lb"
            );
            case UNAVAILABLE -> Component.literal("Weights are not ready yet.");
            case UNKNOWN_ITEM -> Component.literal("That item is not registered.");
            case INCOMPLETE -> Component.literal("The contents could not be weighed.");
        };
    }
}
```

The helper reports raw stored pounds. For a client display, call `ClientWeights.format` on a complete result instead. It
accepts finite, nonnegative pounds and applies local formatting. Use your mod's translation keys for production
messages.

## Player snapshots

`player(...)` returns an `Optional<PlayerWeightSnapshot>`. Empty means no current initialized or synchronized snapshot.
A present snapshot can contain an **incomplete** carried weight, so check both levels of availability.

| Field                 | Meaning                                                                      |
|-----------------------|------------------------------------------------------------------------------|
| `carriedWeight()`     | The result of the last carried-inventory calculation                         |
| `baseCapacity()`      | Configured capacity before bonuses                                           |
| `capacity()`          | Effective capacity, including Strength, enchantments, and API contributions  |
| `state()`             | `NORMAL`, `ENCUMBERED`, or `OVERLOADED`                                      |
| `walkingMultiplier()` | The walking multiplier for this snapshot                                     |
| `effectsApply()`      | Whether weight effects currently apply to this player                        |
| `revision()`          | The weight/settings revision used by this update                             |
| `tick()`              | Local level time when the server calculated or the client received the state |
| `loadRatio()`         | Carried weight divided by capacity; empty for incomplete weight              |

`loadRatio()` is not clamped. A ratio of 1.25 means 125% capacity. Clamp it yourself when drawing a bounded fill, but
preserve the full value for labels. Do not infer a reliable numeric load from `state()` when carried weight is
incomplete.

Snapshots are immutable and contain no player or world references. You can keep one to compare it with a later value.
Don't treat a retained snapshot as current after disconnect. Server and client ticks are different clocks; do not use
them to measure network delay. Client queries apply locally known game-mode and flight exemptions without recalculating
weight.

## Find a weight's source

`ServerWeights.source` returns `EXPLICIT`, `RECIPE`, `FALLBACK`, or `SESSION`. Explicit definitions can include the
source pack name and resource ID; both details are optional. `SESSION` represents a session-supplied value, not a
datapack origin. Unknown items and unavailable server state return an empty optional. Source metadata is not exposed
through `ClientWeights`.

## Refresh external storage

Call `ServerWeights.invalidate(player)` on the server thread after storage changes that HI cannot see through ordinary
stack data. It marks the player for the next normal update. It does not calculate immediately, send an immediate
response, or change item definitions.

Normal carried slots are already checked during player updates, and unchanged inventories have a 20-tick refresh
fallback. Use explicit invalidation for storage outside an item's components;
see [container contents](/heavy-inventories/api/container-contents). To react after an update has completed,
use [notifications](/heavy-inventories/api/notifications).
