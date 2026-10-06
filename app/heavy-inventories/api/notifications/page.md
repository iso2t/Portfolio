---
title: "Notifications"
---

# Notifications

Register listeners during plugin initialization to react after HI has updated its state. These are typed callbacks for
weight revisions and player snapshots. They cannot cancel or rewrite an update.

Listeners run in ascending registration-ID order within each notification category. IDs use your plugin's namespace.
Don't register again on login or when another world opens.

## Server callbacks

| Registration      | Arguments                                            | When it runs                                                          |
|-------------------|------------------------------------------------------|-----------------------------------------------------------------------|
| `onWeightsReady`  | Server and revision                                  | After initial definitions or a successful definition/settings commit  |
| `onPlayerChanged` | Player, optional previous snapshot, current snapshot | After the first player snapshot or a change to its values or revision |
| `onServerStopped` | Server                                               | Once after normal server shutdown                                     |

All three run on the **owning server thread**. Query services see committed state inside the listener.

At `onWeightsReady`, item queries use the new table. Player updates follow, so don't assume every player's snapshot
already has that revision. A rejected reload emits no ready callback and leaves the previous definitions active. A
successful commit emits a callback even if its numeric weights happen to match the previous table.

`onPlayerChanged` supplies the **last delivered** snapshot as `previous`, not a snapshot from every intervening tick. It
is empty for a new player entity, including after respawn or reconnect. Both snapshots are immutable. Advancing only the
snapshot's tick doesn't trigger another notification.

You may call `invalidate(player)` in a listener; it schedules a later update. Queries don't recalculate the player's
inventory, and recursive HI commits are rejected. To change your own inventory in response, update your own storage and
invalidate its carrier for the next normal update.

By `onServerStopped`, queries are unavailable. Release your own session data there. Do not rely on a normal-shutdown
callback for saving critical data after a process crash.

## Example: announce overload transitions

This common plugin sends a message when a player crosses into overload. It skips the first snapshot so joining while
overloaded doesn't count as a new transition, and skips incomplete totals so an unreadable inventory isn't described as
a measured overload.

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.EncumbranceState;
import com.iso2t.heavyinventories.api.plugin.HIPlugin;
import com.iso2t.heavyinventories.api.plugin.HeavyInventoriesPlugin;
import com.iso2t.heavyinventories.api.plugin.PluginRegistration;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;

@HIPlugin
public final class LoadNoticePlugin implements HeavyInventoriesPlugin {
    @Override
    public Identifier id() {
        return Identifier.fromNamespaceAndPath("expedition", "load_notices");
    }

    @Override
    public void register(PluginRegistration registration) {
        registration.onPlayerChanged(id(), (player, previous, current) -> {
            if (previous.isEmpty() || !current.effectsApply()
                || current.carriedWeight().pounds().isEmpty()) return;
            if (previous.orElseThrow().state() != EncumbranceState.OVERLOADED
                && current.state() == EncumbranceState.OVERLOADED) {
                player.sendSystemMessage(Component.literal("Your pack is overloaded."));
            }
        });
    }
}
```

Register this class using the loader instructions in [getting started](/heavy-inventories/api/getting-started). Replace the literal message
with your mod's translation key when shipping it. Registering this listener does not alter HI's penalties or built-in
feedback.

## Client callbacks

`ClientPluginRegistration.onPlayerChanged` receives an `Optional<PlayerWeightSnapshot>` on the **client thread**. A
present value means a matching player snapshot and weight table are available. It may still contain an incomplete
carried weight.

HI samples the current state once per client tick. Several packets can produce one notification. Changed values, a
changed revision, a replacement player, or local game-mode/flight exemptions can trigger it; a changed timestamp alone
does not.

An empty value follows loss of readiness or disconnect. Clear any stored display value when it arrives. Repeated
unavailable state emits nothing, so there is no guaranteed initial empty callback at the title screen. If a temporary
mismatch is resolved between samples, you won't receive an event for that intermediate state.

This client plugin keeps only an immutable snapshot for another UI to read:

```java
package example.expedition.compat.hi;

import com.iso2t.heavyinventories.api.PlayerWeightSnapshot;
import com.iso2t.heavyinventories.api.client.ClientPluginRegistration;
import com.iso2t.heavyinventories.api.client.HeavyInventoriesClientPlugin;
import com.iso2t.heavyinventories.api.plugin.HIPlugin;
import net.minecraft.resources.Identifier;

import java.util.Optional;

@HIPlugin(HIPlugin.Side.CLIENT)
public final class LoadDisplayPlugin implements HeavyInventoriesClientPlugin {
    private static Optional<PlayerWeightSnapshot> current = Optional.empty();

    @Override
    public Identifier id() {
        return Identifier.fromNamespaceAndPath("expedition", "load_display");
    }

    @Override
    public void register(ClientPluginRegistration registration) {
        registration.onPlayerChanged(id(), snapshot -> current = snapshot);
    }

    public static Optional<PlayerWeightSnapshot> current() {
        return current;
    }
}
```

Read this helper only on the client thread, and only from your HI integration code if HI is optional. It stores no
player or world reference. For a HUD owner, prefer the snapshot already supplied by its `HudContext`, which describes
that frame.

## Listener lifetime and failures

Registrations last until the game process exits. HI clears session notification state on disconnect/server stop; your
own session data still needs cleanup. Don't retain the server or player passed to a callback indefinitely. If you
maintain a per-player cache, handle player departure through your loader's lifecycle hooks too; this API has no separate
server-side logout event.

A listener throwing a runtime or linkage exception does not undo committed state or prevent later listeners from
running. The listener stays registered. HI logs the failure at most once per minute per listener/category within a
session. Unlike failed HUD renderers, notification listeners are not disabled until restart.
