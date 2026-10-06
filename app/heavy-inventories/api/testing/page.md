---
title: "Testing an integration"
---

# Testing an integration

Compile against the API jar and exercise the packaged HI mod on each loader you support. A successful singleplayer
launch doesn't verify dedicated-server class loading, disconnect cleanup, or client previews with missing server data.

The examples in these pages target **Minecraft 26.3 / HI 4.263.0.0-rc.2**. Use matching HI builds on the client and
server. The API is still part of a release candidate; check signatures and behavior when updating it.

## Before testing in a world

Inspect your built mod jar. It should contain your integration classes and loader metadata, but no copied
`com/iso2t/heavyinventories/api` classes. Keep the real HI loader jar on the runtime side and the API jar on the compile
side.

Check plugin IDs and hook IDs against your mod ID. On Fabric, verify the fully qualified entrypoint names and
client/common entries. On NeoForge, verify the annotations and that your client class uses `HIPlugin.Side.CLIENT`.

For an optional integration, launch without HI. Also test with HI but without any additional mod listed in `requires`.
Neither case should load the skipped integration or crash your normal initializer. Start a dedicated server to catch
accidental client imports even if your feature mainly affects the HUD.

## Gameplay checks

Use a disposable world and a small inventory whose expected weight you can calculate. Check the following on an
integrated server and on a separate server/client pair:

- Add and remove items from every extra slot. Moving an item between vanilla and custom storage must count it once.
- Change stack counts and components in place. Confirm the total updates without reopening a screen.
- Change externally stored contents without changing the carrying stack. Confirm invalidation refreshes the carrier.
- Put a custom container inside a vanilla container, then reverse the nesting. Check unavailable contents and
  calculation limits as well as valid totals.
- Equip and remove capacity-granting equipment. Check multiple active bonuses, Strength, and HI enchantments together.
- Die with and without retained inventory, change dimension, disconnect, and reconnect. A new entity must use its
  current inventory and equipment.
- Apply a valid weight datapack override and reload. Then try an invalid definition. A failed reload must retain the
  last working weights and emit no successful-reload notification.
- Observe the client before synchronization. Unknown or incomplete state must not appear as zero weight. A server-only
  backpack can have an incomplete tooltip and a correct carried total.

Capacity, player totals, and gameplay outcomes should agree with the server. A local display preference must not change
them.

## HUD checks

Test Ring, Numbers, and Both, then overlay-off, F1, Creative/Spectator, an open screen, and disconnect. Try different
GUI scales, a resized window, XP level zero, and a large XP number. Verify that your layout and XP movement agree and
that nothing is drawn twice.

Install another owner fixture or register a second owner while testing. Check automatic selection, equal priorities, an
explicit owner ID, the built-in choice, and an unavailable selected ID. A losing owner should not render. Decorations
should follow the selected layout.

Exercise a layout failure and a render failure in a development build. Check that HI restores its default, disables only
the failing hook until restart, and doesn't flood the log. Remove deliberate failures before shipping your integration.

## Notifications

Check the initial ready state, one changed inventory, several unchanged ticks, a successful reload, a rejected reload,
and both disconnect and reconnect. Server listeners must see committed query results. Client listeners must receive
coherent synchronized snapshots on the client thread.

Don't assert that clients receive every intermediate server update: client notifications are sampled once per tick. Do
assert that your UI clears an old value when it receives empty and displays the next ready value. If you keep caches,
also open another world in the same process to check their cleanup.

## Common problems

| Symptom                                               | Check                                                                                    |
|-------------------------------------------------------|------------------------------------------------------------------------------------------|
| Plugin never registers on Fabric                      | Add the named entrypoint; the annotation alone is insufficient                           |
| Startup rejects a plugin ID                           | Use the owning mod's namespace and a unique plugin path                                  |
| Startup reports duplicate container ownership         | Keep one contents provider per item ID                                                   |
| Weight is counted twice                               | Remove overlapping vanilla slots, extra slots, or container contents                     |
| A loaded container appears empty                      | Return unavailable when contents cannot be read; don't substitute an empty list          |
| Weight stays unchanged after external storage changes | Invalidate affected carriers on the server thread                                        |
| Client item queries remain unavailable                | Wait for a matching player snapshot and complete table; check the connection and item ID |
| A HUD owner seems ignored                             | Check owner ID selection, priority, player visibility settings, and failure logs         |
| XP still moves after suppressing artwork              | Return a hidden layout with zero XP offset                                               |
| An optional integration crashes without HI            | Remove references to API-dependent classes from ordinary startup code                    |
| A query throws a thread error                         | Schedule it on the owning server or client thread                                        |
| An incomplete weight is shown as zero                 | Handle `WeightResult.status()` before reading its optional number                        |

## Tests in the HI repository

The repository includes API-only consumer fixtures for registration, queries, providers, notifications, and HUD
behavior. `gradlew.bat build` compiles those fixtures, runs unit tests, and checks production jars. It does not launch
Minecraft.

With the wiki checkout present, run `gradlew.bat :tests:compileWikiExamplesJava` to compile the Java blocks from these
API
pages against the API jar and Minecraft alone. The generated examples stay under `tests/build`; they are not included in
release artifacts. This checks the actual documented source rather than a separate copy.

The [runtime test guide](https://github.com/iso2t/Heavy-Inventories/blob/26.3/tests/README.md) describes packaged
client/server runs, datapack reload tests, optional-plugin absence checks, and reconnect scenarios. Those scenarios
modify their worlds and settings, so use dedicated test instances.

HI's fixtures verify the API contract. Your mod still needs tests using its own storage, networking, and rendering. They
are not a compatibility certification for third-party mods.
