---
title: "Custom container contents"
---

# Custom container contents

Vanilla bundles and shulker boxes already work. Items using Minecraft's standard `CONTAINER` or `BUNDLE_CONTENTS`
components use HI's normal traversal too. Register a provider only when you need to supply contents that this support
cannot read.

A container provider owns contents for specific item IDs. It supplies stacks; HI adds the empty item's weight, follows
nested containers, and multiplies the total by the outer stack count.

## Register an adapter

Call this helper from your common plugin's `register` method. Pass your satchel's item ID and a function that reads its
contents using the supplied level and stack. The adapter uses `Optional.empty()` for unavailable contents and a present
empty list for a known empty satchel.

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.plugin.PluginRegistration;
import net.minecraft.resources.Identifier;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;

public final class SatchelWeights {
    public static void register(
        PluginRegistration registration,
        Identifier satchelItem,
        BiFunction<Level, ItemStack, Optional<List<ItemStack>>> readContents
    ) {
        registration.container(
            Identifier.fromNamespaceAndPath("expedition", "satchel_contents"),
            Set.of(satchelItem),
            (level, satchel, sink) -> {
                var contents = readContents.apply(level, satchel);
                if (contents.isEmpty()) return false;
                for (var stack : contents.orElseThrow()) {
                    if (!sink.accept(stack)) return false;
                }
                return true;
            }
        );
    }
}
```

Your contents function connects this helper to your storage implementation. It must return the full contents of **one
container**. Don't include the satchel itself, precompute a weight, or multiply its contents by the satchel stack count.
Don't mutate the supplied stacks or retain the sink.

If a shell weighs 2 pounds and its contents weigh 8, one container weighs 10. A stack of two containers with those same
contents weighs 20. HI performs this multiplication.

## Ownership replaces standard traversal

For a claimed item, your provider replaces HI's standard container/bundle traversal. If the item has both custom storage
and standard contents, your provider must report everything it owns. Registering a provider does not add a second pass
over the built-in contents.

Only one provider can claim an item ID. Conflicting ownership is a startup error, regardless of provider priority; there
is no priority for container ownership. You can claim several related item IDs in one registration.

Don't also expose the same contents through an inventory provider. A backpack carried as an item normally belongs here.
A separate player accessory inventory normally belongs in [inventories and capacity](/heavy-inventories/api/inventories-and-capacity).

## Server calculations and client previews

The callback runs on the supplied **level's game thread**. Server inventory calculations pass a server level. Client
stack queries and tooltips pass the current client level. On an integrated server, the same registered adapter can run
on both threads. Use the supplied level rather than a global current-world variable.

HI synchronizes the server's carried total and capacity. It does **not** synchronize your private backpack contents. If
the client lacks those contents, return false. The stack preview becomes incomplete while the player's carried total can
still be correct.

Do not treat missing client data as an empty list. That would claim the container is empty. When your own
synchronization makes the contents available, later previews can calculate them normally.

## Storage outside the stack

For a backpack whose stack holds only a storage ID, changes to the backing inventory may not change its item components.
After such a change, call `ServerWeights.invalidate` for each affected carrier on the server thread. The next normal
update will read the contents again. HI also has a 20-tick refresh fallback.

HI doesn't track every player holding a copy of a linked storage ID. Your mod owns that relationship, along with storage
persistence and any rules about shared inventories.

## Limits and incomplete results

Custom contents use the same **16-level depth limit** and **4,096-visit traversal budget** as standard containers.
Cycles, overflows, exhausted budgets, invalid data, unavailable contents, and provider failures make the calculation
incomplete. HI won't use a partial total as if it were complete.

Stop supplying stacks when the sink returns false. Return false whenever you couldn't supply all contents, even if some
were already accepted. Returning true cannot override a limit the sink has reached.

Never call a stack-weight calculation recursively from inside a provider. Submit the nested stack itself and let HI
traverse it. Test a custom container inside a shulker box and a shulker box inside the custom container, plus
unavailable client data and external-storage mutation.
